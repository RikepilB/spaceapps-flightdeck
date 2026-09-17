# Public repository and Pages

Repository: https://github.com/RikepilB/spaceapps-flightdeck

Tutorial: https://rikepilb.github.io/spaceapps-flightdeck/

## Publication boundary

The public repository starts with a reviewed snapshot of source, documentation,
synthetic fixtures and the website. Original development history, session transcripts,
raw runtime logs, credentials and local evidence are excluded. Keep personal/team
information out of public issues and pull requests.

Only site/ is uploaded to Pages. The crew planner has a local-only form and stores
aliases, capability self-reports and readiness in browser localStorage. Nothing is
sent to a team server. Export creates a user-controlled JSON file; import validates
it and asks before replacing the local board. Clearing browser data removes saved
work. There is no backend, live sync, authentication, analytics SDK, cookie storage
or external font. GitHub operates hosting under its own policies.

## Editing and recovery

Edit HTML/CSS/JS, run npm test and npm run validate, then inspect npm run serve on
desktop and mobile. Push an authorized reviewed change to main. Publish tutorial
tests before deploying; validate independently checks the repository. Pages uses
GitHub Actions, not publication of the repository root.

Owner: repository maintainer. Inspect Actions → Publish tutorial if deployment fails.
Fix or revert through a normal reviewed commit and rerun. Never force-push to roll
back. Verify the public URL and relative assets after deployment. No database or
secret is required for this page; never add tokens to its artifact.
