# Dotfit Fitness Website

## Overview

World-class fitness website for Dotfit Fitness gym in Baner, Pune, India. Built as a pnpm monorepo with a React + Vite frontend and Express API backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/dotfit) — serves at /
- **API framework**: Express 5 (artifacts/api-server) — serves at /api
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec) — mode: single, no workspace barrel (avoids naming conflicts)
- **Build**: esbuild (CJS bundle)
- **UI**: Tailwind CSS + shadcn/ui + framer-motion + embla-carousel
- **Fonts**: Oswald (display), Inter (body) via Google Fonts
- **Icons**: Lucide React

## Gym Info (Dotfit Fitness)
- Address: 136/1, 5th Floor, Srushti Elegance, Old Baner-Balewadi Rd, Baner, Pune 411045
- Phone: +91 95272 37213
- Email: Support@dotfitfitness.in
- Established: 2012, 50,000+ members, 4.2/5 rating (726 reviews)
- Timings: Mon–Sat 6AM–10PM, Sunday Closed
- Happy Hours: 12PM–5PM daily (discounted annual plan ₹8,500)

## Database Schema
- `contacts` table — lead/contact form submissions (name, phone, email, plan, message, createdAt)

## API Endpoints
- `GET /api/healthz` — health check
- `POST /api/contacts` — submit contact/join form (Zod validated, try/catch DB error handling)
- `GET /api/contacts` — list contact submissions

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## GitHub
- Remote: https://github.com/mangeshraut712/Dotfit-Fitness.git
- Push: `git --no-optional-locks push "https://${GITHUB_TOKEN}@github.com/mangeshraut712/Dotfit-Fitness.git" main`

## Important Notes

### API / Backend
- CORS is origin-restricted in production (`*.replit.app`, `dotfitfitness.in`); wildcard in development
- Request body size limited to 10kb
- Global 404 handler and Express error handler middleware added to `app.ts`
- `contacts.ts` has try/catch on both DB operations — errors are logged via `req.log.error()` and return user-friendly 500 messages

### Frontend
- `index.html`: no duplicate og:image, full OG/Twitter/JSON-LD schema, canonical URL, robots meta, `og:site_name`, `og:locale`, non-render-blocking font loading, JSON-LD now includes `geo`, `foundingDate`, `aggregateRating`, `openingHoursSpecification`
- Hero image uses `fetchPriority="high"` + `decoding="async"` for LCP performance
- All below-the-fold images use `loading="lazy" decoding="async"` (trainer photos, class images, facility, gallery, Instagram grid, transformation, staff cards)
- Floating desktop side tab uses clean inline `transform: translateY(-50%) rotate(180deg)` — removed conflicting Tailwind `-translate-y-1/2` class
- Logo files permissions fixed to 644 (were 600)
- `vite.config.ts` requires `PORT` and `BASE_PATH` env vars (injected by Replit workflow; do not set manually in dev)

### Color / Design
- PRIMARY: hsl(82, 60%, 45%) — lime green
- Light bg: `#f8fbf3`, Dark sections: `bg-gray-950`
- CSS var: `--app-font-display` for Oswald, `--app-font-sans` for Inter

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
