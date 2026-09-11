# rudol.dev — CV

Statyczne CV (monospace): doświadczenie, impact, skills, rekomendacje, formularz kontaktowy (FormSubmit + reCAPTCHA).

## Lokalnie

```bash
cd www
python3 -m http.server 8765
```

Otwórz: <http://localhost:8765>

## Deploy (Cloudflare Pages)

1. Repo → **Workers & Pages** → Create → Connect git (lub Direct Upload folder `www`).
2. **Build settings**
   - Framework preset: None
   - Build command: _(empty)_
   - Output directory: `www`
3. Custom domain: `rudol.dev` (+ `www` → redirect).
4. Headers z `www/_headers` są stosowane automatycznie na CF Pages.

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
