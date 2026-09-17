# Team runbook

Who runs what, and when. Roles are Lead, Data, Core, Interface, Narrative, Floater —
doubling up is fine, leaving one unowned is not.

## Before the event

| When | Who | Action |
|---|---|---|
| Challenge summaries drop | Lead | Run `challenge-scout`. It reads every statement and scores them. |
| Same day | Lead + all | Run `prior-art-analyst` on the shortlist. Find what is saturated. |
| Same day | Lead | Decide. One challenge, in writing. Post the kill criteria. |
| Team forming | Lead | Run `team-architect`. It audits the gap and writes the recruiting spec. |
| Team forming | Lead | **Create the team yourself.** On the Universal Event the creator's local time sets everyone's deadline. |
| 1 week out | Data | Run `data-scout` on the chosen challenge. Get the manifest verified before the day. |
| 1 week out | All | Finish `docs/ONBOARDING.md`. Accounts tested on your own machine. |
| 2 days out | Lead | Run `scope-planner`. Publish the hour table with real clock times and named cut-line owners. |

Nobody writes project code in this column. That is the rule.

## The weekend

| Hour | Who | Action |
|---|---|---|
| 0–2 | Lead | Lock the one-sentence promise. Assign roles by name. Repo + deploy target live. |
| 0–2 | Narrative | **Start the project page now.** Not at hour 26. |
| 2–5 | Data | Data on disk and inspected. State what it says, with units. |
| 5–8 | Core + Interface | Ugly end-to-end path. Renders from real data. Deployed. |
| 8–12 | Core | The differentiator, first pass. |
| **12** | **Lead** | **Cut line 1.** Differentiator not working → fall back to the simple version. |
| 12–20 | Core | The differentiator, finished, working on the seeded example. |
| ~18 | Data + Core | Run `science-validator` on every claim. Do this *before* anything is filmed. |
| **20** | **Lead** | **Cut line 2: feature freeze.** Broken now means cut, not fixed. |
| 20–26 | Interface | Edge cases, seeded known-good example, loading and error states. |
| 24 | Narrative | Run `pitch-director`. Script, shot list, run-of-show. |
| **26** | **Lead** | **Cut line 3: code freeze.** Submission work only. |
| 26 | All | Run `judge-simulation`. Fix by payoff, not by interest. |
| 26–32 | Narrative | Record. Page finished. Rehearse. |
| 30 | Interface | Record a screen capture of the working demo. Keep it in a second tab. |
| 32 | Lead | **Submit a complete draft.** Then keep improving it. |
| 34 | All | Run `judge-simulation` again on the real submission. |
| 36+ | All | Sleep. Rehearse. Final submit. |

## Checkpoints

Every four hours, five minutes, standing:

1. Is the end-to-end path still working?
2. What is blocked, and who owns unblocking it?
3. On schedule or behind?
4. If behind, what gets cut?

## When behind, cut in this order

1. Features nobody demos
2. Model quality beyond "clearly better than the baseline"
3. Breadth of data sources, down to one done properly
4. Visual polish beyond legible

**Never cut:** the end-to-end path, the seeded working example, the project page, the
video, or the truthfulness of the numbers.

## The failure everyone has

The demo breaks in front of judges. Prevention is cheap and must happen before hour 26:
cache data to disk, seed a known-good example behind a visible button, and record the
screen capture. A broken live demo then costs five seconds instead of the pitch.

## Sleep

Thirty productive hours plus sleep beats forty-five hours awake. Teams that skip sleep
ship worse work and present badly, and Presentation is a fifth of the score. The sleep
block is in the table because it is load-bearing, not because it is nice.

## After

Within a week, open one issue per thing the harness got wrong or did not cover. That is
how next year's version is better than this one. See CONTRIBUTING.md.
