# How Astro lands on Pages project `rudol-cv`

Primary sources only: Astro docs, Cloudflare Pages docs, Wrangler docs. Local repo facts are labeled as such.

## Gist

Stay on the existing Cloudflare Pages project `rudol-cv`. Build Astro as a **static** site (default `outDir` `./dist`, **no** `@astrojs/cloudflare` adapter). Put `_headers` and `_redirects` in Astro’s `public/` so they copy into `dist/`. Keep Direct Upload. Change only the upload directory from `www/` to `dist/`:

```bash
npx astro build && npx wrangler pages deploy dist --project-name=rudol-cv --branch=main
```

Custom domains (`rudol.dev` / `www.rudol.dev`) stay attached to that Pages project. No DNS redo. Do not migrate to Workers, do not create a new Pages project, and do not add the Cloudflare adapter unless you later accept leaving Pages.

## Current project (local)

`README.md` in this repo already deploys Direct Upload to Pages project **`rudol-cv`**:

```bash
npx wrangler pages deploy www --project-name=rudol-cv --branch=main
```

Custom domains already CNAME to `rudol-cv.pages.dev`. Publish root today is `www/`, which contains `_headers` and `_redirects`.

## Stay on the same Pages project (no DNS redo)

Custom domains are a **project** setting, not a per-directory setting. You add them under the Pages project → Custom domains; Cloudflare then creates the CNAME to `<PROJECT>.pages.dev`. Detaching a domain is a separate DNS edit plus dashboard remove ([Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)).

Redeploying a new asset tree (`dist/` instead of `www/`) to the **same** `--project-name` is still that project. The `rudol-cv.pages.dev` hostname and attached custom domains do not change.

Wrangler’s Direct Upload path is: create the project once, then **subsequent deployments** upload a folder of prebuilt assets to it ([Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)):

```bash
npx wrangler pages deploy <BUILD_OUTPUT_DIRECTORY>
```

`--project-name` is “the name of the project you want to deploy to”; `--branch` is the branch that deployment is attributed to ([Wrangler `pages deploy`](https://developers.cloudflare.com/workers/wrangler/commands/pages/)). CI docs use the same flags against an existing project ([Direct Upload with CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)):

```bash
npx wrangler pages deploy dist --project-name=<PROJECT_NAME>
```

Preview vs production: `--branch=<BRANCH_NAME>` deploys a preview; production is the project’s production branch ([Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)). Keep `--branch=main` to match the current production command.

### What *would* force a domain redo

1. **New Pages project.** Direct Upload projects **cannot** later switch to Git integration; that requires creating a new project ([Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)). A new project is a new `*.pages.dev` hostname; custom domains would have to be added again ([Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)).
2. **Migrate to Workers.** Astro’s current Cloudflare deploy guide recommends Workers for **new** projects and points existing Pages projects at Cloudflare’s migration guide ([Deploy Astro to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)). Migration means a Worker (`wrangler deploy`, `assets.directory`), then attaching custom domains to the Worker and eventually deleting the Pages project ([Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)). Workers custom domains require the zone’s nameservers to be on Cloudflare; unlike Pages, Workers do **not** support domains outside Cloudflare zones ([same migration guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)). That is a domain move, not a no-op.

For this ticket: keep Direct Upload to `rudol-cv`.

## Adapter vs static `dist`

Astro prerenders to static HTML by default. An adapter is required only for on-demand / SSR routes ([On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/)). Start in `'static'` mode unless most pages actually need a server ([same page](https://docs.astro.build/en/guides/on-demand-rendering/)).

`@astrojs/cloudflare` exists to deploy **on-demand** routes to Cloudflare. Quote from the adapter docs: **“If you’re using Astro as a static site builder, you don’t need an adapter.”** ([@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)).

Current adapter changelog in that same page: **“Removed: Cloudflare Pages support. The Astro Cloudflare adapter no longer supports deployment on Cloudflare Pages.”** Migrate to Workers if you need the adapter ([@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)).

`astro add cloudflare` on current Astro generates a **Workers** `wrangler.jsonc` (`assets.directory: "./dist"`) and `npx wrangler deploy`, not `pages deploy` ([Deploy Astro to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)).

Cloudflare Pages still documents Astro as a static/Git build: **Build command `npm run build`, Build directory `dist`** ([Deploy an Astro site](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/); [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) framework preset “Astro”). That Pages guide also covers SSR via the adapter and Pages Functions — that is the old Pages-Functions path. It conflicts with current Astro adapter policy (Pages support removed). For a markdown homepage, that conflict is avoided by **not installing the adapter**.

Astro’s default `outDir` is `"./dist"` ([Configuration reference: `outDir`](https://docs.astro.build/en/reference/configuration-reference/#outdir)). Do not set `outDir` to `www/` (that directory is currently the **source** tree, not a build output).

**Decision:** static Astro → `dist/` → `wrangler pages deploy`. No adapter. SSR later would mean leaving Pages (current adapter) or pinning an older Astro that still targeted Pages (not recommended; not a primary-source upgrade path).

## `_headers` and `_redirects`

Cloudflare Pages parses a `_headers` file and a `_redirects` file in the **static asset directory** of the deployment. They are not served as assets. With a framework, author them in `public/` or `static/` so the build copies them into the output; without a framework, they live directly in the output directory ([Headers](https://developers.cloudflare.com/pages/configuration/headers/); [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)).

Astro’s `public/` files are copied into the build folder untouched ([Project structure](https://docs.astro.build/en/basics/project-structure/)). Put `public/_headers` and `public/_redirects`; they land in `dist/` and Pages sees them.

Astro’s Cloudflare adapter docs (still the owning note for this file placement, even if you skip the adapter) say the same: create `_headers` / `_redirects` in `public/`; they are copied to the build output. **Headers in `_headers` are not applied to responses generated by Worker code.** Dynamic redirects should be configured in Astro, not `_redirects` ([@astrojs/cloudflare — Headers / Redirects](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)).

Cloudflare Pages itself has the same Functions caveat: `_headers` and `_redirects` **do not apply** to Pages Functions / `_worker.js` responses, even when the URL matches ([Headers](https://developers.cloudflare.com/pages/configuration/headers/); [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)). Static-only deploys do not hit that caveat.

Redirects run before headers ([Redirects](https://developers.cloudflare.com/pages/configuration/redirects/); [Headers](https://developers.cloudflare.com/pages/configuration/headers/)). Lines starting with `#` in `_redirects` are comments ([Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)). The current comment-only `www/_redirects` is valid but unused.

### Mapping the existing `www/_headers`

Today’s rules target `/reset.css`, `/style.css`, `/app.js`, `/*.html`. After Astro, bundled CSS/JS default to `dist/_astro/` (`build.assets` default `'_astro'`) ([Configuration reference: `build.assets`](https://docs.astro.build/en/reference/configuration-reference/#buildassets)). Those old path-specific cache rules will not match hashed `/_astro/*` files unless rewritten.

Pages already sends `Cache-Control: public, max-age=0, must-revalidate` for cacheable assets ([Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)). Cloudflare’s own example for fingerprinted files is a `_headers` glob with a long `max-age` ([Headers](https://developers.cloudflare.com/pages/configuration/headers/)). Site-wide security headers (`X-Frame-Options`, CSP, etc.) on `/*` still apply to static responses.

If a later SSR/adapter path is chosen, security headers must be set on the Function/Worker `Response`, not only in `_headers` ([Headers](https://developers.cloudflare.com/pages/configuration/headers/)).

Workers static assets also honor `_headers` / `_redirects` in the asset directory ([Migrate from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)) — relevant only if the site later leaves Pages.

## Recommended publish command

Keep Direct Upload. Build, then upload `dist` to the existing project:

```bash
npx astro build && npx wrangler pages deploy dist --project-name=rudol-cv --branch=main
```

That is the current README command with `www` replaced by `dist`, which is Astro’s default output and Cloudflare’s Astro Pages build directory.

Do **not** run `npx wrangler deploy` (Workers) against this project if the goal is no DNS/project move ([Deploy Astro to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) vs [Wrangler `pages deploy`](https://developers.cloudflare.com/workers/wrangler/commands/pages/)).

Optional later: a Pages-shaped `wrangler.jsonc` with `"name": "rudol-cv"` and `"pages_build_output_dir": "./dist"` was the Astro **v5** Pages recipe ([Astro v5 deploy to Cloudflare](https://v5.docs.astro.build/en/guides/deploy/cloudflare/)). Current Astro docs no longer document that Pages `wrangler.jsonc`; the CLI flags above do not depend on it.

## Constraints checklist

| Topic | Constraint | Source |
| --- | --- | --- |
| Same custom domains | Redeploy to existing Pages project `rudol-cv` | [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) |
| Static vs adapter | Static: no adapter. Adapter: on-demand only, and **no longer Pages** | [@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/), [On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/) |
| Publish directory | `dist` (Astro default; CF Pages Astro preset) | [`outDir`](https://docs.astro.build/en/reference/configuration-reference/#outdir), [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) |
| `_headers` / `_redirects` | Author in `public/`; copied to `dist`; apply to **static** responses only | [Headers](https://developers.cloudflare.com/pages/configuration/headers/), [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/), [Project structure](https://docs.astro.build/en/basics/project-structure/) |
| Git integration | Cannot convert this Direct Upload project in place | [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) |
| Workers (Astro 6 default for SSR) | New resource + custom-domain move | [Deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/), [Migrate from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/) |

## Sources

- https://docs.astro.build/en/guides/deploy/cloudflare/
- https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- https://docs.astro.build/en/guides/on-demand-rendering/
- https://docs.astro.build/en/basics/project-structure/
- https://docs.astro.build/en/reference/configuration-reference/#outdir
- https://docs.astro.build/en/reference/configuration-reference/#buildassets
- https://v5.docs.astro.build/en/guides/deploy/cloudflare/ (Pages `wrangler pages deploy ./dist` recipe; current docs dropped this section)
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/pages/configuration/headers/
- https://developers.cloudflare.com/pages/configuration/redirects/
- https://developers.cloudflare.com/pages/configuration/serving-pages/
- https://developers.cloudflare.com/workers/wrangler/commands/pages/
- https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
