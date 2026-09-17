---
name: project-page-builder
description: >
  This skill should be used when the user needs to write or improve a NASA Space Apps
  project submission page - "write the project page", "draft our submission", "how
  should we describe the project", "improve our submission text", or is preparing the
  written artefact judges read.
metadata:
  version: "0.1.0"
---

Read [shared evidence and authority contract](../../SAFETY.md) before applying this role or workflow.


# Writing the project page

The project page is what a global judge reads without you in the room. It carries more
weight than the code and usually more than the video. Start it at hour 2, finish it
before the code freeze.

Check the year's Project Submission Guide for the authoritative field list; it is
published shortly before the hackathon. The structure below maps onto every version of
it so far.

## The order that scores

**1. The one-sentence promise.** First line, no preamble.
`For [named person], [product] turns [named dataset] into [the decision they can now make].`

**2. The problem, with a person in it.** A specific person facing a specific decision
with bad information. Not "climate change is a challenge". A judge cannot score
"helps people".

**3. What we built.** What it does, in the user's terms, before any technology appears.

**4. How it works.** Now the technology. Pipeline in four or five steps, each naming the
actual dataset and the actual transform. Name instruments and products specifically:
"TEMPO tropospheric NO2, Level 3" not "NASA data".

**5. Data used.** Every source, with a link and one line on why that source. This is
where Relevance is won. If the challenge's own Resources tab listed a source and you
used it, say so.

**6. Validation.** What you tested, against what baseline, with what result. Then the
limitations, named honestly. Judges scoring Validity read a stated limitation as
evidence of competence, not weakness. This section is the most commonly missing and the
cheapest to add.

**7. Impact.** Who uses this on Monday. What changes for them. Be concrete about scale
without inventing a number - never fabricate a statistic, a user count or a projected
benefit.

**8. What's next.** Short. Shows the team knows where the edges are.

**9. Credits and licences.** Team, third-party assets, licences, AI tools used. Attribute
everything.

## Rules

- Lead with outcome, not stack. The most common failure is a page that opens with
  "built with Next.js and FastAPI".
- Name the challenge explicitly and quote its objective, then show the line where you
  meet it. Relevance is a full fifth of the score and it is lost by drift, not by
  incompetence.
- Every link must resolve for a logged-out viewer. Test in a private window. Broken and
  permission-gated links are the most common self-inflicted wound in the whole event.
- Plain language. Judges span disciplines and many read in a second language.
- No invented metrics. No projected impact numbers you cannot source.
- English.
- No minor's name or likeness in materials.

## Length

Long enough to answer the five criteria, short enough to read in four minutes. If a
paragraph does not move Impact, Creativity, Validity, Relevance or Presentation, cut it.

## Self-check before submitting

Read the page as a judge with no context and ask: what problem, for whom, using what
data, how do I know it works, and why is it interesting. If any of the five has no
answer on the page, that criterion scores low. Then hand it to `judge-simulation`.

## No evidence, no demo claim

Do not turn a proposed feature into a demonstrated capability. Before scripting a
product action, dataset, explanatory factor, user scene or result, require supplied
evidence that it exists. When none is supplied, write a concept-only pitch using
"we propose" or "we aim to test", and label visuals as proposed storyboards.
Replace the proof beat with the validation plan; do not invent a working forecast,
a UI, a named beneficiary, an interview, uptake or an operational deployment.
