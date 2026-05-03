# Dotfit Fitness

Baner, Pune gym website built with React, Vite, Express, PostgreSQL, and pnpm workspaces.

## Stack

- React + TypeScript
- Vite
- Express 5
- Drizzle ORM
- PostgreSQL
- Framer Motion
- TanStack Query
- React Hook Form + Zod
- Radix UI
- Tailwind CSS
- Pino

## Current features

- SEO-ready landing page with JSON-LD, meta tags, sitemap, and robots.txt
- Pricing, trainers, class timetable, FAQ, gallery, and contact form
- Contact submissions stored in the database
- Base-path-aware frontend for Replit/Vercel
- Responsive layout with strong mobile UX
- Performance improvements: image optimization, code splitting, preload hints
- Real gym content for Dotfit Fitness in Baner, Pune

## 2026 upgrade areas

- PWA/service worker
- Real payments/checkout
- Automated tests
- Deployment hardening
- Better analytics and conversion tracking

## Local development

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/dotfit run dev
```

## Scripts

- `pnpm run build`
- `pnpm run typecheck`
- `pnpm --filter @workspace/api-server run dev`
- `pnpm --filter @workspace/dotfit run dev`
- `pnpm --filter @workspace/api-server run build`
- `pnpm --filter @workspace/dotfit run build`

## Notes

- The frontend lives at `artifacts/dotfit/src/pages/home.tsx`.
- The API server lives at `artifacts/api-server/src`.
- `DATABASE_URL` is required for the API server and database-backed features.
- Vercel uses the root build script for deployment.
