# Security AI Platform

An intelligent security monitoring platform that receives security events, analyzes risk with a Python/FastAPI service, stores results in PostgreSQL, and displays alerts and metrics in a React dashboard.

## Overview

This project is a small SOC-style platform built with three services:

- **backend-node**: Main API for authentication, users, security events, alerts, dashboard data, PostgreSQL access, and communication with the AI service.
- **ai-service-python**: FastAPI microservice that calculates risk scores using rule-based analysis.
- **frontend**: React dashboard for events, alerts, users, and charts.

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
- Security event ingestion
- Risk scoring with Python/FastAPI
- Automatic alert creation for high-risk events
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

### AI Service

- Python
- FastAPI
- Pydantic
- Rule-based risk analysis

## Project Structure

```txt
security-ai-platform/
├── backend-node/
│   ├── prisma/
│   └── src/
├── ai-service-python/
│   └── app/
├── frontend/
│   └── src/
├── docker-compose.yml
├── README.md
└── .gitignore
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
npx prisma migrate dev --name init
npm run seed
npm run dev
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
  "ip": "181.50.12.10",
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

## Docker

Docker files and `docker-compose.yml` are included. If Docker is installed:

```bash
docker compose up --build
```

## Notes

- `.env` files are ignored by Git.
- Use `.env.example` files as templates.
- The Python service currently uses rule-based analysis and can later be replaced or extended with ML models.

