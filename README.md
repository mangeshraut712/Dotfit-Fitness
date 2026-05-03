# Dotfit Fitness — Official Website

**Live Site:** [dotfit-fitness--mbr63.replit.app](https://dotfit-fitness--mbr63.replit.app)
**GitHub Repo:** [mangeshraut712/Dotfit-Fitness](https://github.com/mangeshraut712/Dotfit-Fitness)

Dotfit Fitness is Baner's most trusted K11-certified gym since 2012 — 50,000+ members, 1:4 trainer ratio, and a full-stack website built to convert visitors into members.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7, TypeScript, Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI), Framer Motion, Embla Carousel |
| Forms | React Hook Form + Zod validation |
| Backend API | Express 5, Node.js, TypeScript |
| Database | PostgreSQL via Drizzle ORM |
| Logging | Pino + pino-http |
| Fonts | Oswald (display), Inter (body) via Google Fonts |
| Icons | Lucide React |
| Monorepo | pnpm workspaces |
| Hosting | Replit (dev + production deployment) |

---

## Project Structure

```
/
├── artifacts/
│   ├── dotfit/              # React + Vite frontend (the gym website)
│   │   ├── public/          # Static assets (images, logos, favicon)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   └── home.tsx # Full single-page site (~1370 lines)
│   │   │   ├── components/ui/  # shadcn/ui component library
│   │   │   ├── hooks/       # Custom hooks (useToast)
│   │   │   ├── lib/         # Utility helpers
│   │   │   ├── App.tsx      # Router + providers
│   │   │   ├── main.tsx     # React entry point
│   │   │   └── index.css    # Tailwind base + CSS variables
│   │   ├── index.html       # SEO-optimized HTML shell
│   │   └── vite.config.ts   # Vite configuration
│   └── api-server/          # Express REST API
│       └── src/
│           ├── app.ts       # Express app (CORS, middleware, error handling)
│           ├── index.ts     # Server entry (port binding)
│           ├── routes/
│           │   ├── contacts.ts  # POST /api/contacts, GET /api/contacts
│           │   ├── health.ts    # GET /api/healthz
│           │   └── index.ts     # Route aggregator
│           └── lib/
│               └── logger.ts    # Pino structured logger
├── lib/
│   ├── api-spec/            # OpenAPI specification
│   ├── api-zod/             # Zod schemas generated from OpenAPI spec
│   ├── api-client-react/    # React Query hooks (generated)
│   └── db/                  # Drizzle ORM schema + DB client
│       └── src/schema/      # contacts table definition
├── pnpm-workspace.yaml      # Workspace + catalog pins
└── package.json             # Root scripts
```

---

## Features

- **Full single-page gym website** with 20+ sections
- **Animated count-up stats** using IntersectionObserver
- **BMI Calculator** with personalised plan recommendations
- **Weekly schedule table** with class and batch timings
- **Pricing comparison table** — 10 features across 4 plans
- **Membership contact form** → saves to PostgreSQL via REST API
- **Google Maps embed** with exact pin for Baner, Pune location
- **Scroll progress bar**, parallax hero, framer-motion scroll animations
- **FAQ accordion** with smooth max-height animation
- **Staff roster** grouped by role — all 16 team members listed
- **Mobile sticky bottom bar** — Call / WhatsApp / Book Trial
- **Desktop floating side tab** — "Book Free Trial" on left edge
- **SEO-optimised** — structured JSON-LD (HealthClub schema), Open Graph, Twitter Card, canonical URL
- **Performance** — hero image `fetchpriority="high"`, all below-fold images `loading="lazy"`

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- PostgreSQL database (or use the Replit-provisioned DB)

### Installation

```bash
# Clone
git clone https://github.com/mangeshraut712/Dotfit-Fitness.git
cd Dotfit-Fitness

# Install all workspace dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the repo root (or set them in your hosting platform):

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Random 32+ char string for session signing |
| `PORT` | Auto | Assigned by the workflow (do not set manually in dev) |
| `NODE_ENV` | Auto | `development` or `production` |

### Database Setup

```bash
# Run migrations (applies schema to your database)
pnpm --filter @workspace/db run migrate
```

### Running in Development

The development server is managed by Replit workflows. Each service is started automatically with the correct `PORT` and `BASE_PATH` environment variables.

| Service | Command |
|---|---|
| Frontend | `pnpm --filter @workspace/dotfit run dev` |
| API Server | `pnpm --filter @workspace/api-server run dev` |

### Build for Production

```bash
# Build API server
pnpm --filter @workspace/api-server run build

# Build frontend (requires PORT and BASE_PATH env vars)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/dotfit run build
```

---

## API Documentation

Base URL: `/api`

### Health Check

```
GET /api/healthz
```

**Response `200`:**
```json
{ "status": "ok" }
```

---

### Submit Contact / Book Trial

```
POST /api/contacts
Content-Type: application/json
```

**Request body:**
```json
{
  "name": "Rahul Sharma",
  "phone": "+91 98765 43210",
  "email": "rahul@example.com",
  "plan": "1 Year",
  "message": "Interested in Happy Hours plan"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | Yes | min 2 chars |
| `phone` | string | Yes | min 10 chars |
| `email` | string | Yes | valid email format |
| `plan` | string | Yes | non-empty |
| `message` | string | No | optional note |

**Response `201`:**
```json
{
  "id": 1,
  "name": "Rahul Sharma",
  "phone": "+91 98765 43210",
  "email": "rahul@example.com",
  "plan": "1 Year",
  "message": "Interested in Happy Hours plan",
  "createdAt": "2026-05-03T06:00:00.000Z"
}
```

**Response `400`:** Invalid input — returns field-level validation errors.
**Response `500`:** Database error — returns user-friendly message.

---

### List All Contacts *(admin)*

```
GET /api/contacts
```

Returns all submitted contact/trial booking records ordered by submission time.

---

## Deployment

This project is deployed on Replit. To publish:

1. Open the project in Replit
2. Click **Deploy** in the top-right
3. Replit handles TLS, health checks, and CDN routing automatically

The production build serves the frontend as static files and runs the Express API at `/api`.

---

## Gym Information

| Detail | Value |
|---|---|
| Address | 136/1, 5th Floor, Srushti Elegance, Old Baner-Balewadi Rd, Pune 411045 |
| Phone | +91 95272 37213 |
| Email | Support@dotfitfitness.in |
| Hours | Mon–Sat: 6:00 AM – 10:00 PM (Sunday closed) |
| Happy Hours | 12:00 PM – 5:00 PM (discounted memberships) |
| Rating | 4.2 / 5 · 726+ Google reviews |

---

## License

© 2026 Dotfit Fitness. All rights reserved.
