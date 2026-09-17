# Goal

Publish Space Apps Flightdeck in English and Spanish with persistent light/dark themes,
and incorporate the six tips the maintainer received from a past winner.

## Current state

Published in commit `fa90db90b5d131c6dc043d0eb2f8199e1cb54f59`. Four static entry points
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

GitHub validate run 35181222026 and Pages run 35181222051 both succeeded. On the
public site, EN/ES navigation, saved Light mode, six Spanish roles, seven Spanish
capabilities, the `Datos` suggestion, a synthetic local team row and 320px layout all
worked without browser errors. Public `robots.txt` and `sitemap.xml` returned HTTP 200.

## Failed attempts

PowerShell treated unquoted accessibility refs beginning with `@` as syntax; browser
checks switched to quoted CSS selectors. No product behavior was affected.

# Next steps

No pending work for this request. A dedicated social-preview image remains an optional
future sharing enhancement.
