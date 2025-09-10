# Fitness Journal API (Express + Prisma)

## Environment
Copy `ENV.example` to `.env` and set values.

## Commands
```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

## Endpoints
- GET `/health`
- GET `/entries`
- POST `/entries`
- GET `/entries/:id`
