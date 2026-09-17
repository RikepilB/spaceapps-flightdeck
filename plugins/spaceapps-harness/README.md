# Space Apps Harness

A participation harness for the NASA International Space Apps Challenge: nine subagents
and eleven skills covering the whole arc from "which challenge do we pick" to "the judges
scored our submission".

Built against the 2025 results set (11,500+ submissions, 1,290+ global nominees,
45 global finalists, 23 honorable mentions, 10 global winners) and the published
judging rubric.

## Why it exists

Space Apps is not won by the best code. It is won by the team that scores highest on
five criteria the judges actually use: Impact, Creativity, Validity, Relevance,
Presentation. Every component in this plugin maps back to one of those five.

## Agents

| Agent | Aspect | What it does |
|---|---|---|
| `challenge-scout` | Investigation | Reads every published challenge, scores them against team strengths and award-category fit, recommends a pick with reasoning |
| `prior-art-analyst` | Investigation | Researches past winners and finalists on the same or adjacent challenge, extracts what scored and what is now saturated |
| `data-scout` | Databases | Builds a verified data manifest: endpoints, auth, formats, rate limits, size, and a working fetch snippet per dataset |
| `scope-planner` | Planning | Turns a chosen challenge into an hour-by-hour build plan with explicit cut lines |
| `build-engineer` | Execution | Implements against the plan; TypeScript/Next.js front end, Python back end |
| `science-validator` | Validity | Adversarially checks the science, units, statistics and data-handling claims before they reach a judge |
| `submission-auditor` | Presentation | Scores the draft submission against the real rubric and returns a prioritized fix list |
| `pitch-director` | Presentation | Writes the 30-second video script, the demo run-of-show and the three pitch lengths |
| `team-architect` | Organization | Audits the team's capability gaps, writes the recruiting spec, assigns roles |

## Skills

| Skill | Trigger it with |
|---|---|
| `spaceapps-brief` | "what are the Space Apps rules", "when is the hackathon", "how does judging work" |
| `challenge-selection` | "which challenge should we pick", "score these challenges" |
| `nasa-data-access` | "how do I get NASA data", "Earthdata login", "which dataset for X" |
| `award-targeting` | "which award should we aim at", "how do we win Best Use of Data" |
| `hackathon-war-room` | "plan the 30 hours", "we are starting the hackathon" |
| `project-page-builder` | "write the project page", "draft our submission" |
| `demo-video` | "write the demo video script", "30 second video" |
| `judge-simulation` | "score our project", "judge us", "mock judging" |
| `team-building` | "who should I recruit", "what roles do we need", "team formation" |
| `sandcastle-orchestration` | "run agents in parallel", "run the evals", "sandcastle" |
| `session-handoff` | "write a handoff", "document what we did", "export this session" |

## Install

This plugin ships from a marketplace in the same repo:

```
/plugin marketplace add RikepilB/spaceapps-flightdeck
/plugin install spaceapps-harness@spaceapps-flightdeck
```

## Setup

No MCP servers, no environment variables, no credentials. Web search is used by the
research agents.

One thing you must do yourself: create a free NASA Earthdata Login at
https://urs.earthdata.nasa.gov/ before the hackathon. Most Earth-science datasets
are gated behind it and account creation on the day costs you an hour.

## Usage

Start here: run `spaceapps-brief` once to load the ground rules, then
`challenge-selection` after the challenge statements drop.
