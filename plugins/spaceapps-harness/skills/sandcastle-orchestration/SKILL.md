---
name: sandcastle-orchestration
description: >
  This skill should be used when running coding agents in isolated sandboxes with
  sandcastle - "run agents in parallel", "sandcastle", "sandboxed agent", "run the evals",
  "orchestrate agents on branches", "@ai-hero/sandcastle" - or when several agent tasks
  need to run at once and land as reviewable commits rather than edits in one working tree.
metadata:
  version: "0.1.0"
---

Read [shared evidence and authority contract](../../SAFETY.md) before applying this role or workflow.


# Orchestrating agents with sandcastle

`@ai-hero/sandcastle` (Matt Pocock / AI Hero) runs a coding agent inside a sandbox, on its
own git branch, and merges the resulting commits back. This repository retains an experimental adapter; its integration has not been
verified. Default tests do not use Sandcastle. See evals/README.md first.

## When to use it, and when not to

**Use it for:** running the plugin's eval suite; letting several agents attempt the same
task so you can compare; parallel changes across the repo that must land as separate
reviewable commits; anything where you want the agent's work isolated from your working
tree.

**Do not use it during the hackathon.** It needs Docker or Podman running, a scaffolded
config, and a working image. Introducing an orchestration layer nobody has run before,
inside a 30-hour window, is exactly the overbuild the `hackathon-war-room` skill warns
against. Set it up weeks ahead for improving the harness, then leave it alone on the
weekend.

## Setup

Do not run an unpinned installer. Review a specific upstream release with the
operator's tool-intake process and pin it before installation. Docker, model auth
and an API-compatible runner must all be verified before claiming readiness.

`init` scaffolds `.sandcastle/` containing `.env` (agent tokens), a `Dockerfile` (Node,
git, GitHub CLI, Claude Code CLI, a non-root `agent` user), `prompt.md`, and a
`.gitignore` that keeps logs and `.env` out of the repo. Prerequisites: git, a sandbox
provider (Docker Desktop, Podman, or a Vercel account), and agent auth.

**Never commit `.sandcastle/.env`.** The scaffolded `.gitignore` covers it; verify before
the first push.

## Historical API example (verify against the pinned release)

```ts
import { run } from "@ai-hero/sandcastle";
import { claudeCode } from "@ai-hero/sandcastle/agents/claude-code";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";

const result = await run({
  agent: claudeCode(process.env.EVAL_MODEL!),
  sandbox: docker(),
  promptFile: "evals/prompts/science-validator.md",
  promptArgs: { FIXTURE: "evals/fixtures/exofinder.md" },
  branchStrategy: { type: "branch", branch: "eval/science-validator" },
  maxIterations: 1,
});
// result.commits -> [{ sha }], result.branch, result.stdout, result.logFilePath
```

## The options that matter

| Option | Notes |
|---|---|
| `agent` | `claudeCode(model, opts)`, `codex()`, `pi()`, `cursor()`, `opencode()`, `copilot()`. No auto-detection - name it. |
| `sandbox` | `docker()`, `podman()`, `vercel()`, `no-sandbox()`, or custom |
| `prompt` **or** `promptFile` | Exactly one. Passing both is an error. |
| `promptArgs` | `{{KEY}}` substitution. Only valid with `promptFile` - passing it with an inline `prompt` is an error. |
| `branchStrategy` | `head`, `merge-to-head`, or `{ type: "branch", branch }` |
| `maxIterations` | Default 1. Incompatible with `resumeSession`. |
| `completionSignal` | Default `<promise>COMPLETE</promise>`. Have the agent emit it to stop early. |
| `idleTimeoutSeconds` | Default 600. Raise it for long research runs. |
| `output` | `Output.object()` / `Output.string()` for structured extraction. Use this for evals so results are machine-comparable. |
| `hooks`, `copyToWorktree` | Setup/teardown commands, and files to seed into the sandbox |

## Branch strategies

- **`head`** writes straight into the host working directory. Bind-mount providers only
  (Docker, Podman), and it is their default. Convenient, and it gives you no isolation -
  do not use it for anything you have not already decided to accept.
- **`merge-to-head`** works on a temp branch and merges back on completion. Default for
  isolated providers.
- **`{ type: "branch", branch }`** is the one to use for evals and for parallel work.
  Named, inspectable, re-runnable - re-running reuses the worktree.

Concurrent runs need a **distinct `branchStrategy` per child**. Two agents sharing one
branch will collide.

## Prompt files

Sourced prompts support three things inline prompts do not:

1. Shell expansion - `` !`command` `` runs in the sandbox and injects stdout
2. `{{KEY}}` substitution from `promptArgs`
3. Built-in `{{SOURCE_BRANCH}}` and `{{TARGET_BRANCH}}`

Shell expansion executes inside the sandbox. Only put commands there you would run
yourself, and never interpolate untrusted text into one.

## Reusing a sandbox

```ts
await using sandbox = await createSandbox({ branch, sandbox: docker() });
await sandbox.run({ agent, prompt });
await sandbox.exec("npm test");
```

`createWorktree()` separates branch management from sandboxing when you want an
interactive session (`wt.interactive({ agent, prompt })`) or several runs against one
worktree.

## Reviewing what comes back

Every run produces commits, not edits in your tree. Read them before merging:

```bash
git log --oneline main..eval/science-validator
git diff main...eval/science-validator
```

The isolation is the point. It buys nothing if you merge without looking.
