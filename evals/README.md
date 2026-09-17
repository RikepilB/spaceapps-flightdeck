# What these tests establish

`npm test` runs offline structural, mutation and content-contract checks. It does not
invoke a model, prove native plugin routing, or validate scientific claims.

`pwsh -File evals/run-behavioral.ps1` runs six bounded text scenarios through an
already authenticated Codex CLI. It uses the configured default model of the CLI,
disables shell and multi-agent tools, uses a read-only temporary working directory,
and saves responses locally in evals/results. It incurs normal account usage. No
API keys, browser state or credentials are read by this script. Review the response
files against evals/scenarios.json; process completion is never a passing grade.
This is explicit prompt loading, not a native plugin-discovery test. All nine roles
and eleven skills are represented, but this small synthetic suite is not an estimate
of real-world reliability. Repeat per model and include negative controls before
making cross-model or value claims.

## Historical sandbox runner

evals/run-evals.ts is an experimental Sandcastle adapter, retained for investigation.
It requires a separately reviewed, pinned Sandcastle installation, a running Docker
daemon and authenticated Claude. It is not installed by npm install and is not part
of CI. Inspect its upstream API before use; no current integration pass is claimed.
It creates branch commits: only run it when authorized. Its completion output says
UNSCORED until a human compares the actual result to the scoring key.

Never edit planted fixtures or the original science scoring key to improve a score.
Keep raw outputs local; publish only reviewed, redacted evidence and coverage limits.
