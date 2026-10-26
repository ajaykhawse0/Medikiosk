# MediKiosk Backend Execution Plan

**Date:** 2026-10-26  
**Source:** `../PRD.md`  
**Scope:** Spring Boot workflow service, Node.js/Express BFF, PostgreSQL, MongoDB, private document storage, authentication, authorization, audit, and integration with the optional AiEngine.

## Summary

Implement the authoritative backend for the patient-intake-to-clinician-review workflow. The Spring Boot service owns encounter state, consent, roles, review decisions, and audit records in PostgreSQL. The Node.js BFF is the only frontend-facing API and coordinates questionnaire/answer payloads, upload handling, and calls to the workflow service and AiEngine. MongoDB stores versioned questionnaires, flexible answers, and processing results; private file storage holds original uploads.

The P0 path is delivered before OCR or AI: create/resume an encounter, capture consent, deliver and validate a questionnaire, save and submit answers, upload safe documents, authenticate clinicians, enforce record-level authorization, expose clinician review, record audit events, and clear/reset session state through explicit backend operations. All retryable writes are idempotent and all workflow transitions are server-validated.

## Technical Context

**Language/Version:** Java 17+ with Spring Boot; Node.js LTS with TypeScript  
**Primary dependencies:** Spring Web, Spring Security, Bean Validation, Spring Data JPA, PostgreSQL driver, MongoDB driver, Express, Zod or equivalent request validation, OpenAPI tooling, test containers where available  
**Storage:** PostgreSQL for users, roles, encounters, consent, documents, reviews, and audit; MongoDB for questionnaire versions, answers, extraction metadata, and draft references; private local/object storage for original files  
**API boundary:** React calls Node.js BFF; BFF calls authenticated Spring internal APIs and the AiEngine only for enabled processing  
**Testing:** Unit, API integration, authorization matrix, upload/failure tests, contract tests, and an end-to-end patient-to-clinician workflow  
**Target platform:** Docker Compose local development and the agreed browser/device combination for the demo  
**Performance goals:** Measure baseline latency and upload behavior on demo hardware; do not claim unmeasured targets  
**Constraints:** Synthetic data by default; no autonomous diagnosis, prescribing, triage, or approval; secrets outside source control; no sensitive data in logs; no private storage keys or unrestricted document URLs in API responses

## Constitution Check

- **Authoritative ownership:** PASS. Spring Boot owns clinical workflow state and PostgreSQL records; Node.js does not create a competing encounter state.
- **Least privilege and server-side enforcement:** PASS. Every protected operation authenticates and checks role plus encounter-level access.
- **Privacy and safety:** PASS. Synthetic data, minimal fields, private files, narrow CORS, safe expiry/logout, and audit events are mandatory.
- **Data integrity:** PASS. Opaque IDs, versioned payloads, explicit states, idempotency keys, retry handling, and reconciliation are planned.
- **AI is assistive only:** PASS. AiEngine output is unverified, source-linked where possible, feature-flagged, and never able to approve a review.
- **Operability and maintainability:** PASS. OpenAPI, stable error codes, correlation IDs, health checks, migrations, setup instructions, and automated tests are included.

## Applied Guidelines

- Use layered Spring services/controllers/repositories with DTOs at API boundaries; do not expose persistence entities directly.
- Validate all request bodies and state transitions on the server, even when the BFF or frontend validates first.
- Keep business state transitions in one domain service and reject illegal transitions with a stable conflict error.
- Use environment variables for credentials, storage roots, service URLs, and feature flags; provide placeholders only in `.env.example`.
- Use generated opaque identifiers and server-side filenames; store upload binaries outside public web roots.
- Return one consistent error shape: `code`, `message`, `correlationId`, and optional field errors.
- Keep internal endpoints authenticated; an `/internal` path alone is not an authorization mechanism.

## Implementation Steps

### Phase 1: Setup

#### Plan 1.1 — Establish service boundaries and local environment

- **Requirements:** FR-18, NFR-03, NFR-08, NFR-09, NFR-11
- **Description:** Create the backend service layout, Docker Compose dependencies, environment templates, correlation-ID conventions, baseline logging policy, and health endpoints. Document the ownership boundary between BFF, Spring Boot, PostgreSQL, MongoDB, file storage, and AiEngine.

#### Plan 1.2 — Define API and error contracts

- **Requirements:** FR-01 through FR-15, FR-18, NFR-05, NFR-08, NFR-10
- **Description:** Write OpenAPI schemas for the PWA-facing routes and authenticated internal routes. Standardize status codes, idempotency headers, opaque IDs, pagination, upload limits, workflow states, and machine-readable errors before implementation.

### Phase 2: Foundational

#### Plan 2.1 — Create authoritative relational schema and migrations

- **Requirements:** FR-01, FR-02, FR-07, FR-08, FR-09, FR-10, FR-11, FR-12, NFR-10, NFR-12
- **Description:** Add migrations and indexes for users, roles, encounters, consents, documents, summary reviews, and audit events. Include unique constraints for idempotency and duplicate submission protection, opaque public IDs, timestamps, actor references, and retention/reset support.

#### Plan 2.2 — Create flexible questionnaire and answer schemas

- **Requirements:** FR-03, FR-04, FR-05, FR-13, FR-14, NFR-10
- **Description:** Define versioned MongoDB documents for questionnaire definitions, branching rules, answer snapshots, processing metadata, and source references. Preserve the distinction between patient-reported, OCR-extracted, and AI-generated values.

#### Plan 2.3 — Implement authentication, authorization, and audit primitives

- **Requirements:** FR-08, FR-09, FR-12, NFR-01, NFR-03, NFR-09
- **Description:** Implement clinician authentication with documented expiry/logout behavior, role checks for patient/assistant/clinician/administrator/service calls, encounter-level policies, authenticated internal calls, and an audit writer that excludes tokens, passwords, document contents, and unnecessary medical data.

### Phase 3: P0 Patient Intake

#### Plan 3.1 — Implement encounter/session lifecycle

- **Requirements:** FR-01, FR-05, FR-06, FR-17, NFR-04, NFR-05, NFR-10
- **Description:** Implement create, retrieve, resume, and submit operations. Enforce `DRAFT → IN_PROGRESS → SUBMITTED`, reject invalid transitions, make submission idempotent, return only non-sensitive confirmation data, and support explicit expiration/abandonment and reset hooks.

#### Plan 3.2 — Implement consent and questionnaire delivery

- **Requirements:** FR-02, FR-03, FR-04, FR-05, NFR-02, NFR-08
- **Description:** Persist the consent decision, timestamp, capture method, and policy version. Block consent-dependent processing without required consent. Serve a pinned questionnaire version and validate required fields, formats, supported question types, and branching rules on the server.

#### Plan 3.3 — Implement answer save/resume and reconciliation

- **Requirements:** FR-04, FR-05, NFR-05, NFR-10
- **Description:** Add versioned answer snapshots with optimistic/version checks, idempotency keys, retry-safe writes, actionable field errors, and recovery for partial PostgreSQL/MongoDB failures. Ensure authorized re-entry restores the latest valid answers without cross-encounter leakage.

#### Plan 3.4 — Implement controlled document registration and storage

- **Requirements:** FR-07, FR-12, NFR-03, NFR-05, NFR-10
- **Description:** Validate allowlisted extension/MIME/signature, configured size limits, and encounter authorization before accepting uploads. Generate server-side filenames, store binaries privately, checksum originals, register metadata, authorize access/downloads, and keep originals when downstream processing fails.

### Phase 4: P0 Clinician Review

#### Plan 4.1 — Implement clinician encounter list and detail

- **Requirements:** FR-08, FR-09, FR-10, FR-12, NFR-01, NFR-09
- **Description:** Add authenticated list/detail endpoints with minimal identifying data, explicit policy filtering, pagination, document metadata, answer data, processing statuses, and audit events for protected access. Never trust a client-supplied encounter ID without a policy check.

#### Plan 4.2 — Implement review state transitions

- **Requirements:** FR-11, FR-12, FR-15, NFR-01, NFR-10
- **Description:** Implement `SUBMITTED → UNDER_REVIEW → REVIEWED` and documented return/reopen paths. Require authorized clinician actions, record actor/timestamp/decision, reject client-supplied status changes, and keep AI draft approval separate from encounter state.

#### Plan 4.3 — Integrate BFF routes and internal service calls

- **Requirements:** FR-01 through FR-12, FR-15, FR-17, NFR-01, NFR-05, NFR-08
- **Description:** Implement the PWA-facing `/api/v1` routes in Node.js, request validation, authentication propagation, timeout/retry behavior, response shaping, and authenticated Spring calls. Keep workflow ownership in Spring and prevent duplicate business logic in the BFF.

### Phase 5: Optional AI/OCR Integration

#### Plan 5.1 — Add feature-gated processing orchestration

- **Requirements:** FR-12, FR-13, FR-14, FR-15, FR-18, NFR-01, NFR-02, NFR-09
- **Description:** Add an explicit feature flag and authenticated AiEngine client. Create processing jobs/statuses, correlate requests, retry safe failures, persist source references and model/provider versions, and expose unverified results without blocking original documents or the P0 workflow.

#### Plan 5.2 — Expose draft review operations

- **Requirements:** FR-14, FR-15, FR-12, NFR-01, NFR-10
- **Description:** Add draft retrieval/edit/approve/reject orchestration for authorized clinicians. Enforce `GENERATED → EDITED → APPROVED` or `REJECTED`, preserve the unverified label until explicit clinician action, and audit every generation, edit, and decision.

### Phase 6: Hardening and Delivery

#### Plan 6.1 — Verify security, failure, and data-retention behavior

- **Requirements:** FR-01 through FR-18, NFR-01 through NFR-12
- **Description:** Run authorization matrices, cross-encounter denial tests, malformed/oversized/corrupt upload tests, duplicate/retry tests, partial-write reconciliation tests, service-unavailable tests, correlation-ID checks, log redaction checks, reset/deletion checks, and health checks.

#### Plan 6.2 — Document reproducible operation

- **Requirements:** FR-18, NFR-03, NFR-07, NFR-08, NFR-11, NFR-12
- **Description:** Complete backend README/setup instructions, environment configuration, migrations, API/error documentation, seed users and synthetic data, reset/deletion procedure, measured performance results, supported browser/device matrix, and limitations.

## Task Breakdown

### Phase 1 — Setup

- [ ] T001 [P] [Plan:1.1] Create `Backend/spring-service`, `Backend/node-api`, `Backend/infra`, and `Backend/docs` module boundaries with build scripts and README entry points.
- [ ] T002 [P] [Plan:1.1] Add `Backend/.env.example`, Docker Compose definitions for PostgreSQL, MongoDB, private file storage, Spring Boot, Node.js, and optional AiEngine connectivity.
- [ ] T003 [P] [Plan:1.1] Implement correlation-ID middleware and sensitive-field logging redaction in `Backend/node-api/src/middleware` and Spring request filters.
- [ ] T004 [P] [Plan:1.1] Add `/health` and `/ready` checks for Node.js, Spring Boot, PostgreSQL, MongoDB, storage, and optional AiEngine.
- [ ] T005 [Plan:1.2] Write `Backend/docs/openapi.yaml` with PWA-facing and internal endpoint schemas, error responses, workflow states, and idempotency headers.

### Phase 2 — Foundational

- [ ] T006 [Plan:2.1] Create versioned PostgreSQL migrations for users, roles, user-role assignments, encounters, consents, documents, summary reviews, audit events, and idempotency records.
- [ ] T007 [P] [Plan:2.1] Add repository indexes and constraints for opaque IDs, encounter access, duplicate submissions, document checksums, and audit correlation IDs.
- [ ] T008 [P] [Plan:2.2] Define MongoDB schemas and indexes for questionnaire versions, encounter answers, extraction metadata, summary drafts, and processing jobs.
- [ ] T009 [Plan:2.3] Implement authentication/session or token expiry and logout in `Backend/spring-service/src/main/java/.../security`.
- [ ] T010 [Plan:2.3] Implement role and encounter-level authorization policies for patient, assistant, clinician, administrator, and service identities.
- [ ] T011 [Plan:2.3] Implement the shared audit service and event taxonomy without logging credentials, tokens, file contents, or unnecessary clinical content.

### Phase 3 — P0 Patient Intake

- [ ] T012 [Plan:3.1] Implement encounter domain states and validated transitions in `Backend/spring-service/src/main/java/.../encounter`.
- [ ] T013 [Plan:3.1] Implement create, retrieve, resume, submit, expiry, and idempotency use cases in the Spring service.
- [ ] T014 [Plan:3.2] Implement consent capture with policy version, timestamp, capture method, required-consent guards, and audit events.
- [ ] T015 [Plan:3.2] Implement questionnaire version retrieval, branching evaluation, question-type validation, and server-side actionable errors.
- [ ] T016 [Plan:3.3] Implement answer snapshot save/resume with schema version, optimistic version checking, retry-safe idempotency, and reconciliation status.
- [ ] T017 [Plan:3.4] Implement upload validation, checksum calculation, private storage, metadata registration, authorized metadata listing, and protected download streaming.
- [ ] T018 [Plan:3.4] Add upload failure cleanup/retry handling so a failed processing or metadata step never deletes an already stored original.

### Phase 4 — P0 Clinician Review

- [ ] T019 [Plan:4.1] Implement clinician encounter list/detail endpoints with policy filtering, minimal identifying data, answers, documents, and audit-on-access.
- [ ] T020 [Plan:4.2] Implement review state transitions, review decisions, return/reopen rules, actor/timestamp recording, and conflict errors.
- [ ] T021 [Plan:4.3] Implement all `/api/v1/sessions` and `/api/v1/doctor/encounters` BFF routes with validation, authenticated internal calls, timeout handling, and stable error mapping.
- [ ] T022 [Plan:4.3] Add request-level tests proving the BFF cannot mutate authoritative workflow state outside Spring service operations.

### Phase 5 — Optional AI/OCR Integration

- [ ] T023 [Plan:5.1] Implement feature-gated AiEngine client, authenticated job submission, status polling/callback handling, retry policy, and correlation IDs.
- [ ] T024 [Plan:5.1] Persist extraction and draft metadata with source references, provider/version, processing status, and safe failure categories.
- [ ] T025 [Plan:5.2] Implement draft retrieval/edit/approve/reject routes and enforce authorized clinician-only decisions with audit events.

### Phase 6 — Hardening and Delivery

- [ ] T026 [P] [Plan:6.1] Add unit tests for validators, consent guards, workflow transitions, policy checks, idempotency, and error mapping.
- [ ] T027 [P] [Plan:6.1] Add API integration tests for the full P0 flow, role matrix, cross-encounter access, uploads, retries, duplicate submission, and partial datastore failures.
- [ ] T028 [P] [Plan:6.1] Add contract tests for Node.js-to-Spring and Backend-to-AiEngine request/response compatibility.
- [ ] T029 [P] [Plan:6.1] Add reset/deletion tests covering PostgreSQL, MongoDB, and private uploaded files, plus log/correlation-ID and health-check assertions.
- [ ] T030 [Plan:6.2] Complete `Backend/README.md`, deployment/setup instructions, synthetic seed data, reset policy, supported-device matrix, measured performance report, and known limitations.

## Project Structure

```text
Backend/
├── spring-service/
│   ├── src/main/java/.../security
│   ├── src/main/java/.../encounter
│   ├── src/main/java/.../consent
│   ├── src/main/java/.../questionnaire
│   ├── src/main/java/.../document
│   ├── src/main/java/.../review
│   ├── src/main/java/.../audit
│   ├── src/main/resources/db/migration
│   └── src/test
├── node-api/
│   ├── src/routes
│   ├── src/clients
│   ├── src/middleware
│   ├── src/validation
│   └── test
├── infra/docker-compose.yml
├── docs/openapi.yaml
├── .env.example
└── README.md
```

## Testing Strategy

- **App type:** Mixed REST API and service orchestration.
- **Critical journeys:** create/consent/save/resume/submit; safe document upload; clinician authentication and permitted encounter review; unauthorized cross-encounter denial; retry/partial-failure recovery; reset/deletion.
- **Primary validation stack:** Spring Boot integration tests with PostgreSQL/MongoDB containers, Node.js API tests, contract tests, and browser-driven end-to-end tests from the Frontend plan.
- **Fallback matrix:** Docker Testcontainers → local Docker Compose services; full browser E2E → API-level workflow tests when browser tooling is unavailable.
- **Environment requirements:** Java 17+, Node.js LTS, Docker, PostgreSQL, MongoDB, private storage directory, and synthetic seed data.
- **Known gaps:** Fallback embedded databases do not fully represent production indexing/transaction behavior; API-only tests do not prove kiosk rendering/accessibility.
- **Test data strategy:** Generate isolated opaque IDs per test, use synthetic fixtures only, and clean database/file records after each scenario or suite.
- **Acceptance criteria:** Every P0 route succeeds for authorized actors, fails safely for invalid/unauthorized actors, retries do not duplicate records, original uploads survive processing failure, and the complete patient-to-clinician flow is reproducible from the setup guide.
- **Validation review expectations:** Confirm service ownership, authorization on every protected operation, no sensitive log leakage, stable error codes, migration reproducibility, and that AI integration cannot bypass clinician review.

## Requirement Mapping

| Requirement | Plan items | Implementation evidence |
|---|---|---|
| FR-01 Create session | 2.1, 3.1, 4.3 | Encounter migrations, lifecycle service, `POST /api/v1/sessions` |
| FR-02 Record consent | 2.1, 3.2 | Consent entity, policy guard, consent endpoint and tests |
| FR-03 Deliver questionnaire | 2.2, 3.2 | Versioned MongoDB questionnaire schema and retrieval service |
| FR-04 Validate answers | 1.2, 2.2, 3.2, 3.3 | DTO validators, branching rules, field-error responses |
| FR-05 Save/resume | 3.1, 3.3 | Answer snapshots, authorized resume endpoint |
| FR-06 Submit intake | 2.1, 3.1 | State transition and idempotent submit use case |
| FR-07 Upload documents | 2.1, 3.4 | Upload validator, private storage, document registry |
| FR-08 Authenticate clinicians | 2.3, 4.1 | Spring Security configuration and auth tests |
| FR-09 Authorize access | 2.3, 4.1 | Role/encounter policy service and denial matrix |
| FR-10 Clinician list/detail | 4.1 | Authorized list/detail controllers and DTOs |
| FR-11 Record review status | 4.2 | Review transition service and decision persistence |
| FR-12 Audit events | 2.3, 3.2, 3.4, 4.1, 4.2, 5.1, 5.2 | Audit service, event taxonomy, audit tests |
| FR-13 OCR extraction | 5.1 | Feature-gated job orchestration and extraction status persistence |
| FR-14 AI draft summary | 5.1, 5.2 | Draft metadata/source references and unverified response contract |
| FR-15 Edit/approve/reject draft | 4.2, 5.2 | Clinician-only draft decision endpoints and audit records |
| FR-16 Multiple UI languages | 1.2, 2.2 | Language-key/questionnaire contract; Frontend owns translated UI |
| FR-17 Kiosk reset | 3.1, 6.1 | Expiry/reset hooks, deletion tests, non-sensitive confirmation |
| FR-18 Health checks | 1.1, 5.1, 6.2 | `/health`, `/ready`, dependency status and documentation |
| NFR-01 Security | 2.3, 4.1, 4.2, 6.1 | Auth, policy, validation, and security tests |
| NFR-02 Privacy | 2.2, 6.1, 6.2 | Minimal schemas, synthetic fixtures, redacted logs |
| NFR-03 Data protection | 1.1, 2.3, 3.4, 6.2 | Env configuration, private storage, secret policy |
| NFR-04 Kiosk safety | 3.1, 6.1 | Expiry/reset behavior and end-to-end assertions |
| NFR-05 Reliability | 1.2, 3.1, 3.3, 3.4, 5.1, 6.1 | Idempotency, retries, reconciliation, failure tests |
| NFR-06 Accessibility | 6.1 | API error clarity and Frontend integration acceptance |
| NFR-07 Performance | 6.2 | Measured backend baseline and report |
| NFR-08 Maintainability | 1.1, 1.2, 6.2 | OpenAPI, migrations, README, test structure |
| NFR-09 Observability | 1.1, 2.3, 4.1, 5.1, 6.1 | Correlation IDs, audit, redacted logging |
| NFR-10 Data integrity | 2.1, 2.2, 3.1, 3.3, 4.2, 5.2 | Constraints, versions, transitions, reconciliation |
| NFR-11 Compatibility | 1.1, 6.2 | Supported-device/browser matrix |
| NFR-12 Retention | 2.1, 6.1, 6.2 | Reset/deletion migrations, file cleanup, documented policy |

## Delivery Gates

1. **P0 gate:** FR-01 through FR-12 and FR-17 pass integration and authorization tests before AiEngine is enabled.
2. **AI integration gate:** AiEngine failures leave original documents and P0 review available; all output is unverified and source-linked where possible.
3. **Demo gate:** A new team member can start the stack with synthetic data, run migrations, complete the end-to-end flow, reset data, and reproduce the documented test evidence.
