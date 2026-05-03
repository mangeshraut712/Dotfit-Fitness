# Dotfit Fitness

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![Website](https://img.shields.io/badge/Website-Live-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://dotfitfitness.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/mangeshraut712/Dotfit-Fitness/pulls)
[![GitHub issues](https://img.shields.io/github/issues/mangeshraut712/Dotfit-Fitness.svg?style=flat-square)](https://github.com/mangeshraut712/Dotfit-Fitness/issues)
[![GitHub stars](https://img.shields.io/github/stars/mangeshraut712/Dotfit-Fitness.svg?style=flat-square)](https://github.com/mangeshraut712/Dotfit-Fitness/stargazers)
[![CI](https://github.com/mangeshraut712/Dotfit-Fitness/actions/workflows/ci.yml/badge.svg)](https://github.com/mangeshraut712/Dotfit-Fitness/actions)

> The official website for **Dotfit Fitness** — Baner, Pune's K11-certified gym since 2012. Built as a production-grade pnpm monorepo with a React/Vite frontend and Express API backend.

---

## About Dotfit Fitness

| | |
|---|---|
| **Address** | 136/1, 5th Floor, Srushti Elegance, Old Baner-Balewadi Rd, Balewadi Phata, Pune 411045 |
| **Phone** | +91 95272 37213 |
| **Email** | Support@dotfitfitness.in |
| **Founded** | 2012 |
| **Members** | 25,000+ |
| **Rating** | 4.2 / 5 (726+ Google reviews) |
| **Certification** | K11 Certified (Floor Managers: Ganesh, Yogesh) |

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

### Team

**Floor Managers (K11 Certified):** Ganesh, Yogesh

**Group Class Instructors:** Poonam & Kale (Yoga), Sikandar & Gajendra (Zumba / Bollywood Beats)

**Personal Trainers:** Dinesh, Rajesh, Mayur, Tukaram

**Trainers:** Dnyaneshwar, Aryan, Sunil, Mayur, Pravin, Rupali

**Front Desk:** Prateek

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Pages](#pages)
- [Live Deployments](#live-deployments)
- [CI / CD](#ci--cd)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Website
- **Single-page marketing site** — hero, stats, classes, trainers, pricing, testimonials, gallery, FAQ, contact
- **Free Trial booking form** — lead captured to PostgreSQL, validated with Zod
- **Fitness Guide page** — 5-level progressive training guide (tabbed interface)
- **Admin dashboard** — view all lead submissions, cycle status (New → Contacted → Converted), CSV export

### Performance & SEO
- Hero image preloaded with `fetchpriority="high"` for fast LCP
- All below-the-fold images `loading="lazy"` 
- Brotli + Gzip compression on all JS/CSS assets at build time
- Full JSON-LD `HealthClub` structured data with geo, hours, aggregate rating
- Open Graph + Twitter Card meta tags
- `sitemap.xml` included in build output
- `robots.txt` configured
- Canonical URL pointing to `dotfitfitness.in`

### Contact / Lead Management
- Contact form POSTs to `/api/contacts` (Zod-validated)
- Submissions stored in PostgreSQL `contacts` table
- Admin page lists all submissions and allows status updates
- CORS restricted to `*.replit.app` and `dotfitfitness.in` in production

---

## Tech Stack

### Frontend — `artifacts/dotfit`

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| Vite | 7 | Build tool & dev server |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 4 | Styling |
| Radix UI | latest | Accessible UI primitives |
| Framer Motion | 12 | Animations |
| React Hook Form + Zod | latest | Form validation |
| Wouter | 3 | Client-side routing |
| Lucide React | latest | Icons |
| @tanstack/react-query | 5 | Server state |

### Backend — `artifacts/api-server`

| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 5 | HTTP server |
| TypeScript | 5.9 | Type safety |
| Drizzle ORM | 0.45 | Type-safe DB queries |
| PostgreSQL | — | Database |
| Pino + pino-http | latest | Structured logging |
| Zod | 3 | Runtime validation |

### Shared Libraries — `lib/`

| Package | Purpose |
|---------|---------|
| `@workspace/db` | Drizzle schema + DB connection |
| `@workspace/api-zod` | Zod schemas generated from OpenAPI spec |
| `@workspace/api-client-react` | React Query hooks generated from OpenAPI spec |
| `@workspace/api-spec` | OpenAPI 3.1 spec + Orval codegen config |

### Tooling

| Tool | Purpose |
|------|---------|
| pnpm workspaces | Monorepo management |
| Orval | OpenAPI → React Query hooks + Zod schemas |
| GitHub Actions | CI (typecheck + build on every push/PR) |
| Drizzle Kit | Database migrations |
| Prettier | Code formatting |

---

## Project Structure

```
dotfit-fitness/
├── artifacts/
│   ├── dotfit/                   # React + Vite frontend
│   │   ├── public/               # Static assets (images, favicon, sitemap)
│   │   ├── src/
│   │   │   ├── components/ui/    # shadcn/ui component library
│   │   │   ├── hooks/            # use-mobile, use-toast
│   │   │   ├── pages/
│   │   │   │   ├── home.tsx      # Main landing page
│   │   │   │   ├── guide.tsx     # 5-level fitness guide
│   │   │   │   ├── admin.tsx     # Lead management dashboard
│   │   │   │   └── not-found.tsx
│   │   │   ├── App.tsx           # Router + query client setup
│   │   │   └── main.tsx
│   │   ├── index.html            # SEO meta, JSON-LD, font loading
│   │   └── vite.config.ts
│   │
│   └── api-server/               # Express.js API
│       └── src/
│           ├── routes/
│           │   ├── contacts.ts   # POST/GET /api/contacts, PATCH status
│           │   └── health.ts     # GET /api/healthz
│           ├── lib/logger.ts     # Pino logger singleton
│           └── app.ts            # Express app: CORS, body parsing, routing
│
├── lib/
│   ├── api-spec/                 # OpenAPI 3.1 spec + Orval codegen
│   ├── api-zod/                  # Generated Zod validation schemas
│   ├── api-client-react/         # Generated React Query hooks
│   └── db/                       # Drizzle ORM schema + DB connection
│
├── scripts/                      # Workspace utility scripts
├── .github/workflows/ci.yml      # GitHub Actions CI pipeline
├── .env.example                  # Environment variable template
├── pnpm-workspace.yaml           # Workspace config + package catalog
├── tsconfig.base.json            # Shared TypeScript config
└── package.json                  # Root scripts
```

---

## Prerequisites

- **Node.js** 20+ 
- **pnpm** 10+
- **PostgreSQL** database

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/mangeshraut712/Dotfit-Fitness.git
cd Dotfit-Fitness
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Fill in DATABASE_URL and SESSION_SECRET
```

### 3. Push the database schema

```bash
pnpm --filter @workspace/db run push
```

### 4. Start development servers

```bash
# Terminal 1 – API server
pnpm --filter @workspace/api-server run dev

# Terminal 2 – Frontend
pnpm --filter @workspace/dotfit run dev
```

The frontend will be available at `http://localhost:4173` and the API at `http://localhost:3000/api`.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret for session signing |
| `PORT` | No | Server port (default: 3000 for API, 4173 for frontend) |
| `NODE_ENV` | No | `development` or `production` |
| `BASE_PATH` | No | URL base path (default: `/`) |

---

## Available Scripts

### Root workspace

```bash
pnpm run build           # Typecheck + build all packages
pnpm run build:vercel    # Alias for pnpm run build (used by Vercel)
pnpm run typecheck       # Full typecheck across all packages
pnpm run typecheck:libs  # Typecheck shared libraries only
```

### API Server

```bash
pnpm --filter @workspace/api-server run dev    # Start with hot reload
pnpm --filter @workspace/api-server run build  # Compile to dist/
pnpm --filter @workspace/api-server run start  # Start production build
```

### Frontend

```bash
pnpm --filter @workspace/dotfit run dev    # Start Vite dev server
pnpm --filter @workspace/dotfit run build  # Production build → dist/public/
pnpm --filter @workspace/dotfit run serve  # Preview production build locally
```

### Shared Libraries

```bash
pnpm --filter @workspace/api-spec run codegen  # Regenerate API hooks + Zod schemas from OpenAPI spec
pnpm --filter @workspace/db run push           # Push DB schema changes (dev only)
```

---

## API Reference

Base path: `/api`

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/healthz` | Returns `{ "status": "ok" }` |

### Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contacts` | Submit a contact / free trial request |
| `GET` | `/api/contacts` | List all contact submissions |
| `PATCH` | `/api/contacts/:id/status` | Update lead status |

#### POST `/api/contacts` — Request body

```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "plan": "string",
  "message": "string | null"
}
```

#### PATCH `/api/contacts/:id/status` — Request body

```json
{
  "status": "New" | "Contacted" | "Converted"
}
```

---

## Database Schema

### `contacts` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | serial | Primary key |
| `name` | text | Not null |
| `phone` | text | Not null |
| `email` | text | Not null |
| `plan` | text | Membership plan selected |
| `message` | text | Optional message |
| `status` | text | Default: `"New"` — allowed: `New`, `Contacted`, `Converted` |
| `created_at` | timestamp | Auto-set on insert |

---

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/home.tsx` | Main single-page landing site |
| `/guide` | `src/pages/guide.tsx` | 5-level progressive fitness guide (tabbed) |
| `/admin` | `src/pages/admin.tsx` | Lead management dashboard (status + CSV export) |

---

## Live Deployments

### Replit (Primary)
- **URL**: https://dotfit-fitness--mbr63.replit.app/
- **API**: https://dotfit-fitness--mbr63.replit.app/api
- **Status**: Active ✅

### Vercel
- **URL**: https://dotfit-fitness.vercel.app
- **Build command**: `pnpm run build:vercel`
- **Output dir**: `artifacts/dotfit/dist/public`

### Custom Domain
- **Website**: https://dotfitfitness.in

---

## CI / CD

GitHub Actions runs on every push and pull request:

1. `pnpm install --frozen-lockfile`
2. `pnpm run typecheck`
3. `pnpm --filter @workspace/dotfit run build`
4. `pnpm --filter @workspace/api-server run build`

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-change`
3. Make your changes and ensure `pnpm run typecheck` and `pnpm run build` pass
4. Open a pull request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with care for <strong>Dotfit Fitness</strong> — Baner, Pune 🏋️
</p>
