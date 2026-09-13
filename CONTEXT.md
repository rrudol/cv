# rudol.dev

Rafał Rudol's personal homepage. It presents him as an IT specialist; it is not a resume that happens to have a URL.

## Language

**Homepage**:
The whole of rudol.dev. Its job is to present Rafał as an IT specialist through selected projects, writing, and condensed experience.
_Avoid_: CV site, resume site, personal brand page

**Home**:
The document at `/`. A short specialist introduction, a handful of Projects, recent Writing. Not the full Experience.
_Avoid_: landing, index-as-CV

**Experience**:
The document at `/experience`. Employment, impact, and recommendations. A guest surface for hiring managers, not the skeleton of the site.
_Avoid_: CV (as the name of the site), resume

**Projects**:
The document at `/projects`. Index of own-name systems. Home shows a handful; this page can show more.
_Avoid_: portfolio, case studies

**Writing**:
A production essay: one hard lesson from work he actually did. Not a tutorial, not a project changelog, not a TIL. Index at `/writing`.
_Avoid_: blog (as a content type), note, changelog

**Specialist**:
The person the Homepage presents: someone who ships and operates real systems — web and platform in industry, agents, memory, and infra in his own work. Snowflake is weight; it is not the hero identity.
_Avoid_: Staff FE (as the site's claim), AI influencer, personal brand

**Project**:
A system Rafał currently runs or recently shipped under his own name. Employment work belongs in Experience, not in the Projects gallery (one industry-proof card is allowed).
_Avoid_: job, case study, portfolio piece (as synonyms for Project)

**Gallery-honest link**:
A public URL or public GitHub repo a visitor without Tailscale can open. Tailnet `*.rudol.dev` hosts and private GitHub URLs are not this.
_Avoid_: live URL (when it only works on the tailnet)

**Site language**:
English only — chrome, Experience, and writing. No Polish locale.
_Avoid_: bilingual site, PL canonical

**Publishing**:
Markdown files in git are the source of truth. The site builds from the repo. A hosted CMS is out until a GUI is actually needed.
_Avoid_: CMS (as the source of truth), WordPress, Sanity

**Syndication**:
On essay publish, post a short hook and URL to Twitter/X and Bluesky. The homepage is not a social client; follow links live in the chrome.
_Avoid_: embedded feed, webmentions (for this effort)

**Material**:
The current monospace, spare, printable look. New IA, same personality.
_Avoid_: new brand, split identity (Home vs Experience)

**Stack**:
Astro, markdown in the repo, static output on the existing Cloudflare Pages project.
_Avoid_: Next.js, hand-edited HTML as the whole site, WordPress
