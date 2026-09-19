# SkillBridge Frontend Design System Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a typed, accessible SkillBridge design system, `/design` showcase, and responsive student dashboard prototype as a standalone Next.js frontend in `frontend/` without changing backend behavior.

**Architecture:** Create a Next.js App Router application under `frontend/`. CSS custom properties are the single runtime token source; generic primitives under `frontend/components/ui/` own product-agnostic behavior, while typed components under `frontend/components/skillbridge/` compose those primitives and own domain presentation. App Router pages remain server components unless interactivity requires a narrowly scoped client component.

**Tech Stack:** Next.js App Router, React, strict TypeScript, CSS Modules/global token CSS, `next/font`, Lucide React icons, Vitest, Testing Library, jest-dom, user-event, axe accessibility checks, and ESLint.

## Global Constraints

- Create only the `frontend/` package plus requested root documentation changes. Do not move, edit, or reconfigure the existing Express backend at the repository root.
- Preserve the future repository target of `frontend/`, `backend/`, and `docs/`; backend relocation is a separate task.
- Use `/` for the dashboard only as temporary prototype routing. Document the intended later landing/auth routes and authenticated `/dashboard` route.
- Keep the locked colors `#540D6E`, `#EE4266`, `#FFD23F`, `#F3FCF0`, and `#1F271B` unchanged.
- Use Inter for every product UI role. Use Felipa only for decorative marketing emphasis, never dense UI, forms, tables, charts, navigation, cards, body text, or analytics.
- Use a separate semantic palette and a separate dark, readable seven-color chart palette. Brand colors do not acquire semantic meanings merely because they are available.
- Use only token-owned spacing, radii, color, typography, elevation, focus, and motion values in shared UI.
- Generic primitives must never import from `components/skillbridge/`.
- Use representative local data only; add no API calls, authentication behavior, or claims that unimplemented backend endpoints exist.
- Target WCAG 2.2 AA: semantic HTML, associated labels, visible `:focus-visible`, keyboard-operable navigation/menus, reduced motion, meaningful disabled/loading/error states, practical AA contrast, and chart meaning that never relies on color alone.
- Do not run commit steps without explicit user authorization.

---

### Task 1: Create the Next.js shell and canonical token contract

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/package-lock.json`
- Create: `frontend/next.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/eslint.config.mjs`
- Create: `frontend/vitest.config.ts`
- Create: `frontend/next-env.d.ts`
- Create: `frontend/app/layout.tsx`
- Create: `frontend/app/globals.css`
- Create: `frontend/styles/tokens.css`
- Create: `frontend/styles/base.css`
- Create: `frontend/test/setup.ts`
- Create: `frontend/test/design-token-contract.test.ts`
- Create: `frontend/public/skillbridge-mark.svg`
- Create: `DESIGN.md`
- Create: `frontend/premium-ui.json`

**Interfaces:**
- Consumes: locked palette, typography roles, spacing scale, radius scale, 240 px sidebar target, 1440 px content maximum, and premium UI behavior rules from the approved specification.
- Produces: CSS custom properties named by role (`--color-brand-primary`, `--color-text-primary`, `--color-success`, `--chart-purple`, `--space-1`, `--radius-md`, `--type-h1-size`, `--focus-ring`, and related documented tokens); root font variables `--font-inter` and `--font-felipa`; frontend scripts `dev`, `lint`, `typecheck`, `test`, and `build`.

- [ ] **Step 1: Establish the test harness and add the focused failing token test**

  Initialize the standalone package and testing configuration without touching the root package. Add a filesystem contract test that reads `styles/tokens.css` and asserts every locked brand value, all eight spacing values, all five radii, the four semantic groups, seven chart hues, both font variables, focus-ring ownership, sidebar width, and content maximum. Assert that `app/layout.tsx` binds both Next font variables and that Felipa has no global body role.

- [ ] **Step 2: Verify the relevant failure**

  Run: `cd frontend && npm test -- design-token-contract.test.ts`
  Expected: failure because the runtime token stylesheet and font bindings do not yet satisfy the contract.

- [ ] **Step 3: Implement the minimum shell and tokens**

  Configure App Router metadata and `next/font/google` for Inter and Felipa. Import `tokens.css` and `base.css` once through `app/globals.css`. Define neutral surfaces/borders/text, semantic colors, dark chart colors, spacing, radii, elevations, focus ring, layout sizes, motion, and visible global scrollbars. Add box sizing, body defaults, reduced-motion behavior, and forced-colors-compatible focus. Create `DESIGN.md` from the premium template with the approved calm SaaS direction and skill-pathway signature; map every durable design value to `frontend/styles/tokens.css`. Add `frontend/premium-ui.json` with the frontend-owned verification commands so quality configuration remains inside the frontend package.

- [ ] **Step 4: Verify the focused pass**

  Run: `cd frontend && npm test -- design-token-contract.test.ts`
  Expected: all token and font-role assertions pass.

- [ ] **Step 5: Run the affected integration check**

  Run: `cd frontend && npm run typecheck && npm run lint`
  Expected: Next.js shell, config, and test files typecheck and lint with no errors.

- [ ] **Step 6: Prepare the passing deliverable**

  Review only the Task 1 files with `git diff -- frontend DESIGN.md docs/project-understanding.md docs/plans/2026-09-14-frontend-design-system.md`; do not commit without explicit user authorization.

---

### Task 2: Implement generic form, feedback, and surface primitives

**Files:**
- Create: `frontend/components/ui/button.tsx`
- Create: `frontend/components/ui/icon-button.tsx`
- Create: `frontend/components/ui/input.tsx`
- Create: `frontend/components/ui/textarea.tsx`
- Create: `frontend/components/ui/select.tsx`
- Create: `frontend/components/ui/checkbox.tsx`
- Create: `frontend/components/ui/radio.tsx`
- Create: `frontend/components/ui/badge.tsx`
- Create: `frontend/components/ui/card.tsx`
- Create: `frontend/components/ui/progress-bar.tsx`
- Create: `frontend/components/ui/avatar.tsx`
- Create: `frontend/components/ui/skeleton.tsx`
- Create: `frontend/components/ui/state-message.tsx`
- Create: `frontend/components/ui/index.ts`
- Create: `frontend/components/ui/primitives.module.css`
- Create: `frontend/test/ui-primitives.test.tsx`

**Interfaces:**
- Consumes: shared CSS tokens and React native element prop types.
- Produces: typed exports `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Badge`, `Card`, `ProgressBar`, `Avatar`, `Skeleton`, `EmptyState`, and `ErrorState`; variants are explicit unions rather than arbitrary color props.

- [ ] **Step 1: Add focused failing primitive tests**

  Assert native element semantics, forwarded refs, associated visible labels, help/error IDs, `aria-invalid`, disabled behavior, loading `aria-busy`, stable loading labels, progress bounds and accessible value text, image/fallback avatar behavior, and status landmarks for empty/error states. Run axe against the representative form and state-message compositions.

- [ ] **Step 2: Verify the relevant failure**

  Run: `cd frontend && npm test -- ui-primitives.test.tsx`
  Expected: module-resolution failures for the not-yet-created primitive exports.

- [ ] **Step 3: Implement the minimum primitive behavior**

  Use native `button`, `input`, `textarea`, `select`, checkbox, and radio elements; native select behavior is the deliberate popup contract. Support default, hover, focus-visible, disabled, loading, and error states where relevant. Keep busy button dimensions stable, textarea non-resizable with a useful minimum height, form errors text-based, and icons supplementary to labels. Clamp visual progress to 0–100 while retaining explicit accessible value text. Implement reusable empty/error compositions with action slots and no domain imports.

- [ ] **Step 4: Verify the focused pass**

  Run: `cd frontend && npm test -- ui-primitives.test.tsx`
  Expected: semantic, state, and axe checks pass.

- [ ] **Step 5: Run the affected integration check**

  Run: `cd frontend && npm run typecheck && npm run lint`
  Expected: public props and styles compile without unsafe casts or lint errors.

- [ ] **Step 6: Prepare the passing deliverable**

  Review Task 2 exports and confirm `rg "components/skillbridge" frontend/components/ui` returns no matches; do not commit without explicit user authorization.

---

### Task 3: Implement keyboard-rich primitives and the semantic table

**Files:**
- Create: `frontend/components/ui/dialog.tsx`
- Create: `frontend/components/ui/tabs.tsx`
- Create: `frontend/components/ui/tooltip.tsx`
- Create: `frontend/components/ui/dropdown.tsx`
- Create: `frontend/components/ui/table.tsx`
- Modify: `frontend/components/ui/index.ts`
- Modify: `frontend/components/ui/primitives.module.css`
- Create: `frontend/test/ui-interactions.test.tsx`

**Interfaces:**
- Consumes: token styles and generic `Button`/`IconButton` primitives.
- Produces: controlled/uncontrolled `Dialog`, typed `Tabs` items, accessible supplementary `Tooltip`, keyboard-operable `Dropdown` items, and generic `Table<TRow>` column definitions with stable row keys.

- [ ] **Step 1: Add focused failing interaction tests**

  Test dialog trigger focus, initial focus, Tab containment, Escape close, labelled title/description, backdrop close, and focus restoration. Test Left/Right/Home/End tab activation. Test dropdown Enter/Space opening, arrow navigation, item activation, Escape/outside close, and trigger focus return. Confirm tooltip content is not required to understand its trigger. Confirm Table renders native caption/head/body markup, row headers where supplied, and a keyboard-reachable horizontal scroll region.

- [ ] **Step 2: Verify the relevant failure**

  Run: `cd frontend && npm test -- ui-interactions.test.tsx`
  Expected: module-resolution failures for the interactive primitives.

- [ ] **Step 3: Implement the minimum interactions**

  Mark only interactive modules with `'use client'`. Use portals for dialog/menu layers, deterministic IDs via `useId`, document event cleanup, focus restoration, and no native `alert`, `confirm`, or `prompt`. Keep tooltip supplementary and dismissible. Use a semantic read-oriented table inside its own labelled overflow container; do not implement ARIA grid behavior or unrequested sorting/pagination.

- [ ] **Step 4: Verify the focused pass**

  Run: `cd frontend && npm test -- ui-interactions.test.tsx`
  Expected: all keyboard, focus, semantics, and cleanup tests pass.

- [ ] **Step 5: Run the affected integration check**

  Run: `cd frontend && npm run typecheck && npm run lint`
  Expected: client boundaries and generic types compile cleanly.

- [ ] **Step 6: Prepare the passing deliverable**

  Inspect the open-state DOM in tests and review only Task 3 files; do not commit without explicit user authorization.

---

### Task 4: Build the typed SkillBridge domain component layer

**Files:**
- Create: `frontend/components/skillbridge/skill-chip.tsx`
- Create: `frontend/components/skillbridge/match-score.tsx`
- Create: `frontend/components/skillbridge/opportunity-card.tsx`
- Create: `frontend/components/skillbridge/application-status-badge.tsx`
- Create: `frontend/components/skillbridge/skill-progress.tsx`
- Create: `frontend/components/skillbridge/profile-completion.tsx`
- Create: `frontend/components/skillbridge/dashboard-stat-card.tsx`
- Create: `frontend/components/skillbridge/skill-gap-card.tsx`
- Create: `frontend/components/skillbridge/learning-recommendation-card.tsx`
- Create: `frontend/components/skillbridge/candidate-match-row.tsx`
- Create: `frontend/components/skillbridge/match.ts`
- Create: `frontend/components/skillbridge/types.ts`
- Create: `frontend/components/skillbridge/index.ts`
- Create: `frontend/components/skillbridge/skillbridge.module.css`
- Create: `frontend/test/skillbridge-components.test.tsx`

**Interfaces:**
- Consumes: generic UI exports only, chart/semantic tokens, and representative typed props.
- Produces: the ten requested domain components; `getMatchState(score: number): { label: MatchLabel; tone: MatchTone }`; `ApplicationStatus` closed union; shared `Opportunity`, `SkillLevel`, and `LearningRecommendation` display types.

- [ ] **Step 1: Add focused failing domain tests**

  Test score boundaries at 0, 59, 60, 74, 75, 89, 90, and 100 and clamp out-of-range display values. Test all seven application status labels. Render every component and assert accessible names, textual chart/progress summaries, actions as buttons/links, and no color-only meaning. Run axe on an opportunity card, candidate row, progress group, and learning card.

- [ ] **Step 2: Verify the relevant failure**

  Run: `cd frontend && npm test -- skillbridge-components.test.tsx`
  Expected: module-resolution failures for the missing domain layer.

- [ ] **Step 3: Implement domain composition**

  Compose Cards, Badges, ProgressBar, Avatar, and Buttons; do not duplicate primitive state logic. Encode match and application states centrally. Apply the skill-pathway motif only to match/progress/gap visuals. Give every chart mark an adjacent value, label, pattern, or list summary. Keep Felipa entirely out of this layer.

- [ ] **Step 4: Verify the focused pass**

  Run: `cd frontend && npm test -- skillbridge-components.test.tsx`
  Expected: all boundary, status, semantic, and axe checks pass.

- [ ] **Step 5: Run the affected integration check**

  Run: `cd frontend && npm run typecheck && npm run lint`
  Expected: typed domain contracts compile and generic/domain dependency direction remains one-way.

- [ ] **Step 6: Prepare the passing deliverable**

  Run `rg "Felipa|font-felipa" frontend/components` and confirm no matches under either dense UI component directory; do not commit without explicit user authorization.

---

### Task 5: Assemble the responsive student dashboard prototype at `/`

**Files:**
- Create: `frontend/components/layout/dashboard-shell.tsx`
- Create: `frontend/components/layout/sidebar.tsx`
- Create: `frontend/components/layout/dashboard-header.tsx`
- Create: `frontend/components/layout/mobile-navigation.tsx`
- Create: `frontend/components/layout/layout.module.css`
- Create: `frontend/components/dashboard/dashboard-overview.tsx`
- Create: `frontend/components/dashboard/dashboard-charts.tsx`
- Create: `frontend/components/dashboard/dashboard.module.css`
- Create: `frontend/data/student-dashboard.ts`
- Create: `frontend/app/page.tsx`
- Create: `frontend/app/not-found.tsx`
- Create: `frontend/test/dashboard-route.test.tsx`

**Interfaces:**
- Consumes: UI/domain exports and immutable representative data from `student-dashboard.ts`.
- Produces: responsive dashboard shell, keyboard-operable mobile navigation, labelled local search control, accessible chart summaries, dashboard route metadata, and a product-owned not-found route.

- [ ] **Step 1: Add the focused failing route tests**

  Assert the page includes skip navigation, one `main`, welcome/readiness/profile sections, opportunity/application/skill analytics, gap summary, recommendations, learning, and deadlines. Assert the search field has a visible label or accessible name plus clear button when populated. Test mobile navigation open/close, Escape, menu item access, and focus restoration. Confirm all chart series have matching text labels/values and the representative-data note is discoverable.

- [ ] **Step 2: Verify the relevant failure**

  Run: `cd frontend && npm test -- dashboard-route.test.tsx`
  Expected: route and layout module failures because the dashboard has not been assembled.

- [ ] **Step 3: Implement the dashboard**

  Build a desktop 240 px sidebar and top header around a max-1440 px, 12-column content grid with 24–32 px desktop padding. Collapse to a tablet arrangement and a one-column mobile flow with at least 16 px gutters. Use CSS/SVG bar, ring, and segmented visuals with dark chart tokens plus text summaries. Use Felipa once in a short decorative welcome statement only. Keep data local and actions non-destructive; navigation links may point to prototype anchors or `/design` without inventing backend flows.

- [ ] **Step 4: Verify the focused pass**

  Run: `cd frontend && npm test -- dashboard-route.test.tsx`
  Expected: dashboard content, mobile menu, search, and chart accessibility assertions pass.

- [ ] **Step 5: Run the affected integration check**

  Run: `cd frontend && npm run typecheck && npm run lint && npm run build`
  Expected: `/` and the not-found boundary compile in the production App Router build.

- [ ] **Step 6: Prepare the passing deliverable**

  Review dashboard files for raw color/spacing/radius literals and replace every unexplained occurrence with tokens; do not commit without explicit user authorization.

---

### Task 6: Build the `/design` showcase from production components

**Files:**
- Create: `frontend/app/design/page.tsx`
- Create: `frontend/components/design/design-showcase.tsx`
- Create: `frontend/components/design/design-showcase.module.css`
- Create: `frontend/components/design/interactive-examples.tsx`
- Create: `frontend/test/design-route.test.tsx`

**Interfaces:**
- Consumes: the real token stylesheet, every generic UI export, every SkillBridge domain export, and representative local examples.
- Produces: `/design` sections for brand/semantic/chart colors, typography, spacing, radii, buttons, form controls, badges, skills, match scores, opportunity cards, status states, progress, tables, empty/loading/error states, and dashboard cards.

- [ ] **Step 1: Add the focused failing showcase tests**

  Assert all required section headings and token swatches exist, every requested component export is rendered, interactive examples expose disabled/loading/error states, form labels are associated, the example table is semantic, and Felipa appears only in the decorative typography specimen. Run axe on the rendered showcase.

- [ ] **Step 2: Verify the relevant failure**

  Run: `cd frontend && npm test -- design-route.test.tsx`
  Expected: missing `/design` showcase modules and sections.

- [ ] **Step 3: Implement the showcase**

  Render actual components rather than duplicate demo-only facsimiles. Keep interactive dialog, tabs, dropdown, and form examples inside one small client component while the route and static specimens remain server-rendered. Add copyable token names only if implemented as an accessible button with confirmation status; otherwise present selectable code text without fake behavior. Make the page portfolio-ready through hierarchy, rhythm, and the skill-pathway motif rather than extra visual effects.

- [ ] **Step 4: Verify the focused pass**

  Run: `cd frontend && npm test -- design-route.test.tsx`
  Expected: complete section coverage, component reuse, font-boundary, semantics, and axe checks pass.

- [ ] **Step 5: Run the affected integration check**

  Run: `cd frontend && npm run typecheck && npm run lint && npm run build`
  Expected: `/design` is present in the production route output with no type or lint errors.

- [ ] **Step 6: Prepare the passing deliverable**

  Compare dashboard and showcase component use, labels, focus, and state behavior for consistency; do not commit without explicit user authorization.

---

### Task 7: Document, audit, and render-verify the complete frontend

**Files:**
- Modify: `docs/architecture.md`
- Modify: `docs/decisions.md`
- Create: `docs/project-understanding.md`
- Create: `docs/design-system.md`
- Create: `frontend/test/documentation-contract.test.ts`
- Create: `frontend/e2e/design-system.spec.ts`
- Create: `frontend/e2e/dashboard.spec.ts`
- Modify: `frontend/package.json`
- Modify: `frontend/premium-ui.json`

**Interfaces:**
- Consumes: implemented routes, token names, component exports, approved specification, and premium verification checklist.
- Produces: maintained architecture/decision/design-system documentation, Playwright browser checks, and a final evidence set for static, unit, build, and responsive behavior.

- [ ] **Step 1: Add the focused failing documentation and browser contracts**

  Add documentation assertions for Next.js/App Router, `frontend/`, temporary `/` routing, future `/dashboard`, token ownership, font boundaries, component dependency direction, accessibility states, chart palette, and interview relevance. Add browser tests for `/` and `/design` at 390×844, 768×1024, and 1440×1000; assert no horizontal document overflow, visible focus after keyboard navigation, working mobile menu, working dialog/dropdown/tabs, labelled charts, reduced-motion CSS, and required content.

- [ ] **Step 2: Verify the relevant failure**

  Run: `cd frontend && npm test -- documentation-contract.test.ts`
  Expected: failures because the four maintained documentation files do not yet contain the complete frontend contract.

- [ ] **Step 3: Update documentation and browser verification tooling**

  Extend—do not erase—the backend architecture and decision records. Document the current root-backend exception and future three-directory target, all requested design-system rules, component examples, accessibility behavior, and prototype route migration. Configure Playwright against the production Next server and capture screenshots for both routes at all three viewports plus open dialog/dropdown states.

- [ ] **Step 4: Verify the focused pass**

  Run: `cd frontend && npm test -- documentation-contract.test.ts`
  Expected: all documentation contract assertions pass.

- [ ] **Step 5: Run the full quality and premium verification suite**

  Run, in order:

  - `cd frontend && npm run lint`
  - `cd frontend && npm run typecheck`
  - `cd frontend && npm test`
  - `cd frontend && npm run build`
  - `npm run lint --if-present`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `python /Users/alishamac/.codex/plugins/cache/openai-curated-remote/frontend-design-premium/1.4.0/skills/frontend-design-premium/scripts/audit_project.py /Users/alishamac/Desktop/B.Tech/Projects/SkillBridge --mode strict --config /Users/alishamac/Desktop/B.Tech/Projects/SkillBridge/frontend/premium-ui.json`
  - `cd frontend && npm run test:e2e`

  Expected: all configured checks exit 0; existing backend tests/build remain unchanged and green; the premium audit reports no blocking finding; browser tests pass at mobile, tablet, and desktop widths and save screenshot evidence.

- [ ] **Step 6: Perform the final structural and anti-pattern review**

  Read every touched UI file completely. Confirm component boundaries, prop flow, and token ownership; run the premium anti-pattern searches for native dialogs, non-semantic click targets, hidden scrollbars, unlabelled icons, arbitrary raw colors, missing reduced-motion handling, and domain imports from `components/ui/`. Verify Felipa usage is limited to the approved welcome accent and `/design` decorative specimen. Record any unresolved contrast, rendering, or environment limitation explicitly.

- [ ] **Step 7: Prepare the final passing deliverable**

  Review `git status --short` and `git diff --stat`; distinguish pre-existing backend/authentication changes from frontend work. Do not commit without explicit user authorization.

## Unresolved externally observable decisions

None. The dashboard data is representative, `/` is explicitly temporary, native Select behavior is accepted for the initial system, and nonfunctional prototype navigation does not claim unavailable backend workflows.
