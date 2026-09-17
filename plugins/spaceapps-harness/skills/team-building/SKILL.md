---
name: team-building
description: >
  This skill should be used when the user is forming or organizing a Space Apps team -
  "who should I recruit", "what roles do we need", "how do I find teammates", "team
  formation", "how big should the team be", "how do we split the work", "who does what",
  or is deciding team composition before or during the hackathon.
metadata:
  version: "0.1.0"
---

Read [shared evidence and authority contract](../../SAFETY.md) before applying this role or workflow.


# Building the team

Team composition is decided weeks before the hackathon and is nearly impossible to fix
during it. Treat it as the second most consequential decision after challenge choice.

## The published mechanics

- **Size:** 2 to 6 members. The official guidance recommends **4 to 5**. Solo entry is
  allowed.
- **One person creates the team and is Team Lead.** The Team Lead's location determines
  where the team is listed.
- **Universal Event teams submit according to the local time of the person who created
  the team.** If you are on the Universal Event, whoever creates the team sets the clock
  for everyone. Decide that deliberately rather than by whoever clicked first.
- All members must be registered for the same event.
- **Members can join right up to the submission deadline, and anyone can leave.** So a
  team is not a commitment device. Plan for attrition.
- One team per person, one challenge per team.
- Team formation opens alongside the challenge summaries, weeks before the hackathon.

## Recruit against gaps, not against enthusiasm

Audit what the team already has before writing a single recruiting message. Score the
existing members only when evidence supports the specific capability. Unknown is
not a low score: CSV inspection does not establish netCDF/geospatial expertise, and
UI building does not establish unaided deployment. Mark unsupported rows unknown:

1. Ships a deployed web interface unaided
2. Data engineering on scientific formats - netCDF, HDF5, GeoTIFF, rasters, projections
3. Trains a model and evaluates it honestly - baselines, holdout, leakage
4. Design: visual, illustration, animation, motion
5. Presents on camera in English without reading
6. Domain background in something the challenge set touches
7. A credible tie to a specific place or community

Then recruit for the lowest scores, in this order of payoff:

- **Design and interface is almost always the highest-value hire.** Presentation is a
  fifth of the rubric, judges score what they can perceive, and engineering teams
  systematically under-recruit it. A designer also unlocks three award categories
  (Art & Technology, Storytelling, Most Inspirational) that engineering-only teams
  cannot reach.
- **Domain or local credibility** is second. Someone who can say "I have stood in this
  field, talked to this farmer, read this municipal dataset" turns a generic project
  into a Local Impact contender, and answers the one question judges always ask.
- **A second builder** is third, and only third. Two engineers do not produce twice the
  project; they produce one project with a merge conflict. Add the second builder when
  the differentiator is genuinely parallelizable.
- **A remote-sensing or geospatial person** only if the scope requires opening a
  scientific binary. If it does not, do not spend a slot on it.

A capability nobody on the team has is a constraint on which challenge to pick, not a
problem to solve during the weekend.

## Where to find people

In rough order of yield:

1. **Your own network first.** Someone who has already shipped something with you is
   worth three strangers. Prior working relationship beats raw skill at this timescale,
   because there is no time to learn how someone works.
2. **The official team-finding features** on spaceappschallenge.org and the Space Apps
   Connect platform, which opens shortly before the hackathon.
3. **Diaspora and affinity tech communities** - these are the fastest route to someone
   with both engineering skill and a genuine regional tie, which is the exact pairing
   that wins Local Impact and Global Connection.
4. **University clubs and societies** in the country you are building for. They are the
   source of most ground truth and of on-camera credibility in the local language.
5. **Your local event's channel** if you have one.

## What to put in the recruiting message

Lead with the specific gap, not with the opportunity. "Looking for teammates for NASA
Space Apps" gets noise. "Looking for one illustrator for a NASA Space Apps team building
a Spanish-language tool for Andean farmers, Nov 14-15, I handle all engineering" gets the
right person. Name the dates, the commitment, the challenge area, and the one thing you
need them to own.

## Organizing the work

Six named roles, even on a team of three. Doubling up is fine; leaving one unowned is not.

| Role | Owns | Failure if unowned |
|---|---|---|
| Lead | The clock. Calls cut lines | Nobody stops the overbuild |
| Data | Ingest and correctness | Numbers nobody can defend |
| Core | The differentiator | The project is generic |
| Interface | Everything the judge sees | Judges cannot score what they cannot perceive |
| Narrative | Page, video, pitch - **from hour 2** | A fifth of the rubric goes unclaimed |
| Floater | Unblocks, tests, catches the miss | One person's bug stalls the team |

Two rules that matter more than the chart:

- **The Lead should not own the critical path.** Someone holding the clock cannot also be
  head-down in the hardest code. If the team is small enough that they must, give the
  clock to someone else explicitly.
- **Narrative starts at hour 2.** It is the role teams cut first and the one that costs
  them a fifth of the score. If a person cannot be spared, the Lead owns it and protects
  the time.

## Timezones

A distributed team is normal here and is not a handicap - the Universal Event produced
more 2025 finalists than any single country. But decide two things up front: who creates
the team (which sets the submission clock), and which four-hour window every day has
everyone awake at once. Checkpoints happen in that window. Everything else is async.

## Before the hackathon, together

- Everyone has an Earthdata Login and an api.nasa.gov key, tested
- Everyone has push access to the repo and can deploy
- One shared doc exists, with the one-sentence promise at the top once it is written
- Everyone knows the exact submission close time, in their own timezone
- Roles are assigned by name, in writing
