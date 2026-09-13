# Inventory of own-name Project URLs

Ticket: [03-project-url-inventory.md](../issues/03-project-url-inventory.md)
Probed: 2026-09-11 (this machine is on the Tailscale tailnet)

## Gist

A public Projects gallery can honestly link **one live public site** (`https://rudol.photos`) and **four public GitHub repos** (`rrudol/tt-pii-middleware`, `rrudol/frisco`, plus two archived npm libraries). Almost every other own-name system is **alive on Tailscale** (`100.64.0.0/10`) with a **private** GitHub repo — visitors without the tailnet cannot open those `*.rudol.dev` URLs, so linking them as public Project URLs would be dishonest. `rudol.dev` itself is the homepage, not a gallery card.

## Method

Primary evidence only:

1. Public GitHub `rrudol/*` via `gh repo list` (authenticated; `isPrivate==false` is the gallery-visible set). Unauthenticated GET of private `rrudol/gedcom` returned **404**.
2. Local `~/Projects/*/`.git remotes (`git remote get-url origin`).
3. Certificate Transparency (`crt.sh/?q=rudol.dev`, 197 unique hostnames) + DNS A records + HTTP GET (8s timeout).
4. README live-URL claims in the matching local checkouts.

Hindsight memories were not used as evidence.

**Public-internet vs tailnet:** if the A record is in `100.64.0.0/10`, the name is Tailscale CGNAT (Cloudflare DNS-only). This probe host can fetch those URLs; a random visitor cannot. Gallery-honest live URLs require a public address (Cloudflare `188.114.*` or a public origin IP).

## Gallery-honest links

These are the only own-name systems a visitor can actually open (public URL and/or public repo). Employment (Snowflake, Netguru, …) is excluded.

| Name | Public URL | Public repo | What it is | Status | Evidence |
|---|---|---|---|---|---|
| Photography | https://rudol.photos | no (`rrudol/photography` is private) | Public photo portfolio (Astro SSG on Cloudflare Pages `rudol-photos`) | **alive** | HTTP 200, Cloudflare, title `Rafał Rudol — fotografia`; DNS `188.114.*`; README: “Publiczne portfolio: https://rudol.photos”; remote `https://github.com/rrudol/photography.git`; `gh` lists the repo private |
| Thinking Typewriters PII middleware | none public (demo is tailnet `https://guard.rudol.dev`) | https://github.com/rrudol/tt-pii-middleware | In-VPC PII redaction middleware (Presidio + PL checksums) | **alive** | Public repo, description + README; `pushedAt` 2026-09-11; unauthenticated GitHub 200. Tailnet demo HTTP 200, title `PL-PII redact (tailnet)`; `deploy/tailnet/README.md` says tailnet-only. Supporting public artifact: HuggingFace dataset `rafalrudol/pl-pii-synthetic-v1` (HTTP 200) |
| Frisco CLI | none | https://github.com/rrudol/frisco | Unofficial CLI & MCP server for the Frisco.pl grocery API | **alive** (OSS; no hosted UI) | Public repo HTTP 200; README install `go install github.com/rrudol/frisco/cmd/frisco@latest`; `pushedAt` 2026-06-23 |
| useCookie | npm https://www.npmjs.com/package/@use-hook/use-cookie | https://github.com/rrudol/useCookie | React hook for cookies (`js-cookie`) | **stale** | Public repo, **archived**; npm registry latest `0.1.4`, modified 2022-04-07; GitHub `pushedAt` 2023-03-29 |
| never-give-up | npm https://www.npmjs.com/package/never-give-up | https://github.com/rrudol/never-give-up | Tiny npm retry helper (README: “you shouldn't use this package”) | **stale** | Public repo, **archived**; npm latest `0.1.0`; GitHub `pushedAt` 2018-12-08 |

**Not a Project card:** the homepage itself.

| Name | Public URL | Public repo | What it is | Status | Evidence |
|---|---|---|---|---|---|
| rudol.dev (this site) | https://rudol.dev , https://www.rudol.dev , https://rudol-cv.pages.dev | https://github.com/rrudol/cv | Static monospace CV / future specialist homepage | **alive** | HTTP 200 Cloudflare, title `Rafał Rudol — Tech Lead & Senior Software Engineer`; README Live table; local remote `origin` → `rrudol/cv` |

## Public GitHub `rrudol/*` (complete)

`gh repo list rrudol` + `select(.isPrivate==false)` — 8 public repos. Profile `public_repos: 8` matches.

| Repo | Fork? | Archived? | Gallery? | Notes |
|---|---|---|---|---|
| `rrudol/cv` | no | no | site, not a Project | Homepage source |
| `rrudol/tt-pii-middleware` | no | no | **yes** | Own-name middleware, recently pushed |
| `rrudol/frisco` | no | no | **yes** | Own-name CLI |
| `rrudol/cursor-rulebook` | no | no | weak | Curated Cursor rules; last push 2025-11-06. Not a running system. Honest GitHub link, thin as a Project |
| `rrudol/useCookie` | no | **yes** | stale OSS | |
| `rrudol/never-give-up` | no | **yes** | stale OSS | |
| `rrudol/hermes-agent-1` | **yes** | no | **no** | Fork of Nous Hermes Agent (`homepageUrl` nousresearch). Not own-name |
| `rrudol/awesome-mcp-servers` | **yes** | no | **no** | Fork of a collection |

Everything else under `rrudol/*` is **private**. A gallery must not link those GitHub URLs: unauthenticated GET `https://github.com/rrudol/gedcom` → **404**.

`cursor-rulebook` is public and own-name but is a rules pack, not a system he currently runs. Include on `/projects` only if the later handful ticket wants OSS clutter; it is not a live host.

## Own-name systems that are alive — but not gallery-linkable as URLs

These returned HTTP 200 **from this tailnet host**. DNS is `100.87.100.111` (Tailscale) unless noted. Repos are private. **Do not put these URLs on a public homepage** until the host is on the public internet or the repo is public.

| Name | URL (tailnet unless noted) | Repo (private) | One-line | HTTP | README / ingress |
|---|---|---|---|---|---|
| gedcom / Genealogy Labs | https://genealogy.rudol.dev | `rrudol/gedcom` | AI-native genealogy: Honesty Report, versioned facts, MCP | **alive** | `/api/health` → `{"ok":true,"database":true,"service":"gedcom"}`; title `gedcom — Git for genealogy`; README **Live:** https://genealogy.rudol.dev |
| Nazwix | https://nazwix.rudol.dev | `rrudol/nazwix` | AI naming assistant (web UI + Axum API) | **alive** | HTTP 200, title `Nazwix — generator nazw firm i produktów z AI`; GitHub description; Mastra control plane `https://nazwix-mastra.rudol.dev/health` → `{"success":true}` |
| career | https://career.rudol.dev | `rrudol/career` | Multi-user agentic job-offer recommender | **alive** | HTTP 200, title `Career`; ingress `apps-static/career/ingress.yaml` |
| Thinking Typewriters (product UI) | https://typewriters.rudol.dev | `rrudol/micro-typewriters` | EU-pinned AI studio / playground (staging) | **alive** | HTTP 200, title `Thinking Typewriters`; README: “wyłącznie w tailnecie”, “Brak publicznej ekspozycji” |
| Radium Agent | https://bot.rudol.dev | `rrudol/agent` (product) / GitOps `radium-226` | TypeScript Radium Agent (canonical product URL) | **alive** | HTTP 200, title `Radium Agent`; ingress `apps-static/bot/ingress.yaml` |
| Journalism | https://journalism.rudol.dev | `rrudol/journalism` | Investor evidence-room / journalism monorepo | **alive** | HTTP 200, title `Journalism — Investor evidence room`; ingress `journalism-showcase` |
| radio | https://radio.rudol.dev | `rrudol/radio` | Polish-radio-style news bulletin studio + LoRA loop | **alive** | HTTP 200, title `radio · studio`; ingress comment “tailnet-only” |
| news / Sygnał | https://news.rudol.dev | `rrudol/news` | Autonomous Polish-politics wire (“Sygnał 2026”) | **alive** | HTTP 200, title `Sygnał — Depesze · 2026`; README |
| travel | https://travel.rudol.dev | `rrudol/travel` | Evidenced travel connections / proof-of-moat | **alive** | HTTP 200, title `Travel Proof — evidenced connections`; README: “Distribution: Tailnet-only” |
| crawler | https://crawler.rudol.dev | `rrudol/crawler` | Crawl admin / pipelines | **alive** | HTTP 200, title `crawler-next` |
| Vera (search) | https://search.rudol.dev | `rrudol/search` | Polish cited-answer engine | **alive** | HTTP 200, title `Vera — wyszukiwarka z odpowiedziami AI`; README |
| dxcs (ravioli) | https://dxcs.rudol.dev | `rrudol/dxcs` | Verified answer engine for coding agents (private alpha) | **alive** | HTTP 200, title `dxcs — Private Alpha · dxcs`; README names the product ravioli |
| Hindsight control plane | https://hindsight.rudol.dev | `rrudol/hippocampus` adjacent; GitOps hindsight tenant | Self-hosted Hindsight memory control plane | **alive** | HTTP 200, title `Hindsight Control Plane`; `mem.rudol.dev` same title; `api.hindsight.rudol.dev/` → JSON 404 (API up, no `/`) |
| Neuron | https://api.mem.rudol.dev (API) | `rrudol/neuron` | Memory gateway (MCP + REST) over Hindsight | **alive** (API) | `GET /` → `{"error":"not_found"}` (JSON API, not a marketing page); README points at `hindsight.rudol.dev` |
| Hippocampus finetune UI | https://finetune.rudol.dev | `rrudol/hippocampus` | LoRA control room for Hindsight distillation | **unknown** / likely down | HTTPS GET **timed out**; DNS exists; README describes Spark-hosted loop |
| academic | https://academic.rudol.dev | `rrudol/academic` (private) | VitePress research site | **alive** | HTTP 200, title `Business Research`; ingress `apps-static/academic` |
| AWK | https://awk.rudol.dev | `rrudol/awk` | Agentic Web Kit — fetch/normalize web data for agents | **alive** | HTTP 200, title `AWK Web Graph`; README |
| Harvest | https://harvest.rudol.dev | `rrudol/harvest` | Tweet/event harvest + export API | **alive** (auth-gated) | **Public IP** `65.21.133.118` (not CGNAT); HTTP **401** `unauthorized`; README Production URL. Visitors hit auth, not a landing page — weak gallery URL |
| Photography CMS | https://photography.rudol.dev | `rrudol/photography` | Directus CMS for rudol.photos (tailnet) | **alive** (operator) | HTTP 200; README: “Tailnet: bez Tailscale nie dojdziesz”; kustomization: “Public site remains rudol.photos” |
| PL-PII demo | https://guard.rudol.dev | `rrudol/tt-pii-middleware` (public source) | Tailnet redact-only demo UI | **alive** | HTTP 200; `deploy/tailnet/README.md` “reachable only on the Tailscale tailnet” |
| Hermes (operator) | https://agent.rudol.dev | `rrudol/agent` fork tenant | Hermes Agent dashboard | **alive** | HTTP 200, title `Sign in — Hermes Agent`. Operator surface, not a public product |
| Radium Platform | https://platform.rudol.dev | GitOps `platform` | OpenHands Agent Canvas | **alive** | HTTP 200, title `Radium Platform` |
| rad-gateway | https://gateway.rudol.dev | `rrudol/rad-gateway` | Tailnet AI/API gateway + portal | **alive** | HTTP 200, title `rad-gateway` |
| kanban | https://kanban.rudol.dev | `rrudol/kanban` | Hermes kanban UI | **alive** | HTTP 200, title `Kanban`; README: reimplementation of hermes kanban |
| VPN console | https://vpn.rudol.dev | `rrudol/vpn` | VPN control UI | **alive** | HTTP 200, title `VPN — sterownia` — infra, not a gallery Project |

### DNS present, not serving as a public Project

| Host | Result | Notes |
|---|---|---|
| https://wradar.rudol.dev | SSL error | GitHub description: “Private WhiskyRadar MVP deployed at wradar.rudol.dev”; A=`100.87.100.111`; **unknown**/stale TLS |
| https://career-rudol.vercel.app | HTTP 200 Vercel | Leftover. Current product is tailnet `career.rudol.dev`. GitHub `homepageUrl` still points here. **Do not** present as current Career |
| https://product-rudol.vercel.app | 404 DEPLOYMENT_NOT_FOUND | Dead |
| https://ctx-psi.vercel.app | 404 DEPLOYMENT_NOT_FOUND | Dead |
| https://rrudol.github.io/things/ | 200 but Next.js `__next_error__` | Repo `rrudol/things` is **private**; homepage URL in gh metadata. Broken GH Pages — **stale**, and source is not publicly linkable |
| https://waitlist.career.rudol.dev | NXDOMAIN | `career/waitlist/README.md` wanted this as a public URL; **does not resolve** |
| https://www.rudol.photos | 404 | Apex `rudol.photos` is the live site |

## What is not a Project

- **Employment** (Snowflake, Netguru, etc.) — Experience only.
- **Forks** (`hermes-agent-1`, `awesome-mcp-servers`).
- **Lab / infra hostnames** (grafana, git, mail, registry, sonar, ntfy, supabase, twenty, vault, …). crt.sh has ~197 `*.rudol.dev` names; most are cluster tenants, not gallery Projects.
- **Private GitHub URLs** — 404 for visitors.
- **Tailnet `*.rudol.dev` product URLs** — alive for Rafał, dead for a hiring manager on the public internet.

## Implications for later tickets

Home’s handful (`04`) has a **thin public-link set**: photography (URL), tt-pii-middleware (repo), frisco (repo). The systems that actually match the specialist story (genealogy, typewriters, career, news, Vera, neuron/hindsight, dxcs, news, travel, nazwix) are **running but unlinkable** on a public site unless (a) a host is moved onto the public internet, (b) a repo is made public, or (c) Home describes them without a clickable URL. That is a decision for grilling, not this inventory.

## Probe appendix

- `gh repo list rrudol`: public set above; many private remotes under `~/Projects` map to `https://github.com/rrudol/<name>.git`.
- crt.sh: 197 unique `*.rudol.dev` names (2025–2026 LE certs). First listed in this probe: `api.hindsight.rudol.dev` (cert not_before 2026-09-01).
- Representative DNS: `rudol.dev` / `rudol.photos` → Cloudflare `188.114.*`; product apexes → `100.87.100.111`; `harvest.rudol.dev` → `65.21.133.118`.
- HTTP GET 2026-09-11 from this tailnet host (selected): see tables.
- Local origin remotes sampled: `hello_wasm` → `rrudol/cv`; `photography` → `rrudol/photography`; `gedcom`, `nazwix`, `career`, `micro-typewriters`, `tt-pii-middleware` as above.
