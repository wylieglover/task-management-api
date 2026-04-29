# Task Management API

A RESTful task management API built with Node.js, TypeScript, and Express. Designed as a focused implementation of production-grade authentication patterns, input validation, and secure data access.

## Features

### Authentication
- **JWT Access + Refresh Token Flow** — Short-lived access tokens (15min production / 5hr development) paired with 7-day refresh tokens
- **Redis-Backed Token Rotation** — Refresh tokens are stored in Redis and rotated on every use; reusing an invalidated token is rejected immediately
- **bcrypt Password Hashing** — Passwords hashed with a cost factor of 10; enforced max length of 72 characters guards against bcrypt truncation attacks
- **Password Complexity Enforcement** — Registration requires uppercase, lowercase, numeric, and special characters via strict Zod schemas

### Security & Reliability
- **Per-Endpoint Rate Limiting** — Tiered limits across auth routes: 5 registrations/hr, 10 login attempts/15min (successful requests excluded), 20 refresh attempts/15min, and a global 300 req/15min API ceiling
- **User-Scoped Authorization** — All item operations are scoped to the authenticated user; cross-user access is structurally prevented at the query layer
- **Centralized Error Handling** — Single error middleware normalizes HttpError, Prisma (P2002, P2025), and Zod validation errors into consistent JSON responses with appropriate status codes

### Validation
- **Strict Zod Schemas** — All request bodies, query parameters, and route params are validated via a reusable `validate` middleware before reaching controllers
- **Type-Safe Query Parsing** — Boolean coercion for query strings, integer validation and transformation for ID params

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express (TypeScript) |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache / Token Store | Redis (ioredis) |
| Validation | Zod |
| Auth | JWT, bcrypt |

## API Endpoints

### Auth
```
POST /api/auth/register   — Register a new user
POST /api/auth/login      — Login and receive access + refresh tokens
POST /api/auth/refresh    — Rotate refresh token and receive new token pair
```

### Items
```
POST   /api/item         — Create a task
GET    /api/item         — List tasks (optional ?completed=true|false filter)
GET    /api/item/:id     — Get task by ID
PUT    /api/item/:id     — Update task description or completion status
DELETE /api/item/:id     — Delete a task
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis

### Installation

```bash
git clone https://github.com/wylieglover/task-management-api.git
cd task-management-api
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://username:password@localhost:5432/task_db"

JWT_SECRET=your_jwt_secret_here

REDIS_HOST=localhost
REDIS_PORT=6379
```

### Database Setup

```bash
npx prisma migrate dev
```

### Start Development Server

```bash
npm run dev
```

## Design Notes

**Why Redis for refresh tokens?**
Storing refresh tokens in Redis enables immediate invalidation — if a token is compromised or a user logs out, the token is deleted and cannot be reused regardless of its remaining TTL. A stateless JWT-only approach cannot achieve this without a blocklist.

**Why separate rate limits per route?**
Login and registration are higher-value brute force targets than general API usage. Granular limits allow tighter restrictions on sensitive auth endpoints without throttling normal API consumers.

**Why validate params before controllers?**
The `validate` middleware runs Zod schemas and stores parsed, type-safe values in `res.locals` before any controller logic runs. This keeps controllers free of validation concerns and ensures no raw request data reaches business logic.