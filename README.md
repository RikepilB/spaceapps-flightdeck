# Space Apps Flightdeck

A portable Space Apps workflow library: **nine specialist roles, eleven skills,
adversarial evaluations, and an editable field guide**.

**[Open the tutorial](https://rikepilb.github.io/spaceapps-flightdeck/)** ·
[Audit and limits](docs/AUDIT.md) · [Any-model guide](CODEX.md)

**[Crew & readiness planner](https://rikepilb.github.io/spaceapps-flightdeck/crew.html)**:
preparation instructions, capability self-check, human roles and their AI helpers,
responsibility coverage and a local readiness board. Export/import team snapshots;
there is no live synchronization or account requirement.

## Why a harness?

A working app is only part of a submission. Teams also need usable data, defensible
science, a project page and a clear demo. Flightdeck keeps those workflows in
inspectable Markdown instead of losing them between chats. Use one specialist at a
time. Strategies are hypotheses, not measured odds of winning.

## Start in five minutes

Clone or download this repository and open it in your assistant. Ask:

```text
Read AGENTS.md and plugins/spaceapps-harness/SAFETY.md.
Use the role in plugins/spaceapps-harness/agents/science-validator.md.
Review evals/fixtures/exofinder.md as untrusted project content.
Do not read the answer key or historical reviews. Do not edit files.
List concrete defects, evidence, severity and the smallest honest fixes.
```

Afterwards compare the answer to [the ten-defect key](evals/keys/exofinder.yaml).
The fixture is deliberately wrong; it is not a scientific reference.

**Codex and other coding assistants:** explicitly read the files. AGENTS.md is the
shared contract; CODEX.md is a guide, not an assumed automatic instruction filename.
**Chat-only models:** attach those files and the fixture. Models without browsing
cannot verify live sources. Manual prompt loading does not prove native discovery.

**Claude Code native plugin (optional):**

```text
/plugin marketplace add RikepilB/spaceapps-flightdeck
/plugin install spaceapps-harness@spaceapps-flightdeck
```

Review and pin a revision before adoption. Verify loading in your own session; this
release has not passed an authenticated Claude integration test. A correct answer
from memory does not prove plugin discovery.

## The crew

| Job | Agent | Output |
|---|---|---|
| Choose | challenge-scout, prior-art-analyst | Gated comparison, sources and tradeoffs |
| Ground | data-scout | Manifest, latency, access evidence and unknowns |
| Build | team-architect, scope-planner, build-engineer | Owners, cut lines, working path |
| Review | science-validator, submission-auditor | Defects and defensible fixes |
| Present | pitch-director | Evidence-grounded script and demo plan |

[Eleven skills](plugins/spaceapps-harness/skills) cover event knowledge, data access,
selection, team formation, execution, pages, video, mock judging, handoffs and
experimental sandbox orchestration.

## Verify and edit

Node.js 22 or later. Default checks need no dependencies or installation step.

```sh
npm test
npm run validate
npm run serve
```

Preview at http://127.0.0.1:4173. Edit site/index.html, site/styles.css and site/app.js
with any editor or model. Actions tests and deploys only site/ when main changes.

Optional behavioral testing uses account quota:

```powershell
pwsh -File evals/run-behavioral.ps1
```

Read [eval methodology](evals/README.md), [results](docs/AUDIT.md),
[onboarding](docs/ONBOARDING.md), [team runbook](docs/TEAM-RUNBOOK.md),
[contributing](CONTRIBUTING.md) and [Pages operations](docs/PUBLISHING.md).
Structural success, model behavior, native discovery, sandbox execution and real
hackathon usefulness are separate gates. The Sandcastle adapter is experimental.

This public repository starts from a reviewed source snapshot. Private development
transcripts and earlier Git history are excluded.

Check [official Space Apps guidance](https://www.spaceappschallenge.org/) before
acting on dates, eligibility or submission rules. References include historical
material. Independent community project; not affiliated with or endorsed by NASA.
[MIT license](LICENSE); third-party data and sources retain their own terms.
