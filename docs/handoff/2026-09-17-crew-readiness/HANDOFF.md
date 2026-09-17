# Goal

Add Space Apps preparation instructions, capability exploration and team organization
to the public Flightdeck website.

## Current state

crew.html adds preparation links, six human role profiles, mapped AI helpers/skills,
seven self-reported capabilities, explainable suggestions, primary/additional roles,
coverage gaps, readiness checks and validated JSON import/export. Data stays local.

## Files in flight

site/crew.html, crew.css, crew.js and team-model.mjs; homepage link; team tests;
site/link validation, preview MIME support, README and publishing disclosure.

## Changed

Preserved the existing static architecture and design. No live database, authentication,
automated team signup or row-ownership claim. Current official terms linked; historical
participant guides labeled. Optional data accounts only affect readiness when needed.

## Verification

Existing checks plus 25 team-model tests pass. Browser checks cover desktop/mobile,
keyboard use, persistence, conditional readiness, multi-role edits, export/import,
malformed input, literal untrusted names and unavailable storage. See AUDIT-PLAN.md.

## Failed attempts

Link test initially treated index.html#start as a filename; corrected to validate
the destination file and fragment independently. No fixture or scoring-key changes.

# Next steps

Verify hosted checks/deployment and the public crew page. Future live collaboration
would require a separately designed backend and access model; current export/import
shares snapshots only.
