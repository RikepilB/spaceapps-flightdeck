# Harness audit and portable tutorial

## Outcome

A reviewable harness with explicit verification limits, shared model-independent
instructions, adversarial checks, and a short editable GitHub Pages tutorial.

## Priority and verification

1. Harden manifest validation: wrong types, empty fields, unsafe source paths,
   duplicate entries, missing inventories, invalid frontmatter and version drift.
   Exercise each failure in temporary fixtures; never change science fixtures.
2. Add AGENTS.md as the shared contract and CODEX.md as a usage guide. Keep Claude
   integration available and make manual use possible with any capable model.
3. Check all nine agent and eleven skill contracts, and run bounded adversarial
   behavioral cases where an authenticated runtime is available. Separate static
   checks, model responses, discovery, and full runtime integration.
4. Replace unsupported readiness and competitive claims with evidence and limits.
   Keep optional sandbox orchestration separate from the default local tests.
5. Build site/index.html, site/styles.css and site/app.js without a framework,
   external fonts, tracking, backend, or model-specific artifact dependency.
6. Verify desktop/mobile, keyboard, tutorial controls, relative URLs and CI.
   Publish a clean public snapshot excluding private session history and local
   evidence. Create the GitHub repository and enable Pages; verify the public URL.

## Initial evidence

- Baseline: 22 structural checks and 3 validator regression assertions passed.
- GitHub remote configured, but repository did not resolve for authenticated owner.
- Claude auth: loggedIn=false. Docker daemon unavailable. Sandbox runner unexecuted.
- Plugin SkillSpector initial scan: LOW, score 7, SAFE. Static signal only.
- Claude artifact unavailable through web retrieval; no local HTML source found.

## Design brief

Audience: hackathon teammates and people adopting the harness with another model.
Primary action: choose a tool and copy a first prompt. Secondary: inspect/edit source.
Story: avoid an impressive build with weak evidence or a missing submission; use
specialist review and reusable workflows; show what has and has not been tested.
Direction: a compact flight notebook, with numbered stages and a visible chain from
question to evidence to demo. Navy ink, off-white paper, blue links, lime highlights.
System: text wordmark, system sans and monospace, strong typographic hierarchy,
thin rules, generous section spacing. No stock space imagery, fake NASA branding,
vanity counters, testimonials, or animated star field.
Sections: introduction + workflow diagram; three-step tutorial with tool selector;
agent/skill field guide; verification and editing instructions.
Mobile: single column, wrapping controls, readable code blocks. Keyboard-visible
focus, reduced-motion support, usable content without JavaScript.
Verification evidence is appended here after rendered review.

## Rendered review and launch checks — 2026-09-17 UTC

- Anti-slop review: PASS for the chosen field-guide direction. Desktop 1440x1000
  and mobile 390x844 inspected. The workflow graphic explains stages; no decorative
  imagery or invented proof. Mobile tutorial readable; 320px has no horizontal overflow.
- Interaction checks: all three assistant options switch using keyboard activation;
  Copy prompt reports success. Browser pointer automation was inconsistent for
  offscreen buttons, so keyboard activation independently confirmed their handlers.
- Landing audit: title, description, canonical project URL, favicon, social text,
  internal anchors and relative assets checked. Repository issue link provides contact.
  No social-image preview is supplied. Public HTTPS/CI checks recorded after deployment.
- Production-readiness: no analytics requested; no forms or backend, so CAPTCHA is
  not applicable. No application storage, tracker or data collection. GitHub hosting
  has its own policies. MIT file, independent-project disclaimer and recovery runbook
  in docs/PUBLISHING.md are present. No invented legal policy.
- Artifact reference: Cloudflare verification prevented reading; no fidelity claim.
- Public deployment: Pages HTTPS confirmed; hosted validate and deploy succeeded.
  Fresh-browser desktop/mobile, all selectors and both clipboard outcomes verified.

## Crew planner addition — 2026-09-17

Add crew.html to keep the introductory page short. Retain the flight-notebook visual
system. Primary journey: preparation guide → capability self-check → explainable
role suggestions → choose responsibilities → readiness board and coverage gaps.
Distinguish human roles from AI helpers. Self-reports are provisional, not verified
competence or personality profiling. No answer is unknown, not a low ability score.
Persist locally with an explicit notice, JSON export/import and failure feedback.
No live team sync or row ownership claims; aliases are sufficient. Optional data
accounts only count when a member needs them. Import is validated before replacement.
Verify ranking, ties, coverage, conditional readiness, persistence, invalid imports,
literal rendering of untrusted names, keyboard interactions and mobile overflow.
Official 2026 homepage/terms checked; older participant guides are labeled historical.

Crew verification: full existing suite and 25 new model tests passed. Rendered at
1440x1000, 390x844 and 320x740; no horizontal overflow. Keyboard form submission,
suggestions, persistence/reload, required-account readiness, multi-role edit/save,
exported JSON, rejected import and confirmed import checked. Imported HTML-like alias
remained text (zero image elements). Corrupt saved data and forced storage denial
showed recovery messages. No backend requests are made by planner code.
Visual review: PASS, consistent with existing brief; cards group real responsibilities
and collapse to a readable column. Launch review: local-storage disclosure and JSON
sharing warning present; no server forms, account system, tracking or live-sync claim.
