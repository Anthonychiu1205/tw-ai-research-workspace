# UI Design System (v0.9)

This workspace uses a light, document-product visual system by default.

## Design goals

- clean and professional (not dark AI demo style)
- compact but readable for research workflows
- clear hierarchy between primary work area and secondary controls
- explicit state visibility for mock/api/fallback

## Core surfaces

- page background: light neutral (`slate`/`zinc` family)
- main panels: white
- secondary panels: soft neutral tint
- borders: subtle low-contrast grays
- heavy shadows/glass effects: avoided

## Status tones

- research/info: sky
- evidence: amber
- trace/planner: violet
- strategy/success: emerald
- portfolio/mock: indigo
- warning/fallback: orange/amber
- error: rose

`StatusBadge` is the shared primitive for these tones.

## Density rules

- avoid nested full-card borders unless section-level grouping is needed
- prefer compact list rows + hover background over thick boxed tiles
- keep topbar to core status only
- keep runtime/capability/export controls as collapsed secondary panels

## Accessibility baseline

- labeled inputs and buttons
- no color-only status communication
- preserve non-advice and no-trading copy in visible workflow surfaces
