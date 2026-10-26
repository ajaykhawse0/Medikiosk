# MediKiosk --- Product Requirements Document (PRD)

**Document type:** College Major Project --- MVP\
**Version:** 1.0\
**Status:** Proposed for team review\
**Last updated:** 26 October 2026

## 1. Purpose

This document defines the Minimum Viable Product (MVP) for MediKiosk, a
kiosk-friendly web application that collects structured patient intake
information and makes it available for clinician review. It defines
goals, users, scope, functional and non-functional requirements,
architecture, data ownership, safety constraints, acceptance tests, and
delivery milestones.

MediKiosk is an academic prototype, not a certified medical device or
production electronic health record. Use synthetic or explicitly
authorized data for development and demonstration.

## 2. Product Overview

### Problem

Patient information may be collected through unstructured conversations,
handwritten notes, or documents shown during a visit. This can make
intake inconsistent and time-consuming to review.

### Solution

MediKiosk provides an installable Progressive Web App (PWA) for guided
patient intake, consent capture, questionnaire responses,
supporting-document upload, and clinician review. Optional OCR/AI may
prepare an unverified draft summary for a clinician to check and edit.

**Core principle:** MediKiosk supports information collection and
clinician review. It must not independently diagnose, prescribe, or make
final clinical decisions.

## 3. Goals and Success Criteria

### MVP goals

1.  Start and manage an intake session.
2.  Record consent and its policy version.
3.  Present a guided, touch-friendly questionnaire with validation.
4.  Save answers and safely resume an authorized session.
5.  Upload supporting documents and associate them with the correct
    encounter.
6.  Allow an authorized clinician to review an encounter.
7.  Enforce server-side role and record-level authorization.
8.  Record audit events for important actions.
9.  Optionally generate an AI/OCR draft that is clearly marked
    unverified and requires clinician review.
10. Run a complete end-to-end demonstration using synthetic data.

### MVP success criteria

-   A session can be created, saved, retrieved, and submitted without
    losing valid answers.
-   Consent-dependent processing is blocked when the required consent is
    absent.
-   Clinicians can access permitted encounters and review their answers
    and documents.
-   Unauthorized API requests cannot access protected encounter data.
-   Invalid or oversized uploads are rejected safely.
-   Loading, validation, empty, success, and error states are
    understandable.
-   Critical workflows and authorization rules have automated tests.
-   A new team member can run the project using the setup guide.

Measure completion time and OCR quality during testing; do not claim
targets as achieved before collecting evidence.

## 4. Users and Roles

  -----------------------------------------------------------------------
  Role                                MVP responsibilities
  ----------------------------------- -----------------------------------
  Patient                             Provide consent, answer questions,
                                      upload permitted documents, review
                                      submitted information where
                                      appropriate

  Clinic assistant                    Help start and complete intake
                                      within assigned permissions; cannot
                                      approve clinical summaries

  Clinician                           View permitted encounters, inspect
                                      answers/documents, edit drafts,
                                      approve or reject drafts, mark
                                      review status

  Administrator                       Manage demo users, roles,
                                      questionnaire settings, and reset
                                      tools; clinical-data access must be
                                      restricted and audited

  Backend service                     Perform only authorized service
                                      operations and enforce the same
                                      workflow rules
  -----------------------------------------------------------------------

For the academic MVP, use minimal demo identity information. Do not
collect real national identity numbers unless there is a documented,
authorized requirement.

## 5. Scope

### In scope --- MVP

-   Responsive, installable PWA for kiosk, tablet, and desktop.
-   Intake session creation and status tracking.
-   Consent capture with timestamp and policy version.
-   Versioned questionnaire with required fields and basic branching.
-   Save/resume and submission workflow.
-   Upload of a limited allowlist of document types and sizes.
-   Clinician login, encounter list, encounter detail, and review
    status.
-   Role-based access control and audit events.
-   Secure storage of original uploaded files.
-   Automated tests, demo data, local deployment instructions.
-   Optional OCR/AI draft summary behind a feature flag.

### Out of scope

-   Autonomous diagnosis, treatment recommendations, or prescriptions.
-   AI approval of summaries or replacement of clinician judgment.
-   Emergency triage based only on an AI model.
-   Production EHR, ABDM/ABHA, pharmacy, lab, insurance, or hospital
    integrations.
-   Native Android/iOS app; PWA is the MVP client.
-   Payments, appointment scheduling, billing, or video consultation.
-   Multi-hospital enterprise administration.
-   Guaranteed extraction of handwritten or poor-quality documents.
-   Regulatory certification or claims of production/clinical readiness.

## 6. Primary User Journeys

### 6.1 Patient intake

1.  Patient or assistant starts a session.
2.  The app explains what information will be collected and why.
3.  The patient records consent or declines optional processing.
4.  The app displays the current questionnaire version.
5.  Answers are entered and validated.
6.  Answers are saved as the patient progresses.
7.  The patient optionally uploads supporting documents.
8.  The patient submits the intake and sees a non-sensitive
    confirmation/reference.
9.  The encounter becomes available for authorized clinician review.

**Expected result:** A persisted encounter with consent state,
questionnaire version, answers, document metadata, and workflow status.

### 6.2 Clinician review

1.  Clinician signs in.
2.  The app lists encounters the clinician is permitted to access.
3.  Clinician reviews answers and original uploaded documents.
4.  Any AI output is clearly labeled as an unverified draft.
5.  Clinician verifies source information and edits the draft if needed.
6.  Clinician approves or rejects the draft and records the decision.
7.  The system records the actor, timestamp, and state transition.

### 6.3 Document processing (optional)

1.  User uploads a supported file.
2.  Backend validates authorization, file size, type, and content where
    practical.
3.  The original file is stored privately; metadata is linked to the
    encounter.
4.  If enabled, OCR extracts text and records processing status.
5.  Authorized users can compare extracted text with the original.
6.  Any generated summary remains an unverified draft until reviewed.

## 7. Functional Requirements

Priority: **P0** required for MVP; **P1** desirable if time permits.

  -----------------------------------------------------------------------------
  ID                Requirement           Priority          Acceptance criteria
  ----------------- --------------------- ----------------- -------------------
  FR-01             Create session        P0                Authorized flow
                                                            creates a unique
                                                            session/encounter
                                                            ID and initial
                                                            status

  FR-02             Record consent        P0                Decision,
                                                            timestamp, and
                                                            policy version
                                                            persist;
                                                            consent-dependent
                                                            work is blocked
                                                            when consent is
                                                            absent

  FR-03             Deliver questionnaire P0                Versioned questions
                                                            appear in the
                                                            defined order and
                                                            supported question
                                                            types render
                                                            correctly

  FR-04             Validate answers      P0                Client and server
                                                            validate required
                                                            fields/formats and
                                                            return actionable
                                                            errors

  FR-05             Save/resume           P0                Saved answers
                                                            remain available to
                                                            an authorized user
                                                            after
                                                            refresh/re-entry

  FR-06             Submit intake         P0                Submission updates
                                                            status and prevents
                                                            accidental
                                                            duplicate
                                                            submission

  FR-07             Upload documents      P0                Only configured
                                                            file types/sizes
                                                            are accepted and
                                                            metadata links to
                                                            the correct
                                                            encounter

  FR-08             Authenticate          P0                Protected clinician
                    clinicians                              routes require
                                                            valid
                                                            authentication

  FR-09             Authorize access      P0                Server checks role
                                                            and encounter-level
                                                            access for every
                                                            protected operation

  FR-10             Clinician encounter   P0                Clinician can
                    list/detail                             list/open only
                                                            encounters
                                                            permitted by policy

  FR-11             Record review status  P0                Valid status
                                                            transitions are
                                                            recorded with actor
                                                            and timestamp

  FR-12             Audit events          P0                Consent,
                                                            submission,
                                                            upload/access,
                                                            draft generation,
                                                            and review
                                                            decisions create
                                                            audit events

  FR-13             OCR extraction        P1                Supported files
                                                            receive processing
                                                            status; failures do
                                                            not delete the
                                                            original

  FR-14             AI draft summary      P1                Output is labeled
                                                            unverified and
                                                            includes source
                                                            references where
                                                            technically
                                                            available

  FR-15             Edit/approve/reject   P1                Only an authorized
                    draft                                   clinician can
                                                            perform the action;
                                                            actor and timestamp
                                                            are recorded

  FR-16             Multiple UI languages P1                Agreed languages
                                                            are translated and
                                                            tested consistently

  FR-17             Kiosk reset           P0                Completion, logout,
                                                            or timeout clears
                                                            session-specific UI
                                                            data

  FR-18             Health checks         P1                Services expose
                                                            useful health
                                                            status for local
                                                            debugging
  -----------------------------------------------------------------------------

**Scope rule:** Deliver FR-01 through FR-12 and FR-17 reliably before
adding OCR or AI.

## 8. Non-Functional Requirements

  ----------------------------------------------------------------------------
  ID                      Area                    Requirement
  ----------------------- ----------------------- ----------------------------
  NFR-01                  Security                Server-side authentication,
                                                  authorization, validation,
                                                  and least privilege

  NFR-02                  Privacy                 Use synthetic data by
                                                  default and collect only
                                                  required information

  NFR-03                  Data protection         HTTPS in deployed
                                                  environments, protected file
                                                  storage, secrets outside
                                                  source control

  NFR-04                  Kiosk safety            Clear patient-specific state
                                                  on
                                                  timeout/logout/completion;
                                                  do not expose previous
                                                  users' data

  NFR-05                  Reliability             Confirm saves and handle
                                                  retryable failures without
                                                  duplicate records

  NFR-06                  Accessibility           Readable typography,
                                                  adequate contrast, keyboard
                                                  support, large touch
                                                  targets, clear errors

  NFR-07                  Performance             Measure baseline performance
                                                  on demo hardware and report
                                                  actual results

  NFR-08                  Maintainability         Document APIs, error
                                                  formats, configuration,
                                                  migrations, and tests

  NFR-09                  Observability           Use correlation IDs and
                                                  avoid logging unnecessary
                                                  sensitive content

  NFR-10                  Data integrity          Stable IDs, explicit states,
                                                  idempotent writes, retries
                                                  and reconciliation for
                                                  partial failures

  NFR-11                  Compatibility           Test the agreed
                                                  browser/device combination

  NFR-12                  Retention               Document demo-data reset and
                                                  deletion, including uploaded
                                                  files
  ----------------------------------------------------------------------------

## 9. Proposed Architecture and Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                React, Vite,            PWA, patient intake,
                          TypeScript, Tailwind    clinician dashboard
                          CSS                     

  Frontend-facing API     Node.js, Express,       BFF/API orchestration,
                          TypeScript              request aggregation,
                                                  upload coordination

  Core workflow service   Spring Boot, Spring     Encounter lifecycle,
                          Security                permissions, consent,
                                                  review/approval, audit

  Relational database     PostgreSQL              Users/roles, encounter
                                                  metadata, consent,
                                                  workflow state,
                                                  document registry,
                                                  reviews, audit

  Flexible data store     MongoDB                 Versioned
                                                  questionnaires,
                                                  flexible answers, OCR
                                                  results, AI draft
                                                  payloads and processing
                                                  metadata

  File storage            Private local storage   Original uploaded
                          for demo or private     documents
                          object storage          

  Optional AI worker      Python/FastAPI or       OCR/model integration
                          background worker       and draft generation

  Local environment       Docker Compose          Reproducible local
                                                  development/demo
  -----------------------------------------------------------------------

### Service ownership

-   Spring Boot owns authoritative clinical workflow state and the
    PostgreSQL records for encounters, consent, roles, approvals, and
    audit.
-   Node.js is the frontend-facing orchestration layer; it must not
    create a competing source of truth for clinical workflow state.
-   MongoDB stores flexible/versioned payloads, with stable encounter
    IDs and schema versions.
-   File storage holds original binaries. Databases store metadata and
    protected references, not large file binaries.
-   Assign one writer/owner to each business entity.
-   PostgreSQL and MongoDB do not share a normal transaction. Use
    idempotency, explicit processing status, retry handling, and
    reconciliation for partial failures.
-   An `/internal` URL prefix does not secure an endpoint; internal
    calls require network restrictions and service authentication.

### Request flow

1.  React PWA calls Node.js.
2.  Node.js validates request shape and coordinates calls.
3.  Spring Boot authorizes workflow actions and updates authoritative
    PostgreSQL state.
4.  The designated service stores flexible payloads in MongoDB.
5.  Original uploads are stored privately and registered against the
    encounter.
6.  The PWA receives only data appropriate for the current role.

## 10. Data Requirements

### 10.1 PostgreSQL

Suggested entities:

-   `users`: internal ID, minimum required profile fields,
    authentication reference, active status.
-   `roles` / `user_roles`: role assignments.
-   `encounters`: ID, status, timestamps, assigned/reviewing clinician
    if applicable.
-   `consents`: encounter ID, decision, policy version, timestamp,
    capture method.
-   `documents`: document ID, encounter ID, private storage key, media
    type, size, checksum, status, uploader, timestamps.
-   `summary_reviews`: draft reference, reviewer, decision, timestamp.
-   `audit_events`: actor/service, action, target ID, timestamp,
    outcome, correlation ID.

### 10.2 MongoDB

Suggested collections:

-   `questionnaire_versions`: question definitions, types, validation,
    branching rules, language keys.
-   `encounter_answers`: encounter ID, questionnaire version, answers,
    save timestamps, schema version.
-   `document_extractions`: document ID, extraction engine/version,
    text, available confidence metadata, status, timestamps.
-   `summary_drafts`: encounter ID, draft content, source references,
    model/provider version, status, timestamps.
-   `processing_jobs` (optional): job ID, type, status, retry count,
    timestamps, safe error category.

These are logical proposals, not final migrations. Confirm exact fields
and indexes before implementation.

### 10.3 Data rules

-   Use opaque IDs; avoid exposing sequential database IDs.
-   Store questionnaire/schema versions with answers.
-   Keep patient-reported values distinct from OCR-extracted and
    AI-generated values.
-   Mark missing/uncertain values instead of inventing facts.
-   Keep source references for generated statements where feasible.
-   Do not log passwords, tokens, document contents, or unnecessary
    medical data.
-   Provide a reset process that deletes both database records and
    associated files.

## 11. API Requirements

These proposed REST routes should be documented with payload schemas and
responses in OpenAPI before integration.

### Node.js PWA-facing API

  -----------------------------------------------------------------------------------------
  Method                  Endpoint                                 Purpose
  ----------------------- ---------------------------------------- ------------------------
  POST                    `/api/v1/sessions`                       Create intake session

  GET                     `/api/v1/sessions/:id`                   Retrieve authorized
                                                                   session status/details

  GET                     `/api/v1/sessions/:id/question`          Get next
                                                                   question/questionnaire
                                                                   state

  POST                    `/api/v1/sessions/:id/consent`           Record consent

  POST                    `/api/v1/sessions/:id/answers`           Validate and save
                                                                   answers

  POST                    `/api/v1/sessions/:id/submit`            Submit intake

  POST                    `/api/v1/sessions/:id/documents`         Upload an allowed
                                                                   document

  GET                     `/api/v1/sessions/:id/documents`         List authorized document
                                                                   metadata

  POST                    `/api/v1/sessions/:id/summary-drafts`    Request optional draft
                                                                   generation

  GET                     `/api/v1/doctor/encounters`              List encounters
                                                                   available to clinician

  GET                     `/api/v1/doctor/encounters/:id`          Retrieve authorized
                                                                   encounter

  POST                    `/api/v1/doctor/encounters/:id/review`   Record review outcome
  -----------------------------------------------------------------------------------------

Spring Boot internal operations may cover encounter creation/retrieval,
consent, state transitions, document registration, review/approval, and
audit. Protect them with authenticated service calls.

### API acceptance rules

-   Use a consistent JSON error shape with stable machine-readable
    codes.
-   Use suitable status codes, such as `400` invalid input, `401`
    unauthenticated, `403` forbidden, `409` state conflict, and `5xx`
    server error.
-   Validate on the server even if the client validates.
-   Add idempotency or duplicate protection to retryable writes.
-   Never trust a client-supplied encounter ID without checking access.
-   Do not expose private storage keys or unrestricted document URLs.

## 12. Workflow States

Suggested encounter states:

`DRAFT → IN_PROGRESS → SUBMITTED → UNDER_REVIEW → REVIEWED`

Optional transitions:

-   `IN_PROGRESS → ABANDONED` under a documented expiry or user action.
-   `UNDER_REVIEW → SUBMITTED` if a clinician returns intake for
    correction.
-   Reopening must be an explicit, audited transition.

Draft summary state is separate: `GENERATED → EDITED → APPROVED` or
`REJECTED`.

All transitions are validated server-side. A client cannot approve an
encounter by simply sending a status field.

## 13. AI and Clinical Safety

AI/OCR is optional and should only be added after the non-AI intake and
review workflow works.

1.  Label all AI output as an unverified draft.
2.  AI must not autonomously diagnose, prescribe, or approve a summary.
3.  Clinicians must be able to inspect original source answers and
    documents.
4.  Preserve source traceability wherever feasible.
5.  Do not fill missing facts silently; mark them as not provided or
    unclear.
6.  OCR/model failures must not remove access to the original document.
7.  Emergency messages must not rely solely on an LLM. Any such logic
    needs advisor review; do not claim the prototype is a validated
    triage system.
8.  Evaluate output on a documented synthetic test set and report
    errors/limitations.
9.  Do not send real patient data to an external AI service without
    explicit authorization and review of its data-handling terms.

## 14. Privacy and Security

-   Use synthetic data for development, screenshots, reports, and demos
    unless real data is explicitly authorized.
-   Collect only the fields needed for the project.
-   Document consent, retention, and deletion/reset policies.
-   If passwords are used, store only appropriately salted password
    hashes.
-   Keep secrets in environment variables or a secrets manager; commit
    placeholders only in `.env.example`.
-   Enforce role and encounter-level access on every protected endpoint.
-   Validate upload size, MIME type and file signature where practical;
    generate server-side filenames and keep files outside public web
    roots.
-   Authorize document downloads and use short-lived access where
    appropriate.
-   Configure CORS narrowly and implement safe session/token expiry and
    logout.
-   Never rely on hiding a UI button as authorization.
-   Audit important access and state changes without logging full
    medical content.
-   Clear kiosk state on logout, timeout, and completion.

## 15. PWA and Kiosk Requirements

-   Provide a web app manifest, app icons, and service worker for
    installation and static asset caching.
-   Support touch and keyboard use on the agreed screen sizes.
-   Display save confirmation and clear session status.
-   Provide safe retries for temporary network failures.
-   Cache static assets only by default. Do not cache patient answers,
    encounter responses, authentication responses, documents, or AI
    drafts in a shared kiosk cache.
-   Do not claim full offline support unless encryption, storage,
    conflict handling, and device controls are deliberately designed and
    tested.
-   Reset session-specific UI state on logout, timeout, and completion.
-   Provide loading, empty, network-error, and retry states.
-   Avoid sensitive details on the landing screen and in notifications.

## 16. Required Screens

1.  **Welcome/Start:** explanation, optional language selection, start
    button.
2.  **Consent:** purpose, choices, policy/version, continue/cancel.
3.  **Patient Intake:** progress, questions, validation, back/next.
4.  **Document Upload:** allowed formats/limits, progress, retry and
    failure states.
5.  **Submission Confirmation:** non-sensitive reference and next steps.
6.  **Staff Sign In:** authentication.
7.  **Clinician Encounter List:** authorized records with minimal
    identifying details.
8.  **Encounter Review:** answers, document list/viewer, processing
    status, review actions.
9.  **Draft Review (if AI enabled):** unverified label, sources, edit,
    approve/reject.
10. **Admin/Demo Setup:** protected configuration and demo reset.

## 17. Testing and Acceptance Plan

### Test types

-   Unit tests: validation, state transitions, questionnaire rules,
    access policy.
-   API integration tests: create session, consent, save answers,
    submit, upload registration, clinician review.
-   Authorization tests for every role and cross-encounter access
    attempts.
-   End-to-end patient-to-clinician workflow test.
-   Upload tests for unsupported types, incorrect content type,
    oversized/corrupt files, and storage failure.
-   PWA tests for refresh, timeout, logout, and kiosk reset.
-   Failure tests for duplicate requests, unavailable services, and
    partial PostgreSQL/MongoDB writes.
-   If AI/OCR is included, evaluate against a documented synthetic test
    set.

### Minimum end-to-end acceptance scenario

1.  Start all services using the setup guide.
2.  Start an intake session and record consent.
3.  Answer required questions and save progress.
4.  Refresh and verify saved answers are restored for an authorized
    session.
5.  Upload a synthetic supported document.
6.  Submit the intake.
7.  Sign in as a clinician and open the encounter.
8.  Review answers and document metadata.
9.  If AI is enabled, verify the draft is labeled unverified and can be
    edited/rejected as well as approved.
10. Verify an unauthorized user cannot access the encounter.
11. Complete the workflow and confirm the kiosk no longer shows the
    previous user's data.

## 18. Sixteen-Week Delivery Plan

  -----------------------------------------------------------------------
  Week                    Milestone               Deliverable
  ----------------------- ----------------------- -----------------------
  1                       Requirements/UX         Approved PRD, use
                                                  cases, wireframes, risk
                                                  list

  2                       Architecture/setup      Repository, local
                                                  environment, API
                                                  contract draft

  3--4                    Backend foundation      Authentication, roles,
                                                  encounter model,
                                                  migrations, Mongo
                                                  schemas

  5--6                    Patient intake          Consent, questionnaire,
                                                  validation, save/resume

  7--8                    Clinician workflow      Encounter list/detail,
                                                  review status, audit

  9--10                   Document handling       Secure upload,
                                                  metadata, authorized
                                                  viewing; optional OCR
                                                  spike

  11--12                  Optional AI             Draft generation,
                                                  source references,
                                                  clinician edit/review

  13--14                  Hardening               Security, end-to-end,
                                                  failure, and
                                                  accessibility tests

  15                      Evaluation/docs         Test results,
                                                  limitations, diagrams,
                                                  user guide

  16                      Final demo              Stable build, synthetic
                                                  dataset, report,
                                                  presentation, backup
                                                  plan
  -----------------------------------------------------------------------

**Schedule rule:** If behind, preserve the P0 intake and
clinician-review workflow. Defer AI/OCR before compromising security,
integrity, or testing.

## 19. Team Responsibilities

  -----------------------------------------------------------------------
  Member                  Primary ownership       Shared responsibilities
  ----------------------- ----------------------- -----------------------
  Member 1 --- React/PWA  Patient UI,             Accessibility and
                          questionnaire screens,  UI/API tests
                          PWA, clinician          
                          dashboard UI            

  Member 2 --- Spring     Workflow APIs, Spring   API contracts and
  Boot                    Security, PostgreSQL,   integration tests
                          state transitions,      
                          audit                   

  Member 3 ---            Node.js BFF, MongoDB    Data quality and
  Data/Python             schemas, optional       synthetic test set
                          OCR/AI evaluation or    
                          Python service          

  Member 4 --- Generalist Docker Compose, CI      Own a demonstrable
                          checks, test            feature, e.g. upload
                          coordination, seed/demo validation, audit
                          data, setup guide       viewer, or test
                                                  automation
  -----------------------------------------------------------------------

Every member should review pull requests and understand the full
workflow. Avoid making one member the sole owner of integration or
deployment.

## 20. Repository Layout

``` text
medikiosk/
├── frontend/          # React + Vite + TypeScript PWA
├── node-api/          # Express BFF/orchestration
├── spring-service/    # Spring Boot workflow service
├── ai-service/        # Optional OCR/AI worker
├── infra/
│   └── docker-compose.yml
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   ├── database-design.md
│   ├── api-contracts.md
│   ├── test-plan.md
│   └── user-guide.md
├── .env.example
└── README.md
```

Use feature branches and pull requests, linting/formatting, versioned
migrations, documented API contracts, tests for critical authorization
rules, and reproducible setup. Never commit secrets or unapproved
patient records.

## 21. Risks and Mitigations

  -----------------------------------------------------------------------
  Risk                    Impact                  Mitigation
  ----------------------- ----------------------- -----------------------
  Scope too large         Core workflow           Deliver P0 first;
                          unfinished              feature-flag AI/OCR

  Cross-database partial  Inconsistent records    Single service
  failure                                         ownership, idempotency,
                                                  retries, explicit
                                                  states, reconciliation

  Incorrect AI/OCR        Misleading summary      Unverified label,
                                                  source links, clinician
                                                  review, synthetic
                                                  evaluation

  Kiosk privacy exposure  Previous user's data    Timeout/reset, no
                          visible                 sensitive caching,
                                                  server-side
                                                  authorization

  Unsafe uploads          Exposure or disruption  Allowlist, size limits,
                                                  signature checks,
                                                  private storage

  Integration delays      Components fail to work Agree API contracts
                          together                early, use
                                                  mocks/contract tests

  External AI unavailable Demo failure            AI optional; core
                                                  non-AI workflow must
                                                  still work

  Duplicate business      Conflicting state       Clear service ownership
  logic                                           and documented
                                                  contracts
  -----------------------------------------------------------------------

## 22. Open Decisions

Resolve during Weeks 1--2:

-   Which languages are mandatory? Suggested initial scope: English; add
    Hindi if fully tested.
-   Will authentication use server-managed sessions or tokens? Document
    expiry, storage, and logout.
-   What file types and maximum upload size are allowed?
-   Is AI/OCR mandatory for the academic evaluation or an optional
    extension?
-   Will the demo run locally, on a campus network, or publicly?
-   What consent wording and demo-data retention/reset policy will be
    used?
-   Who will review clinical wording and any emergency-related messages?
-   Which browser/device will be used for the final demonstration?

## 23. Definition of Done

A feature is done when its acceptance criteria are met, server-side
validation/authorization is present where relevant, success and failure
states are handled, tests cover normal and important failure/permission
cases, documentation is updated, code is reviewed and merged, no secrets
or real patient data are committed, and the feature works in the
integrated demo.

## 24. Final MVP Recommendation

Build a complete **patient-intake-to-clinician-review workflow** first:
consent, versioned questionnaire, saved answers, controlled uploads,
role-based access, and audit events. Add OCR and AI-assisted draft
summaries only after that workflow is stable. Keep AI output unverified
until an authorized clinician explicitly reviews it.

The final academic report should distinguish implemented features from
planned features, include test evidence, document limitations, and avoid
claims of clinical accuracy or production readiness without appropriate
validation.
