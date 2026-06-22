# Security AI Platform

An intelligent security monitoring platform that receives security events, analyzes risk with a Python/FastAPI service, stores results in PostgreSQL, and displays alerts, audit logs and metrics in a React dashboard.

## Overview

This project is a small SOC-style platform built with three services:

- **backend-node**: Main API for authentication, users, audit logs, security events, alerts, dashboard data, PostgreSQL access and communication with the AI service.
- **ai-service-python**: FastAPI microservice that calculates risk scores using rule-based analysis.
- **frontend**: React dashboard for events, alerts, users, audit activity, suspicious IPs and charts.

## Screenshots

The screenshots use sanitized demo data and documentation IP ranges to avoid exposing personal or real network information.

### Security dashboard

<img src="docs/screenshots/dashboard.png" alt="Security AI Platform dashboard with metrics, suspicious activity and recent alerts" width="900" />

### Security events

<img src="docs/screenshots/events.png" alt="Security event registration screen for suspicious login attempts" width="900" />

### User management

<img src="docs/screenshots/users.png" alt="User management screen with roles and active user controls" width="900" />

### Alert triage

<img src="docs/screenshots/alerts.png" alt="Alert triage screen with brute force and API abuse alerts" width="900" />

### Audit logs

<img src="docs/screenshots/audit.png" alt="Audit dashboard showing login and administrative activity" width="900" />

## Architecture

```txt
Frontend React
      |
      v
Backend Node.js / Express
      |
      v
PostgreSQL + Prisma
      |
      v
Python FastAPI Risk Service
```

## Features

- JWT authentication
- Role-based access control
- Audit dashboard for login and user-management actions
- Brute-force login protection with temporary account lockout
- Password recovery flow with temporary reset tokens
- Winston logging for app, error and security logs
- Swagger API documentation at `/api-docs`
- Jest + Supertest API tests
- Security event ingestion
- Risk scoring with Python/FastAPI
- Automatic alert creation for high-risk events
- Suspicious IP detection for repeated failed login attempts
- Dashboard metrics
- Event and alert tables
- User management
- Recharts visualizations
- Docker-ready structure

## Main Tables

- `users`
- `security_events`
- `alerts`
- `risk_scores`
- `audit_logs`

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Recharts
- Axios
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Socket.IO
- Winston
- Swagger
- Jest
- Supertest

### AI Service

- Python
- FastAPI
- Pydantic
- Rule-based risk analysis

## Project Structure

```txt
security-ai-platform/
|-- backend-node/
|   |-- prisma/
|   |   `-- migrations/
|   `-- src/
|       |-- controllers/
|       |-- routes/
|       |-- services/
|       |-- middlewares/
|       `-- utils/
|-- ai-service-python/
|   `-- app/
|-- frontend/
|   `-- src/
|       |-- api/
|       |-- components/
|       |-- context/
|       `-- pages/
|-- docs/
|   `-- screenshots/
|-- docker-compose.yml
|-- README.md
`-- .gitignore
```

## Local Setup

### 1. PostgreSQL

Create a PostgreSQL database:

```txt
security_ai_platform
```

Then configure:

```txt
backend-node/.env
```

Example:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/security_ai_platform
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
AI_SERVICE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:5173
```

### 2. Backend

```bash
cd backend-node
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Run tests:

```bash
npm test
```

Open API docs:

```txt
http://localhost:3000/api-docs
```

### 3. Python AI Service

```bash
cd ai-service-python
py -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Default Admin User

Created by `npm run seed`:

```txt
Email: admin@security.local
Password: Admin1234
```

Change this user before using the project outside local development.

## API Examples

Create a security event:

```json
{
  "type": "login_failed",
  "description": "Multiple failed login attempts from an unknown IP",
  "ip": "203.0.113.42",
  "country": "Colombia",
  "failedAttempts": 12,
  "requestCount": 20
}
```

AI service response:

```json
{
  "riesgo": "alto",
  "score": 92,
  "reasons": ["More than 10 failed attempts", "Activity during an unusual hour"],
  "model": "rules-v1"
}
```

## Security Notes

- After 5 failed login attempts, an account is locked for 15 minutes.
- Failed logins are recorded as security events and audit logs.
- Password reset tokens are stored as SHA-256 hashes and expire after 30 minutes.
- `.env` files are ignored by Git.

## Docker

Docker files and `docker-compose.yml` are included. If Docker is installed:

```bash
docker compose up --build
```

## Deployment Notes

This repository is a monorepo with three deployable services. Do not deploy the
repository root as a single Railway service. Create one service per folder:

| Service | Platform | Root directory |
| --- | --- | --- |
| Backend API | Railway | `backend-node` |
| Python AI service | Railway | `ai-service-python` |
| Frontend | Vercel or Railway | `frontend` |

Recommended production variables for the backend service:

```env
DATABASE_URL=<Railway PostgreSQL DATABASE_URL>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=production
AI_SERVICE_URL=<Python AI service URL>
ALLOWED_ORIGINS=<Frontend URL>
```

Recommended production variable for the frontend:

```env
VITE_API_URL=<Backend API URL>
```

On Railway, add public networking only to the services that need browser access
(backend and optional frontend). PostgreSQL should stay private.

## Notes

- Use `.env.example` files as templates if you add them later.
- The Python service currently uses rule-based analysis and can later be replaced or extended with ML models.
