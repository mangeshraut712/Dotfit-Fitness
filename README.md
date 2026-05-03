# Dotfit Fitness

Baner, Pune gym website built with React, Vite, Express, PostgreSQL, and pnpm workspaces.

## Quick start

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/dotfit run dev
```

## Environment

Copy `.env.example` to `.env` and set values for local development.

## Scripts

- `pnpm run typecheck`
- `pnpm --filter @workspace/dotfit run build`
- `pnpm --filter @workspace/api-server run build`

## Notes

- Frontend base path is handled through Vite `BASE_PATH`.
- API routes are served under `/api`.
- Production JSON-LD, schedule, pricing, trainers, trial booking, and SEO are already in the app.
