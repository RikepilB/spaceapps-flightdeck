---
name: hackathon-war-room
description: >
  This skill should be used when the user is running or about to run the Space Apps
  hackathon weekend - "plan the 30 hours", "we're starting the hackathon", "what should
  we do first", "we're behind schedule", "assign roles", "hour by hour plan", or needs
  mid-event replanning and cut-line decisions.
metadata:
  version: "0.1.0"
---

Read [shared evidence and authority contract](../../SAFETY.md) before applying this role or workflow.


# The war room

48 hours on the clock, about 30 of them workable. Plan backwards from the demo.

## Roles

Six named roles even on a team of three. Doubling up is fine; leaving one unowned is
not.

| Role | Owns |
|---|---|
| Lead | The clock. Calls cut lines. Does not write the critical path code |
| Data | Ingest and correctness. Owns the claim that numbers are real |
| Core | The differentiator - the one thing that is not obvious |
| Interface | Everything the judge sees and touches |
| Narrative | Project page, video, pitch. **Starts at hour 2, not hour 26** |
| Floater | Unblocks, tests, notices what everyone missed |

Narrative is the role teams cut first and the one that costs them a fifth of the rubric.
If you must cut something, cut a feature.

## The schedule

Anchor to your event's real clock. Keep the shape.

| Hour | Block | Exit condition |
|---|---|---|
| 0-2 | Lock challenge. Write the one-sentence promise. Assign roles. Create the repo and the deploy target | The sentence is written down and everyone can recite it |
| 2-5 | Data on disk, inspected in a notebook | You can state what the data actually says, with units |
| 5-8 | Ugly end-to-end path | Something renders from real data. No styling. Deployed |
| 8-12 | The differentiator, first pass | It half works |
| 12 | **Cut line 1** | If the differentiator is not working, fall back to the simple version |
| 12-20 | The differentiator, finished | It works on the known-good example |
| 20 | **Cut line 2 - feature freeze** | Anything broken now is cut, not fixed |
| 20-26 | Interface, edge cases, the seeded example, loading and error states | A stranger can drive it |
| 26 | **Cut line 3 - code freeze** | Only submission work from here |
| 26-32 | Project page, video, pitch rehearsal | All three exist in draft |
| 32-36 | Buffer | Absorbs the overrun that will happen |
| 36+ | Submit early, revise, rehearse, sleep | Submitted with hours to spare |

Name the person allowed to call each cut line. An unowned cut line is decoration.

## Hour zero checklist

- Repo created, everyone has push access
- Deploy target live with a hello-world, so deployment failures surface now
- Shared doc for the project page, started immediately
- Earthdata Login and api.nasa.gov key confirmed working on each machine
- The one-sentence promise written at the top of the shared doc
- Everyone knows the local event's exact submission close time, in local time

## The one-sentence promise

`For [named person], [product] turns [named dataset] into [the decision they can now make].`

Write it in hour 1. Every scope argument for the next 30 hours resolves by asking
whether the thing in dispute serves that sentence. If the sentence changes, the project
changed and the plan needs redoing.

## Checkpoints

Every four hours, five minutes, standing up:

1. Is the end-to-end path still working?
2. What is blocked and who owns unblocking it?
3. Are we on or behind the schedule above?
4. What gets cut if we are behind?

## Mid-event triage

When behind, cut in this order:

1. Features nobody demos
2. Model quality beyond "clearly better than the baseline"
3. Breadth of data sources, down to one done properly
4. Visual polish beyond legible

Never cut: the end-to-end path, the seeded working example, the project page, the video,
or the truthfulness of the numbers.

## The failure everybody has

The demo breaks in front of judges. Prevent it: cache data to disk, seed a known-good
example, record a screen capture of the working flow at hour 26 and keep it in a second
browser tab. A broken live demo then costs five seconds instead of the pitch.

## Wellbeing, stated plainly

Thirty productive hours plus sleep beats forty-five hours awake. Teams that skip sleep
ship worse work and present badly, and Presentation is a fifth of the score. Schedule
the sleep block into the table above and treat it as load-bearing.
