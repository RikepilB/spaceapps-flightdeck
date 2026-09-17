---
name: judge-simulation
description: >
  This skill should be used when the user wants their Space Apps project scored before
  submission - "score our project", "judge us", "mock judging", "what are we losing
  points on", "is this good enough", "review our submission" - or needs a prioritized
  fix list against the official rubric.
metadata:
  version: "0.1.0"
---

Read [shared evidence and authority contract](../../SAFETY.md) before applying this role or workflow.


# Mock judging

Score the project the way a judge does, then say what to fix with the time remaining.
Run this at hour 26 and again at hour 34.

## Compliance gate, first

A compliant-but-weak submission beats a brilliant disqualified one. Check before
scoring:

- [ ] Submitted before the local event's stated close. Submit a complete draft early and
      revise
- [ ] English
- [ ] Exactly one challenge, named on the page
- [ ] Team of six or fewer, all registered for the same event
- [ ] NASA data used and named specifically
- [ ] Every link resolves in a logged-out private window
- [ ] No minor's name, voice or likeness in the video or materials
- [ ] Third-party assets attributed and licensed
- [ ] No work begun before the hackathon opened

Any unchecked box outranks every scoring note below.

## Score each criterion 1-5, with evidence

Quote the submission as the evidence for each score. A score without a quote is an
opinion.

**Impact** - How much impact, quality and quantity? Big problem or little problem?
- 1: no beneficiary named
- 3: plausible beneficiary, no evidence of the decision changing
- 5: named user, named decision, credible scale, honest about limits

**Creativity** - How innovative? Novel, or already attempted?
- 1: the obvious reading of the challenge
- 3: a competent build with one interesting choice
- 5: a non-obvious framing that makes other approaches look incomplete

**Validity** - Scientifically valid? Will it do what it claims? Real world?
- 1: numbers with no method
- 3: a method, no baseline, no uncertainty
- 5: method, baseline, held-out evaluation, named limitations

**Relevance** - Responsive to the challenge? Complete, or a long way to go?
- 1: solves an adjacent problem the team found more interesting
- 3: meets the letter of the objective
- 5: meets the stated objectives and the considerations, and shows where

**Presentation** - How well communicated? Effective storytelling?
- 1: describes the stack
- 3: clear but technology-led
- 5: outcome-led, a stranger understands it in 30 seconds

## The fix list

Order by score delta per minute of work, not by how interesting the fix is. Give each a
time estimate. The highest-payoff fixes are almost always these, in this order:

1. Add the validation paragraph with a baseline and one honest limitation (15 min, often
   +2 on Validity)
2. Rewrite the opening to lead with the beneficiary and the decision (10 min, +1 on both
   Impact and Presentation)
3. Quote the challenge objective and show where you meet it (10 min, +1 on Relevance)
4. Seed a known-good example with a visible "try this" button (20 min, +1 on
   Presentation, and it saves the live demo)
5. Name the datasets specifically everywhere they appear (10 min, +1 on Relevance and
   Validity)

## The 30-minute version

If only half an hour remains: fix the broken links, add the limitations sentence, and
rewrite the first paragraph to name a person and a decision. Nothing else.

## Tone

Be direct. A weakness you decline to name is one a judge names instead. Do not pad the
score to be encouraging - a generous mock score is worse than useless, because it spends
the team's last hours on the wrong thing.
