
# SkillBridge Project Understanding

This document is a learning guide to the code that actually exists in SkillBridge.
It starts with a beginner-friendly mental model, then adds the implementation detail
needed to explain the design in a technical interview.

## Repository layout

- `backend/` contains the complete Express, TypeScript, Prisma, and PostgreSQL
  backend. Run npm and Prisma commands from this directory.
- `frontend/` contains the Next.js design foundation, generic primitives, domain
  components, and Phase 4 student dashboard. It uses local data, not backend APIs.
- `docs/` contains repository-level architecture, API, setup, decision, and learning
  documentation.

Backend source paths in this guide therefore begin with `backend/src/`, and the
database schema lives at `backend/prisma/schema.prisma`.

## Frontend Design Foundation — Phase 1

Phase 1 established an independently runnable Next.js foundation for brand, fonts,
responsive layout, and accessibility defaults. Later phases add controls and the
dashboard described below. The Express backend is still a separate package.

### How the page is assembled

`frontend/app/layout.tsx` exports `RootLayout`, the shared HTML/body wrapper, and
metadata. It sets `lang="en"`, loads both fonts, imports `app/globals.css`, and adds a
skip link. `frontend/app/page.tsx` exports `HomePage` for `/`. These remain Server
Components; HomePage now renders the client-side `StudentDashboard` composition.

The old placeholder's `app/page.module.css` was retired in Phase 4; dashboard and
layout CSS Modules now own page-specific rules. Global
CSS follows one path: `app/globals.css` imports `styles/tokens.css`, then
`styles/base.css`. The base stylesheet sets box sizing, body type/background,
headings, links, focus, selection, scrollbar colors, and accessibility overrides.

### What a design token does

A token is a named design decision. For example, `--color-canvas` refers to the
locked pale-green background and `--space-6` is 1.5rem. Page CSS consumes
`var(--color-canvas)` or `var(--space-6)` instead of choosing its own values. Changing
the shared token updates its consumers together. CSS Modules prevent local class
names from colliding; they still share the same global CSS variables.

The runtime owner is `frontend/styles/tokens.css`. It defines brand, neutral,
semantic, chart, typography, spacing, radius, shadow, focus, motion, scrollbar, and
layout tokens. Semantic success/error hues are separate from decorative brand
accents. Chart tokens now supply the Phase 4 readiness/distribution visualization.

### Font loading and typography

`Inter` and `Felipa` are imported from `next/font/google` in `RootLayout`. Next
downloads font files at build time and serves them locally. The root font variables
feed `--font-body` and `--font-decorative` in the token stylesheet. Inter is used for
all UI text. Only `.brandNote` in `components/dashboard/dashboard.module.css` uses Felipa, for the short
decorative line. The fonts use `display: swap` so readable fallback text can appear
while the font finishes loading.

### Responsive and accessible defaults

The page uses natural document scrolling. Gutters are
16px on mobile, 24px from 48rem, and 32px from 64rem; dashboard content is bounded by
the 90rem content token. Fluid headings wrap within the available width. There is no hidden overflow
to conceal layout mistakes.

The skip link takes keyboard users directly to `main#main-content`, avoiding the
header. `:focus-visible` gives keyboard focus a 3px outline. Reduced-motion settings
suppress animations/transitions; forced colors preserve a system-colored outline.
Color accents are decorative, so no instruction depends only on pink or yellow.
These defaults support accessibility, but future interactive components will need
their own labels, keyboard behavior, state handling, and contrast checks.

### Running and explaining the foundation

From `frontend/`, use `npm install`, `npm run dev` (port 3001), `npm run lint`,
`npm run typecheck`, and `npm run build`. Typechecking first generates Next route
types. A production browser check is `npm run test:e2e` after building and installing
Chromium with `npx playwright install chromium`.

`frontend/e2e/foundation.spec.ts` checks real fonts, rendered colors, layout width,
skip focus, console errors, reduced motion, and forced colors. It does not test
backend integration because none is implemented. `frontend/DESIGN.md` preserves
intent; `docs/design-system.md` is the detailed token and usage reference.

Interview answer: “I separated the frontend package from Express, used App Router
Server Components for the initial static shell, and centralized design decisions in
CSS variables. CSS Modules consume those tokens without leaking local styles. I
verified the production page at mobile, tablet, and desktop widths, including font
loading and keyboard accessibility, before building reusable product components.”

## Core UI Primitives — Phase 2

### Beginner mental model

A primitive is a reusable building block: a button knows how an action looks and
behaves, not what the action means for SkillBridge. These blocks live in
`frontend/components/ui/` and are exported by `index.ts`. Phase 3 composes them in
`frontend/components/skillbridge/`; Phase 4 composes these into the public dashboard.

The layer contains Button/IconButton, Input/Textarea/Select, Checkbox, RadioGroup,
Badge, Card compositions, ProgressBar, Avatar, Skeleton, EmptyState, and ErrorState.
They accept content and callbacks rather than calling APIs or choosing destinations.

### How interactions and accessibility are shared

`button.tsx` exports `Button`, a real HTML button. It defaults to `type="button"`
so placing it in a future form does not accidentally submit. Callers can opt into
submit/reset. Primary/secondary/outline/ghost/destructive are visual variants;
sm/md/lg change density. `loading` sets native disabled and `aria-busy`; the visible
text/spinner overlaps the reserved content footprint so nearby controls do not jump.
Disabled buttons also have dashed borders and a noninteractive cursor. `IconButton`
delegates to Button and requires a textual `label` even though it displays an icon.

`field.tsx` exports internal helpers `useField`, `FieldLabel`, and `FieldMessages`.
`useField` takes a supplied ID or creates one with React `useId`, then derives help
and error IDs. Input, Textarea, Select, Checkbox, and RadioGroup share that wiring.
Labels point at native controls; `aria-describedby` connects help/error text. Errors
include text and `aria-invalid`, not just a red border. IDs stay stable across
rerenders/hydration; random IDs would break this. Caller descriptions are preserved,
and stale error relationships disappear when the error is removed.

Native controls provide keyboard behavior we do not reinvent: Space toggles a
checkbox; same-name radio inputs support arrows; fieldset/legend names the group;
select supplies its platform popup. The Select wrapper does not pretend to control
OS popup geometry. Textarea resizes vertically without widening the layout.
React 19 refs reach the actual native control for future focus management.
Controlled fields get value/onChange from their parent; uncontrolled fields use
defaultValue/defaultChecked. The wrappers do not own schemas or submission logic.

### Display and feedback without business meaning

`badge.tsx` renders caller-supplied metadata in six tones, without mapping application
statuses. `card.tsx` exports Card/Header/Title/Description/Content/Footer: a flat,
bordered composition, not a clickable div. CardTitle supports h2/h3/h4 to preserve
the consuming page's heading hierarchy.

`progress-bar.tsx` renders labelled native progress with value/min/max (0–100 by
default). It clamps values to bounds and rejects nonfinite/invalid ranges. ARIA
exposes the actual range; visible text shows percentage. It does not know readiness
terminology. `avatar.tsx` reserves image space, shows supplied/derived initials on
failure, and resets failure state when src changes. An empty alt marks it decorative
when adjacent text already supplies the identity.

`feedback.tsx` provides EmptyState/ErrorState with optional real actions and chosen
heading levels. Error announcements are opt-in. Skeleton is decorative; its owner
provides an accessible busy-region description, and reduced motion makes it static.

### Styling and verification

CSS Modules consume `styles/tokens.css`: purple emphasis, semantic error tones,
strong control borders, and existing spacing/radius/focus values. Felipa is never
used in primitives. There are no raw brand-color copies or inline visual styles.
ESLint restricts domain/page/backend imports into the generic UI layer.

`components/ui/button.test.tsx`, `fields.test.tsx`, and `display.test.tsx` test real
behavior with Vitest/Testing Library. `e2e/primitives.spec.ts` uses Chromium and axe
for keyboard actions, rendered states/contrast, responsiveness, and reduced motion.
The fixture in `test/fixtures/` is outside Next routing; it reuses production fonts
and is not `/design` or a shipped product screen. From `frontend/`, `npm test` runs
component tests; after `npm run build`, `npm run test:e2e` starts the test servers
and includes the existing foundation/contrast checks.

### Interview: Why build primitives separately from domain components?

“Generic primitives solve reusable interaction and visual problems: how a button
disables, how a field announces an error, and how a card is spaced. Domain
components compose them with SkillBridge-specific meaning. That keeps business
concepts out of the reusable UI layer, makes accessibility fixes apply consistently,
and lets domain behavior evolve without duplicating controls.”

## SkillBridge Domain Components — Phase 3

### Beginner mental model: building blocks with product meaning

A UI primitive is useful in many products: Card is a surface; Badge is labelled
metadata; Button is an accessible action. A **domain component** combines those
blocks into something meaningful in this product, such as an opportunity or a
candidate. The domain layer lives in `frontend/components/skillbridge/` and exports
its public components and props from `index.ts`.

For example, `OpportunityCard` in `opportunity-card.tsx` composes:

```text
Card + Badge + SkillChip + MatchScore + Button (or a real link)
  → OpportunityCard
```

The Card family owns surface, heading, content and footer structure. SkillChip adds
skill/proficiency/verification text to Badge. MatchScore gives a number its match
label. `DomainActionControl` in `domain-action.tsx` renders the caller's Button
callback or link. The surrounding card is never a clickable div, so keyboard users
can find a real, explicitly named action.

### What actually exists

Every path below is relative to `frontend/components/skillbridge/`:

- `skill-chip.tsx`: `SkillChip` combines a compact Badge and optional IconButton.
  “Git · Advanced · Verified” is meaningful without color. Removal is named
  “Remove Git”; the parent owns removal state and focus after an item disappears.
- `match-score.tsx`: `MatchScore` displays a percentage and semantic Badge; large
  mode adds ProgressBar. `presentation.ts` contains `percentage` (finite input,
  clamp 0–100) and `matchPresentation` (≥90 Excellent, ≥75 Strong, ≥60 Moderate,
  otherwise Low). 89.9 is Strong, not rounded to Excellent.
- `application-status-badge.tsx`: `ApplicationStatusBadge` maps the seven closed
  status values to human labels and Badge tones. A rejected application is neutral,
  not a system error. Rendering SELECTED does not perform any selection operation.
- `opportunity-card.tsx`: `OpportunityCard` displays company, title, location,
  work mode, stipend, duration, deadline, required skills, score, state, and action.
- `skill-progress.tsx`: `SkillProgress` labels current and optional target values.
  Connected decorative dots form the skill-pathway motif; supplied percentage uses
  the generic ProgressBar. It does not assume “Intermediate” means a certain percent.
- `profile-completion.tsx`: `ProfileCompletion` combines supplied percentage/counts
  and optional next action. Its ProgressBar exposes “75%; 6 of 8 items complete”.
- `dashboard-stat-card.tsx`: `DashboardStatCard` shows a label/value pair using a
  description list, optional context, and optional decorative icon/accent. Having
  a stat card does not implement an analytics backend; Phase 4 supplies local values.
- `skill-gap-card.tsx`: `SkillGapCard` uses ProgressBar and separately labelled
  strong/missing SkillChip lists. Empty lists get honest “No … supplied” text.
- `learning-recommendation-card.tsx`: `LearningRecommendationCard` renders a skill,
  resource title, difficulty, explicit priority, optional effort, and real action.
  No external learning integration or recommendation engine exists.
- `candidate-match-row.tsx`: `CandidateMatchRow` composes Avatar, identity/education
  summary, top skills, match, status, and a contextual action such as “View profile
  — Asha Patel”. It stacks on narrow screens without clipping important text.
- `deadline-item.tsx`: `DeadlineItem` displays a semantic time element and explicit
  Upcoming/Due soon/Overdue text. The caller supplies `{ dateTime, label }` and
  urgency; it does not read the clock or silently shift time zones during hydration.

### Presentation is not calculation or data fetching

MatchScore receives `score={92}`. It knows how to present “92% — Excellent Match”,
not how to compare a student with an opportunity. The future matching algorithm
must account for business rules and data; putting it inside a visual component
would couple those rules to every render and make backend/frontend results diverge.
The only calculation here is display classification, not a matching algorithm.

The same principle applies to readiness, profile counts, skill gaps and priorities.
Parents pass already calculated, consistent data through typed props. A future page
can change its data source without rewriting the cards, and tests can render exact
edge cases without a database, network, or login. TypeScript catches wrong prop
shapes at development time; it does not validate untrusted API responses at runtime.

`DomainAction` allows either `href` or `onClick`, never both. Callback actions reuse
Button's loading/disabled behavior; links use native anchor semantics and shared
focus/hover styles. The parent controls pending state, success/error feedback,
navigation policy, and permissions. Client callbacks belong in a Next Client
Component; the domain renderers add no independent state or requests.

### Styling, accessibility, and tests

`domain.module.css` consumes the existing tokens and adds only domain composition:
wrapping skill lists, metadata layout, candidate reflow, and restrained pathway
markers. It never copies the Button/Badge/Card/Progress recipes or introduces raw
brand hex values. Inter remains the product font. Full long titles and skills wrap;
they are not removed behind ellipses. Text supplies meaning independently of color.
Headed components accept h2/h3/h4 to fit the parent section's hierarchy.

`presentation.test.tsx` tests score boundaries and all status mappings.
`composition.test.tsx` tests real primitive composition, content/actions, accessible
progress values, empty skill groups, priority labels, and keyboard activation.
`frontend/test/fixtures/domain.tsx` supplies representative local examples to the
existing isolated fixture; `frontend/e2e/domain.spec.ts` verifies browser layout,
axe/contrast, focus, native links, loading, and forced-color/reduced-motion reflow.
These domain tests do not prove API integration or a real matching algorithm.
Separate Phase 4 tests now verify dashboard composition and local interactions.

### Interview: How did you structure your frontend component system?

“I separated three responsibilities: tokens, generic primitives, and product-specific
compositions. `styles/tokens.css` owns visual values. `components/ui/` owns reusable
semantics and interactions such as Button, Card, Badge, and ProgressBar.
`components/skillbridge/` composes those into OpportunityCard, CandidateMatchRow,
SkillGapCard, and other domain displays. They take typed, already calculated data
and caller-owned actions, rather than fetching or implementing business algorithms.
For example, MatchScore classifies a supplied score for display, but never computes
the match. This makes the domain components independently testable and lets shared
accessibility fixes propagate through one primitive. Phase 4 pages compose these
components; API integration is still deferred.”

## Student Dashboard Composition — Phase 4

### Beginner mental model: a page arranges existing building blocks

The dashboard is a composition, not another design system:

`tokens → UI primitives → SkillBridge domain components → page composition`

`frontend/app/page.tsx` exports `HomePage` and its page title, then renders
`StudentDashboard` from `frontend/components/dashboard/student-dashboard.tsx`.
`StudentDashboard` is a Client Component because search and previews need browser
state; Next still prerenders its initial HTML. It passes the search field and
student summary into `DashboardShell` in `frontend/layout/dashboard-shell.tsx`.
RootLayout still owns fonts, global styles, and the skip link to `main-content`.

### Code map and composition

- `dashboard-data.ts` holds typed snapshot data: metrics, six skills, three fictional
  opportunities, four learning resources, four recent applications, and deadlines.
  Its opportunity/learning types derive from domain props instead of duplicating
  their interfaces. Display dates and urgency are fixed to 23 September 2026.
- `StudentDashboard` uses DashboardStatCard, SkillProgress, SkillGapCard,
  ProfileCompletion, ApplicationStatusBadge, DeadlineItem, and the Card family.
  It groups applications in a semantic list, without inventing a second table system.
- `RecommendationsSection` in `recommendations-section.tsx` renders OpportunityCard;
  that existing domain owner composes Card + Badge + SkillChip + MatchScore + Button.
- `LearningSection` in `learning-section.tsx` renders LearningRecommendationCard.
- `SamplePreview` in `sample-preview.tsx` displays inline details/topic lists. It
  focuses its heading on opening and returns focus to the action on close. It is
  not a modal, real job-detail route, application submission, or course integration.
- `MatchOverview` in `match-overview.tsx` renders the readiness/distribution chart.

### Why data is local and APIs are intentionally deferred

This phase tests page composition independently of authentication, loading policy,
backend contracts, and network failures. The page explicitly says Design preview
and Representative local data. The numbers are examples, not computed skill scores.
There are no fetch calls, fake request delays, credentials, or global state stores.
Future integration can adapt validated server data into the existing typed display
props without replacing Button, OpportunityCard, or MatchScore.

Search is a real but limited local interaction: `StudentDashboard.search` trims the
draft and filters company/title/skill text case-insensitively after form submission.
`clearSearch` resets it and focuses Input. IME composition is guarded. Draft and
committed query are separate `useState` values; results/previews reset on a fresh
page load rather than pretending to be persisted search. Submitting focuses the
results group; no-results feedback offers a real local reset action.

Only Dashboard is linked (`aria-current="page"`). Other navigation items say
Coming soon and are not links to nonexistent pages. Notifications are disabled
with a visible explanation. Profile editing and authentication UI do not exist.

### Responsive layout and keyboard behavior

`dashboard-shell.module.css` owns the 240px sidebar and header. Below 64rem, a named
IconButton opens an in-flow navigation disclosure. `DashboardShell` uses
`aria-expanded`/`aria-controls`, focuses its Dashboard link, handles Escape, restores
trigger focus, and resets the disclosure on a desktop resize. It is nonmodal, so
the rest of the page is not trapped or hidden. The browser tests verify this behavior.

`dashboard.module.css` owns a 12-column main grid. At 80rem, insight/application
sections split 7/5, learning/pathway split 8/4, and opportunities use three columns.
Tablet layouts reduce complexity; metrics and learning cards use two columns from
48rem. Mobile stacks sections with at least 16px gutters; desktop gutters are 32px.
Cards and full titles wrap naturally, rather than clipping important data or hiding
horizontal overflow. Page CSS consumes tokens; it does not restyle shared controls.

### Chart accessibility and alternate states

The trend uses a small SVG polyline and point markers, not a chart library. Its
accessible name lists all checkpoints. The same dates/percentages appear as HTML
text with a visible summary: 56% to 78%, up 22 percentage points. Each distribution
bar has an adjacent label, score range, count, and percentage; the bar itself is
decorative. Color supports meaning but never carries it alone. Forced colors use
system colors. Plot geometry is presentation, not a matching algorithm.

`RecommendationsSection` accepts `state` values ready/loading/empty/error. Loading
uses Skeleton and a labelled busy region; EmptyState explains absence; ErrorState
can restore local samples. `frontend/test/fixtures/dashboard-states.tsx` exposes
these variants outside production routing. There is no fake asynchronous request.

### Tests and interview explanation

`dashboard.test.tsx` tests major sections, statuses, navigation semantics, menu focus,
search/reset/IME protection, sample details, textual chart meaning, and alternate
states. `frontend/e2e/dashboard.spec.ts` covers Chromium at 390/768/1024/1440px,
overflow, keyboard/resize behavior, local actions, browser errors, no API requests,
and axe. Existing font, contrast, primitive, and domain browser checks remain.
These checks do not certify every browser or replace manual screen-reader testing.

Q: How did you keep the dashboard maintainable as it became more complex?

“I kept the direction tokens → primitives → domain components → page composition.
DashboardShell owns responsive navigation, StudentDashboard arranges sections,
RecommendationsSection and LearningSection own their local previews, and typed
fixtures live outside JSX. Shared controls still own interaction/accessibility;
domain cards still own product display rules. The page does not duplicate either
layer or run matching logic. Small behavior tests and responsive browser checks
let me verify each responsibility independently before connecting backend data.”

## Authentication and Role-Based Authorization

### Beginner mental model

Authentication answers **“Who is making this request?”** Authorization answers
**“Is that user allowed to do this?”**

In SkillBridge:

1. Registration creates an account and the matching student or recruiter profile.
2. Login checks the password and returns an access token.
3. A protected request sends that token in the `Authorization` header.
4. The server verifies the token, reads the User ID, and reloads the User from
   PostgreSQL.
5. Role middleware can then decide whether the current STUDENT, RECRUITER, or ADMIN
   may access a route.

The access token proves that the server issued a valid, unexpired credential for a
User ID. It does not replace the database, and it does not make an embedded role
authoritative.

### Authentication code map

| Responsibility | Actual code |
| --- | --- |
| Mount `/api/auth` | `backend/src/routes/index.ts` — `createApiRouter` |
| Define register, login, and current-user routes | `backend/src/routes/auth.routes.ts` — `createAuthRouter` |
| Parse body/query/params with Zod | `backend/src/middleware/validate-request.ts` — `validateRequest` |
| Define registration and login schemas | `backend/src/validators/auth.validator.ts` |
| Translate HTTP input/output | `backend/src/controllers/auth.controller.ts` — `register`, `createLogin`, `currentUser` |
| Register, log in, and load the current user | `backend/src/services/auth.service.ts` — `registerUser`, `login`, `getCurrentUser` |
| Hash and compare passwords | `backend/src/utils/password.ts` — `hashPassword`, `verifyPassword` |
| Create and verify JWTs | `backend/src/utils/token.ts` — `createAccessToken`, `verifyAccessToken` |
| Authenticate a protected request | `backend/src/middleware/authenticate.ts` — `createAuthenticate` |
| Enforce allowed roles | `backend/src/middleware/require-role.ts` — `requireRole` |
| Type the authenticated context | `backend/src/types/auth.ts` — `AuthenticatedUser`, `AuthLocals`, `OptionalAuthLocals` |
| Produce consistent errors | `backend/src/utils/app-error.ts` and `backend/src/middleware/error-handler.ts` |

### Registration flow: `POST /api/auth/register`

The route is declared in `createAuthRouter`:

```text
POST /api/auth/register
  -> validateRequest(registerRequestSchema, register)
  -> register controller
  -> registerUser service
  -> hashPassword
  -> Prisma transaction
  -> User + StudentProfile or RecruiterProfile
```

Step by step:

1. `backend/src/app.ts` mounts the root API router at `/api`.
2. `createApiRouter` in `backend/src/routes/index.ts` mounts `createAuthRouter(config)` at
   `/auth`.
3. `createAuthRouter` passes the request through
   `validateRequest(registerRequestSchema, register)`.
4. `registerRequestSchema` in `backend/src/validators/auth.validator.ts` parses a
   discriminated union based on `role`:
   - STUDENT requires `university`, `degree`, and `graduationYear`.
   - RECRUITER requires `company` and `designation`.
   - ADMIN is not a valid public registration variant.
5. The validator trims names/profile strings and trims plus lowercases email. It
   leaves the password text unchanged, requires at least eight characters, and
   rejects passwords above 72 UTF-8 bytes.
6. `validateRequest` gives the controller the parsed `validated.body`; it does not
   overwrite `req.body`.
7. The `register` controller calls `registerUser(validated.body)`.
8. `registerUser` calls `hashPassword(input.password)` before opening a transaction.
9. Inside `prisma.$transaction`, it uses the callback's `transaction` client to
   create the `User`, followed by either `transaction.studentProfile.create` or
   `transaction.recruiterProfile.create`.
10. Explicit Prisma selections (`safeUserSelect`, `studentProfileSelect`, and
    `recruiterProfileSelect`) control the returned fields. `passwordHash` is not in
    the response.
11. The controller returns HTTP 201 with `{ user, profile }`. It does not return an
    access token.

A Prisma `P2002` unique-constraint failure is translated to
`409 EMAIL_ALREADY_EXISTS` by `registerUser`.

#### Why registration does not return a JWT

Registration and login are intentionally separate operations. Registration proves
that valid account data could be stored; login is the operation that verifies stored
credentials and issues an access token. The client therefore registers first and
then calls `POST /api/auth/login`.

This gives the API a clear contract: only `login` calls `createAccessToken`. It also
keeps token issuance outside the registration transaction and prevents account
creation from silently becoming an authenticated session.

### Password storage and bcrypt

#### Hashing is not encryption

Encryption is designed to be reversible when someone has the decryption key.
Password hashing is designed to be one-way: the application stores a derived hash,
not the original password, and checks a future password against that hash.

`hashPassword` in `backend/src/utils/password.ts` calls:

```ts
bcrypt.hash(password, 12)
```

The database stores the result in `User.passwordHash`. The plaintext password is
never placed in Prisma data and is never returned by an API response. During login,
`verifyPassword` calls `bcrypt.compare(password, passwordHash)`.

#### Why cost factor 12?

Bcrypt's cost factor controls how much work hashing requires. Cost 12 means bcrypt
uses `2^12` internal work rounds. Deliberately expensive password checks make
large-scale password guessing more costly, while remaining usable for normal login
traffic. Increasing the cost improves resistance to guessing but also increases CPU
time, so it is an operational tradeoff rather than a value to raise without testing.

#### Why the 72-byte limit matters

Bcrypt processes only its first 72 input bytes. Bytes are not the same as JavaScript
characters: an emoji can require several UTF-8 bytes. `withinBcryptLimit` therefore
uses `Buffer.byteLength(password, "utf8") <= 72` for both registration and login.
This prevents two visually different overlong passwords from being treated as the
same truncated bcrypt input.

### Login flow: `POST /api/auth/login`

```text
POST /api/auth/login
  -> validateRequest(loginRequestSchema, createLogin(config))
  -> loginController
  -> login service
  -> User lookup by normalized email
  -> bcrypt.compare
  -> createAccessToken with jose
  -> access-token response
```

Step by step:

1. `loginRequestSchema` trims and lowercases the email through
   `normalizedEmailSchema`. The service can therefore assume its email input is
   normalized.
2. The supplied password is not trimmed. It is treated as exact credential input
   and is limited to 72 UTF-8 bytes.
3. `createLogin(config)` creates `loginController`, which calls
   `login(validated.body, config)`.
4. `login` queries `getPrisma().user.findUnique({ where: { email } })` using
   `loginUserSelect`. This selection temporarily includes `passwordHash` because it
   is needed for comparison.
5. `verifyPassword` calls `bcrypt.compare` with the supplied password and stored
   hash.
6. A missing user and an incorrect password both produce the same
   `401 INVALID_CREDENTIALS` response. This avoids using the login response to tell
   clients whether a particular email exists.
7. On success, the service removes `passwordHash` from the returned user object and
   calls `createAccessToken(user.id, config)`.
8. The response contains `accessToken`, `tokenType: "Bearer"`, the configured
   `expiresIn`, and safe User fields.

### JWT from first principles

A JSON Web Token is a compact string with three Base64URL-encoded parts separated
by dots:

```text
header.payload.signature
```

Base64URL encoding is not encryption. Anyone holding a JWT can decode its header and
payload. Security comes from the signature, so secrets must never be placed in the
payload.

#### 1. Header

The header describes how the token is signed. `createAccessToken` uses
`{ "alg": "HS256" }`. HS256 uses the same server secret to create and verify the
signature.

#### 2. Payload

The payload contains claims—statements about the token:

| Claim | Meaning in SkillBridge |
| --- | --- |
| `sub` | Subject: the User UUID. `verifyAccessToken` also validates that it is a UUID. |
| `iat` | Issued at: when the server created the token. |
| `exp` | Expiration: after this time the token is rejected. |
| `iss` | Issuer: fixed to `skillbridge-api`. |
| `aud` | Audience: fixed to `skillbridge-api`. |

`JWT_EXPIRES_IN` controls `exp`, while `JWT_SECRET` supplies the HS256 signing key.
`backend/src/config/env.ts` requires the secret to contain at least 32 UTF-8 bytes and limits
duration syntax to positive minute, hour, or day values such as `15m`, `1h`, or
`1d`.

#### 3. Signature

The signature lets the server detect changes to the header or payload and verify
that the token was signed with the configured secret. `verifyAccessToken` uses
`jose.jwtVerify` and requires HS256 plus the expected issuer and audience. An altered,
expired, incorrectly signed, or otherwise invalid token becomes
`401 INVALID_TOKEN`.

#### Why role is not authoritative token state

`createAccessToken` deliberately puts the User ID in `sub` but does not add role.
Roles can change, and users can be deleted, while a token is still unexpired. If
authorization trusted a role copied into the token, a demoted user could keep old
permissions until token expiry.

SkillBridge instead reloads the User from PostgreSQL for every protected request.
The role returned by that lookup is the role used by RBAC. Even if a token somehow
contains a stale `role` claim, `createAuthenticate` ignores it.

### Trace of an authenticated request

The implemented protected example is `GET /api/auth/me`:

```text
Authorization: Bearer <token>
  -> createAuthenticate(config)
  -> parse Bearer header
  -> verifyAccessToken(token, config)
  -> verify signature, expiry, issuer, audience, and UUID sub
  -> extract userId from sub
  -> PostgreSQL User lookup by primary key
  -> read current id and role
  -> response.locals.auth = { userId, role }
  -> currentUser controller
  -> getCurrentUser service
```

`createAuthenticate` in `backend/src/middleware/authenticate.ts` accepts exactly one Bearer
token, calls `verifyAccessToken`, and then performs:

```ts
getPrisma().user.findUnique({
  where: { id: userId },
  select: { id: true, role: true },
})
```

If the User exists, downstream code receives the current database identity through
`res.locals.auth`. If a valid token refers to a deleted User, the current explicit
API choice is `401 USER_NOT_FOUND`.

`GET /api/auth/me` then calls `getCurrentUser`. STUDENT must have a StudentProfile,
RECRUITER must have a RecruiterProfile, and ADMIN receives `profile: null`. A missing
required role profile is treated as an internal data-integrity failure and is hidden
behind the generic `500 INTERNAL_SERVER_ERROR` response.

### Why PostgreSQL is queried on every protected request

The token establishes a signed User ID, but PostgreSQL is the source of truth for
whether that User still exists and which role the User currently has.

Benefits:

- deleting a User invalidates their access on the next request;
- changing a role changes authorization on the next request;
- RBAC never depends on stale token role data.

Cost:

- every authenticated request performs one indexed lookup on the User primary key;
- database availability and latency are therefore part of authenticated-request
  availability and latency.

This is a deliberate consistency-over-throughput choice for the current stage. No
Redis or authentication cache is implemented.

### Authentication versus authorization

Authentication identifies the caller. In SkillBridge, `createAuthenticate(config)`
verifies the Bearer token, reloads the User, and creates the authenticated context.

Authorization decides what that authenticated caller may do. In SkillBridge,
`requireRole(...roles)` checks the current database role in `res.locals.auth`.

Example route composition for a future recruiter-only endpoint would be:

```ts
router.post(
  "/opportunities",
  createAuthenticate(config),
  requireRole(UserRole.RECRUITER),
  createOpportunity,
);
```

The first middleware answers “which current user is this?” The second answers “is
the current role RECRUITER?” The example is explanatory only; opportunity routes are
not implemented yet.

### How `requireRole(...roles)` works

`requireRole` is defined in `backend/src/middleware/require-role.ts`. It accepts one or more
allowed `UserRole` values and returns `authorizeRole` middleware.

1. It reads `response.locals.auth`.
2. If authentication context is absent, it throws
   `401 AUTHENTICATION_REQUIRED`.
3. If `auth.role` is not in `allowedRoles`, it throws `403 FORBIDDEN`.
4. Otherwise it calls `next()`.

It does not parse JWTs, query the database, or trust a role claim. Those are the
authentication middleware's responsibilities. No current business-feature route
uses `requireRole` yet; it is implemented and tested as reusable infrastructure.

### Understanding the main 401 and 403 responses

| Response | Meaning | Example |
| --- | --- | --- |
| `401 AUTHENTICATION_REQUIRED` | The request did not present usable Bearer credentials. | Missing header, `Basic ...`, or malformed `Bearer` header. |
| `401 INVALID_TOKEN` | A token was presented, but token verification failed. | Bad signature, expired token, wrong issuer/audience, or invalid/missing UUID `sub`. |
| `403 FORBIDDEN` | Authentication succeeded, but the current role is not allowed. | A STUDENT calls a recruiter-only route. |

The key distinction is that 401 means the server cannot accept the caller's
authentication, while 403 means the caller is authenticated but lacks permission.
SkillBridge also uses `401 USER_NOT_FOUND` when a valid token's User has since been
deleted.

### Typed `res.locals.auth`

`backend/src/types/auth.ts` defines:

```ts
interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

interface AuthLocals {
  auth: AuthenticatedUser;
}
```

`OptionalAuthLocals` represents middleware stages where `auth` may not yet exist.
After authentication, protected controllers such as `currentUser` declare
`Response<unknown, AuthLocals>`, so TypeScript knows that `response.locals.auth`
contains a User ID and role.

`res.locals` was chosen because Express already provides it as request-scoped data
for middleware and handlers. It avoids mutating `req`, globally augmenting Express's
`Request` interface, adding an application-specific `req.user`, or repeatedly using
unsafe casts. Each request receives its own response-local object.

### Registration transaction and failure behavior

Conceptually, `registerUser` performs:

```text
hash password before transaction

BEGIN
  INSERT User
  INSERT StudentProfile or RecruiterProfile
COMMIT
```

Both inserts use the transaction client passed into the interactive
`prisma.$transaction` callback. If profile creation throws, the callback rejects and
Prisma does not commit the transaction; PostgreSQL transaction semantics are
expected to roll back the User insert as well. The error propagates to centralized
error handling.

Hashing happens before `BEGIN` because bcrypt is CPU work, not database work. Keeping
it outside avoids holding a database transaction open while the password is hashed.
JWT creation is not part of registration at all.

### What the tests prove—and what they do not

The mocked persistence tests in `backend/src/services/auth.service.test.ts` prove that:

- `registerUser` calls `prisma.$transaction`;
- User and profile writes use the callback transaction client;
- Prisma receives a bcrypt hash rather than a plaintext password;
- a profile-write rejection propagates out of the service;
- a `P2002` failure maps to `EMAIL_ALREADY_EXISTS`.

They do **not** prove physical PostgreSQL rollback: specifically, they do not show
that a real server executes `ROLLBACK` or that no row remains after an actual
database failure. The mock runs a JavaScript callback with fake methods; it is not a
database transaction engine.

A real rollback test would need a disposable PostgreSQL database, run the real Prisma
transaction, deliberately fail after the User insert, and then query the database to
confirm that the User row does not exist. That integration test is not currently in
the repository.

Other auth tests use real bcrypt and `jose` behavior while mocking Prisma at the
persistence boundary:

- `backend/src/auth.test.ts` tests register/login/me HTTP contracts.
- `backend/src/middleware/authenticate.test.ts` tests Bearer parsing, token failures, deleted
  users, and database-role freshness.
- `backend/src/middleware/require-role.test.ts` tests single-role and multi-role access.
- `backend/src/utils/password.test.ts` tests real bcrypt hashing and comparison.
- `backend/src/utils/token.test.ts` tests real JWT creation and verification.

## Interview-Level Questions and Concise Answers

### How does authentication work?

Login normalizes the email, loads the User, checks the supplied password with
`bcrypt.compare`, and issues an HS256 JWT whose `sub` is the User UUID. On every
protected request, `createAuthenticate` verifies the token and reloads the current
User ID and role from PostgreSQL into `res.locals.auth`.

### Why JWT?

JWT gives the API a compact, signed Bearer credential with standard expiry, issuer,
audience, and subject claims. It fits the current stateless access-token requirement
without server sessions. SkillBridge still performs a database lookup because role
freshness and deleted-user enforcement are more important here than eliminating that
lookup.

### Why not store role in the JWT?

Roles can change before a token expires. Trusting a token role would delay demotions
or promotions until token expiry. SkillBridge omits authoritative role state and
uses the role read from PostgreSQL on each authenticated request.

### Why bcrypt?

Bcrypt is a purpose-built, salted password hashing algorithm with an adjustable work
factor. SkillBridge uses cost 12, stores only the hash, compares with
`bcrypt.compare`, and enforces the algorithm's 72-byte input limit using UTF-8 byte
length.

### Authentication versus authorization?

Authentication establishes identity; authorization checks permission. In this code,
`createAuthenticate` establishes `{ userId, role }`, and `requireRole(...roles)`
decides whether that current role may continue.

### Where did you use transactions?

`registerUser` in `backend/src/services/auth.service.ts` uses an interactive Prisma
transaction to create the User and the matching StudentProfile or RecruiterProfile as
one unit. Password hashing happens before the transaction.

### Why does every authenticated request query PostgreSQL?

It makes deletion and role changes effective on the next request. The tradeoff is
one indexed User lookup per protected request and a dependency on database latency
and availability.

### Why can't users register as ADMIN?

The public Zod registration union contains only STUDENT and RECRUITER. Allowing
clients to choose ADMIN would let them self-assign privileged access. Admin accounts
must come from a seed or a future privileged provisioning process.

### Why `res.locals` instead of `req.user`?

`res.locals` is already request-scoped in Express and can be typed per protected
controller. It avoids mutating the request object, global Express type augmentation,
and unsafe casts while keeping authentication context available to downstream
middleware and controllers.

## Things I Should Be Able to Explain Without Notes

- [ ] Trace HomePage → StudentDashboard → DashboardShell and domain sections.
- [ ] Explain local fixture data, deferred APIs, and transient search/preview state.
- [ ] Explain the 12-column grid, responsive sidebar/disclosure, and focus restoration.
- [ ] Explain chart text equivalents and why SVG plotting is not matching logic.
- [ ] Demonstrate loading/empty/error fixture states without fake network requests.
- [ ] Explain how tokens → primitives → domain components → page composition prevents one-off styling.
- [ ] Explain the roles of `RootLayout`, `HomePage`, CSS Modules, and global styles.
- [ ] Explain why primitives and domain components belong in separate layers.
- [ ] Trace Card + Badge + SkillChip + MatchScore + Button into OpportunityCard.
- [ ] Explain why MatchScore presents calculated data rather than running matching logic.
- [ ] Explain typed domain props, caller-owned actions, dates/urgency, and pending state.
- [ ] Explain how domain separation improves maintainability and independent testing.
- [ ] Explain textual score/status meaning, contextual action names, and responsive wrapping.
- [ ] Trace `useField` IDs, label association, help/error wiring, and error cleanup.
- [ ] Explain native choice/Select semantics and controlled versus uncontrolled fields.
- [ ] Explain Button loading geometry, native disabled behavior, and IconButton naming.
- [ ] Explain what component tests, axe, and fixture browser checks do and do not prove.
- [ ] Trace a design token from `frontend/styles/tokens.css` to the rendered page.
- [ ] Explain how `next/font` serves Inter/Felipa and why their roles are different.
- [ ] Explain skip navigation, focus-visible, reduced motion, and forced colors.
- [ ] Explain what Phase 1 browser checks cover and which features remain deferred.

- [ ] Trace `POST /api/auth/register` from route and Zod validation through
  `register`, `registerUser`, bcrypt, and the Prisma transaction.
- [ ] Explain why registration returns safe User/profile data but no JWT.
- [ ] Trace `POST /api/auth/login` through email normalization, User lookup,
  `bcrypt.compare`, `createAccessToken`, and the response.
- [ ] Explain hashing versus encryption and why plaintext passwords are never stored.
- [ ] Explain bcrypt cost 12 and why the 72-byte limit uses UTF-8 byte length.
- [ ] Describe a JWT's header, payload, and signature, and explain `sub`, `iat`,
  `exp`, `iss`, and `aud`.
- [ ] Explain why JWT payloads are readable and must not contain secrets.
- [ ] Explain why role is not authoritative token state in SkillBridge.
- [ ] Trace `Authorization: Bearer <token>` through `createAuthenticate`,
  `verifyAccessToken`, the User lookup, and `res.locals.auth`.
- [ ] Explain the benefit and cost of querying PostgreSQL on every protected request.
- [ ] Distinguish authentication from authorization with a SkillBridge example.
- [ ] Explain how `requireRole(...roles)` handles allowed, forbidden, and missing-auth
  cases.
- [ ] Distinguish `AUTHENTICATION_REQUIRED`, `INVALID_TOKEN`, and `FORBIDDEN`.
- [ ] Explain the explicit `USER_NOT_FOUND` behavior for a deleted token subject.
- [ ] Explain why typed `res.locals.auth` was chosen instead of `req.user`.
- [ ] Draw the registration `BEGIN -> User -> Profile -> COMMIT` transaction and
  explain the failure path.
- [ ] Explain what the mocked transaction tests prove and why a real PostgreSQL test
  is still required to prove physical rollback.
- [ ] Explain why public registration cannot create ADMIN users.
