# How Astro lands on rudol-cv

Type: research
Status: resolved

## Question

How should Astro land on the existing Cloudflare Pages project `rudol-cv` (custom domain rudol.dev / www.rudol.dev, current deploy `npx wrangler pages deploy www`, publish directory `www/`) without a DNS redo?

Need: official Astro + Cloudflare constraints, adapter vs static `dist`, what happens to `_headers` / `_redirects`, and a recommended publish command. Primary sources only.

## Answer

Stay on Pages project `rudol-cv` with **static** Astro (no `@astrojs/cloudflare` adapter). Put `_headers` / `_redirects` in `public/` so they copy into `dist/`. Deploy with `npx astro build && npx wrangler pages deploy dist --project-name=rudol-cv --branch=main`. Custom domains stay on the existing project; no DNS redo. The current adapter dropped Pages, so SSR would mean a later Workers migration.

Findings: [research/01-astro-on-pages.md](../research/01-astro-on-pages.md)
