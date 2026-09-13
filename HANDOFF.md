# Handoff: rrudol/cv

Backup przed formatem, 2026-09-13.

**To archiwum WIP, nie wydanie. CI pominięte na wyraźne polecenie użytkownika.**

Stany referencji: `{'ALREADY_ON_ORIGIN': 5, 'VERIFIED': 2}`.

Career i radium-226 oraz rozpoznane kopie wyłączone. Bez merge, deploy, force-push i zmiany oryginalnych branchy.
Pliki ignorowane przez Git, sekrety, bazy, duże pliki i oryginalne historie oznaczone BLOCKED nie są objęte pełnym backupem.
Nie formatować przed zabezpieczeniem pozycji lokalnych. Sam plik handoff nie zawiera kodu tych pozycji.

Tagi zachowano jako commity docelowe; podpisy i metadane tagów annotated mogą pozostać tylko lokalnie.

## Odtwarzanie

1. Sklonuj odpowiednie repozytorium. Pobierz branche: `git fetch origin`.
2. Wybierz ref VERIFIED z mapy. Dla snapshot/sanitized: `git switch -c recovered origin/backup/pre-format-20260913/...`.
3. Ref `snapshot` zawiera stan roboczy; `index_snapshot` osobno oryginalny staged. `ref` zachowuje tip brancha jako parent commita backupowego.
4. Dla stasha VERIFIED, jego oryginalny OID znajduje się w mapie i jest parentem commita backupowego: `git stash apply --index <original-oid>` na odpowiedniej bazie.
5. SANITIZED to osobny snapshot bez historii, z listą usuniętych ścieżek. Nie używaj go jako pełnego zamiennika oryginału.
6. ALREADY_ON_ORIGIN: tip był obecny w reklamowanych refach serwera w trakcie audytu. OID można odnaleźć po `git fetch --all --tags`.
7. Nested source: kod zagnieżdżonego repo zapisano w prywatnym origin projektu nadrzędnego. Odtwórz osobno do wskazanego podkatalogu; zwykłe submodule update nie odtworzy zmian roboczych.
8. Nie uruchamiaj skryptów deploy z odzyskanych branchy. Sprawdź diff i uruchom właściwe testy dopiero przy kontynuacji pracy.

## Suggested skills

`git-worktree-management`, `handoff`, `verification-before-completion`; przy kontynuacji kodu właściwe AGENTS.md.

## Projekty i niedokończone prace

### rrudol/cv — 58b63dd3263e

- Lokalnie: `/Users/rafal/Projects/rudol_dev/hello_wasm`.
- Status: **PUBLISHED**.

**/Users/rafal/Projects/rudol_dev/hello_wasm** — branch `main`.

Stan WIP: 17 wpisów statusu.
```text
 M www/index.html
 M www/thanks.html
?? .scratch/homepage/issues/01-astro-on-pages.md
?? .scratch/homepage/issues/02-syndicate-x-bluesky.md
?? .scratch/homepage/issues/03-project-url-inventory.md
?? .scratch/homepage/issues/04-home-project-handful.md
?? .scratch/homepage/issues/05-experience-port.md
?? .scratch/homepage/issues/06-home-prototype.md
?? .scratch/homepage/issues/07-essay-frontmatter.md
?? .scratch/homepage/issues/08-chrome.md
?? .scratch/homepage/issues/09-x-autopost.md
?? .scratch/homepage/issues/10-unlinkable-projects.md
?? .scratch/homepage/map.md
?? .scratch/homepage/research/01-astro-on-pages.md
?? .scratch/homepage/research/02-syndicate-x-bluesky.md
?? .scratch/homepage/research/03-project-url-inventory.md
?? CONTEXT.md
```

| Rodzaj / źródło | Stan | Branch backupowy / commit |
|---|---|---|
| ref: `refs/heads/main` | ALREADY_ON_ORIGIN | [72d62d78938c](https://github.com/rrudol/cv/commit/72d62d78938c1e37481dc40ed7c39993f0a3ec83) |
| head: `/Users/rafal/Projects/rudol_dev/hello_wasm` | ALREADY_ON_ORIGIN | [72d62d78938c](https://github.com/rrudol/cv/commit/72d62d78938c1e37481dc40ed7c39993f0a3ec83) |
| snapshot: `/Users/rafal/Projects/rudol_dev/hello_wasm` | VERIFIED | [backup/pre-format-20260913/58b63dd3263e/snapshot/a61eb49f283e](https://github.com/rrudol/cv/tree/backup/pre-format-20260913/58b63dd3263e/snapshot/a61eb49f283e) |

### rrudol/cv — 6dd418781298

- Lokalnie: `/Users/rafal/Projects/rudol_dev/hello_wasm`.
- Status: **PUBLISHED**.

**/Users/rafal/Projects/rudol_dev/hello_wasm** — branch `main`.

Stan WIP: 14 wpisów statusu.
```text
?? .scratch/homepage/issues/01-astro-on-pages.md
?? .scratch/homepage/issues/02-syndicate-x-bluesky.md
?? .scratch/homepage/issues/03-project-url-inventory.md
?? .scratch/homepage/issues/04-home-project-handful.md
?? .scratch/homepage/issues/05-experience-port.md
?? .scratch/homepage/issues/06-home-prototype.md
?? .scratch/homepage/issues/07-essay-frontmatter.md
?? .scratch/homepage/issues/08-chrome.md
?? .scratch/homepage/issues/09-x-autopost.md
?? .scratch/homepage/issues/10-unlinkable-projects.md
?? .scratch/homepage/map.md
?? .scratch/homepage/research/01-astro-on-pages.md
?? .scratch/homepage/research/02-syndicate-x-bluesky.md
?? .scratch/homepage/research/03-project-url-inventory.md
```

| Rodzaj / źródło | Stan | Branch backupowy / commit |
|---|---|---|
| ref: `refs/heads/main` | ALREADY_ON_ORIGIN | [72d62d78938c](https://github.com/rrudol/cv/commit/72d62d78938c1e37481dc40ed7c39993f0a3ec83) |
| ref: `refs/heads/wip/pre-format-2026-09-13` | ALREADY_ON_ORIGIN | [ff6ee5541772](https://github.com/rrudol/cv/commit/ff6ee5541772bb7875e66986ad4226b6e5d06df6) |
| head: `/Users/rafal/Projects/rudol_dev/hello_wasm` | ALREADY_ON_ORIGIN | [72d62d78938c](https://github.com/rrudol/cv/commit/72d62d78938c1e37481dc40ed7c39993f0a3ec83) |
| snapshot: `/Users/rafal/Projects/rudol_dev/hello_wasm` | VERIFIED | [backup/pre-format-20260913/6dd418781298/snapshot/a61eb49f283e](https://github.com/rrudol/cv/tree/backup/pre-format-20260913/6dd418781298/snapshot/a61eb49f283e) |

