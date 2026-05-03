# Dotfit Fitness

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.9-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Website-Live-00C853?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://github.com/mangeshraut712/Dotfit-Fitness/actions/workflows/ci.yml/badge.svg" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
</p>

<p align="center"><strong>Official website for Dotfit Fitness — Baner, Pune.</strong></p>
<p align="center">A premium gym website with a React/Vite frontend, Express API backend, PostgreSQL, and an AI Health & Fitness Coach.</p>

---

## Why this project stands out

- Premium landing page with strong conversion-focused design
- Real free-trial booking flow backed by PostgreSQL
- AI Health & Fitness Coach with streaming + offline fallback
- Lead management dashboard for gym staff
- Polished SEO, metadata, and brand presentation

---

## Dotfit Fitness at a glance

| Item | Details |
|---|---|
| Address | 136/1, 5th Floor, Srushti Elegance, Old Baner-Balewadi Rd, Balewadi Phata, Pune 411045 |
| Phone | +91 95272 37213 |
| Email | Support@dotfitfitness.in |
| Founded | 2012 |
| Members | 25,000+ |
| Rating | 4.2/5 (726+ reviews) |
| Certification | K11 Certified |

### Timings

| Day | Morning | Evening |
|---|---|---|
| Mon–Sat | 6:00 AM – 12:00 PM | 4:00 PM – 10:00 PM |
| Sunday | 6:00 AM – 12:00 PM | Closed |

> 12 PM – 2 PM: rest period. 2 PM – 4 PM: trainer workout time.

### Membership

| Plan | Regular | Happy Hours |
|---|---|---|
| 1 Month | ₹3,500 | ₹3,000 |
| 3 Months | ₹5,500 | ₹5,000 |
| 6 Months | ₹7,500 | ₹7,000 |
| 1 Year | ₹12,000 | ₹10,000 |
| 7-Day Trial | ₹1,500 | — |
| Single Session | ₹500 | — |

### Gym details

- 2 cleaners maintain the male and female locker rooms
- Water machine supports cold, normal, and hot drinking water
- Membership transfer fee: ₹1,500–₹2,000
- Referral bonus: 1 month extension for bringing a new client on a 6–12 month membership
- All classes are free and first-come, first-served
- Front desk helps with inquiries, holidays, closures, and information
- Trainers are helpful and guide members on what to do next

---

## Design system

- Brand green: `#6aaa14`
- Premium dark sections: `bg-gray-950`
- Display font: Oswald
- Body font: Inter
- Floating quick actions for call, WhatsApp, and AI coach

---

## AI Coach

The chatbot focuses on:

- Strength and muscle gain
- Fat loss and calorie control
- Exercise selection and form
- Gym policies and Dotfit details
- Safe training guidance

It supports:

- Streaming SSE responses
- Session memory
- Offline smart replies

---

## Tech stack

### Frontend — `artifacts/dotfit`

- React 19
- Vite 7
- TypeScript 5.9
- Tailwind CSS 4
- Framer Motion 12
- Lucide React
- React Hook Form + Zod
- @tanstack/react-query

### Backend — `artifacts/api-server`

- Express 5
- PostgreSQL
- Drizzle ORM
- Zod
- Pino
- OpenRouter via Replit AI Integrations

---

## Project structure

```text
artifacts/
├── dotfit/          # React + Vite frontend
└── api-server/      # Express API
lib/
├── api-spec/        # OpenAPI spec + codegen
├── api-zod/         # Generated validation schemas
├── api-client-react/# Generated React Query hooks
└── db/              # Drizzle schema + DB connection
```

---

## Quick start

```bash
pnpm install
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/dotfit run dev
```

---

## API

Base path: `/api`

- `GET /api/healthz`
- `POST /api/contacts`
- `GET /api/contacts`
- `PATCH /api/contacts/:id/status`
- `POST /api/openrouter/conversations`
- `GET /api/openrouter/conversations/:id`
- `POST /api/openrouter/conversations/:id/messages` (SSE)

---

## CI / CD

GitHub Actions runs on push and pull request:

1. Install dependencies
2. Typecheck all packages
3. Security audit
4. Build frontend
5. Build API server
6. GitHub client check

---

## Live links

- Website: https://dotfitfitness.in
- Replit: https://dotfit-fitness--mbr63.replit.app/
- GitHub: https://github.com/mangeshraut712/Dotfit-Fitness

---

<p align="center">Built with care for <strong>Dotfit Fitness</strong> — Baner, Pune.</p>
