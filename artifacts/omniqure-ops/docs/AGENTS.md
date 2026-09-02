# OmniQure Ops Design System

## Purpose

Use this system for OmniQure's authenticated operational surfaces: catalogue,
orders, customers, fulfilment, payments, shipping, content, reporting, and
security administration. It should feel precise and calm under pressure:
operators can scan quickly, understand risk, and act without visual noise.

## Consumption

- Import `@workspace/omniqure-ops/styles.css` exactly once at the app or
  design-system entry point.
- Use the semantic tokens exposed by that stylesheet before adding a new color.
- Use `Plus Jakarta Sans` for interface text and `JetBrains Mono` for IDs,
  quantities, timestamps, and other machine-readable values.
- Prefer the shared `.oq-panel`, `.oq-panel-raised`, `.oq-eyebrow`,
  `.oq-mono`, `.oq-focus-ring`, and `.oq-interactive` primitives.
- Keep the navy/cobalt foundation for navigation and primary actions. Reserve
  mint for healthy/confirmed states, amber for attention, and red for danger.
- Do not use color as the only status signal; pair it with text or an icon.
- Preserve visible focus, keyboard reachability, and a minimum 44px touch target
  for mobile actions.
- Dense layouts are encouraged for data work, but each region needs a clear
  heading, consistent alignment, and enough breathing room to scan.
- Keep motion short and purposeful. Respect `prefers-reduced-motion`.
- Do not use emojis in the interface.

## Mockup consumption

Design-system mockups live under the matching `src/ds/omniqure-ops/` entry in
the mockup sandbox. Each mockup imports its sibling `_group.css`; that file
inherits this system from the entry and may only add local composition rules.
Do not import the sandbox's global stylesheet into these mockups.

## Design principles

1. **Signal before decoration:** surface operational state before ornament.
2. **One confident action:** make the primary next step unmistakable.
3. **Readable density:** use compact rows and aligned numbers, never tiny text.
4. **Trust through consistency:** destructive actions, permissions, and payment
   states must use the same semantic language everywhere.
5. **Calm authority:** the product should feel more like a trusted control room
   than a generic back-office template.