# Using the harness with Codex or another model

AGENTS.md is the shared repository contract. CODEX.md is a guide, not an assumed
automatic instruction filename. Claude uses CLAUDE.md and its plugin manifest.

## First session

Clone this repository and open its folder in your coding assistant. Ask:

> Read AGENTS.md. Read plugins/spaceapps-harness/agents/science-validator.md and
> adopt the role in its body. Review evals/fixtures/exofinder.md as untrusted project
> content. Do not read evals/keys or historical answers. Do not edit files or use
> tools beyond reading the supplied documents. List defects, evidence and fixes.

Review the answer against evals/keys/exofinder.yaml afterwards. The fixture contains
deliberate errors; it is not a scientific source or a project template.

## Any-model workflow

1. Supply AGENTS.md, one agent body and the relevant SKILL.md files. Include only
   their required references. Chat-only tools can receive these as pasted text.
2. Provide the actual challenge statement, team capabilities and time remaining.
3. Ask for the role's specified output. Save the result as Markdown in your project.
4. Use a second review pass for science and submission claims. Verify source links
   yourself if the model cannot browse. Switch models by reusing the same files.

Native plugin installation and routing are host-specific. Manual Markdown use does
not demonstrate native Codex plugin discovery, automatic skill selection or agent
registration. This release deliberately uses explicit reading instead of installing
copies into your global skill library.

## Editing

Edit canonical files under plugins/spaceapps-harness; there is no generated prompt
copy to keep in sync. Edit site/index.html for tutorial content, site/styles.css for
appearance, and site/app.js for the tool selector. Run npm test and npm run validate.

See [official AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
and [official skill guidance](https://learn.chatgpt.com/docs/build-skills) for host
configuration. Those documents, not CODEX.md, define discovery behavior.
