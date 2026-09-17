/**
 * Regression evals for the Space Apps harness.
 *
 * Each agent definition is run against a fixture with known planted defects, inside a
 * sandbox, on its own branch. Results land as commits you review before merging.
 *
 * Why sandboxed rather than just calling the agent: the runs are concurrent, they write
 * files, and the whole point is to compare several attempts. Branch isolation is what
 * makes that reviewable instead of a mess in one working tree.
 *
 *   npx tsx evals/run-evals.ts
 *
 * Prerequisites: Docker Desktop or Podman running, and `.sandcastle/.env` populated.
 */
import { run } from "@ai-hero/sandcastle";
import { claudeCode } from "@ai-hero/sandcastle/agents/claude-code";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";

interface EvalCase {
  /** Used for the branch name and the output path, so keep it filesystem-safe. */
  readonly id: string;
  readonly promptFile: string;
  readonly promptArgs: Record<string, string>;
}

const MODEL = process.env.EVAL_MODEL;
if (!MODEL) throw new Error("Set EVAL_MODEL to an available model after reviewing the sandbox setup.");
const RUN_ID = new Date().toISOString().replace(/[:.]/g, "-");

const CASES: readonly EvalCase[] = [
  {
    id: "science-validator",
    promptFile: "evals/prompts/science-validator.md",
    promptArgs: {
      FIXTURE: "evals/fixtures/exofinder.md",
      OUTPUT: "evals/results/science-validator.md",
    },
  },
  {
    id: "data-scout",
    promptFile: "evals/prompts/data-scout.md",
    promptArgs: {
      TASK: [
        "A team needs a two-day frost-risk warning for smallholder farmers in the",
        "Peruvian altiplano (about 15S 70W, 3800-4200 m). They need near-surface air",
        "temperature, humidity, precipitation, land surface temperature, soil moisture",
        "and a DEM. 30 hours, one laptop.",
      ].join(" "),
      OUTPUT: "evals/results/data-scout.md",
    },
  },
];

async function runCase(c: EvalCase) {
  // A distinct branch per case is required: concurrent runs sharing a branch collide.
  const result = await run({
    agent: claudeCode(MODEL),
    sandbox: docker(),
    promptFile: c.promptFile,
    promptArgs: c.promptArgs,
    branchStrategy: { type: "branch", branch: `eval/${RUN_ID}/${c.id}` },
    maxIterations: 1,
    // Research-heavy runs go quiet for a long time while fetching. The 600s default
    // kills data-scout mid-sweep.
    idleTimeoutSeconds: 1800,
  });
  return { id: c.id, branch: result.branch, commits: result.commits.length };
}

async function main(): Promise<void> {
  // Promise.allSettled, not Promise.all: one agent failing should not discard the
  // results of the others. A partial eval run is still useful.
  const settled = await Promise.allSettled(CASES.map(runCase));

  let failed = 0;
  settled.forEach((s, i) => {
    const id = CASES[i].id;
    if (s.status === "fulfilled") {
      console.log(`UNSCORED  ${id}  branch=${s.value.branch}  commits=${s.value.commits}`);
    } else {
      failed += 1;
      console.error(`ERROR ${id}  ${String(s.reason)}`);
    }
  });

  console.log(
    "\nReview before merging:\n" +
      CASES.map((c) => `  git diff main...eval/${RUN_ID}/${c.id}`).join("\n"),
  );
  console.log(
    "\nThen score each result against evals/keys/. An agent below its pass_threshold\n" +
      "has regressed: fix the agent definition, not the fixture.",
  );

  // Non-zero exit so CI notices, without hiding the results printed above.
  if (failed > 0) process.exitCode = 1;
}

main();
