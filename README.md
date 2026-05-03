# Dotfit Fitness

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![Website](https://img.shields.io/badge/Website-Live-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://dotfitfitness.in)
[![CI](https://github.com/mangeshraut712/Dotfit-Fitness/actions/workflows/ci.yml/badge.svg)](https://github.com/mangeshraut712/Dotfit-Fitness/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> Official website for **Dotfit Fitness** — Baner, Pune's K11-certified gym since 2012. Built as a production-grade pnpm monorepo with a React/Vite frontend, Express API backend, PostgreSQL, and AI coach support.

---

## ✨ Highlights

- **Premium landing page** with strong visuals, motion, and conversion-focused CTAs
- **Free trial booking** backed by PostgreSQL + Zod validation
- **Admin dashboard** for lead tracking and status updates
- **AI Health & Fitness Coach** with live streaming responses and offline fallback
- **Fast, SEO-friendly builds** with modern image, font, and metadata optimization

---

## 📍 Dotfit Fitness

| | |
|---|---|
| **Address** | 136/1, 5th Floor, Srushti Elegance, Old Baner-Balewadi Rd, Balewadi Phata, Pune 411045 |
| **Phone** | +91 95272 37213 |
| **Email** | Support@dotfitfitness.in |
| **Founded** | 2012 |
| **Members** | 25,000+ |
| **Rating** | 4.2/5 (726+ reviews) |
| **Certification** | K11 Certified |

### Timings

| Day | Morning | Evening |
|-----|---------|---------|
| Mon – Sat | 6:00 AM – 12:00 PM | 4:00 PM – 10:00 PM |
| Sunday | 6:00 AM – 12:00 PM | Closed |

> 12 PM – 2 PM: rest period. 2 PM – 4 PM: trainer workout time.

### Membership Pricing

| Plan | Regular | Happy Hours (12 PM – 5 PM, Mon–Sat) |
|------|---------|--------------------------------------|
| 1 Month | ₹3,500 | ₹3,000 |
| 3 Months | ₹5,500 | ₹5,000 |
| 6 Months | ₹7,500 | ₹7,000 |
| 1 Year | ₹12,000 | ₹10,000 |
| 7-Day Trial | ₹1,500 | — |
| Single Session | ₹500 | — |

### Gym Details

- 2 cleaners handle the male and female locker rooms
- Drinking water machine supports cold, normal, and hot water
- Membership transfer fee: ₹1,500–₹2,000
- Referral bonus: if an existing member brings a new client on a 6–12 month membership, the existing member gets a 1 month extension
- All classes are free to join and follow first-come, first-served seating/space rules
- Front desk is available for inquiries, holiday/closure updates, and general gym information
- Trainers are helpful and always ready to guide members on what to do next

---

## 🎨 Design & Experience

- Lime green brand accent: `#6aaa14`
- Dark premium sections: `bg-gray-950`
- Display font: **Oswald**
- Body font: **Inter**
- Floating phone / WhatsApp / AI coach actions for quick access
- Motion-powered hero, cards, and buttons for a polished feel

---

## 🧠 AI Coach

The chatbot is designed as a **world-class fitness consultant** focused on:

- Hypertrophy and strength training
- Nutrition and calorie management
- Gym equipment selection and exercise execution
- Injury-aware training modifications
- Dotfit-specific gym information

It supports:

- Streaming SSE responses
- Session memory
- Offline smart replies when the model is unavailable

---

## 🧰 Tech Stack

### Frontend — `artifacts/dotfit`

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| TypeScript 5.9 | Type safety |
| Tailwind CSS 4 | Styling |
| Framer Motion 12 | Animations |
| Lucide React | Icons |
| React Hook Form + Zod | Form validation |
| @tanstack/react-query | Server state |

### Backend — `artifacts/api-server`

| Technology | Purpose |
|------------|---------|
| Express 5 | HTTP server |
| PostgreSQL | Database |
| Drizzle ORM | Type-safe DB queries |
| Zod | Runtime validation |
| Pino | Structured logging |
| OpenRouter via Replit AI Integrations | AI chat streaming |

---

## 📦 Project Structure

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

## 🚀 Quick Start

```bash
pnpm install
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/dotfit run dev
```

---

## 🔌 API

Base path: `/api`

- `GET /api/healthz`
- `POST /api/contacts`
- `GET /api/contacts`
- `PATCH /api/contacts/:id/status`
- `POST /api/openrouter/conversations`
- `GET /api/openrouter/conversations/:id`
- `POST /api/openrouter/conversations/:id/messages` (SSE)

---

## ✅ CI / CD

GitHub Actions runs on push and pull request:

1. Install dependencies
2. Typecheck all packages
3. Security audit
4. Build frontend
5. Build API server
6. GitHub client check

---

## 🔗 Live Links

- **Website:** https://dotfitfitness.in
- **Replit:** https://dotfit-fitness--mbr63.replit.app/
- **GitHub:** https://github.com/mangeshraut712/Dotfit-Fitness

---

<p align="center">
  Built with care for <strong>Dotfit Fitness</strong> — Baner, Pune
</p>
