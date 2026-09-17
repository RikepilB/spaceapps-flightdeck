# Improving the harness

The harness is a set of prompts. Prompts fail silently, so the only way to know a change
helped is to run it against something with known answers.

## The loop

```
notice a gap  ->  write a fixture  ->  change the agent  ->  run evals  ->  PR  ->  release
```

### 1. Notice a gap

Gaps show up in three ways, all of them worth a issue:

- **An agent gave bad advice.** Paste what it said. This is the highest-value report.
- **A link in the catalogue is dead**, or a dataset moved. Cheap to fix, and it costs
  someone an hour on the day if it is not.
- **A stage of the weekend has no owner.** If you found yourself doing something none of
  the nine agents covers, that is a missing agent.

### 2. Write the fixture first

Before changing a prompt, write the input that should have produced a better answer. Put
it in `evals/fixtures/` and its scoring key in `evals/keys/`.

A good fixture has **planted, enumerable defects** and a pass threshold. "Does this read
well" is not a test. "Does it catch the swapped declination" is.

Fixtures are the test. Never edit one to make a run pass.

### 3. Change the agent or skill

Keep the shape:

- Skill frontmatter `description` is third-person and carries the literal phrases someone
  would type. That string is the whole trigger mechanism.
- Agent frontmatter needs `name`, `description` with `<example>` blocks, `model`, `color`.
  **The description must be a block scalar** — `description: |` with every line
  indented two spaces. `<example>` blocks at column 0 make the whole file fail to
  parse, and the agent silently never loads. v0.4.0 shipped nine agents like that.
- SKILL.md bodies stay under 3,000 words. Detail goes in `references/`.
- Write portable instructions imperatively; keep host metadata separate. Not documentation for a human to read.

### 4. Run checks and relevant behavioral scenarios

Run npm test and npm run validate. See [evals/README.md](evals/README.md) for optional
authenticated model tests. Keep raw results local; publish reviewed evidence with
model, criteria, failures, fixes and reruns. Missing runtime access is BLOCKED, not
PASS. Explicit prompt loading is not native plugin discovery.

### 5. Open the PR

Include the eval output. A PR that changes an agent with no eval result attached gets
sent back.

Conventional Commits: `fix(data-scout): add latency gate before dataset selection`.

### 6. Release

Bump package.json version and `version` in both `plugins/spaceapps-harness/.claude-plugin/plugin.json` and the
matching entry in `.claude-plugin/marketplace.json` — they must agree or installs get
confusing. Tag it. Teammates pick it up with `/plugin marketplace update`.

## Two rules that outrank the rest

**Do not add an agent because the arc feels incomplete.** Nine is already a lot to hold in
your head. A new agent has to earn its slot against a real failure someone hit.

**Do not let the harness become the project.** It exists to win a hackathon. If you are
spending the week before the event improving the harness instead of preparing to build,
the harness has become a distraction from the thing it was for.
