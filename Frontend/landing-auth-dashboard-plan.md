# Landing, Staff Login, and Doctor Dashboard

**Date:** 18 November 2026  
**Source:** `Medikiosk/PRD.md` and the Stitch export `stitch_medikiosk_patient_intake_platform/code.html`

## Goal

Create the public MediKiosk entry screen and the two staff-facing routes: sign in and the doctor encounter dashboard. The landing page will follow the supplied Stitch design. Login and dashboard behavior must use the Node.js `/api/v1` BFF and must not grant access in the browser on their own.

## Design Reference

The Stitch page is a fixed-width marketing-style landing page for a kiosk product. It has:

- 80px fixed header with the MediKiosk mark, Home/How It Works/Features/About links, and Staff Login
- a split hero with introduction copy on the left and an ambulatory terminal questionnaire mockup on the right
- light teal and dark teal backgrounds, rounded cards, and Plus Jakarta Sans/Inter typography
- three benefit cards for guided intake, secure handling, and clinician review
- a three-step process section
- a platform capabilities grid
- a clinician workspace preview
- a final “Begin Patient Intake” banner
- a footer with Home, Features, Privacy, and Staff Login links

The implementation should use the approved Tailwind design tokens already present in the Stitch export. The React components should be responsive, but the desktop composition can stay close to the 1120px reference layout.

The landing copy currently says “HIPAA Compliant,” “Encrypted End-to-End,” and “legally binding” in some sections. Do not present those claims as implemented unless the team has verified the relevant architecture and policies. Keep them out of the first build unless they are replaced with approval-safe wording.

## Technical Context

- React 18+ with Vite
- JavaScript ES modules and JSX
- React Router
- Tailwind CSS or the existing design token values
- Shared BFF client in `src/api`
- React context for the doctor session
- Vitest, Testing Library, and Playwright

The frontend calls only the Backend BFF. Protected encounter data may be held in memory for the active doctor session, but it must not be written to `localStorage`, browser notifications, URLs, or service-worker caches. Static assets may be cached.

## Route Plan

| Route | Purpose |
|---|---|
| `/` | Stitch-based public landing page |
| `/intake` | Patient intake entry; initially a route placeholder if the intake flow is not yet implemented |
| `/staff/login` | Doctor sign-in |
| `/doctor` | Protected encounter dashboard |
| `/doctor/encounters/:id` | Protected encounter detail and review |

The landing header and footer Staff Login links navigate to `/staff/login`. The patient buttons navigate to `/intake`.

## Implementation

### 1. Landing Page

Map the existing Stitch sections to React components:

- `LandingHeader.jsx`
- `HeroSection.jsx`
- `BenefitsSection.jsx`
- `HowItWorksSection.jsx`
- `FeaturesSection.jsx`
- `ClinicianPreviewSection.jsx`
- `IntakeCtaSection.jsx`
- `LandingFooter.jsx`

Use the Stitch export as visual reference, including:

- fixed header at the top with a semi-transparent background
- primary text color `#00454a`
- secondary/accent color `#006b59`
- warm off-white surface `#f9f9f6`
- 24px and 32px spacing scales from the reference
- `Plus Jakarta Sans` for headings and `Inter` for body text
- Material Symbols icons

The patient mockup and clinician preview can use approved synthetic content. Do not add real names or clinical information.

**Requirements:** FR-01, FR-16, NFR-04, NFR-06

### 2. Shared Frontend Setup

Create the Vite app and route structure. Add `src/api/contracts.js` and `src/api/client.js` for the BFF. Keep the API client separate from React components and centralize:

- correlation IDs
- retry and timeout behavior
- idempotency keys for retryable writes
- 401, 403, 404, 409, and 5xx handling
- safe messages for the UI

Remove the use of the Stitch CDN Tailwind script once the React app has its local build setup.

**Requirements:** FR-08, FR-09, NFR-01, NFR-03

### 3. Staff Login

Build `/staff/login` as a focused form rather than another marketing screen.

The page should include:

- MediKiosk mark and return-to-home link
- email or staff ID field
- password field
- accessible validation messages
- pending and failed login states
- duplicate-submit protection
- expired-session and unauthorized messages
- successful redirect to `/doctor`

Login state belongs in `AuthContext.jsx` and the BFF calls belong in `authService.js`. Token or credential storage must follow the security design agreed by the Backend team.

**Requirements:** FR-08, FR-09, NFR-01, NFR-06

### 4. Protected Doctor Routes

Add a `ProtectedRoute` component for `/doctor` and `/doctor/encounters/:id`. A missing or expired session sends the user to `/staff/login` with a safe return location.

Route protection improves UX only. The Backend remains responsible for role and encounter-level authorization.

**Requirements:** FR-08, FR-09

### 5. Doctor Dashboard

Build `/doctor` with:

- compact staff header and navigation
- doctor name or staff label
- logout action
- encounter list
- search/filter controls only if returned in the API contract
- pagination or refresh controls
- loading, empty, network-error, forbidden, and retry states

The encounter cards should show only minimal permitted fields, for example encounter reference, submission time, and review status. Do not show information from a response unless the Backend has authorized access.

**Requirements:** FR-10, NFR-01, NFR-06

### 6. Encounter Detail

Build `/doctor/encounters/:id` using:

- `GET /api/v1/doctor/encounters/:id`
- `POST /api/v1/doctor/encounters/:id/review`

The detail screen should present questionnaire answers, questionnaire version, document metadata, document viewer access, processing status, and review status. A review action requires confirmation and handles server validation, conflict, unauthorized, forbidden, timeout, and success responses.

The UI must not calculate or send a workflow transition that the Backend cannot validate. The clinician remains the approver; no AI or draft can approve itself.

**Requirements:** FR-09, FR-10, FR-11, FR-12

### 7. Reset and Session Cleanup

Clear in-memory doctor session and encounter state on logout, inactivity timeout, completion, and explicit reset. Route public users back to `/` or a non-sensitive kiosk state.

No encounter, authentication, or patient response should enter persistent storage or static service-worker caches.

**Requirements:** FR-17, NFR-04

## Project Structure

```text
Frontend/
├── public/
│   ├── manifest.webmanifest
│   └── icons/
├── src/
│   ├── api/
│   │   ├── contracts.js
│   │   └── client.js
│   ├── auth/
│   │   ├── AuthContext.jsx
│   │   ├── authService.js
│   │   └── ProtectedRoute.jsx
│   ├── components/
│   │   ├── landing/
│   │   └── common/
│   ├── routes/
│   │   ├── LandingPage.jsx
│   │   ├── IntakeEntryPage.jsx
│   │   ├── auth/
│   │   │   └── DoctorLoginPage.jsx
│   │   └── doctor/
│   │       ├── DoctorDashboardPage.jsx
│   │       └── EncounterDetailPage.jsx
│   ├── state/reset.js
│   ├── styles/
│   ├── router.jsx
│   └── main.jsx
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Task Breakdown

### Phase 1 — App and Shared UI

- [ ] T001 [P] [Plan:1.1] Create the Vite React app and JavaScript route structure in `Frontend/src/router.jsx` and `Frontend/src/main.jsx`.
- [ ] T002 [P] [Plan:1.1] Move the Stitch colors, typography, spacing, radii, and responsive breakpoints into `Frontend/src/styles`.
- [ ] T003 [P] [Plan:1.1] Build reusable header, footer, button, card, alert, progress, and empty-state components under `Frontend/src/components/common` and `Frontend/src/components/landing`.
- [ ] T004 [Plan:2.1] Add BFF models and route constants for authentication, encounters, reviews, errors, and health in `Frontend/src/api/contracts.js`.
- [ ] T005 [Plan:2.1] Implement the shared BFF client in `Frontend/src/api/client.js`.

### Phase 2 — Public Landing

- [ ] T006 [P] [US1] [Plan:1.1] Convert the Stitch header and responsive navigation into `Frontend/src/components/landing/LandingHeader.jsx`.
- [ ] T007 [P] [US1] [Plan:1.1] Build the hero and terminal mockup in `Frontend/src/components/landing/HeroSection.jsx`.
- [ ] T008 [P] [US1] [Plan:1.1] Build the benefits, how-it-works, features, clinician preview, and CTA sections under `Frontend/src/components/landing`.
- [ ] T009 [US1] [Plan:1.1] Compose `/` in `Frontend/src/routes/LandingPage.jsx` and add `/intake` and `/staff/login` navigation.
- [ ] T010 [US1] [Plan:1.1] Build the landing footer in `Frontend/src/components/landing/LandingFooter.jsx`, without shipping unverified compliance claims.
- [ ] T011 [P] [US1] [Plan:1.1] Check landing behavior at desktop, tablet, and mobile widths and preserve keyboard focus and adequate touch targets.

### Phase 3 — Staff Authentication

- [ ] T012 [US2] [Plan:3.1] Implement doctor session state and BFF authentication calls in `Frontend/src/auth/AuthContext.jsx` and `Frontend/src/auth/authService.js`.
- [ ] T013 [US2] [Plan:3.1] Build `/staff/login` in `Frontend/src/routes/auth/DoctorLoginPage.jsx` with labels, validation, loading, error, and redirect behavior.
- [ ] T014 [US2] [Plan:4.1] Add `Frontend/src/auth/ProtectedRoute.jsx` and the protected route definitions in `Frontend/src/router.jsx`.
- [ ] T015 [US2] [Plan:4.1] Add 401, 403, expired-session, forbidden, logout, and return-route handling.

### Phase 4 — Doctor Dashboard

- [ ] T016 [P] [US3] [Plan:5.1] Build the protected dashboard shell in `Frontend/src/routes/doctor/DoctorDashboardPage.jsx`.
- [ ] T017 [US3] [Plan:5.1] Fetch and render authorized encounters using `GET /api/v1/doctor/encounters`, including loading, empty, error, and retry states.
- [ ] T018 [US3] [Plan:6.1] Build `Frontend/src/routes/doctor/EncounterDetailPage.jsx` using `GET /api/v1/doctor/encounters/:id`.
- [ ] T019 [US3] [Plan:6.1] Add 401, 403, 404, timeout, and retry handling without showing restricted encounter data.
- [ ] T020 [US3] [Plan:6.1] Implement the review form and confirmation in `EncounterDetailPage.jsx`; submit through `POST /api/v1/doctor/encounters/:id/review`.
- [ ] T021 [US3] [Plan:6.1] Handle successful review, conflict, field validation, and server errors.

### Phase 5 — Cleanup and Verification

- [ ] T022 [P] [Plan:7.1] Add logout, inactivity timeout, completion, and explicit reset behavior in `Frontend/src/state/reset.js`.
- [ ] T023 [P] [Plan:7.1] Verify protected data is not persisted or cached by the PWA.
- [ ] T024 [P] [Plan:9.1] Add component tests for landing navigation, login, protected routes, encounter list/detail, review responses, and reset.
- [ ] T025 [P] [Plan:9.1] Add accessibility checks for labels, keyboard navigation, focus, contrast, touch size, and error announcements.
- [ ] T026 [Plan:9.1] Add Playwright coverage for landing, staff login, authorized dashboard access, denied access, review submission, logout, and timeout.

## Verification

- landing matches the supplied layout and remains readable at supported screen sizes
- all patient and staff CTAs lead to the correct route
- a signed-out user cannot open the doctor routes
- only authorized encounters are rendered
- 401/403/404/409 responses show the correct safe state
- review requests go only through the BFF and remain server-validated
- logout and timeout clear active doctor and encounter state
- no patient or authentication data is in local storage or service-worker cache

## Requirement Coverage

| PRD item | Where covered |
|---|---|
| FR-08 | Staff login and protected routes |
| FR-09 | ProtectedRoute and all BFF encounter requests |
| FR-10 | Doctor dashboard and encounter detail |
| FR-11 | Encounter review submission |
| FR-12 | Backend audit event created for the review decision |
| FR-16 | Landing and staff UI text should use shared language resources if localization is enabled |
| FR-17 | Logout, timeout, completion, and reset |
| NFR-01 | Server-side authorization and frontend route guards |
| NFR-03 | Secrets and protected data handling |
| NFR-04 | Kiosk session cleanup |
| NFR-06 | Responsive layout, keyboard use, labels, contrast, and touch targets |
