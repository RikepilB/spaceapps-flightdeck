# Goal

Publish Space Apps Flightdeck in English and Spanish with persistent light/dark themes,
and incorporate the six tips the maintainer received from a past winner.

## Current state

Implementation complete in the canonical public checkout. Four static entry points
provide complete English/Spanish content. Shared scripts localize prompts and all
generated crew-planner states. Theme follows the operating system on first visit and
persists locally after selection.

## Files in flight

English/Spanish index and crew pages; theme/preference scripts; shared CSS; localized
planner; sitemap/robots; tests and publishing documentation.

## Changed

Added explicit EN/ES and Light/Dark controls, reciprocal hreflang metadata, Spanish
metadata/content/prompts/planner copy, dark color tokens, and a clearly non-official
winner-advice field note in both languages. No backend, analytics or new dependency.

## Verification

31 adversarial validator cases, 20 component contracts, 25 team tests, four-page site
checks and 22 plugin validations pass. Browser checks covered both themes/languages,
saved theme and team data across navigation, Spanish generated content, 320px layout,
contrast and console errors. A mixed-language native file label found during review was
fixed and rechecked.

## Failed attempts

PowerShell treated unquoted accessibility refs beginning with `@` as syntax; browser
checks switched to quoted CSS selectors. No product behavior was affected.

# Next steps

Commit, push, wait for GitHub Actions and verify all four public pages plus robots and
sitemap on the deployed commit.
