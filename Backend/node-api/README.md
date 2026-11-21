# MediKiosk Node.js BFF (API Gateway)

Node.js + Express Backend-for-Frontend (BFF) service for MediKiosk. Orchestrates requests from the React frontend to the authoritative Spring Boot backend.

## Architecture

```
React / Client
     │ (Port 3000)
     ▼
Node.js BFF (Express) ── (Port 5000)
     │
     │ SpringClient (HTTP Client / native fetch)
     ▼
Spring Boot Service  ── (Port 8081)
     │
     ▼
PostgreSQL Database
```

## Features

- **Centralized SpringClient:** Reusable, configurable HTTP client with GET, POST, PUT, PATCH, DELETE support.
- **Resilient Error Handling:** Graceful handling of connection refused, timeouts (`AbortSignal.timeout`), and downstream HTTP errors without leaking sensitive stack traces.
- **Tracing & Correlation:** Automatic `X-Correlation-ID` extraction, generation, and downstream forwarding.
- **Secure Service-to-Service Communication:** Optional `X-Service-API-Key` injection.
- **Configurable Environment:** Zero hardcoded URLs or ports via `src/config/env.js`.

## Setup & Running

### 1. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configuration keys:
| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port Node API listens on |
| `NODE_ENV` | `development` | Application environment |
| `SPRING_SERVICE_URL` | `http://localhost:8081` | Spring Boot service base URL |
| `SPRING_SERVICE_TIMEOUT` | `5000` | Downstream request timeout (ms) |
| `SERVICE_API_KEY` | `c2VjdXJlLW1lZGlraW9zay1zZXJ2aWNlLWFwaS1rZXktMjAyNg==` | Shared service-to-service key |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Allowed CORS origins |

### 2. Start the Service
```bash
npm install
npm run dev   # Development with nodemon
# or
npm start     # Production
```

## Endpoints

### 1. Node API Standalone Health
```http
GET /api/v1/health
```
Response:
```json
{
  "success": true,
  "service": "node-api",
  "status": "up",
  "timestamp": "2026-11-21T18:00:00.000Z"
}
```

### 2. Downstream Dependency Health
```http
GET /api/v1/health/dependencies
```
Success Response (HTTP 200 when Spring Boot is running):
```json
{
  "success": true,
  "dependencies": {
    "springService": {
      "status": "up",
      "message": "Spring Boot service is reachable"
    }
  }
}
```
Failure Response (HTTP 503 when Spring Boot is stopped or unreachable):
```json
{
  "success": false,
  "dependencies": {
    "springService": {
      "status": "down",
      "message": "Spring Boot service is unavailable"
    }
  }
}
```
