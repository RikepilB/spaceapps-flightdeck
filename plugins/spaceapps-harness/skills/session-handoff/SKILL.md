---
name: session-handoff
description: >
  This skill should be used when a working session needs to be documented so someone
  can pick it up later - "export this session", "write a handoff", "document what we
  did", "archive this context", "hand this over", "keep this traceable", "write a
  retro" - or at the end of a hackathon, a sprint, or any stretch of work whose
  reasoning would otherwise be lost.
metadata:
  version: "0.1.0"
---

Read [shared evidence and authority contract](../../SAFETY.md) before applying this role or workflow.


# Session handoff

A handoff exists so the next person - often the same person after a gap - can resume
without re-deriving the reasoning. Files alone do not carry why a decision was made,
what was rejected, or what is still unverified.

## Where it goes

```
docs/handoff/
├── HANDOFF.md            root index: current state + append-only session index
├── .current-session      the most recent package's directory name
└── <YYYY-MM-DD>-<agent>-<short-id>/
    ├── .sid              the full session id
    ├── SESSION.md        facts: identity, objective, decisions, artefacts, verification
    ├── INPUTS.md         what the operator supplied: requests, files, URLs
    ├── REFERENCES.md     every source consulted + the repo's own instruction docs
    ├── EVIDENCE.md       raw findings a successor can re-check
    ├── HANDOFF.md        the deep synthesis
    └── transcript.md     chronological record of turns and work
```

Create the root `HANDOFF.md` only if it does not exist. If it does:
update only `## Current state` deliberately with verified current facts and update
`.current-session` to the new package. Add exactly one row to `## Session index`.
Preserve every prior row and package; never rewrite historical session records.

Never rename a package to drop its session id. The id is what makes it traceable.
Never overwrite an existing package.

## What the synthesis must contain

A handoff that lists files is not a handoff. `HANDOFF.md` covers, in order:

1. **Objective and real scope** - including what was asked for and deliberately not
   built, and why
2. **Sequence of decisions and the reason for each** - especially reversals. A
   recommendation that changed is the single most valuable thing to record, because
   it is the thing most likely to be quietly dropped
3. **What was built**, by component
4. **Results** - what was tested, what passed, what broke
5. **Findings worth keeping** - the durable knowledge, separated from the narrative
6. **Analysis specific to this team or operator**
7. **Git state and the files to open first**, in reading order
8. **Errors, blockers, risks, unverified assumptions** - the section people skip and
   successors need most
9. **Next steps in priority order**, ending with one concrete instruction to resume

## Mark inference

Label anything reasoned rather than observed as **[inference]**. A successor
inheriting an inference dressed as a fact will build on it.

State what was *not* done as plainly as what was. "The eval runner has never been
executed" is more useful than any amount of description of what it would do.

## What stays out

- Internal reasoning and chain-of-thought
- Raw, noisy tool output. Distil it into `EVIDENCE.md` instead
- Tokens, keys, credentials, `.env` contents, any sensitive config
- Personal data that is not needed to resume the work

If the environment produced no machine-readable transcript, say so in
`transcript.md` and write a reconstructed summary. Do not fabricate a verbatim
record, and do not leave a placeholder that a later session might fill with
invention.

## Language

Write in the repository's primary language, not the language of the conversation.

## After a hackathon specifically

The handoff is where next year's advantage comes from. Include: which agents were
actually used and which were ignored, where the schedule broke, what the judges
asked that nobody had prepared for, and every link or dataset that failed on the
day. Each of those is a fixture waiting to be written.
