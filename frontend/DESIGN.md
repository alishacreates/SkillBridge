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

The public `/` is the Phase 4 student dashboard with explicitly fictional local
data. `components/dashboard/` composes Phase 2 primitives in `components/ui/` and
Phase 3 domain components in `components/skillbridge/`. The isolated test fixture
still verifies reusable components and alternate states. The public `/design`
reference now composes the same exports in `components/design/`; it is not a copy
of the fixture or a second component system.
Connected markers in SkillProgress and SkillGapCard provide the restrained pathway
signature. No backend integration or calculated analytics exists.

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
| primary/accent/highlight/background/ink | `--color-brand-*` | Dashboard, base canvas, text |
| neutral text/surfaces/borders | `--color-text-*`, `--color-surface*`, `--color-border*` | Base styles, fields, cards, skeletons, dashboard shell |
| semantic feedback | `--color-success`, `--color-warning`, `--color-error`, `--color-info` and `*-surface` | Badges, field errors, destructive action, ErrorState |
| chart hues | `--chart-*` | DashboardStatCard accents; readiness trend and labelled match distribution |

Only a light theme is implemented. Forced colors use system focus and scrollbar
colors. Decorative favicon artwork repeats the locked purple/yellow because it is
an independent SVG document; this is the only static-asset palette exception.

## Typography

`app/layout.tsx` loads Inter (variable weight) and Felipa (400) using
`next/font/google`, Latin subsets, and `display: swap`. Next downloads fonts at
build time and serves them locally. Fonts are bound to `--font-inter` and
`--font-felipa` on the root element; `--font-body` and `--font-decorative` adapt them.

Inter owns all product text, headings, data, navigation, and labels. Felipa appears
in the short decorative `.brandNote` welcome phrase in
`components/dashboard/dashboard.module.css`, plus a brief intro accent and labelled
type specimen on `/design`. The dashboard/intro decoration is hidden from assistive
technology; the specimen is explicitly labelled. Felipa is never a global heading or body font.
Type sizes, line heights, weights, and heading tracking come from `--type-*` and
`--font-weight-*` tokens. Body text is 16px at the browser's default root size.

## Layout

Document scrolling remains natural. Dashboard content uses the 90rem maximum and
16/24/32px gutters at base/48rem/64rem. The 15rem sidebar appears at 64rem; narrower
viewports use an in-flow navigation disclosure, not an overlay. A 12-column grid
uses 7/5 and 8/4 section splits at 80rem. Metrics use one/two/four columns at
base/48rem/80rem. Text uses a 38rem copy measure and fluid headings; content has no
fixed height. The sidebar alone can scroll if the viewport is short.

Spacing follows the approved 4, 8, 12, 16, 24, 32, 48, 64px scale (rem tokens).
Media-query breakpoints are literals because CSS custom properties cannot be used
as media-query thresholds.

## Elevation & Depth

Dashboard surfaces remain flat and bordered. Three subtle shadow tokens remain
available without making every card float. The focus halo separates the purple
outline from its surroundings.

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
`Highlight` from the shared baseline. Page composition reuses these owners unchanged.

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

### Domain compositions (Phase 3)

`components/skillbridge/index.ts` exports the eleven product-specific compositions:
SkillChip, MatchScore, ApplicationStatusBadge, OpportunityCard, SkillProgress,
ProfileCompletion, DashboardStatCard, SkillGapCard, LearningRecommendationCard,
CandidateMatchRow, and DeadlineItem. Their shared `domain.module.css` owns only
domain layout and decoration; Button, IconButton, Badge, Card, ProgressBar, and
Avatar remain the behavior/visual owners. No primitive or global token was changed.

Cards remain flat, wrap full titles and skills, and never act as giant buttons.
The default heading is h2, configurable to h3/h4 by the parent. Caller-owned
`DomainAction` chooses a Button callback (including disabled/loading) or an actual
text link. Accessible action names include the resource/person context by default.
Removable SkillChip uses a 44px medium IconButton beside its compact badge.

MatchScore presents an already calculated score: ≥90 excellent/success, ≥75
strong/info, ≥60 moderate/warning, otherwise low/neutral. It always shows the
number and label; the large variant adds the shared ProgressBar. No ranking or
matching algorithm is present. Nonfinite percentages throw; finite values clamp
to 0–100 consistently with ProgressBar. Fractional scores are classified before
rounding (89.9 is still Strong), and MatchScore displays the supplied precision.

Application status tones: saved/rejected neutral, applied/under review/interview
info, shortlisted/selected success. Rejection is an outcome, not a system error.
Learning priority is explicit text: high/warning, medium/info, low/neutral. Deadline
urgency is upcoming/neutral, due soon/warning, overdue/error. Brand pink/yellow
are not repurposed as outcome colors. Stats may use semantic/chart accent tokens;
their label, value, and context carry meaning independently of the accent/icon.

Dates, money, proficiency/readiness descriptions, counts, and urgency are supplied
by the caller. Date props pair a machine-readable `dateTime` with a display label;
components neither consult the clock nor invent time-zone/currency rules. No
backend requests, external learning APIs, permissions, or navigation policy exist.

Feature forms, authentication, overlays, and remote-data workflows are not
implemented. Consumers own future validation timing, schemas, first-error focus,
and async operations. The Phase 4 menu and local preview contracts are below.

### Dashboard composition (Phase 4)

`layout/dashboard-shell.tsx` owns the desktop sidebar, responsive header, and
mobile disclosure. Only Dashboard is a route (`/`, `aria-current="page"`); other
destinations are text labelled Coming soon. Notifications use a disabled IconButton
with visible availability text. The avatar is decorative beside the named identity.
The menu focuses its Dashboard link on opening, closes on Escape, restores trigger
focus, and resets when resizing to desktop. It is nonmodal: no trap or overlay.

`components/dashboard/student-dashboard.tsx` composes existing domain cards and
progress/status displays. `dashboard-data.ts` is a fixed, typed September 2026
snapshot, not a clock-driven or live feed. Search uses Input/IconButton in a native
form: submit filters company/title/skill in the three local opportunities; clear
resets both draft/results and returns input focus. IME composition is guarded.
Search is transient page state, not persisted URL/global state.

Opportunity and learning actions open real inline sample details/topic lists via
`SamplePreview`; focus moves to its heading and returns to the triggering action
on close. No application or course connection is implied. Skill-gap/profile links
target existing page content. `RecommendationsSection` exposes ready/loading/empty/
error props for the fixture; recovery restores local data, never a simulated request.

`MatchOverview` uses lightweight SVG with chart tokens, visible checkpoint values,
counts, ranges, and explanatory text. The trend SVG has a complete accessible name;
distribution bars are decorative beside equivalent text. No chart dependency,
matching algorithm, new token, or parallel component system was introduced.

### Public reference (Phase 5)

`app/design/page.tsx` renders `DesignShowcase` with a unique document title. The
reference uses a wide editorial introduction, clear section dividers, and a sticky
in-page index from 64rem. On narrow or short screens the index remains in document
flow. Natural document scrolling, token gutters, bounded grid tracks, and full-text
wrapping preserve reachability; no hidden overflow or independently scrolling panels.

`TokenSpecimens` paints brand/semantic/chart swatches and type/spacing/radius/shadow/
layout examples from CSS variables. `catalog.ts` contains display labels, not a
theme: browser tests compare hex labels against computed colors. Chart rows include
names and values outside decorative bars. Layout specimens are capped to the panel,
not miniature proportional diagrams. No locked token is modified.

`PrimitiveSpecimens` and `DomainSpecimens` import real public exports. Enabled
actions produce explicit local status feedback, never applications or server calls.
The small `noValidate` form checks only its example name, focuses the associated
error, and preserves text on correction. Native Select retains OS-owned popup
geometry; Textarea retains the approved vertical resize. Removing Docker focuses
its restore action. `StateLab` uses native checkboxes/radios to select disabled,
loading, ready, empty, or error states. Recovery focuses the Ready radio; loading
has an explicit user-controlled exit and no fake timer. Hover/focus-visible/active
are actual browser states on Button, not copied CSS recipes.

Dashboard footer and reference header provide real two-way navigation. The page
explains token → primitive → domain → page layering and the implemented accessibility
choices without claiming certification. Authentication UI and API integration remain
out of scope; the internal fixture continues to provide isolated regression checks.

### Motion and content

Durations are 120/200/320ms with `cubic-bezier(0.2, 0, 0, 1)`. The current page has
no entrance or ambient animation. Reduced-motion preferences zero the duration
tokens and suppress animation, transitions, and smooth scrolling globally.
Use plain, honest copy; do not present unavailable features as working actions.
Charts include values and summaries rather than relying on color.

## Do's and Don'ts

- Do consume runtime CSS properties; change their owner once and update these docs.
- Do keep text contrast, keyboard focus, responsive wrapping, and native semantics.
- Do keep scrollbar themes global, visible, and compatible with forced colors.
- Don't use Felipa for product information or pink/yellow for small light-surface text.
- Don't add feature forms, new product workflows, or API integration in Phase 5.

### Phase 2 reconciliation

The locked palette, fonts, spacing/radii, and flat-surface direction are unchanged.
The previous “components await review” boundary is intentionally replaced by this
approved generic layer. Browser fixtures compare the primitives against the same
production fonts/tokens as the existing placeholder; no second theme is introduced.

### Phase 3 reconciliation

The prior “no domain components” scope statement is updated for this approved
phase. Flat surfaces, Inter, semantic color ownership, and the locked token values
are preserved. The pathway motif now appears only in labelled skill progress/gaps;
its connected dots are decorative, not a second progress implementation. The fixture
extends the existing production-font test surface, without adding a Next route.

### Phase 4 reconciliation

The approved dashboard replaces the placeholder at `/`; the unused placeholder CSS
was removed. The existing tokens, fonts, primitives, and domain implementation stay
unchanged. Page-only CSS owns layout/chart geometry; shared components retain all
control and status behavior. The fixture gains alternate recommendation states.

### Phase 5 reconciliation

The approved `/design` route replaces its prior deferred status. Existing tokens,
primitives, and domain implementations remain unchanged. New CSS owns only reference
layout and token specimens; all shared component states stay with their original
owners. No new dependencies, theme, or API boundary is introduced.
