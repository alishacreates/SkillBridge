---
version: alpha
name: SkillBridge
description: A calm, career-focused foundation for students turning skills into opportunities.
colors:
  primary: "#540D6E"
  accent: "#EE4266"
  highlight: "#FFD23F"
  background: "#F3FCF0"
  ink: "#1F271B"
  surface: "#FFFFFF"
typography:
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.6
  decorative:
    fontFamily: "Felipa, Georgia, serif"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  base: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "3rem"
  generous: "4rem"
omitted:
  - section: components
    reason: "Component recipes live in canonical CSS Modules, mapped in Components below rather than duplicated as YAML values."
---

# SkillBridge Design Foundation

## Overview

SkillBridge serves students preparing for opportunities and recruiters evaluating
skills. The approved reference is a calm career workspace: pale green canvas, dark
readable type, white surfaces, and deliberate purple emphasis. Dense dashboards,
bright promotional gradients, and decorative type in product controls are
anti-references. English is the initial UI language; no market-specific behavior or
internationalization is implemented.

The public `/` remains the Phase 1 coming-soon placeholder. Phase 2 adds generic
primitives under `components/ui/`, verified through an isolated test fixture—not
a product route or `/design`. The skill-pathway signature remains reserved for
future domain progress/analytics; no domain components exist yet.

The canonical runtime values live in `styles/tokens.css`. This document records
intent and mirrors selected accepted values; it does not generate a second theme.
The complete role/value inventory is in `../docs/design-system.md`.

## Colors

Brand colors are locked. Use purple for primary emphasis, pink/yellow as restrained
decorative accents, pale green for the canvas, and dark neutral for primary text.
Pink and yellow are not body-text colors on light surfaces. Semantic colors and
chart colors have separate tokens even when their hues resemble the brand.

Runtime mapping:

| Document role | Runtime owner | Current consumer |
| --- | --- | --- |
| primary/accent/highlight/background/ink | `--color-brand-*` | Placeholder, base canvas, text |
| neutral text/surfaces/borders | `--color-text-*`, `--color-surface*`, `--color-border*` | Base styles, fields, cards, skeletons, placeholder |
| semantic feedback | `--color-success`, `--color-warning`, `--color-error`, `--color-info` and `*-surface` | Badges, field errors, destructive action, ErrorState |
| chart hues | `--chart-*` | Reserved tokens; no charts yet |

Only a light theme is implemented. Forced colors use system focus and scrollbar
colors. Decorative favicon artwork repeats the locked purple/yellow because it is
an independent SVG document; this is the only static-asset palette exception.

## Typography

`app/layout.tsx` loads Inter (variable weight) and Felipa (400) using
`next/font/google`, Latin subsets, and `display: swap`. Next downloads fonts at
build time and serves them locally. Fonts are bound to `--font-inter` and
`--font-felipa` on the root element; `--font-body` and `--font-decorative` adapt them.

Inter owns all product text, headings, data, navigation, and labels. Felipa appears
only in the short decorative `.brandNote` line on the Phase 1 placeholder. This
phase-specific brand specimen replaces the later welcome/showcase specimen while
those routes are deferred. Felipa must never become a global heading or body font.
Type sizes, line heights, weights, and heading tracking come from `--type-*` and
`--font-weight-*` tokens. Body text is 16px at the browser's default root size.

## Layout

Document scrolling remains natural. The root shell has a 72rem maximum width and
16/24/32px gutters at base/48rem/64rem viewport widths. Future product content may
use the approved 90rem maximum and 15rem sidebar tokens; no sidebar exists yet.
Text uses a 38rem maximum measure, a fluid display heading, and no fixed content
height. The shell can grow when text wraps or users increase text size.

Spacing follows the approved 4, 8, 12, 16, 24, 32, 48, 64px scale (rem tokens).
Media-query breakpoints are literals because CSS custom properties cannot be used
as media-query thresholds.

## Elevation & Depth

The placeholder is flat, with border separators. Three subtle shadow tokens are
available for later elevated surfaces; they are not applied gratuitously to the
current content. The focus halo separates the purple outline from its surroundings.

## Shapes

Radii follow 8, 12, 16, 24, and 999px. The wordmark uses the 12px radius; small
decorative accents use the pill radius. Border thickness is 1px. These are token
definitions. Controls use the 8px radius, cards/feedback the 16px radius, and badges,
avatars, and progress the pill/circle radius. All consume tokens without new values.

## Components

All generic primitives live in `components/ui/`; none import page or domain modules.
They use Inter and CSS Modules consuming `styles/tokens.css`. A local
`no-restricted-imports` lint rule protects the domain/page/backend boundary.
Focus uses a 3px purple outline, 3px offset, and white halo; forced colors use
`Highlight` from the shared baseline. The public placeholder stays unchanged.

- Button: primary, secondary, outline, ghost, destructive; sm/md/lg. Native button,
  default `type="button"`. Loading uses equal-footprint overlapping content, visible
  loading text/spinner and `aria-busy`; native disabled prevents repeated activation.
  Disabled borders are dashed, not just recolored. IconButton reuses that owner,
  requires a `label`, and uses square geometry with a spinner-only busy treatment.
- Fields: `field.tsx` owns stable `useId` relationships, shared visible labels,
  descriptions, and textual errors. Controls preserve native props/ref/value behavior.
  The strong border token identifies controls; the faint border is only decorative.
- Select: native single-select, with browser/OS-owned popup appearance and keyboard
  behavior. Textarea permits vertical resizing (never horizontal) with four default
  rows; users can expand long text without breaking the field width.
- Checkbox and RadioGroup: native inputs; RadioGroup uses fieldset/legend and shared
  names. Disabled options retain native semantics. No authored ARIA selection model.
- Badge: neutral/primary/success/warning/error/info, always caller-supplied text;
  it does not infer domain status. Cards are flat, bordered compositions, not actions.
- ProgressBar: determinate native progress with a name and range; 0–100 defaults,
  optional visible label/value. Avatar reserves image geometry and falls back to
  initials. EmptyState/ErrorState take content/actions; no navigation is invented.
- Skeleton: text/circle/block shapes, gentle pulse and static reduced-motion state;
  the owner labels its busy region rather than announcing every skeleton.

Button destructive hover/active colors are token-derived `color-mix` recipes, not
new palette values. Normal and busy layers reserve the larger content footprint.
Input visual slots are decorative and must not contain focusable controls.

### Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Scrollbar | `styles/base.css` | `styles/tokens.css` | Native geometry, global colors | Browser computed styles and forced colors |
| Select/Listbox | `components/ui/select.tsx` | Native single-select contract above | Native only | Unit selection; browser popup/keyboard/axe |
| Form | `components/ui/field.tsx` + `field.module.css` | Label/help/error contract above | Input, Textarea, Select, Checkbox, RadioGroup | Relationship, ref, controlled/native behavior tests |

Feature forms, validation policy, menus, overlays, and data navigation are not
implemented. Consumers own validation timing, schemas, first-error focus, and async
operations. There are no product workflows to connect yet.

### Motion and content

Durations are 120/200/320ms with `cubic-bezier(0.2, 0, 0, 1)`. The current page has
no entrance or ambient animation. Reduced-motion preferences zero the duration
tokens and suppress animation, transitions, and smooth scrolling globally.
Use plain, honest copy; do not present unavailable features as working actions.
Future charts must add text/shape distinctions and summaries, not rely on color.

## Do's and Don'ts

- Do consume runtime CSS properties; change their owner once and update these docs.
- Do keep text contrast, keyboard focus, responsive wrapping, and native semantics.
- Do keep scrollbar themes global, visible, and compatible with forced colors.
- Don't use Felipa for product information or pink/yellow for small light-surface text.
- Don't add domain components, dashboard content, `/design`, or API integration in Phase 2.

### Phase 2 reconciliation

The locked palette, fonts, spacing/radii, and flat-surface direction are unchanged.
The previous “components await review” boundary is intentionally replaced by this
approved generic layer. Browser fixtures compare the primitives against the same
production fonts/tokens as the existing placeholder; no second theme is introduced.
