# Dotfit Fitness Website

## Overview

Official website for Dotfit Fitness gym in Baner, Pune, India. Built as a pnpm monorepo with a React + Vite frontend (single-page marketing site) and an Express 5 API backend.

## Stack

- **Monorepo**: pnpm workspaces
- **Node.js**: 20+ (24 in Replit)
- **Package manager**: pnpm 10
- **TypeScript**: 5.9 (strict)
- **Frontend**: React 19 + Vite 7 (`artifacts/dotfit`) — serves at `/`
- **API**: Express 5 (`artifacts/api-server`) — serves at `/api`
- **Database**: PostgreSQL + Drizzle ORM (`lib/db`)
- **Validation**: Zod v4, drizzle-zod (`lib/api-zod`)
- **API codegen**: Orval from OpenAPI 3.1 spec (`lib/api-spec`)
- **Build**: esbuild CJS bundle (API), Vite (frontend)
- **UI**: Tailwind CSS 4 + shadcn/ui + Framer Motion 12 + Embla Carousel
- **Fonts**: Oswald (display/headings), Inter (body) — Google Fonts, non-render-blocking
- **Icons**: Lucide React

## Gym Info

| | |
|---|---|
| Address | 136/1, 5th Floor, Srushti Elegance, Old Baner-Balewadi Rd, Balewadi Phata, Pune 411045 |
| Phone | +91 95272 37213 |
| Email | Support@dotfitfitness.in |
| Founded | 2012 |
| Members | 25,000+ |
| Rating | 4.2/5 (726+ reviews) |

**Timings**: Mon–Sat 6AM–12PM & 4PM–10PM (12–2PM rest, 2–4PM trainer workout); Sunday 6AM–12PM only

**Happy Hours**: 12PM–5PM Mon–Sat — discounted memberships

## Pricing

| Plan | Regular | Happy Hours |
|------|---------|-------------|
| 1 Month | ₹3,500 | ₹3,000 |
| 3 Months | ₹5,500 | ₹5,000 |
| 6 Months | ₹7,500 | ₹7,000 |
| 1 Year | ₹12,000 | ₹10,000 |
| 7-day trial | ₹1,500 | — |
| Single session | ₹500 | — |

## Team

- **Floor Managers (K11 Certified)**: Ganesh, Yogesh
- **Yoga Instructors**: Poonam, Kale
- **Zumba / Bollywood Beats**: Sikandar, Gajendra
- **Personal Trainers**: Dinesh, Rajesh, Mayur, Tukaram
- **Trainers**: Dnyaneshwar, Aryan, Sunil, Mayur, Pravin, Rupali
- **Front Desk**: Prateek

## Database Schema

### `contacts` table

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | not null |
| phone | text | not null |
| email | text | not null |
| plan | text | not null |
| message | text | nullable |
| status | text | default "New"; allowed: New, Contacted, Converted |
| created_at | timestamp | auto |

## API Endpoints

- `GET /api/healthz` — health check → `{ status: "ok" }`
- `POST /api/contacts` — submit contact/trial form (Zod validated, persisted to DB)
- `GET /api/contacts` — list all submissions (used by admin page)
- `PATCH /api/contacts/:id/status` — update lead status (New / Contacted / Converted)

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/home.tsx` | Main landing page (~1700 lines) |
| `/guide` | `src/pages/guide.tsx` | 5-level progressive fitness guide |
| `/admin` | `src/pages/admin.tsx` | Lead management: list, status cycle, CSV export |

## Animation Architecture (home.tsx)

- **Hero**: Individually staggered children — badge 0.1s, h1 0.2s, subheading 0.42s, body 0.54s, buttons 0.66s
- **Trust Strip**: `motion.div animate={{ x: ["0%", "-50%"] }}` marquee — 16 items × 2 = 32 loop, 32s linear infinite
- **Section headings**: `initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}`
- **Pricing cards**: `whileHover={{ y: -8 }}` spring; "Best Value" badge pulses `animate={{ opacity: [1, 0.7, 1] }}`
- **Gallery / Staff / Stats**: `whileHover={{ y: -4 to -8 }}` spring + overlays

## Key Commands

```bash
pnpm run typecheck                              # Full typecheck across all packages
pnpm run build                                  # Typecheck + build all packages
pnpm run build:vercel                           # Alias used by Vercel CI
pnpm --filter @workspace/api-spec run codegen   # Regenerate API hooks + Zod schemas from OpenAPI
pnpm --filter @workspace/db run push            # Push DB schema (dev only)
```

## Live URLs

- Replit: https://dotfit-fitness--mbr63.replit.app/
- Vercel: https://dotfit-fitness.vercel.app
- Custom domain: https://dotfitfitness.in

## GitHub

- Remote: https://github.com/mangeshraut712/Dotfit-Fitness.git
- Push: `git --no-optional-locks push "https://${GITHUB_TOKEN}@github.com/mangeshraut712/Dotfit-Fitness.git" main`

## Important Notes

### API / Backend

- CORS: restricted to `*.replit.app` and `dotfitfitness.in` in production; wildcard in development
- Request body limit: 10 KB
- Global 404 and error handler middleware in `app.ts`
- All DB operations in routes have try/catch; errors logged via `req.log.error()`, user-friendly 500 messages returned

### Frontend

- `index.html`: full OG/Twitter/JSON-LD schema, canonical URL, robots meta, non-render-blocking fonts
- JSON-LD includes: geo, foundingDate, aggregateRating, openingHoursSpecification, amenityFeature, sameAs
- Hero image: `fetchPriority="high"` + `decoding="async"` for LCP
- Below-fold images: `loading="lazy" decoding="async"`
- Favicon: `%BASE_URLfavicon.svg` (Vite base-URL substitution format)
- Preload links: `%BASE_URLhero.webp` and `%BASE_URLlogo-text.webp`
- `vite.config.ts`: `base: process.env.BASE_PATH ?? "/"`, `strictPort: false`

### Color / Design

- Primary: `hsl(82, 60%, 45%)` — lime green (`#6aaa14` theme-color)
- Light bg: `#f8fbf3`
- Dark sections: `bg-gray-950`
- Display font: Oswald (`--app-font-display`)
- Body font: Inter (`--app-font-sans`)

### Repo Cleanup (done)

- Removed pasted dev-note `.txt` files from `attached_assets/`
- `.gitignore` now ignores `attached_assets/Pasted-*.txt`
- `README.md` rewritten with accurate, real gym + tech information (no invented features)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
