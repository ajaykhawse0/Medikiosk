# MediKiosk Frontend — React.js Kiosk & Landing Web App

Modern, accessible, kiosk-friendly web app built with React 18, Vite, and Tailwind CSS following the MediKiosk clinical design system.

---

## Features

- **Doctor Dashboard (`/doctor`):**
  - **KPI Metrics:** Real-time summary counts for Ready for Review, Under Review, Completed Today, and High Pain/Urgent Triage.
  - **Encounter Queue Table:** Tabbed filtering (`All`, `Ready`, `In Progress`, `Completed`, `Flagged Alerts`) and live text search across patient names, encounter IDs, and clinical symptoms.
  - **Detailed Clinical Encounter Review Drawer:**
    - Full patient demographics and kiosk check-in timestamp.
    - Clinical alerts (e.g. severe penicillin allergy, fever).
    - Structured health questionnaire answers.
    - Uploaded medical documents viewer (PDFs, images) with checksum verification.
    - Disposition actions: "Approve & Sign Chart" (`REVIEWED`), "Flag for Nurse Triage", differential clinical notes.
  - **Audited Patient Search Modal (`GET /api/v1/doctor/patients/search?email=`):** Exact email match search compliant with backend PRD security rules.
  - **Doctor Profile Modal (`GET /api/v1/doctor/profile`):** View/update specialization, department, and contact phone.
  - **Password Reset Modal (`POST /api/v1/doctor/password-reset-requests`):** Clinician password reset flow with admin approval token entry.
- **Ambulatory Terminal Kiosk Mockup:** Interactive symptom selection, dynamic step indicator, discomfort slider (1–10), and verified digital signature/document badges.
- **Clinician Workspace Preview:** Real-time patient triage card, severe allergy flags, temperature alerts, and charting triage approval simulation.
- **3-Step Process & 6 Platform Capabilities:** Explains patient intake to clinician handoff.
- **Interactive Modals:**
  - **Staff Login Modal:** Authenticates directly with the Spring Boot backend (`/api/v1/auth/login`) or provides one-click Demo Admin / Demo Doctor preview tokens, seamlessly redirecting to `/doctor`.
  - **Patient Intake Modal:** Fast, touch-friendly legal name and normalized email session intake.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build
```bash
npm run build
```
Build output is generated in `./dist`.
