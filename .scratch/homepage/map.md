# rudol.dev as specialist homepage

Label: `wayfinder:map`

## Destination

A spec for rudol.dev as Rafał's homepage: a specialist who ships and operates real systems, shown through selected own-name Projects, production essays, and condensed Experience at `/experience`. Publishing is git markdown (Astro on the existing Cloudflare Pages project); essays syndicate a hook to X and Bluesky. The map is done when nothing remains to decide before that spec is written.

## Notes

- Domain glossary: `CONTEXT.md` in this repo. Skills: grilling, domain-modeling; prototype (UI) for Home; research for facts outside this tree.
- Tracker: local markdown under `.scratch/homepage/` (no `docs/agents` setup yet).
- Plan, don't build. Do not write the essays. Do not deploy.
- Grilling in this effort: Cursor AskQuestion; recommended option first, labeled.
- Site language is English only. Material is the current monospace look. `/` is Home, not the CV.

### Locked in charting

- Specialist-first; hiring managers are guests on `/experience`.
- Project = own-name system; employment stays in Experience.
- Writing = production essays. Git markdown is the CMS. Astro + Cloudflare Pages (`rudol-cv`).
- Syndication = hook + URL to X and Bluesky on publish; follow links in chrome, no live feed.

## Decisions so far

- [How Astro lands on rudol-cv](issues/01-astro-on-pages.md) — Static Astro (no adapter) onto existing Pages `rudol-cv` via `wrangler pages deploy dist`; DNS unchanged.
- [Inventory of own-name Project URLs](issues/03-project-url-inventory.md) — Public gallery can honestly link rudol.photos plus GitHub tt-pii-middleware and frisco; most own-name systems are tailnet-only.
- [How essays syndicate to X and Bluesky](issues/02-syndicate-x-bluesky.md) — GitHub Action calls X `POST /2/tweets` (user OAuth; URL posts $0.20) and Bluesky `createRecord` (app password); humans for credits, app password, secrets.

## Not yet specified

- RSS, Open Graph images, analytics.
- Whether the first essay is drafted as part of the later build (not this map's destination).
- Repo identity (`hello_wasm` directory vs `rrudol/cv` name) and whether print CSS on Experience survives the Astro move.
- Comments, newsletter, search.
- Where X/Bluesky credentials live (1Password vs GitHub secrets) if auto-post survives [Whether publish still auto-posts to X](issues/09-x-autopost.md).

## Out of scope

- Writing the backlog of essays (including the 32-topic list).
- Hosted CMS (Sanity, Contentful, Ghost, WordPress) as source of truth.
- Polish locale / full i18n.
- Embedded X/Bluesky feeds and webmentions.
- Hiring-first IA; Next.js; treating Snowflake work as Projects.
- Putting tailnet products on the public internet (unless [How unlinkable Projects appear on a public homepage](issues/10-unlinkable-projects.md) redraws that).
