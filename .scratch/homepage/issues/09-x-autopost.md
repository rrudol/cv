# Whether publish still auto-posts to X

Type: grilling
Status: open

## Question

Charting locked a hook plus URL to X and Bluesky on essay publish. [How essays syndicate to X and Bluesky](02-syndicate-x-bluesky.md) found there is no first-party git-push product: a GitHub Action calls X `POST /2/tweets` (user-context OAuth; a post that contains a URL is billed **$0.20**) and Bluesky `createRecord` (app password, 300 graphemes, link facets). Humans stay in the loop for the X developer app and credits, a Bluesky app password, and GitHub secrets.

Does publish still auto-post to **both**, Bluesky only, X only, or neither (chrome follow links; a human pastes the hook)?
