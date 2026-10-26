# MediKiosk AiEngine Execution Plan

**Date:** 2026-10-26  
**Source:** `../PRD.md`  
**Scope:** Optional OCR/extraction and AI draft-summary worker. This plan is intentionally downstream of the Backend P0 workflow and must never become the source of truth for encounters, consent, authorization, or clinical review.

## Summary

Build a feature-gated, authenticated processing service that accepts authorized document-processing jobs from the Backend, extracts text where supported, and optionally creates a clearly labeled unverified draft summary. The service preserves original documents, tracks processing status and failures, records model/provider versions, and emits source references where technically available.

The AiEngine cannot diagnose, prescribe, triage, approve, reject, or directly mutate encounter workflow state. It must not be required for intake submission or clinician review. External model use is disabled by default and must be explicitly configured and authorized; development and evaluation use synthetic data only.

## Technical Context

**Language/Version:** Python 3.11+ with FastAPI and a background worker  
**Primary dependencies:** FastAPI, Pydantic, a typed HTTP client, OCR adapter(s), optional model-provider adapter(s), structured logging, pytest, and an isolated synthetic evaluation harness  
**Storage:** MongoDB for extraction results, draft payloads, processing jobs, source references, and status; original binaries remain in Backend-owned private storage  
**Integration:** Authenticated Backend-to-AiEngine job API with opaque document/encounter IDs, correlation IDs, idempotency keys, and explicit feature flags  
**Testing:** Adapter unit tests, API contract tests, safety/policy tests, failure/retry tests, synthetic evaluation set, and integration tests against Backend stubs  
**Target platform:** Docker Compose local development; optional worker mode for asynchronous jobs  
**Constraints:** No real patient data by default, no autonomous clinical decisions, no silent filling of missing facts, no unrestricted file URLs, and no deletion of originals on processing failure

## Constitution Check

- **Backend ownership:** PASS. AiEngine stores processing artifacts only and asks Backend to expose/update authorized workflow data through contracts.
- **Human oversight:** PASS. Every generated summary is `UNVERIFIED` until an authorized clinician acts in Backend.
- **Traceability:** PASS. Draft claims carry source references or explicit missing/unclear markers.
- **Failure safety:** PASS. OCR/model errors produce a failed status and safe error category while originals remain available.
- **Privacy:** PASS. Synthetic fixtures, minimal payloads, redacted logs, configurable retention, and external-provider opt-in are required.
- **Reliability:** PASS. Jobs are idempotent, retry boundedly, and expose processing status for reconciliation.

## Applied Guidelines

- Use typed request/response models and reject unknown or malformed job data.
- Separate OCR and summary provider adapters from orchestration so unavailable providers fail explicitly rather than returning success-shaped empty output.
- Treat provider output as untrusted data: normalize, validate, attach provenance, and reject unsupported claims or missing safety metadata.
- Use bounded timeouts, retry only transient failures, and make retries idempotent by job key.
- Never log document contents, prompts, credentials, tokens, or full generated medical text.
- Keep provider credentials in environment variables/secrets manager and keep provider use disabled unless explicitly enabled.

## Prerequisites and Contract

Backend must provide:

- An authenticated job submission contract containing `jobId`, opaque `encounterId`, opaque `documentId`, document access mechanism approved by Backend, requested operation, schema version, and correlation/idempotency IDs.
- A way for AiEngine to obtain the original privately without exposing public storage keys or bypassing Backend authorization.
- A callback or polling contract for `QUEUED`, `PROCESSING`, `COMPLETED`, and `FAILED` status plus safe error categories.
- A persistence/registration contract for extraction results and draft references.
- A clinician-facing contract that labels all drafts `UNVERIFIED` and keeps approval/rejection in Backend.

## Implementation Steps

### Phase 1: Setup and Safety Foundation

#### Plan 1.1 — Scaffold service and secure configuration

- **Requirements:** FR-18, NFR-01, NFR-02, NFR-03, NFR-08, NFR-09
- **Description:** Create the FastAPI service, worker entry point, typed settings, health/readiness endpoints, authenticated Backend client, correlation-ID middleware, redacted structured logs, provider feature flags, and `.env.example`.

#### Plan 1.2 — Define processing contracts and safety schema

- **Requirements:** FR-12, FR-13, FR-14, FR-15, NFR-05, NFR-09, NFR-10
- **Description:** Define job, status, extraction, source-reference, draft, and safe-error schemas. Include idempotency, schema/provider versions, explicit provenance, `UNVERIFIED` status, missing/unclear markers, and no approval capability.

### Phase 2: OCR/Extraction

#### Plan 2.1 — Implement safe document acquisition and OCR adapters

- **Requirements:** FR-13, FR-12, NFR-01, NFR-02, NFR-03
- **Description:** Fetch only Backend-authorized originals, validate job/document identity and size/type constraints, route supported formats to isolated OCR adapters, and return normalized text plus confidence metadata without altering the original.

#### Plan 2.2 — Implement asynchronous job lifecycle

- **Requirements:** FR-13, FR-18, NFR-05, NFR-09, NFR-10
- **Description:** Persist job state, support bounded retries for transient failures, classify permanent/provider failures, expose status, deduplicate by idempotency key, and make reconciliation possible after worker or database interruption.

### Phase 3: Optional Draft Summary

#### Plan 3.1 — Implement source-grounded draft generation

- **Requirements:** FR-14, FR-12, NFR-01, NFR-02, NFR-09, NFR-10
- **Description:** Generate structured draft content only from authorized patient answers and/or extraction results. Attach source references, provider/model version, generation timestamp, and `UNVERIFIED` status. Represent absent or uncertain facts explicitly rather than inventing them.

#### Plan 3.2 — Implement draft edit/decision integration

- **Requirements:** FR-15, FR-12, NFR-01, NFR-10
- **Description:** Return draft artifacts to Backend for clinician editing and decision. Do not expose an AiEngine approval endpoint; verify that only Backend-owned clinician operations can change the draft to approved or rejected.

### Phase 4: Evaluation and Hardening

#### Plan 4.1 — Build synthetic safety and quality evaluation

- **Requirements:** FR-13, FR-14, FR-15, NFR-02, NFR-07
- **Description:** Create a versioned synthetic document/question-answer set and measure extraction errors, unsupported formats, missing facts, source coverage, latency, and failure behavior. Report limitations; do not claim clinical accuracy.

#### Plan 4.2 — Verify integration, privacy, and recovery

- **Requirements:** FR-12, FR-13, FR-14, FR-15, FR-18, NFR-01 through NFR-12
- **Description:** Test unauthorized jobs, cross-encounter IDs, duplicate jobs, provider outages, malformed files, timeout/retry recovery, original-file preservation, log redaction, health checks, retention/reset, and Backend contract compatibility.

## Task Breakdown

### Phase 1 — Setup and Safety Foundation

- [ ] T001 [P] [Plan:1.1] Create `AiEngine/app`, `AiEngine/worker`, `AiEngine/tests`, and `AiEngine/evaluation` package boundaries with FastAPI and worker entry points.
- [ ] T002 [P] [Plan:1.1] Add `AiEngine/.env.example` with Backend URL, service-auth configuration, MongoDB URL, provider flags, size/time limits, retry limits, and retention settings.
- [ ] T003 [P] [Plan:1.1] Implement `/health` and `/ready`, correlation-ID middleware, authentication dependency, and sensitive-field log redaction in `AiEngine/app`.
- [ ] T004 [Plan:1.2] Define Pydantic models for processing jobs, statuses, extraction results, source references, drafts, safe errors, and schema/provider versions.
- [ ] T005 [Plan:1.2] Add idempotency and safety validators that reject missing encounter/document identity, unsupported operations, approval requests, and malformed provenance.

### Phase 2 — OCR/Extraction

- [ ] T006 [P] [Plan:2.1] Implement the Backend-authorized document acquisition client without exposing or persisting unrestricted storage URLs.
- [ ] T007 [P] [Plan:2.1] Implement format/size/signature validation and normalized extraction interfaces for supported document types.
- [ ] T008 [P] [Plan:2.1] Implement OCR adapter(s) that return text, confidence metadata where available, engine/version, and explicit unsupported/error results.
- [ ] T009 [Plan:2.2] Implement asynchronous job persistence and worker transitions for `QUEUED`, `PROCESSING`, `COMPLETED`, and `FAILED`.
- [ ] T010 [Plan:2.2] Add bounded transient retry, idempotency deduplication, safe error categories, and recovery/reconciliation after worker interruption.
- [ ] T011 [Plan:2.2] Implement Backend callback/status client with authenticated requests, timeout handling, correlation IDs, and contract-version checks.

### Phase 3 — Optional Draft Summary

- [ ] T012 [P] [Plan:3.1] Implement provider adapter interfaces and a disabled-by-default model configuration with explicit timeout and data-handling settings.
- [ ] T013 [Plan:3.1] Implement source-grounded draft generation that marks missing/uncertain facts and emits source references, model/provider version, and `UNVERIFIED`.
- [ ] T014 [Plan:3.1] Add output validation rejecting diagnosis, prescription, autonomous approval, unsupported emergency triage, and untraceable claims.
- [ ] T015 [Plan:3.2] Implement draft persistence and Backend registration/status integration without adding approve/reject behavior to AiEngine.

### Phase 4 — Evaluation and Hardening

- [ ] T016 [P] [Plan:4.1] Add synthetic fixtures covering supported files, poor-quality files, missing facts, ambiguous text, and provider failures.
- [ ] T017 [P] [Plan:4.1] Add evaluation scripts/tests for extraction quality, source-reference coverage, unverified labeling, latency, and safe failure behavior.
- [ ] T018 [P] [Plan:4.2] Add API and integration tests for authentication, cross-encounter denial, duplicate jobs, retries, malformed uploads, provider outage, and original preservation.
- [ ] T019 [P] [Plan:4.2] Add privacy tests for redacted logs, no credential/document leakage, external-provider opt-in, retention/reset, and health/readiness behavior.
- [ ] T020 [Plan:4.2] Complete `AiEngine/README.md` with local setup, synthetic-only policy, contract references, feature flags, evaluation method, limitations, and operational troubleshooting.

## Project Structure

```text
AiEngine/
├── app/
│   ├── api.py
│   ├── config.py
│   ├── auth.py
│   ├── contracts.py
│   ├── health.py
│   ├── jobs.py
│   ├── extraction/
│   ├── summarization/
│   └── storage/
├── worker/
│   └── main.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
├── evaluation/
│   ├── fixtures/
│   └── run_evaluation.py
├── .env.example
└── README.md
```

## Testing Strategy

- **App type:** Authenticated asynchronous processing API and worker.
- **Critical journeys:** authorized OCR job completion; unsupported/corrupt file failure with original preserved; duplicate/retried job; source-grounded unverified draft; unauthorized/cross-encounter denial; provider outage recovery.
- **Primary validation stack:** pytest with FastAPI client, MongoDB integration, mocked Backend contract, isolated OCR/model adapters, and synthetic evaluation fixtures.
- **Fallback matrix:** MongoDB container → local MongoDB instance or repository test double; provider integration → deterministic local adapter; worker integration → direct task execution with status assertions.
- **Environment requirements:** Python 3.11+, Docker/MongoDB, Backend stub or running Backend, synthetic files, and no external provider credentials for default tests.
- **Known gaps:** Synthetic evaluation cannot establish clinical accuracy; deterministic adapters do not prove external provider behavior; fallback storage tests do not prove production object-storage policy.
- **Test data strategy:** Use synthetic documents only, unique opaque job/encounter/document IDs, isolate each test, and delete generated artifacts after each run.
- **Acceptance criteria:** Every job is authenticated and idempotent, original files remain available after any processing failure, output is explicitly unverified and source-grounded, no approval/diagnosis/prescription path exists, and all status transitions are observable.
- **Validation review expectations:** Confirm no real data is required, provider use is opt-in, logs are redacted, Backend remains authoritative, and documented limitations match measured evaluation results.

## Requirement Mapping

| Requirement | Plan items | Implementation evidence |
|---|---|---|
| FR-12 Audit events | 1.2, 2.2, 3.1, 3.2, 4.2 | Status callbacks, generation metadata, Backend audit contract |
| FR-13 OCR extraction | 2.1, 2.2, 4.1, 4.2 | OCR adapters, processing jobs, status/error tests |
| FR-14 AI draft summary | 1.2, 3.1, 4.1 | Source-grounded draft schema, unverified output, evaluation |
| FR-15 Edit/approve/reject | 3.2, 4.2 | Backend-only decision contract and negative approval tests |
| FR-18 Health checks | 1.1, 2.2, 4.2 | `/health`, `/ready`, worker status and docs |
| NFR-01 Security | 1.1, 1.2, 2.1, 4.2 | Authenticated jobs, authorization tests, no unsafe actions |
| NFR-02 Privacy | 1.1, 3.1, 4.1, 4.2 | Synthetic fixtures, provider opt-in, redacted output |
| NFR-03 Data protection | 1.1, 2.1, 4.2 | Env secrets, private acquisition, retention tests |
| NFR-04 Kiosk safety | 4.2 | Backend-owned reset verification; no shared client cache/artifacts |
| NFR-05 Reliability | 1.2, 2.2, 4.2 | Idempotency, retries, recovery, original preservation |
| NFR-06 Accessibility | 4.2 | Clear machine-readable statuses/errors consumed by Frontend |
| NFR-07 Performance | 4.1 | Measured extraction/generation latency and evaluation report |
| NFR-08 Maintainability | 1.1, 1.2, 4.2 | Typed contracts, adapters, README, health endpoints |
| NFR-09 Observability | 1.1, 2.2, 4.2 | Correlation IDs, status lifecycle, redacted logs |
| NFR-10 Data integrity | 1.2, 2.2, 3.1, 4.2 | Versioned schemas, idempotency, provenance, reconciliation |
| NFR-11 Compatibility | 4.2 | Backend contract-version and integration tests |
| NFR-12 Retention | 4.2 | Artifact reset/deletion tests and documented policy |

## Safety and Delivery Gates

1. **Backend dependency gate:** Do not enable AiEngine until Backend P0 tests pass and authorized document acquisition/status contracts are available.
2. **Failure-safety gate:** A provider/OCR failure must leave the original document and clinician review path usable.
3. **Human-review gate:** Every draft is `UNVERIFIED`; only Backend-authorized clinicians can edit, approve, or reject it.
4. **Evaluation gate:** Synthetic evaluation results, errors, limitations, and measured latency are documented before demo use.
