---
name: challenge-selection
description: >
  This skill should be used when the user asks "which Space Apps challenge should we
  pick", "score these challenges", "compare these two challenges", "is this challenge
  worth doing", or needs to choose between published NASA Space Apps challenge
  statements.
metadata:
  version: "0.1.0"
---

Read [shared evidence and authority contract](../../SAFETY.md) before applying this role or workflow.


# Choosing the challenge

Run this the day the challenge statements drop, not the morning of the hackathon.

## Step 1 - establish the team's real capability

Ask directly, and write the answers down:

- Who can ship a deployed web interface unaided?
- Who can do data engineering on scientific formats (netCDF, HDF5, GeoTIFF)?
- Who can train and honestly evaluate a model?
- Who can design, illustrate, animate or compose?
- Who can present on camera, in English, without reading?
- Who has domain background in anything the challenges touch?

Missing capabilities are constraints, not problems to solve during the weekend. A team
with no designer should not pick Art & Technology.

## Step 2 - score every challenge

Six dimensions, 1-5 each. Show the full matrix; do not shortlist before scoring.

| Dimension | 1 | 5 |
|---|---|---|
| Data readiness | needs approval, or nothing verified resolves | CSV or open API, downloadable in ten minutes |
| Demo legibility | output is a number in a terminal | output is a picture a stranger reads in 20 seconds |
| Scope fit | needs a capability the team lacks | v1 reachable by hour 12 |
| Saturation (crowding) | thin field, few teams | every team will do this |
| Award surface | fits one award category | plausibly fits three or more |
| Differentiator | this team brings nothing special | this team brings something almost nobody else has |

**Hard gates.** A 1 or 2 on Data readiness or Scope fit eliminates the challenge
regardless of total. These are not preferences; they are the two failure modes that end
weekends.

**Ranking among survivors:** `(demo legibility x 2) + award surface + differentiator - saturation`

Saturation is scored as **crowding**: 5 means everyone will pick it, 1 means a thin field.
It is the only dimension where high is bad, which is why the formula subtracts it. Check
the direction before you trust a total.

Demo legibility is doubled because Presentation is a fifth of the rubric and because it
gates the judge's ability to score the other four at all.

## Step 3 - run the counter-argument

For the leading pick, write the strongest case against it, then answer it. If you
cannot answer it, the runner-up wins. Do not skip this - a scoring matrix built by the
person who already has a favourite will confirm the favourite.

## Step 4 - write the kill criteria

Before starting, name what you would have to learn in the first three hours to abandon
this challenge. Typically: the data does not contain the variable you assumed, the
download is too large, or the labels do not mean what the documentation implied.
Checking the kill criteria at hour 3 is cheap; discovering them at hour 20 is fatal.

## Notes on specific challenge archetypes

- **"Create Your Own Challenge"** is scoped for beginners and youth. It also removes
  Relevance as an anchor, since there is no published objective to be responsive to.
  Avoid it if you are competing.
- **Advanced-only challenges** have thinner fields but need genuine capability.
- **Storytelling, education and art challenges** convert unusually well because
  Presentation is a fifth of the score and most technical teams under-invest there.
- **Popular challenges are not penalized.** In 2025 three of ten winners came from
  Commercializing LEO; in 2023 two different teams won separate awards on the same
  challenge.

## Output

The matrix, the top three with a paragraph each, one recommendation stated plainly with
the reason the runner-up loses, and the kill criteria.

Do not return "it depends on your preference". Pick one and defend it.

## Evidence limits

Competitive strategy is a hypothesis, not an official rule or measured probability.
Winner counts without entrant denominators cannot establish conversion rates,
crowding, or easier awards. Do not infer an empty niche from incomplete research.
Mark unknown inputs and rankings provisional rather than inventing scores.
