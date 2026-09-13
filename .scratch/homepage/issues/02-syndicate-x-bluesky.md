# How essays syndicate to X and Bluesky

Type: research
Status: resolved

## Question

What is the current first-party way to post a short hook plus essay URL to Twitter/X and Bluesky when a git publish happens (GitHub Action on the content repo), and what credentials, scopes, and limits does that imply?

Need: official API docs, not blog roundups. Call out anything that would force a human in the loop.

## Answer

No first-party “post on git push.” A GitHub Action on `push` stores secrets and calls each HTTP API: X `POST /2/tweets` with user-context OAuth (1.0a owner tokens or OAuth 2.0 `tweet.write` + `tweet.read` + `users.read`; URL posts cost $0.20 in pay-per-use credits) and Bluesky `createSession` (app password) then `createRecord` `app.bsky.feed.post` (300 graphemes; link facets required). Humans: X developer app + credits, Bluesky app password, GitHub secrets; optional environment reviewers.

Full write-up: [research/02-syndicate-x-bluesky.md](../research/02-syndicate-x-bluesky.md)
