# SkillBridge Frontend Design System

**Date:** 2026-09-14  
**Status:** Proposed for implementation

## Objective

Add a standalone, portfolio-quality Next.js frontend to the existing SkillBridge
repository without changing the Express API or its runtime behavior. The frontend
will establish the reusable design system, expose it through `/design`, and apply it
to a representative student dashboard at `/`.

## Delivery boundary

The frontend will live in `frontend/` as a Next.js App Router, React, and
strict-TypeScript application. The existing root package remains the backend package
for this task. Frontend commands run from `frontend/`; no backend source, package,
API contract, database model, or authentication behavior is changed.

The intended repository architecture is `frontend/`, `backend/`, and `docs/` at the
root. Moving the existing Express package into `backend/` is explicitly deferred to
a separate refactoring task, so this task creates only `frontend/` and leaves the
current backend at the repository root.

The frontend uses representative local data only. It will not imply that dashboard
API endpoints exist. Existing unrelated authentication work in the repository is
preserved.

## Visual direction

SkillBridge is a professional student opportunity platform. Its interface should
feel calm, capable, and career-focused: pale green page canvas, white cards, dark
ink, disciplined purple emphasis, and semantic colors reserved for their actual
meaning.

The one signature element is the **skill pathway**: compact connected markers and
segmented progress treatments that make readiness, gaps, and next actions feel like
one coherent journey. It appears in selected progress and analytics contexts only;
the rest of the interface stays restrained.

The locked brand colors are:

- Primary purple: `#540D6E`
- Accent pink: `#EE4266`
- Highlight yellow: `#FFD23F`
- Background: `#F3FCF0`
- Dark neutral: `#1F271B`

Inter owns all product UI, dense content, labels, controls, data, and numbers.
Felipa is limited to a short decorative brand statement in the dashboard welcome
area and a typography specimen on `/design`. It is not used in forms, navigation,
tables, cards, analytics, or body copy.

## Token model

CSS custom properties in a single token stylesheet are the runtime source of truth.
`DESIGN.md` documents their intent and ownership; component styles consume only the
runtime properties.

- Spacing: 4, 8, 12, 16, 24, 32, 48, and 64 px.
- Radius: 8, 12, 16, 24, and 999 px.
- Color groups: brand, neutral surface/text/border, semantic feedback, and a separate
  dark chart palette containing purple, pink, yellow, green, blue, cyan, and orange.
- Typography: display, h1, h2, h3, body-lg, body, body-sm, label, and caption.
- Supporting tokens: focus ring, shadows, motion duration/easing, layout widths,
  sidebar width, and global scrollbar colors.

Semantic success, warning, error, and info colors remain independent from brand and
chart colors. Yellow chart marks will use dark text or an adjacent label rather than
white text.

## Application architecture

```text
frontend/
├── app/
│   ├── design/          # Design-system showcase route
│   ├── globals.css      # Global token and style entry point
│   ├── layout.tsx       # Root metadata, fonts, and document shell
│   └── page.tsx         # Temporary student-dashboard prototype route
├── components/
│   ├── ui/             # Generic, product-agnostic primitives
│   └── skillbridge/    # Opportunity, skill, profile, and matching concepts
├── layout/             # Dashboard shell, sidebar, and header
├── styles/             # Tokens, reset/base, layout, and component styles
├── test/               # Test setup and accessibility helpers
└── public/              # Static frontend assets when required
```

Generic primitives never import SkillBridge domain components. Domain components
compose generic primitives and expose typed business-facing props. Pages compose
both layers but do not redefine component tokens or duplicate primitive behavior.

## Routes and layout

- `/`: responsive student dashboard foundation. This is temporary prototype routing;
  later landing and authentication routes will own the public entry points, and the
  authenticated experience will move beneath a route such as `/dashboard`.
- `/design`: public/internal showcase built from the same exported components used
  by the dashboard.
- Unknown paths: an App Router `not-found.tsx` state linking back to the dashboard.

The desktop dashboard uses an approximately 240 px sidebar, top header, 12-column
content grid, 24–32 px page padding, and 1440 px maximum content width. Tablet uses
a compact navigation rail/header arrangement. Mobile replaces the sidebar with a
keyboard-operable menu and a one-column content flow with at least 16 px gutters.

## Generic component contracts

`Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Badge`,
`Card`, `Dialog`, `Tabs`, `Tooltip`, `Dropdown`, `ProgressBar`, `Avatar`, `Table`,
`Skeleton`, `EmptyState`, and `ErrorState` will be typed React components.

Shared expectations:

- Native semantic elements are the foundation.
- Every interactive control has hover, pressed where relevant, visible
  `:focus-visible`, disabled, and busy/error states where relevant.
- Navigation, menus, tabs, dropdowns, and overlays are fully keyboard operable.
- Buttons preserve their dimensions while loading and expose `aria-busy`.
- Form controls use real label associations and textual errors with `aria-invalid`
  and `aria-describedby`.
- The initial Select remains native because the showcase does not require a custom
  popup contract.
- Dialog traps focus, closes on Escape, restores trigger focus, and uses a labelled
  title and description.
- Tabs implement arrow-key navigation and proper tab/panel semantics.
- Tooltip content is supplementary, never the only source of required information.
- Dropdown supports Escape, outside-click dismissal, keyboard entry, and focus
  return.
- Table remains a semantic read-oriented `<table>` with a responsive scroll owner.
- Skeleton respects reduced motion and matches representative final geometry.
- Text and interactive states target WCAG AA contrast where practical.

## SkillBridge domain components

The domain layer contains `SkillChip`, `MatchScore`, `OpportunityCard`,
`ApplicationStatusBadge`, `SkillProgress`, `ProfileCompletion`, `DashboardStatCard`,
`SkillGapCard`, `LearningRecommendationCard`, and `CandidateMatchRow`.

Match score labels are derived from the numeric score in one shared helper:

- 90–100: Excellent Match
- 75–89: Strong Match
- 60–74: Moderate Match
- Below 60: Low Match

Application status is a closed union: Saved, Applied, Under Review, Shortlisted,
Interview, Selected, and Rejected. Each status combines text with a restrained icon
or structural treatment so meaning never relies on color alone.

## Student dashboard composition

The dashboard contains sidebar navigation; header search and profile controls; a
welcome area; readiness and profile-completion summaries; opportunity-match,
application, and skill-proficiency analytics; skill-gap cards; recommended
opportunities; learning recommendations; and upcoming deadlines.

Charts use semantic HTML/SVG with labels and text summaries. Multiple chart palette
colors distinguish data series, while brand purple remains the main interaction
color. Dashboard data is clearly representative and local.

## Design showcase

`/design` is a real reference surface rather than a decorative mockup. It demonstrates
the runtime tokens and the actual exported components across normal, hover-adjacent,
disabled, loading, error, empty, and representative domain states. Sections cover
brand, semantic, and chart colors; type; spacing; radii; buttons; controls; badges;
skills; match scores; opportunity cards; application states; progress; tables;
empty/loading/error states; and dashboard cards.

## Responsive and accessibility contract

The target is WCAG 2.2 AA. The implementation includes:

- skip link and landmark structure;
- visible non-obscured keyboard focus;
- logical heading order and semantic labels;
- minimum practical touch targets for icon controls;
- status text, shape, labels, or patterns in addition to color, including every chart;
- reduced-motion fallbacks;
- application-owned scrollbar styling without hidden scrollbars;
- stable loading geometry and no viewport-wide overflow;
- mobile navigation that does not trap or lose focus;
- focus restoration for overlays and menus.

## Validation strategy

Automated checks:

- ESLint with TypeScript and React rules.
- TypeScript typecheck.
- Next.js production build with App Router route generation.
- Vitest and Testing Library coverage for match/status mapping, form labelling,
  dialog keyboard behavior, tabs keyboard behavior, and route rendering.
- Existing backend tests and build remain green.
- Premium design static audit and anti-pattern scan.

Rendered checks use a real browser at mobile, tablet, and desktop widths. They verify
`/design` and `/`, mobile navigation, open dialog/dropdown states, keyboard focus,
horizontal overflow, reduced motion, and obvious contrast or Felipa misuse.

## Documentation

- Root `DESIGN.md`: durable visual intent and token ownership for `frontend/`.
- `docs/design-system.md`: token values, component conventions, accessibility, chart
  use, and domain examples.
- `docs/architecture.md`: adds frontend boundaries while retaining backend content.
- `docs/decisions.md`: records font roles, token-driven UI, component separation, and
  `/design`.
- `docs/project-understanding.md`: explains the system, accessibility states, and
  portfolio/interview relevance.

## Explicit non-goals

- Backend, root backend package, or Prisma changes, including moving the current
  backend into `backend/`.
- Authentication integration or protected-route behavior.
- New dashboard API endpoints.
- A new charting framework when accessible CSS/SVG visuals suffice.
- Dark mode, internationalization, destructive workflows, or backend data fetching.
- Storybook; `/design` is the maintained component showcase for this scope.
