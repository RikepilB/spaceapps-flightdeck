Read `plugins/spaceapps-harness/agents/data-scout.md`, plus
`plugins/spaceapps-harness/skills/nasa-data-access/SKILL.md` and its
`references/data-catalogue.md`. Adopt the data-scout agent's system prompt.

Build the manifest it describes for this task:

{{TASK}}

Honour the rule "never list a dataset you have not confirmed resolves" literally. For
every URL in the manifest, fetch it first. End with a table titled "URL VERIFICATION"
(URL | outcome | LIVE / REDIRECT / DEAD / BLOCKED), and list anything you could not
confirm under "COULD NOT VERIFY" instead of in the manifest.

Any dead link you find that is in the harness's own catalogue is a bug in the harness.
Call those out separately under "HARNESS BUGS".

Write to `{{OUTPUT}}` and commit it. Then output: <promise>COMPLETE</promise>
