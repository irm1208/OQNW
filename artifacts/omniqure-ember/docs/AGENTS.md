# OmniQure Ember Design System

## Purpose

A warm, friendly commerce back-office language for OmniQure admin surfaces:
dashboards, orders, products, customers, reports, and settings. Modeled on a
bright "paper on parchment" aesthetic — a soft cream shell, white rounded
cards, and a single confident ember-orange accent that carries navigation,
primary actions, and data emphasis. It should feel approachable and legible,
never sterile.

## Consumption

- Import `@workspace/omniqure-ember/styles.css` exactly once at the app or
  design-system entry point.
- Use the semantic tokens exposed by that stylesheet before adding a new
  color. Core palette: `--em-background` (paper), `--em-shell` (parchment
  page surround), `--em-primary` (ember orange), `--em-primary-soft` /
  `--em-primary-tint` (peach tints), plus success/warning/danger token pairs
  with matching `-soft` backgrounds.
- Use `Plus Jakarta Sans` for interface text and `JetBrains Mono` for IDs,
  quantities, currency values, and timestamps (`.em-mono`).
- Prefer the shared primitives: `.em-panel`, `.em-panel-raised`,
  `.em-panel-hero` (dashed ember outline for the featured metric),
  `.em-eyebrow`, `.em-pill` (+ `-up`, `-down`, `-warn`, `-brand`),
  `.em-nav-active`, `.em-nav-item`, `.em-focus-ring`, `.em-interactive`.
- Ember orange is the only brand hue. Use tint stacks of it (from
  `--em-primary-tint` up to `--em-primary`) for charts and category scales
  instead of introducing new hues. Green is reserved for positive deltas and
  healthy states, amber for attention, red for negative deltas and danger.
- Exactly one hero-tinted card per view; every other card stays white.
- Do not use color as the only status signal; pair it with text or an icon.
- Preserve visible focus, keyboard reachability, and a minimum 44px touch
  target for interactive controls.
- Corners are generous (12–24px). Cards sit on the paper surface with soft
  warm shadows — no hard borders heavier than 1.5px, no pure grey.
- Keep motion short and purposeful. Respect `prefers-reduced-motion`.
- Do not use emojis in the interface.

## Mockup consumption

Design-system mockups live under the matching `src/ds/omniqure-ember/` entry
in the mockup sandbox. Each mockup imports its sibling `_group.css`; that file
inherits this system from the entry and may only add local composition rules.
Do not import the sandbox's global stylesheet into these mockups.

## Design principles

1. **One warm accent:** ember orange does all the branding work; everything
   else is cream, white, and ink.
2. **Numbers first:** metrics are large, mono-spaced, and aligned; labels are
   quiet eyebrows above them.
3. **Soft but structured:** rounded cards and gentle shadows, laid out on a
   strict grid with consistent gutters.
4. **Deltas are directional:** every trend value pairs a green/red pill with
   an explicit "+/-" sign and comparison caption.
5. **Friendly density:** dashboards can be dense, but each card keeps one
   clear headline metric and breathing room around it.
