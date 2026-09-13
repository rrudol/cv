# How essays syndicate to X and Bluesky

Question: first-party way to post a short hook plus essay URL to Twitter/X and Bluesky when a git publish happens (GitHub Action on the content repo), plus credentials, scopes, and limits.

Sources: `docs.x.com` / `developer.x.com`, `docs.bsky.app` / `atproto.com`, GitHub Actions docs. Retrieved 2026-09-11.

## Gist

There is no first-party “post on git push” product. The current first-party path is a GitHub Actions workflow on `push` that stores credentials as Actions secrets and calls each network’s HTTP API:

- **X:** `POST https://api.x.com/2/tweets` with **user-context** auth (OAuth 1.0a user tokens, or OAuth 2.0 user token with `tweet.write` + `tweet.read` + `users.read`). App-only Bearer tokens cannot post. Pay-per-use credits; a post whose text contains a URL is billed as **Post: Create (with URL) at $0.200**. Rate limit: **100 posts / 15 min per user**, **10,000 / 24 h per app**. Text is **280 weighted characters**; every URL counts as **23**.
- **Bluesky:** `com.atproto.server.createSession` with handle + **app password**, then `com.atproto.repo.createRecord` with `collection: app.bsky.feed.post`. Password auth is the documented bot path. Post text is **300 graphemes**. URLs in `text` are not auto-linked; add a `app.bsky.richtext.facet#link` (and optionally an `app.bsky.embed.external` card). Rate limits are generous for a few essays; `createSession` is the tight one (**30 / 5 min**, **300 / day** per account).

After one-time setup, a workflow can fire unattended. Humans stay in the loop for X developer signup + credit purchases, Bluesky app-password creation, putting secrets in GitHub, and (optional) environment required reviewers.

## Glue: GitHub Action on the content repo

GitHub does not provide an X or Bluesky posting API. The first-party pieces are:

1. Trigger on `push`, optionally filtered to essay paths (`on.push.paths`). Path filters are not evaluated for tag pushes. ([Workflow syntax — `on.push.paths`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax))
2. Store tokens as repository (or environment) **Actions secrets**. Inject via `${{ secrets.NAME }}` as env vars; do not pass secrets on the command line. Secrets are encrypted with Libsodium sealed boxes, redacted in logs (not guaranteed), **not** passed to fork PR workflows, and **not** available to Dependabot-triggered workflows. ([Secrets](https://docs.github.com/en/actions/concepts/security/secrets), [Using secrets](https://docs.github.com/en/actions/how-tos/security-for-github-actions/security-guides/using-secrets-in-github-actions))
3. Optionally attach `jobs.<id>.environment` so syndication waits on **required reviewers**. On GitHub Free / Pro / Team, required reviewers are **only available for public repositories**. A waiting job fails if not approved within 30 days. ([Deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments))

Limits that matter here: 100 repository secrets, 48 KB each. ([Secret types](https://docs.github.com/en/code-security/reference/secret-security/secret-types))

## X / Twitter

### Endpoint

Create a Post: `POST https://api.x.com/2/tweets` with JSON `{"text": "<hook> <url>"}`. `text` is required unless media is provided. Success is HTTP 201. OpenAPI security schemes:

- `OAuth2UserToken` scopes: `tweet.write`, `users.read`, `tweet.read`
- `UserToken` (OAuth 1.0a HTTP)

([Create Posts](https://docs.x.com/x-api/posts/create-post), [Manage Posts](https://docs.x.com/x-api/posts/manage-tweets/introduction))

App-only Bearer tokens are for reading public data. Posting needs user context. A 403 is the documented failure when the app lacks access or the request is not user-context. ([Getting access](https://docs.x.com/x-api/getting-started/getting-access), [Make your first request](https://docs.x.com/make-your-first-request))

### Credentials (two documented user-context options)

**A. OAuth 1.0a user tokens — best fit for a personal GitHub Action.** Console path: developer account → Project → App → Keys and tokens.

| Credential | Role |
|---|---|
| API Key & Secret | Identify the app; sign OAuth 1.0a requests |
| Access Token & Secret | Act as the **app-owning account** |

Documented as “Acting as yourself … Best for: Testing, personal bots, your own automation.” ([Getting access](https://docs.x.com/x-api/getting-started/getting-access), [Apps](https://docs.x.com/resources/fundamentals/developer-apps))

OAuth 1.0a app permission must be **Read and write** (or Read, write, and DMs). Read only cannot post. Changing permissions requires re-authorization. ([Apps](https://docs.x.com/resources/fundamentals/developer-apps))

3-legged OAuth user tokens **do not expire** but the user can revoke them. PIN-based OAuth exists when there is no callback URL. ([Obtaining access tokens](https://docs.x.com/fundamentals/authentication/oauth-1-0a/obtaining-user-access-tokens))

Quickstart shows both Bearer user tokens and OAuth 1.0a (API key / secret / access token / secret) against `POST /2/tweets`. ([Manage Posts quickstart](https://docs.x.com/x-api/posts/manage-tweets/quickstart))

**B. OAuth 2.0 Authorization Code with PKCE.** Enable OAuth 2.0 in App settings. Confidential clients (Web App, Automated App or bot) get a Client Secret. Scopes for this job:

| Scope | Why |
|---|---|
| `tweet.write` | Create the Post |
| `tweet.read` | Required by the endpoint’s OAuth2 scheme |
| `users.read` | Required by the endpoint’s OAuth2 scheme |
| `offline.access` | Issue a refresh token (otherwise access tokens last **two hours**) |

Auth codes expire in **30 seconds**. Access tokens expire in **two hours** unless `offline.access` is granted. Refresh flow: `POST https://api.x.com/2/oauth2/token` with `grant_type=refresh_token`. Grant types: authorization code + PKCE, and refresh token only. ([OAuth 2.0 Authorization Code Flow with PKCE](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code), [v2 authentication mapping](https://docs.x.com/resources/fundamentals/authentication/guides/v2-authentication-mapping))

X’s Apps page says “Choose OAuth 2.0 for new projects” and that it “is required for X API v2 user-context endpoints.” The Create Post OpenAPI and the manage-Posts quickstart still accept OAuth 1.0a. For a single-account Action, OAuth 1.0a owner tokens avoid refresh-token rotation in CI.

Credentials are shown **once**. Store in a vault; regenerating invalidates the old set. ([Getting access](https://docs.x.com/x-api/getting-started/getting-access))

### Billing (this use case is the expensive write)

v2 is **pay-per-usage credits**, no subscription. Writes are charged per request. Current table ([Pricing](https://docs.x.com/x-api/getting-started/pricing)):

| Action | Unit cost |
|---|---|
| Post: Create | $0.015 |
| **Post: Create (with URL)** | **$0.200** |
| Post: Create (summoned) | $0.010 |

A hook that includes the essay URL is the **with URL** row. Prices can change; console and [developer.x.com#pricing](https://developer.x.com/#pricing) are the live source. If the credit balance hits zero (or slightly negative), **requests are blocked** until a human adds credits. Auto-recharge and spending limits are console settings.

Rate limits and billing are separate: you can be inside the 15-minute window and still be charged, or hit 429 with no extra charge. ([Rate limits](https://docs.x.com/x-api/fundamentals/rate-limits))

### Rate limits (manage posts)

| Method | Endpoint | Per app | Per user |
|---|---|---|---|
| POST | `/2/tweets` | 10,000 / 24 hrs | **100 / 15 min** |
| DELETE | `/2/tweets/:id` | — | 50 / 15 min |

429 + `x-rate-limit-reset`. ([X API Rate Limits](https://docs.x.com/x-api/fundamentals/rate-limits))

### Text / URL counting

Posts are **280 weighted characters**. URLs are wrapped with `t.co` and count as **23 characters** regardless of original length. Emojis and CJK count as 2. Use `twitter-text` for the official weighted length. ([Counting characters](https://docs.x.com/fundamentals/counting-characters))

Self-serve extra restrictions (not Enterprise): max **1 cashtag** per API post; replies only if the original author summoned the account (@mention or quote). Quote-posting via `quote_tweet_id` is **Enterprise-only**. None of that blocks a top-level hook + URL. ([Manage Posts](https://docs.x.com/x-api/posts/manage-tweets/introduction), [Integration guide](https://docs.x.com/x-api/posts/manage-tweets/integrate))

### Human in the loop (X)

Must happen once (or when rotating keys / topping up credits):

1. Sign in at [console.x.com](https://console.x.com), accept the Developer Agreement, complete the use-case profile. ([Getting access](https://docs.x.com/x-api/getting-started/getting-access))
2. Create a Project + App; save keys (displayed once).
3. Set OAuth 1.0a to Read and write, **or** enable OAuth 2.0 and run the browser PKCE consent once.
4. **Buy credits** and keep a non-zero balance (or enable auto-recharge + a payment method).
5. Put secrets in GitHub. Do not commit them.

OAuth 2.0 without a stored refresh token forces a human every two hours. App-only Bearer cannot post.

## Bluesky / AT Protocol

### Endpoint

1. `POST {pds}/xrpc/com.atproto.server.createSession` with `{ "identifier": "<handle>", "password": "<app password>" }` → `accessJwt` (minutes) + `refreshJwt` (longer).
2. `POST {pds}/xrpc/com.atproto.repo.createRecord` with `Authorization: Bearer <accessJwt>` and body:

```json
{
  "repo": "<did>",
  "collection": "app.bsky.feed.post",
  "record": {
    "$type": "app.bsky.feed.post",
    "text": "<hook> https://rudol.dev/writing/slug",
    "createdAt": "<RFC3339 Z>",
    "facets": [ { "index": { "byteStart": n, "byteEnd": m }, "features": [ { "$type": "app.bsky.richtext.facet#link", "uri": "https://rudol.dev/writing/slug" } ] } ]
  }
}
```

Entryway used in official examples: `https://bsky.social`. Authenticated writes go to the account’s **own PDS**. ([Posting via the Bluesky API](https://atproto.com/blog/create-post), [HTTP API (XRPC)](https://atproto.com/specs/xrpc))

For a **single post**, official guidance is: one `createSession`, don’t bother refreshing. ([create-post](https://atproto.com/blog/create-post))

### Credentials and “scopes”

**App password + session (documented bot path).** “Password auth is acceptable for bots and command line tools.” Generate an app password in Bluesky account settings; do not use the main password. App passwords look like `xxxx-xxxx-xxxx-xxxx`. They grant slightly restricted permissions: they cannot do destructive account/auth changes (including managing app passwords). There is no per-endpoint OAuth scope list on this path. ([SDK authentication](https://atproto.com/guides/sdk-auth), [XRPC — App Passwords](https://atproto.com/specs/xrpc))

Store in Actions: handle (or DID) + app password. Optionally persist `refreshJwt` to skip login rate limits; for one post per publish, a fresh session is enough.

**OAuth (primary going forward for user-facing apps, a poor fit for a fire-and-forget Action).** Spec: authorization code + PKCE, PAR, DPoP, public client metadata JSON at an `https://` `client_id`. Transitional scopes: `transition:generic` (same as an app password), plus `transition:chat.bsky` for DMs. Confidential clients need a signing key and a public JWKS. This still requires a **browser authorization** once, plus a live HTTPS client-metadata URL. ([OAuth spec](https://atproto.com/specs/oauth), [OAuth for AT Protocol](https://atproto.com/blog/oauth-atproto))

### Limits

Lexicon `app.bsky.feed.post`: `text` **maxGraphemes 300**, `maxLength` 3000 bytes. ([lexicon](https://github.com/bluesky-social/atproto/blob/main/lexicons/app/bsky/feed/post.json); also [intent links](https://docs.bsky.app/docs/advanced-guides/intent-links) — 300 Unicode grapheme clusters)

PDS content writes (per DID): **5,000 points / hour**, **35,000 / day**. CREATE = 3 points → **1,666 creates / hour**, **11,666 / day**. ([Rate limits](https://docs.bsky.app/docs/rate-limits))

Hosted PDS HTTP:

| Endpoint | Window |
|---|---|
| All authenticated requests | 3000 / 5 min per IP |
| `com.atproto.server.createSession` | **30 / 5 min**, **300 / day** per account |

429 + optional `Retry-After`. Blob upload cap 50 MB (only if attaching a card thumb). ([Rate limits](https://docs.bsky.app/docs/rate-limits), [XRPC](https://atproto.com/specs/xrpc))

### Links and cards

Mentions and links are **facets**, not auto-detected by the PDS. Byte offsets are UTF-8. Official Python walks `https://…` spans into `app.bsky.richtext.facet#link`. Without a facet, the URL is plain text. ([create-post](https://atproto.com/blog/create-post))

Website cards are `app.bsky.embed.external` (`uri`, `title`, `description`, optional `thumb` blob). **The posting client** fetches HTML / `og:*` and uploads the thumb. That is extra HTTP from the Action, not a human step. ([create-post](https://atproto.com/blog/create-post))

### Human in the loop (Bluesky)

1. Own a Bluesky account.
2. Create (and later revoke) an **app password** in settings.
3. Put handle + app password in GitHub secrets.
4. If using OAuth instead: publish client metadata, run a browser consent, store refresh/DPoP material — more human and infra than an app password.

No paid API tier. Login rate limits bite only if the workflow re-logins in a tight loop.

## What would force a human in the loop

| Item | Forced? | Why |
|---|---|---|
| X developer signup, agreement, app | Yes, once | Console-only; credentials shown once |
| X **credits** for URL posts ($0.20) | Yes, ongoing | Zero/negative balance **blocks** API requests |
| X OAuth 2.0 without `offline.access` | Yes, every ~2 h | Access token lifetime |
| X OAuth 2.0 **first** consent | Yes, once | Browser PKCE / 3-legged |
| Bluesky app password | Yes, once | Created in account settings |
| GitHub secrets | Yes, once | Human writes secrets (or `gh secret set`) |
| GitHub **required reviewers** | Only if enabled | Job waits; Free/Pro/Team: **public repos only** |
| Fork PRs / Dependabot | N/A | Secrets are not injected — syndication will not run there |
| Composing the hook | Product choice | APIs post whatever `text` you send; nothing drafts it |
| X quote-post / unsolicited API replies | N/A for this job | Self-serve restrictions; not needed for hook+URL |

Nothing in the three first-party stacks auto-posts on git. After secrets + X credits, a `push` workflow can post both networks with no further approval.

## Recommended credential set for this homepage

Store as GitHub Actions secrets; inject as env:

- X (OAuth 1.0a, app owner): `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`. App permission **Read and write**. Keep a credit balance.
- Bluesky: `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD`. Post via `createSession` + `createRecord`. Attach a link facet (and optionally an external embed).

Trigger: `on.push` to the publish branch, `paths` limited to essay markdown. Do not use environment required reviewers unless a human gate is wanted (and the repo is public, or the plan supports it).
