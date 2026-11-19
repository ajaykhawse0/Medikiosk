# MediKiosk Backend — Auth & Workflow Service

Spring Boot backend module providing authentication, role-based authorization, doctor management, password reset workflows, audit logging, and patient search for MediKiosk.

---

## Prerequisites

- **Java:** JDK 21 (installed at `C:\Program Files\Java\jdk-21.0.12.1`)
- **Maven:** 3.9+ (installed at `C:\Program Files\apache-maven-3.10.1`)
- **PostgreSQL:** 18 (installed at `C:\Program Files\PostgreSQL\18`)
- **Node.js:** LTS (BFF layer)

---

## 1. Quick Start

### Step 1: Initialize Database
Run PowerShell as Administrator or with access to PostgreSQL:
```powershell
cd Backend\spring-service
.\init-db.ps1
```
Or execute manually with `psql`:
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h 127.0.0.1 -p 5432 -f db-init.sql
```
This creates:
- User: `medikiosk` with password `medikioskPostGre`
- Databases: `medikiosk` and `medikiosk_dev` (both owned by `medikiosk`)
- Enables `pgcrypto` extension for UUID generation

### Step 2: Configure Environment
Copy `.env.example` to `.env` in `Backend/` (already pre-configured for local dev):
```properties
DB_URL=jdbc:postgresql://127.0.0.1:5432/medikiosk_dev
DB_USERNAME=medikiosk
DB_PASSWORD=medikioskPostGre
JWT_SECRET=7r2aG/KGjZGIMaNjSd904AxKNrrLcQ7vMJL+rHQGoeY=
ADMIN_BOOTSTRAP_ENABLED=true
ADMIN_BOOTSTRAP_EMAIL=admin@medikiosk.local
ADMIN_BOOTSTRAP_PASSWORD=Ajay@Medikiosk06
```

### Step 3: Run the Spring Service
Run via PowerShell:
```powershell
cd Backend\spring-service
.\run-service.ps1
```
Or double-click `run-service.bat`.

Once started:
- **API Base:** `http://localhost:8080/api/v1`
- **Swagger UI:** `http://localhost:8080/api/v1/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/api/v1/api-docs`

---

## 2. Admin Bootstrap
On first startup, Flyway automatically runs migrations `V1` through `V9` (seeding `ADMIN` and `DOCTOR` roles).
`AdminBootstrap` automatically creates the initial `ADMIN` user if none exists:
- **Email:** `admin@medikiosk.local`
- **Password:** `Ajay@Medikiosk06`
- **Role:** `ADMIN`
- **Status:** `ACTIVE`

---

## 3. Core API Endpoints

### Auth (`/api/v1/auth`)
- `POST /api/v1/auth/login` — Login with credentials (returns access token + refresh token)
- `POST /api/v1/auth/logout` — Revoke active refresh tokens
- `GET /api/v1/auth/me` — Current authenticated user profile
- `POST /api/v1/auth/refresh` — Rotate refresh token for a new access token
- `POST /api/v1/auth/change-password` — Change password (requires auth)
- `POST /api/v1/auth/forgot-password` — Request password reset link

### Admin (`/api/v1/admin`) — *Requires ADMIN role*
- `POST /api/v1/admin/doctors` — Create doctor (generates temporary password, sets `mustChangePassword=true`)
- `GET /api/v1/admin/doctors` — List doctors (paginated, query search by name/email)
- `GET /api/v1/admin/doctors/{doctorId}` — Doctor detail view
- `PUT /api/v1/admin/doctors/{doctorId}` — Update doctor details
- `PATCH /api/v1/admin/doctors/{doctorId}/status` — Activate/Deactivate doctor
- `GET /api/v1/admin/password-reset-requests` — List reset requests
- `PATCH /api/v1/admin/password-reset-requests/{requestId}/approve` — Approve password reset
- `PATCH /api/v1/admin/password-reset-requests/{requestId}/reject` — Reject password reset

### Doctor (`/api/v1/doctor`) — *Requires DOCTOR role*
- `GET /api/v1/doctor/profile` — View own profile
- `PUT /api/v1/doctor/profile` — Update own permitted profile fields
- `POST /api/v1/doctor/password-reset-requests` — Submit password reset request
- `GET /api/v1/doctor/password-reset-requests` — View own requests
- `POST /api/v1/doctor/reset-password` — Complete password reset using approved one-time token
- `GET /api/v1/doctor/patients/search?email=` — Search patient by exact email (audited)

---

## 4. Security Architecture

1. **Password Security:** BCrypt strength 12 for all passwords. Plaintext is never stored.
2. **Token Lifecycle:** Short-lived JWT access tokens (15 min) + rotating SHA-256 hashed refresh tokens (7 days).
3. **Lockout Protection:** 5 consecutive failed logins lock account for 15 minutes.
4. **Password Reset:**
   - Single-use, cryptographically secure random token (48 bytes, Base64Url).
   - Only SHA-256 hash stored at rest.
   - Requires ADMIN approval; doctor cannot approve own request.
   - Resets revoke all active sessions.
5. **Audit Logging:** Every authentication, status change, reset, and patient search is recorded to `audit_logs` without exposing sensitive credentials.
