# MediKiosk Frontend Execution Plan

**Date:** 2026-10-26  
**Source:** `../PRD.md`  
**Scope:** React, Vite, TypeScript Progressive Web App for patient intake, kiosk operation, clinician review, optional AI draft review, and protected administrator/demo setup.

## Summary

Build an installable, responsive PWA that guides patients through intake and gives authorized clinicians a clear review workspace. The Frontend consumes the Backend BFF contracts; it does not enforce authorization by itself, create authoritative workflow states, or store protected patient data in shared browser caches.

The P0 experience is delivered first: welcome/start, consent, versioned questionnaire, validation, save/resume, controlled upload, submission confirmation, clinician sign-in, authorized encounter list/detail, review actions, loading/error/empty states, and kiosk reset. OCR/AI screens are feature-gated and always display drafts as unverified, with source references and explicit clinician actions.

## Technical Context

**Language/Version:** TypeScript with React and Vite  
**Primary dependencies:** React Router, a typed API client, form/state validation such as Zod and React Hook Form or the repository-equivalent, Tailwind CSS or existing design tokens, PWA manifest/service-worker tooling, and Vitest/Testing Library/Playwright  
**API boundary:** Frontend calls only the Node.js BFF `/api/v1` routes; it never calls Spring Boot, MongoDB, private storage, or AiEngine directly  
**Storage:** In-memory or carefully scoped session state for active UI only; static assets may be cached; patient answers, encounters, documents, authentication responses, and AI drafts must not enter a shared kiosk cache  
**Testing:** Component/unit tests, API-mocked workflow tests, authorization/error-state tests, PWA reset tests, accessibility checks, and an end-to-end patient-to-clinician flow  
**Target platform:** Installable PWA on the agreed kiosk/tablet/desktop browser and keyboard/touch input  
**Performance goals:** Measure startup, route transitions, questionnaire interaction, upload feedback, and bundle behavior on demo hardware  
**Constraints:** Synthetic data by default; no diagnosis/prescription/triage claims; no sensitive details on landing/notifications; server-side authorization remains authoritative; secrets are not shipped to the browser

## Constitution Check

- **Backend contract ownership:** PASS. The client treats Backend responses and workflow states as authoritative and does not duplicate business transitions.
- **Kiosk privacy:** PASS. Session-specific state is cleared on completion, logout, timeout, and reset; service-worker caching is restricted to static assets.
- **Accessibility:** PASS. Touch targets, keyboard navigation, readable typography, contrast, focus management, semantic labels, and actionable errors are planned.
- **Safety and human review:** PASS. AI output is visibly `UNVERIFIED`, source-linked where available, and never presented as a clinical decision.
- **Reliability:** PASS. Save/upload actions expose confirmation, retry, conflict, and failure states without hiding data loss.
- **Maintainability:** PASS. Shared typed API models, route guards, reusable state components, feature flags, tests, and setup documentation are included.

## Applied Guidelines

- Keep API calls in typed client modules rather than components; map Backend error codes to user-safe messages centrally.
- Use route-level access checks for UX only; never treat hidden UI as authorization.
- Use controlled forms with schema validation and preserve valid input when a request fails.
- Treat loading, empty, offline/network error, conflict, success, and retry states as first-class UI states.
- Keep sensitive response data out of `localStorage`, service-worker caches, URLs, analytics, and browser notifications.
- Use stable keys and explicit questionnaire/question versions so a refresh cannot silently render a different schema.
- Feature-gate AI/OCR screens and fail closed when the capability is unavailable.

## Backend and AiEngine Dependencies

The Frontend depends on the Backend plan’s PWA-facing contracts:

- `POST /api/v1/sessions`, `GET /api/v1/sessions/:id`, `GET /question`, `POST /consent`, `POST /answers`, `POST /submit`
- `POST /documents`, `GET /documents`, and optional `POST /summary-drafts`
- `GET /doctor/encounters`, `GET /doctor/encounters/:id`, and `POST /doctor/encounters/:id/review`
- Stable error shape with machine-readable `code`, safe `message`, `correlationId`, field errors, and status codes
- Auth expiry/logout behavior, idempotency headers, upload limits, workflow states, document processing statuses, and feature flags

The Frontend consumes AiEngine output only through Backend. It must not call AiEngine directly or infer approval from a generated draft.

## Implementation Steps

### Phase 1: Setup

#### Plan 1.1 — Establish the React/PWA foundation

- **Requirements:** FR-16, FR-17, FR-18, NFR-04, NFR-06, NFR-08, NFR-11
- **Description:** Scaffold the Vite React TypeScript app, routing, design tokens, responsive layout primitives, manifest, icons, service worker, environment configuration, typed build scripts, and health-aware application shell.

#### Plan 1.2 — Define frontend contracts and state model

- **Requirements:** FR-01 through FR-18, NFR-04, NFR-05, NFR-08, NFR-10
- **Description:** Generate or hand-author typed API models for session, consent, questionnaire, answers, documents, clinician encounters, reviews, drafts, pagination, errors, and processing statuses. Define the active-session state machine, auth state, feature flags, and reset boundaries.

#### Plan 1.3 — Build shared interaction and accessibility primitives

- **Requirements:** FR-04, FR-16, FR-17, NFR-06, NFR-08
- **Description:** Implement accessible buttons, inputs, radios/checkboxes, selects, progress indicators, dialogs, alerts, banners, file dropzone, loading skeletons, empty states, error/retry states, focus management, and screen-reader announcements.

### Phase 2: P0 Patient Intake

#### Plan 2.1 — Implement welcome/start and consent

- **Requirements:** FR-01, FR-02, FR-16, FR-17, NFR-02, NFR-04, NFR-06
- **Description:** Build the welcome screen with minimal non-sensitive information, language selection if enabled, session creation, consent purpose/choices/policy version, decline handling, and clear transition into the questionnaire only after required consent.

#### Plan 2.2 — Implement versioned questionnaire and validation

- **Requirements:** FR-03, FR-04, FR-05, FR-16, NFR-05, NFR-06, NFR-10
- **Description:** Render supported question types and branching from the Backend schema, show progress and current version, validate required fields/formats locally, preserve answers during navigation, surface server field errors, and avoid silently changing answers when the schema changes.

#### Plan 2.3 — Implement save/resume and network recovery

- **Requirements:** FR-05, FR-06, FR-17, NFR-04, NFR-05, NFR-09, NFR-10
- **Description:** Save at explicit checkpoints and navigation boundaries with idempotency/version headers, show saved/unsaved status, restore an authorized session after refresh/re-entry, handle conflicts and retryable failures, and clear active state on completion, timeout, logout, or reset.

#### Plan 2.4 — Implement document upload and submission

- **Requirements:** FR-06, FR-07, FR-12, FR-17, NFR-03, NFR-05, NFR-06
- **Description:** Build upload UI with configured allowlist/size guidance, client prevalidation, progress, retry/cancel/failure states, document metadata/status display, non-sensitive submission confirmation, duplicate-submit protection, and safe reset after completion.

### Phase 3: P0 Clinician Review

#### Plan 3.1 — Implement staff sign-in and protected navigation

- **Requirements:** FR-08, FR-09, FR-17, NFR-01, NFR-04, NFR-06
- **Description:** Build sign-in, session-expiry, logout, unauthorized, and forbidden screens. Configure route guards for UX, redirect safely after expiry, and ensure no protected response is retained in browser storage or shared cache.

#### Plan 3.2 — Implement clinician encounter list

- **Requirements:** FR-09, FR-10, FR-12, NFR-01, NFR-06, NFR-09
- **Description:** Display only Backend-authorized encounters with minimal identifying details, pagination/filter state, loading/empty/error/retry states, safe refresh behavior, and clear navigation to a permitted encounter.

#### Plan 3.3 — Implement encounter review workspace

- **Requirements:** FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, NFR-01, NFR-06, NFR-10
- **Description:** Show answers, questionnaire version, document metadata/viewer access, processing statuses, audit-relevant timestamps where appropriate, review status, and explicit clinician actions. Clearly label every AI/OCR draft as unverified and preserve source references.

#### Plan 3.4 — Implement draft decision and review feedback

- **Requirements:** FR-11, FR-14, FR-15, FR-12, NFR-01, NFR-06
- **Description:** Add draft edit, approve, reject, and encounter-review actions using Backend routes only. Require confirmation for consequential actions, show actor/status/timestamp feedback, handle conflicts, and never present AI output as approved before a successful clinician response.

### Phase 4: Optional Localization and Administration

#### Plan 4.1 — Add tested language support

- **Requirements:** FR-16, NFR-06, NFR-11
- **Description:** Externalize all user-visible strings, implement agreed languages only, support language selection at the approved entry point, preserve validation/error meaning, and test translated layouts, labels, focus order, and text expansion.

#### Plan 4.2 — Add protected admin/demo setup

- **Requirements:** FR-09, FR-12, FR-17, FR-18, NFR-01, NFR-02, NFR-12
- **Description:** Add a protected configuration/demo-reset screen only for authorized administrators. Show confirmation and scope before reset, never expose clinical data unnecessarily, and reflect Backend reset completion without claiming success on a failed request.

### Phase 5: Hardening and Delivery

#### Plan 5.1 — Verify PWA, kiosk, accessibility, and privacy behavior

- **Requirements:** FR-01 through FR-18, NFR-02 through NFR-12
- **Description:** Test installability, refresh, timeout, logout, completion reset, service-worker cache boundaries, keyboard/touch use, focus and screen-reader behavior, responsive layouts, sensitive-data leakage, loading/empty/error states, and supported browser/device behavior.

#### Plan 5.2 — Verify integrated workflow and document operation

- **Requirements:** FR-01 through FR-18, NFR-05, NFR-07, NFR-08, NFR-11, NFR-12
- **Description:** Run the complete synthetic patient-to-clinician journey against Backend, including unauthorized access denial, upload failure, duplicate request, optional draft review, and reset. Document local setup, environment variables, test commands, feature flags, measured performance, and known limitations.

## Task Breakdown

### Phase 1 — Setup

- [ ] T001 [P] [Plan:1.1] Scaffold the Vite React TypeScript app in `Frontend/` with development, build, preview, lint, type-check, and test scripts.
- [ ] T002 [P] [Plan:1.1] Add responsive design tokens, layout primitives, typography, color/contrast rules, and touch-target defaults in `Frontend/src/styles`.
- [ ] T003 [P] [Plan:1.1] Add `Frontend/public/manifest.webmanifest`, app icons, service-worker registration, and static-asset-only caching configuration.
- [ ] T004 [P] [Plan:1.2] Define typed API models and route constants in `Frontend/src/api/contracts.ts` for sessions, questionnaire, documents, encounters, reviews, drafts, errors, and health.
- [ ] T005 [Plan:1.2] Implement the typed BFF client in `Frontend/src/api/client.ts` with correlation IDs, idempotency keys, auth handling, timeout behavior, stable error mapping, and no sensitive URL logging.
- [ ] T006 [Plan:1.2] Implement auth, active-session, questionnaire, upload, and feature-flag state boundaries in `Frontend/src/state`.
- [ ] T007 [P] [Plan:1.3] Implement accessible shared form controls, buttons, alerts, progress indicators, dialogs, loading skeletons, empty states, and retryable error panels in `Frontend/src/components`.

### Phase 2 — P0 Patient Intake

- [ ] T008 [P] [Plan:2.1] Build the welcome/start route in `Frontend/src/routes/WelcomePage.tsx` with non-sensitive explanation, optional language selection, and session creation.
- [ ] T009 [Plan:2.1] Build the consent route in `Frontend/src/routes/ConsentPage.tsx` with purpose, policy version, required/optional choices, decline behavior, and consent submission feedback.
- [ ] T010 [Plan:2.2] Implement questionnaire schema rendering and branching in `Frontend/src/questionnaire`, including supported question types, stable question IDs, version display, and progress.
- [ ] T011 [Plan:2.2] Implement client validation and server-field-error rendering in `Frontend/src/questionnaire/validation.ts` while preserving valid user input after failed requests.
- [ ] T012 [Plan:2.3] Implement answer save/resume orchestration in `Frontend/src/state/session.ts` with explicit save confirmation, optimistic version handling, retry, conflict recovery, and refresh rehydration.
- [ ] T013 [Plan:2.3] Add kiosk reset behavior for completion, logout, timeout, expired auth, and explicit reset in `Frontend/src/state/reset.ts`; ensure protected data is not persisted to shared browser storage.
- [ ] T014 [P] [Plan:2.4] Build document upload UI in `Frontend/src/routes/DocumentUploadPage.tsx` with allowlist/size guidance, client prevalidation, progress, cancel, retry, failure, and processing status states.
- [ ] T015 [Plan:2.4] Build submission confirmation in `Frontend/src/routes/SubmissionConfirmationPage.tsx` with only a non-sensitive reference and next steps, then invoke the kiosk reset boundary.

### Phase 3 — P0 Clinician Review

- [ ] T016 [P] [Plan:3.1] Build staff sign-in, session-expiry, logout, unauthorized, and forbidden routes in `Frontend/src/routes/auth`.
- [ ] T017 [Plan:3.1] Implement protected route guards and safe redirect behavior in `Frontend/src/router.tsx`, ensuring guards improve UX but do not replace Backend authorization.
- [ ] T018 [P] [Plan:3.2] Build clinician encounter list in `Frontend/src/routes/ClinicianEncounterListPage.tsx` with minimal details, pagination, loading, empty, error, retry, and refresh states.
- [ ] T019 [Plan:3.3] Build encounter review in `Frontend/src/routes/EncounterReviewPage.tsx` for answers, questionnaire version, document metadata/viewer access, processing status, and review status.
- [ ] T020 [Plan:3.3] Build source-aware draft review components in `Frontend/src/components/drafts` with persistent `UNVERIFIED` labeling, source references, missing/unclear markers, and feature-flag handling.
- [ ] T021 [Plan:3.4] Implement clinician edit/approve/reject and encounter-review actions through Backend APIs with confirmation dialogs, conflict handling, success feedback, and no direct AiEngine calls.

### Phase 4 — Optional Localization and Administration

- [ ] T022 [P] [Plan:4.1] Externalize all visible strings and implement the agreed language resources in `Frontend/src/i18n`, including translated validation, errors, empty states, and accessibility labels.
- [ ] T023 [P] [Plan:4.1] Add localization tests for text expansion, layout overflow, translated labels, date/time formatting, and keyboard/focus order.
- [ ] T024 [Plan:4.2] Build protected admin/demo setup and reset screens in `Frontend/src/routes/AdminDemoPage.tsx` with role-aware navigation, scope confirmation, and explicit failure handling.

### Phase 5 — Hardening and Delivery

- [ ] T025 [P] [Plan:5.1] Add component and state tests for consent guards, questionnaire branching/validation, save/resume, duplicate submit, upload failures, auth expiry, and kiosk reset.
- [ ] T026 [P] [Plan:5.1] Add accessibility tests for keyboard navigation, focus management, labels, contrast, touch targets, announcements, and error association.
- [ ] T027 [P] [Plan:5.1] Add PWA/browser tests for installability, refresh, service-worker static caching, protected-data cache exclusion, timeout/logout/completion reset, and supported viewport sizes.
- [ ] T028 [P] [Plan:5.2] Add mocked API integration tests for the patient flow, clinician review, unauthorized encounter access, upload rejection, retry/conflict behavior, and optional unverified draft decisions.
- [ ] T029 [Plan:5.2] Add Playwright end-to-end coverage for the synthetic patient-to-clinician acceptance scenario against the running Backend stack.
- [ ] T030 [Plan:5.2] Complete `Frontend/README.md` with setup, environment configuration, PWA behavior, supported browsers/devices, test commands, feature flags, measured performance, reset policy, and limitations.

## Project Structure

```text
Frontend/
├── public/
│   ├── manifest.webmanifest
│   ├── icons/
│   └── service-worker.js
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   └── contracts.ts
│   ├── components/
│   │   ├── common/
│   │   ├── drafts/
│   │   ├── documents/
│   │   └── layout/
│   ├── i18n/
│   ├── questionnaire/
│   ├── routes/
│   │   ├── auth/
│   │   ├── WelcomePage.tsx
│   │   ├── ConsentPage.tsx
│   │   ├── PatientIntakePage.tsx
│   │   ├── DocumentUploadPage.tsx
│   │   ├── SubmissionConfirmationPage.tsx
│   │   ├── ClinicianEncounterListPage.tsx
│   │   ├── EncounterReviewPage.tsx
│   │   └── AdminDemoPage.tsx
│   ├── state/
│   ├── styles/
│   ├── router.tsx
│   └── main.tsx
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── accessibility/
│   └── e2e/
├── .env.example
└── README.md
```

## Testing Strategy

- **App type:** Installable React PWA with patient, clinician, and protected admin routes.
- **Critical journeys:** create/consent/questionnaire/save/resume/submit; controlled document upload; clinician sign-in/list/detail/review; unauthorized access denial; optional unverified draft review; timeout/logout/completion reset.
- **Primary validation stack:** Vitest and Testing Library for components/state, mocked BFF contract tests, axe-based accessibility checks, and Playwright for integrated browser flows.
- **Fallback matrix:** Running Backend stack → mocked BFF for component/integration tests; Playwright browser tests → API-level workflow tests when browser tooling is unavailable.
- **Environment requirements:** Node.js LTS, Backend BFF, synthetic fixtures, agreed browser/device matrix, and optional Docker Compose stack.
- **Known gaps:** Mocked API tests cannot prove server authorization; browser fallback cannot prove visual interaction or service-worker behavior; PWA install behavior must be checked on the actual demo browser.
- **Test data strategy:** Use synthetic questionnaire/encounter fixtures, unique session IDs, reset state after every workflow, and never place real patient data in screenshots, fixtures, snapshots, or logs.
- **Acceptance criteria:** Patient flow retains valid answers, blocks required-consent work, rejects invalid uploads visibly, restores authorized sessions, submits once, clinician sees only permitted records, AI drafts remain unverified, and no prior kiosk data remains after reset.
- **Validation review expectations:** Confirm all protected operations use Backend APIs, no sensitive data is cached or logged, accessibility states are complete, route guards do not imply authorization, and feature flags fail closed.

## Requirement Mapping

| Requirement | Plan items | Implementation evidence |
|---|---|---|
| FR-01 Create session | 1.2, 2.1 | Typed session contract and welcome/start route |
| FR-02 Record consent | 1.2, 2.1 | Consent page, required-consent guard, API tests |
| FR-03 Deliver questionnaire | 1.2, 2.2 | Versioned schema renderer and branching |
| FR-04 Validate answers | 1.3, 2.2 | Shared controls, client/server field errors, tests |
| FR-05 Save/resume | 1.2, 2.3 | Session state, save confirmation, refresh rehydration |
| FR-06 Submit intake | 2.3, 2.4 | Idempotent submit flow and confirmation page |
| FR-07 Upload documents | 2.4 | Upload UI, prevalidation, progress/retry states |
| FR-08 Authenticate clinicians | 3.1 | Sign-in and expiry/logout routes |
| FR-09 Authorize access | 3.1, 3.2 | Protected UX routes and Backend denial handling |
| FR-10 Clinician list/detail | 3.2, 3.3 | Encounter list and review workspace |
| FR-11 Record review status | 3.3, 3.4 | Review status and clinician action feedback |
| FR-12 Audit events | 3.3, 3.4, 5.2 | Access/review response display and integrated tests |
| FR-13 OCR extraction | 3.3, 5.2 | Processing statuses and extraction metadata display |
| FR-14 AI draft summary | 3.3, 3.4 | Unverified draft view, source references, feature flag |
| FR-15 Edit/approve/reject draft | 3.4 | Backend-only decision controls and tests |
| FR-16 Multiple UI languages | 1.1, 1.3, 2.1, 4.1 | i18n resources and localization tests |
| FR-17 Kiosk reset | 1.1, 2.3, 2.4, 3.1, 4.2, 5.1 | Reset boundary, logout/timeout handling, PWA tests |
| FR-18 Health checks | 1.1, 5.2 | Health-aware shell and documented service checks |
| NFR-01 Security | 1.2, 3.1, 3.2, 3.4, 5.1 | Auth handling, safe routes, no direct service access |
| NFR-02 Privacy | 1.1, 2.1, 2.4, 5.1, 5.2 | Non-sensitive landing, synthetic data, cache/log checks |
| NFR-03 Data protection | 1.1, 2.4, 5.1 | No secrets in bundle, private document API, cache controls |
| NFR-04 Kiosk safety | 1.2, 2.3, 3.1, 5.1 | State reset on all exit paths and PWA tests |
| NFR-05 Reliability | 1.2, 2.3, 2.4, 5.2 | Retry/conflict/duplicate handling and workflow tests |
| NFR-06 Accessibility | 1.3, 2.2, 2.4, 3.2, 4.1, 5.1 | Shared primitives, accessibility tests, language tests |
| NFR-07 Performance | 5.2 | Measured startup, interaction, upload, and bundle report |
| NFR-08 Maintainability | 1.1, 1.2, 5.2 | Typed client, structure, README, test commands |
| NFR-09 Observability | 1.2, 2.3, 3.2, 5.1 | Correlation-safe errors and observable save/status states |
| NFR-10 Data integrity | 1.2, 2.2, 2.3, 3.4, 5.2 | Versioned forms, idempotency, conflict handling |
| NFR-11 Compatibility | 1.1, 4.1, 5.1, 5.2 | Browser/device matrix and responsive/localization tests |
| NFR-12 Retention | 2.3, 4.2, 5.1, 5.2 | Reset UX, storage exclusion, documented deletion policy |

## Delivery Gates

1. **P0 gate:** FR-01 through FR-12 and FR-17 work against the Backend contracts before optional AI screens are enabled.
2. **Kiosk privacy gate:** Completion, logout, timeout, and reset remove session-specific UI state; service workers cache static assets only.
3. **Accessibility gate:** Critical flows work with keyboard and touch, have visible focus, associated errors, readable contrast, and understandable status announcements.
4. **AI safety gate:** Drafts are feature-gated, visibly unverified, source-aware, and cannot be approved from the Frontend without a successful Backend clinician action.
5. **Demo gate:** A new team member can install/run the PWA, complete the synthetic patient-to-clinician workflow, reproduce tests, and explain unsupported/optional features.
