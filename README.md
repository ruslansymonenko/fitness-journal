# Fitness Journal

Independent client and server projects for a minimalist fitness journal.

- Client: Next.js (App Router) + Tailwind CSS
- Server: Express.js + PostgreSQL + Prisma

## Prerequisites
- Node.js 18+
- PostgreSQL 13+

## Setup

### Server
```bash
cd server
npm install
# Create .env from ENV.example
#   copy ENV.example to .env and adjust values
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
# Server at http://localhost:4000
```

API Endpoints:
- GET `/health`
- GET `/entries`
- POST `/entries`
- GET `/entries/:id`

### Client
```bash
cd client
npm install
npm run dev
# Client at http://localhost:3000
```

Pages:
- `/` Home
- `/journal` Journal list (mock data)
- `/add` Add Entry (mock submit)

## Wiring client to server
Update the client fetch calls to hit `http://localhost:4000`. Consider a proxy or environment variables for different environments.

## Scripts
- Client: `dev`, `build`, `start`
- Server: `dev`, `build`, `start`, `prisma:generate`, `prisma:migrate`, `prisma:studio`
