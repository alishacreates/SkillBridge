# SkillBridge Design System

## Current scope: Phases 1 and 2

Implemented: a standalone Next.js App Router package, strict TypeScript, font
loading, canonical CSS tokens, global accessibility/base styles, and a responsive
coming-soon homepage, plus generic UI primitives under `frontend/components/ui/`.
No domain components, feature forms, dashboard, charts, `/design`, authentication
UI, or API integration exists yet. Phase 2 stops at review of this reusable layer.

The approved specification is
`docs/specs/2026-09-14-frontend-design-system-design.md`; its root-backend and full
dashboard delivery notes describe an older repository state and later phases.
The current packages live in `backend/` and `frontend/`. Durable frontend design
intent is maintained in `frontend/DESIGN.md` as requested for Phase 1.

## Ownership and styling

`frontend/styles/tokens.css` owns all runtime design values. `app/globals.css`
imports it, then `styles/base.css`, once from `app/layout.tsx`. The placeholder's
`app/page.module.css` consumes those variables. CSS Modules are the styling choice
recorded in the approved implementation plan; Tailwind and CSS-in-JS are not added.

Change a value in the token stylesheet and update the affected documentation.
Do not copy palette values into page-level CSS or introduce a parallel JS theme.
SVG favicon colors are the documented exception because the SVG is a separate
document. Literal media thresholds (48rem/64rem) and structural CSS such as `0`,
`100%`, and flex factors are not semantic theme values.

## Color tokens

| Token | Value | Intended use |
| --- | --- | --- |
| `--color-brand-primary` | `#540D6E` | Purple emphasis, links, focus |
| `--color-brand-accent` | `#EE4266` | Restrained pink decoration |
| `--color-brand-highlight` | `#FFD23F` | Yellow decoration/selection with dark text |
| `--color-brand-background` | `#F3FCF0` | Pale green page canvas |
| `--color-brand-dark` | `#1F271B` | Primary ink |
| `--color-surface` | `#FFFFFF` | White surface |
| `--color-surface-subtle` | `#EAF1E7` | Subtle surface/scrollbar track |
| `--color-surface-brand` | `#F1E8F4` | Quiet purple-tinted surface |
| `--color-text-secondary` | `#4F5B49` | Supporting copy |
| `--color-text-muted` | `#626E5C` | Secondary small text on the current light surfaces |
| `--color-text-inverse` | `#FFFFFF` | Text on dark backgrounds |
| `--color-border` | `#D2DDCE` | Decorative separators, not sole control boundaries |
| `--color-border-strong` | `#75816F` | Higher-contrast boundaries |
| `--color-link-hover` / `--color-link-active` | `#3B094D` / `#290635` | Link states |

Aliases: `--color-canvas` → brand background, `--color-text-primary` → brand dark,
`--color-link` → brand primary; selection uses yellow background and dark ink.

Semantic colors are independent from brand accents:

| Semantic role | Foreground token/value | Surface token/value |
| --- | --- | --- |
| Success | `--color-success`: `#23653D` | `--color-success-surface`: `#EAF6ED` |
| Warning | `--color-warning`: `#795600` | `--color-warning-surface`: `#FFF5D5` |
| Error | `--color-error`: `#A3293D` | `--color-error-surface`: `#FCECEF` |
| Info | `--color-info`: `#245B8A` | `--color-info-surface`: `#EAF2FB` |

The reserved chart palette uses dark, readable hues:

| Token | Value |
| --- | --- |
| `--chart-purple` | `#632B80` |
| `--chart-pink` | `#A83259` |
| `--chart-yellow` | `#806400` |
| `--chart-green` | `#287347` |
| `--chart-blue` | `#2C5FA3` |
| `--chart-cyan` | `#186D7A` |
| `--chart-orange` | `#A64F20` |

No chart is implemented. Later charts must include labels, values, or patterns;
contrast against a surface alone does not distinguish adjacent data series.
Brand pink/yellow are not approved small-text colors on the pale canvas. Contrast
must be checked for the actual foreground/background pair when components are added.

## Fonts and typography

`frontend/app/layout.tsx` configures `Inter` and `Felipa` with `next/font/google`,
Latin subsets and `display: swap`. Inter is variable; Felipa uses weight 400.
Next downloads the files during the build and serves them from the application,
so the browser does not contact Google Fonts. A fresh build requires access to the
font host. See the [Next.js font documentation](https://nextjs.org/docs/app/getting-started/fonts).

The generated variables `--font-inter` and `--font-felipa` are applied to `<html>`.
`--font-body` adds Arial/sans-serif fallbacks and is inherited by the whole UI.
`--font-decorative` adds Georgia/serif fallbacks and is used only by `.brandNote`.

| Role | Runtime size | Line height |
| --- | --- | --- |
| Display | `--type-display-size`: fluid 2.5–4.5rem | 1.08 |
| H1 | `--type-h1-size`: fluid 2–3rem | 1.25 |
| H2 / H3 | 1.5rem / 1.25rem | 1.25 |
| Body large / body / body small | 1.125rem / 1rem / 0.875rem | 1.6 |
| Label | 0.875rem | 1.4 |
| Caption | 0.75rem | 1.5 |
| Decorative | fluid 1.75–2.25rem | 1.25 |

Weights: `--font-weight-regular/medium/semibold/bold` = 400/500/600/700.
Heading tracking is `--type-heading-tracking: -0.04em`. Product headings still use
Inter; Felipa is decorative brand emphasis only.

## Spacing, shape, focus, and motion

- `--space-1/2/3/4/6/8/12/16`: 0.25/0.5/0.75/1/1.5/2/3/4rem, equivalent to
  the approved 4/8/12/16/24/32/48/64px scale at the default root font size.
- `--radius-sm/md/lg/xl/full`: 0.5/0.75/1/1.5rem and 999px.
- `--border-width`: 1px.
- `--shadow-sm`: `0 1px 3px rgb(31 39 27 / 0.06)`.
- `--shadow-md`: `0 8px 24px rgb(31 39 27 / 0.08)`.
- `--shadow-lg`: `0 16px 48px rgb(31 39 27 / 0.12)`.
- `--focus-ring`: a 3px solid primary-purple outline; offset 3px with a white halo.
  Forced-colors mode uses system `Highlight` and no halo.
- `--motion-fast/normal/slow`: 120/200/320ms; easing
  `cubic-bezier(0.2, 0, 0, 1)`. Reduced motion zeroes these tokens and overrides
  animations/transitions and smooth scrolling in base styles.

## Layout and scroll ownership

`--layout-content-max` is 90rem (1440px), `--layout-shell-max` is 72rem (1152px),
`--layout-copy-max` is 38rem, and `--layout-sidebar-width` is 15rem (240px).
Only shell and copy widths are used now. `--layout-gutter` changes from 1rem to
1.5rem at 48rem and 2rem at 64rem. `--layout-min-target` is 2.75rem (44px).

The page grows naturally; min-height is not a content-height limit. No horizontal
overflow is hidden. The global scrollbar baseline uses thumb `#75816F`, subtle
surface track, hover `#4F5B49`, active brand purple, and a 12px fallback size.
Standards-based properties and WebKit fallbacks live in `styles/base.css`, with a
system-color path for forced colors. No opt-in scrollbar class is required.

## Accessibility and verification

The foundation has one `main`, an H1, semantic header/footer, `lang="en"`, a
keyboard-visible skip link, native links, and no color-only information. These
foundations target WCAG 2.2 AA; they are not a certification of future components.

The browser suite checks at least 4.5:1 contrast for primary/secondary/muted text on
canvas, white, and subtle surfaces; semantic foregrounds on their matching surfaces;
and chart hues on white. It also checks purple on canvas and white on purple.
Decorative light borders and brand accents are not approved text/control boundaries.

From `frontend/`:

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser check runs against the production build on port 3101. It checks 390,
768, and 1440px viewports, actual font loading, canvas/text colors, overflow, skip
link/focus behavior, browser errors, reduced motion, and forced colors. Screenshots
and failure traces go into ignored `frontend/test-results/`.

Phase 2 adds a separate Vite fixture server on port 3102, started/stopped by
Playwright alongside production Next on 3101. Source lives in `frontend/test/fixtures/`,
outside App Router; it never becomes a production route. The fixture proxies Next's
generated font assets and reuses its font classes/CSS rather than configuring a
second font system. To inspect manually after building, run
`npm start -- --hostname 127.0.0.1 --port 3101` and `npm run test:fixtures` in separate
terminals. Visit `http://127.0.0.1:3102`. This is temporary verification infrastructure,
not the final showcase. Vite/Vitest/testing libraries are development dependencies.

Development and normal production serving use port 3001 (`npm run dev`, or build
then `npm start`), avoiding the backend's documented default port 3000. No frontend
environment variables or database connection are needed for Phase 1.

Tooling constraint: ESLint remains on major 9 because the React/import/accessibility
plugins bundled with the current Next preset do not support major 10. npm emits an
ESLint 9 deprecation warning; migrate when the preset's plugins support it. No lint
rules are disabled to bypass that compatibility issue.

### Phase 1 verification record

On 2026-09-19, dependency installation, lint, strict typecheck, and the production
build completed successfully. All five production Chromium tests passed, covering
390/768/1440px layouts, loaded Inter/Felipa fonts, no console/page/HTTP errors on the
placeholder, skip navigation, reduced motion, forced colors, and 22 contrast pairs.
Desktop and mobile screenshots were also visually inspected. The strict design
static audit and `DESIGN.md` validator reported no errors or warnings. These checks
cover the Phase 1 placeholder, not unimplemented components or all browser engines.

## Generic primitives (Phase 2)

Public exports live in `frontend/components/ui/index.ts`; direct file imports also
work. These solve reusable visual/interaction problems without importing domain,
page, or backend code. CSS Modules consume existing tokens; the palette and spacing
scale have not changed. Inter is the only primitive font. Cards stay flat by default.

| Component/file | API and behavior |
| --- | --- |
| `Button` / `button.tsx` | `variant`: primary (default), secondary, outline, ghost, destructive; `size`: sm/md/lg (md default). Native button props/ref, default type button, explicit submit/reset supported. `loading` disables activation; `loadingLabel` defaults to “Loading”. Both content layers reserve space, so changing loading does not resize it. Icons compose inside children. |
| `IconButton` / `icon-button.tsx` | Requires `label` and icon children. Same sizes/loading/disabled semantics; ghost default. Label remains the accessible name; icons are decorative. Tooltips deferred. |
| `Input` / `input.tsx` | Required visible `label`; `description`, `error`, native `required`, `disabled`, value/defaultValue, event and ref props. Supports text-like native types (not hidden/check/radio/file). `leadingVisual` / `trailingVisual` are noninteractive decoration, hidden from AT. |
| `Textarea` / `textarea.tsx` | Same field contract, four rows by default; vertical resize, native scrolling and caller-configurable rows. No horizontal resizing. |
| `Select` / `select.tsx` | Same field contract, native option/optgroup children, single selection. Optional `placeholder` is an empty-value option and the initial uncontrolled value unless defaultValue is given; disabled when required. Optional fields may select it again. Controlled `value` wins. Browser owns popup geometry. |
| `Checkbox` / `checkbox.tsx` | Label, description, error, native checked/defaultChecked/onChange/required/disabled and ref. Native Space/label activation. |
| `RadioGroup` / `radio-group.tsx` | Required label/name/options (`value`, `label`, optional description/disabled). Fieldset/legend; `value` + `onValueChange` or `defaultValue`. Native arrows, one checked option, disabled options/group, required and help/error. Option values and names must be unique in their respective scopes. |
| `Badge` / `badge.tsx` | neutral (default), primary, success, warning, error, info. Static text/metadata; no automatic live region or domain-status mapping. Meaning must be in children, not just color. |
| `Card*` / `card.tsx` | Card, Header, Title, Description, Content, Footer; ordinary composition, no click behavior. CardTitle `as` supports h2 (default), h3, h4 for correct heading hierarchy. |
| `ProgressBar` / `progress-bar.tsx` | Required accessible `label` and finite `value`; min=0/max=100, so value is a percentage by default. Other finite ranges allowed. Values clamp to bounds; max≤min/nonfinite ranges throw RangeError. showLabel/showValue default true; hiding both retains the accessible name. Native progress normalizes the visual range and exposes actual min/max/current through ARIA. `aria-valuetext` can customize spoken units. Determinate only. |
| `Avatar` / `avatar.tsx` | Required `alt`, optional src/initials, sm/md/lg (32/48/64px at default root size). Derives up to two initials from alt when omitted. Failed source falls back; changed source retries. Use alt="" beside an already named identity when decorative. Native img supports arbitrary caller URLs; CSS reserves geometry. |
| `Skeleton` / `feedback.tsx` | text/circle/block, optional animate (true default), className for owner-specific geometry. Hidden from AT; reduced motion is static. Put an accessible loading status/aria-busy on the owning region. |
| `EmptyState`, `ErrorState` / `feedback.tsx` | Required heading/description, optional action ReactNode, headingLevel=2/3/4, className. ErrorState may `announce` an asynchronous error via alert; default false avoids unnecessary announcements. Actions remain caller-owned real controls. |

### Field accessibility and state ownership

`field.tsx` centralizes `useField`, `FieldLabel`, and `FieldMessages`. Callers can
supply a stable unique `id`; otherwise React `useId` supplies a hydration-safe ID.
Labels point to the actual control. Existing `aria-describedby` IDs are merged with
present help/error IDs. Errors add `aria-invalid` on fields/group and the visible
prefix “Error:”; removing the error removes its relationship. The message area
reserves one text line; long descriptions/errors can grow naturally rather than clip.

Native semantics supply focus, form values, keyboard behavior, and disabled state.
The wrappers do not reimplement those interactions in divs or custom ARIA widgets.
Refs reach native controls using React 19 ref props. Controlled and uncontrolled
usage are both supported; do not switch between them during a control's lifetime.
Consumers own schemas, validation timing, submission, error focus, and business rules.
Future feature forms can use `noValidate` with their own textual validation UX; this
layer deliberately does not implement a form manager or authentication form.

Enabled controls have hover/active feedback and the shared focus ring. Disabled
buttons/fields use native disabling, a noninteractive cursor, and dashed borders;
disabled choices additionally use a dashed text treatment. Loading uses visible
text/spinner plus `aria-busy`, not disabled color alone. Error text complements color.
Strong borders identify fields; light borders separate static surfaces only.

### Tests and limitations

`components/ui/*.test.tsx` uses Vitest, jsdom, Testing Library, and user-event for
activation, safe button types, disabled/loading, label/help/error wiring, stable IDs,
native refs, controlled values, choice selection, range semantics, image failure,
and recovery actions. Real components run; no persistence/API mocks are needed.
`e2e/primitives.spec.ts` uses Chromium and axe for rendered states, contrast,
keyboard operation, responsive overflow, busy geometry, and reduced/forced colors.
Existing Phase 1 browser/contrast checks remain intact. A native popup is deliberately
OS-owned; screenshots and Chromium checks are not a claim of cross-OS or manual
screen-reader certification. Headless screenshots show the select trigger; they
cannot certify the OS-owned popup's rendering.

### Static audit review

The supplemental premium static scanner exits 1 with four reviewed findings, not a
clean result: it treats native reset as actionless in `button.test.tsx`, cannot trace
IconButton's prop-forwarded handler, and requires literal `resize:none` on both
Textarea and its test usage. The reset and forwarded activation have behavioral
coverage; vertical-only resizing is an intentional, documented Phase 2 choice and
has a browser assertion. The scanner does not resolve React/CSS-Module composition.
Its raw JSON stays in ignored `frontend/premium-audit.json`; no scanner rules were
disabled and no no-op handlers were added to conceal these limitations.

### Phase 2 verification record

On 2026-09-19, `npm run lint`, `npm run typecheck`, `npm test` (20 tests),
`npm run build`, and `npm run test:e2e` (10 tests, including the five foundation
checks) passed. Axe reported no tested WCAG A/AA violations in the mobile/desktop
fixture or the button hover/active contrast checks. The 22 existing token contrast
pairs, keyboard selection/activation, busy geometry, reduced motion, and forced
colors passed. Desktop/mobile and state screenshots were inspected. `git diff
--check` passed and the backend diff was empty. DESIGN.md validation returned zero
errors/warnings; the separate static scanner limitations are recorded above.

Core button, field, progress, and feedback tests were observed failing against the
initial minimal implementations before those behaviors were added. Extra icon,
controlled-field, and browser-state checks were added as regression coverage;
those were not all separate red-first cycles. No snapshot-only tests were used.
