# rudol.dev — CV

Statyczne CV (monospace): doświadczenie, impact, skills, rekomendacje, formularz kontaktowy (FormSubmit + reCAPTCHA).

## Lokalnie

```bash
cd www
python3 -m http.server 8765
```

Otwórz: <http://localhost:8765>

## Live

| URL | Status |
|-----|--------|
| https://rudol-cv.pages.dev | **Production (live)** |
| https://github.com/rrudol/cv | Source |
| https://rudol.dev | Custom domain (CNAME — see below) |

Redeploy:

```bash
npx wrangler pages deploy www --project-name=rudol-cv --branch=main
```

## Deploy (Cloudflare Pages)

Already created: project **`rudol-cv`**, account Rafał Rudol.

### Custom domain `rudol.dev`

Pages domains are registered on the project (`rudol.dev`, `www.rudol.dev`) but the Wrangler OAuth token cannot write DNS. In **Cloudflare Dashboard → rudol.dev → DNS** add:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `@` (rudol.dev) | `rudol-cv.pages.dev` | Proxied |
| CNAME | `www` | `rudol-cv.pages.dev` | Proxied |

If apex CNAME is blocked by other records, use a flattened CNAME / ALIAS to `rudol-cv.pages.dev`, or CF “Custom domains” UI on the Pages project (it can create records when you have full zone access in the browser).

After DNS propagates, domain status in Pages → Custom domains should flip to **Active**.

### Netlify

- Base directory: `/`
- Publish directory: `www`
- `_headers` i `_redirects` w `www/` działają out of the box.

### GitHub Pages

- Deploy contents of `/www` (Action `peaceiris/actions-gh-pages` lub branch `gh-pages`).
- Ustaw custom domain `rudol.dev` w Settings → Pages.
- `_headers` **nie** działa na GH Pages — security headers ustaw na DNS/CDN (Cloudflare proxy).

## Formularz kontaktowy

- Endpoint: FormSubmit → `rudol.dev@gmail.com`
- Captcha: wbudowane reCAPTCHA FormSubmit
- Po deployu: **pierwszy submit z produkcji** aktywuje skrzynkę (mail z linkiem confirm)
- `_next` ustawiane w `app.js` na absolutny `thanks.html`

## Druk / PDF

W przeglądarce: Print → Save as PDF. Style `@media print` zwijają UI i rozwijają earlier experience.

## Struktura

```
www/
  index.html      # CV
  thanks.html     # po wysłaniu formularza
  app.js          # lata IT, tenure, form next URL
  reset.css       # modern reset
  style.css       # layout
  favicon.svg
  robots.txt
  sitemap.xml
  _headers        # CF Pages / Netlify security + cache
  _redirects
```
