# Portfolio CMS (Frontend)

Single-page application for a personal portfolio with a public marketing site and a password-protected admin console. The UI talks to a separate HTTP API: it loads published projects and site settings for visitors, and uses authenticated cookie sessions for content management, contact messages, analytics, and audit logs.

## Overview

This repository is the **frontend** of a portfolio system built with Vite and React. Route-based code splitting keeps initial loads small. Server state is handled with TanStack Query; HTTP calls go through a shared Axios client that expects a consistent JSON envelope from the API. The admin area is gated by session checks against `/auth/me`; the public site reads published data and submits the contact form without admin login.

## Key Features

- **Public site**: Home, About, Projects (list and slug-based detail with case study layout), Contact form.
- **Admin console**: Dashboard with aggregate and per-project analytics (views, dwell time), full project lifecycle (create, edit, delete, publish status, drag-style reordering), image/asset uploads and metadata, inbox for contact messages, versioned site settings with draft/publish and clone, and filtered activity logs.
- **Theming**: Published site settings drive live typography on the public site (CSS custom properties); defaults live in global styles.
(This feature is currently disabled; it will be fixed and reactivated.)
- **Analytics**: Project detail pages report visits and time-on-page to the API; `navigator.sendBeacon`-style `fetch` with `keepalive` is used on tab close for best-effort final updates.
- **Resilience**: Centralized API error parsing (`success` / `error` envelopes), route-level error UI, and loading fallbacks for lazy routes.

## Tech Stack

| Area | Choice |
|------|--------|
| Runtime / bundler | Node 18+, Vite 6 |
| UI | React 19, TypeScript (strict) |
| Styling | Tailwind CSS 3, CSS variables in `globals.css` |
| Routing | React Router 7 (`createBrowserRouter`) |
| Data fetching | TanStack React Query 5, Axios (`withCredentials: true`) |
| Motion | Framer Motion (public marketing sections) |

Path alias: `@/` → `src/` (see `vite.config.ts` and `tsconfig.app.json`).

## Architecture and Project Structure

```
src/
  app/                 # App shell: entry, providers, router, layouts
  features/            # Feature modules (auth, projects, admin UI, public pages, etc.)
  shared/              # API client, envelope types, errors, global styles
```

- **`app/`** — `main.tsx` bootstrap, `App.tsx` + `RouterProvider`, `router/routes.tsx` (lazy pages + `Suspense`), `PublicLayout`, `AdminLayout`, `AuthLayout`, React Query provider.
- **`features/public-site/`** — Marketing pages, shared sections (hero, expertise, process), static copy under `content/`, and helpers such as `published-theme.ts` for applying published settings to the document.
- **`features/admin/`** — Admin-only pages and presentation components (tables, forms, side navigation).
- **`features/auth/`** — Login/logout/session hooks and route guards (`ProtectedRoute`, `GuestRoute`).
- **`features/projects`**, **`features/messages`**, **`features/settings`**, **`features/logs`**, **`features/assets`**, **`features/analytics`** — API modules, React Query keys, and hooks aligned with backend resources.

The API layer (`shared/api/request.ts`) unwraps responses shaped as `{ success: true, data }` and maps failure envelopes to a typed `ApiError`.

## Getting Started

### Prerequisites

- Node.js **18**, **20**, or **22+** (see `package.json` `engines`)
- A running backend that implements the routes this client calls (see below), with CORS and cookies configured for your dev origin if you use cookie-based auth.

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and set the API root. The value must match how your backend is mounted (including any `/api/v1` prefix).

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Base URL for all Axios requests (e.g. `http://localhost:3000/api/v1`). If unset, requests use relative URLs (same origin as the Vite dev server or static host). |

Vite only exposes variables prefixed with `VITE_`. For production on Vercel, set `VITE_API_BASE_URL` under Project → Settings → Environment Variables and redeploy.

### Available Scripts

| Script | Command |
|--------|---------|
| Development server | `npm run dev` |
| Production build | `npm run build` (runs `tsc -b` then `vite build`) |
| Preview production build locally | `npm run preview` |
| Lint | `npm run lint` |

## Running in Development

```bash
npm run dev
```

Ensure the backend is reachable at the URL in `VITE_API_BASE_URL` (or the same origin if you proxy). Without a valid API, public pages that fetch data and the entire `/admin` area will show errors or redirect to login as designed.

## Production Build and Deployment

```bash
npm run build
```

Static output is written to `dist/`. The repo includes `vercel.json` with:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- SPA fallback: all routes rewrite to `index.html`

Deploy the `dist` folder to any static host with the same rewrite behavior, or connect the repo to Vercel using the existing config.

## Main Routes (UI)

**Public** (under `PublicLayout`):

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/projects` | Project index |
| `/projects/:slug` | Project detail |
| `/contact` | Contact |

**Admin** (under `ProtectedRoute` + `AdminLayout`):

| Path | Purpose |
|------|---------|
| `/admin/login` | Sign-in (`GuestRoute` redirects if already authenticated) |
| `/admin` | Dashboard (analytics summary + per-project table) |
| `/admin/projects` | Project list |
| `/admin/projects/new` | Create project |
| `/admin/projects/:id/edit` | Edit project and assets |
| `/admin/messages` | Contact messages |
| `/admin/settings` | Site name, live theme, theme library, drafts, and publish |
| `/admin/logs` | Admin activity / audit log viewer |

## Backend API Surface (Consumed by This Client)

All paths are relative to `VITE_API_BASE_URL`. The client sends JSON (except multipart uploads) and expects wrapped responses as defined in `shared/api/types.ts`.

**Auth (cookies)**

- `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`

**Public / published**

- `GET /projects`, `GET /projects/:slug`
- `GET /site/appearance` — published site theme tokens + metadata (primary source for public CSS variables)
- `GET /settings` — compat published configuration (optional metadata fallback)
- `POST /messages` — contact form submission
- `POST /analytics/track/:projectId` — visit / dwell tracking (also used with `keepalive` fetch)

**Admin**

- Projects: `GET/POST /admin/projects`, `GET/PATCH/DELETE /admin/projects/:id`, `PATCH /admin/projects/:id/status`, `PUT /admin/projects/reorder`
- Assets: `POST /admin/projects/:projectId/assets` (multipart), `DELETE /admin/assets/:assetId`, `PATCH` for order and alt text
- Messages: `GET /admin/messages`, `PATCH /admin/messages/:id/read`
- Site & themes: `GET/POST /admin/themes`, `GET /admin/themes/:id`, `PATCH /admin/themes/:id/draft`, `POST /admin/themes/:id/publish`, `GET /admin/themes/:id/revisions`, `POST /admin/themes/:id/duplicate`, `PATCH /admin/site-settings`
- Logs: `GET /admin/logs`
- Analytics: `GET /admin/analytics/stats`

The backend implementation is **not** in this repository; this list reflects the frontend’s `*.api.ts` modules only.

## Design Notes

- **Cookie sessions**: `apiClient` uses `withCredentials: true`, so the API must issue and accept session cookies with appropriate `SameSite` / CORS settings for your deployment topology.
- **Lazy routes**: Page components are `lazy()`-loaded in `routes.tsx` to reduce the initial bundle; a shared `PageLoading` fallback is used during chunk load.
- **Query defaults**: React Query uses a 60s `staleTime` and a single retry on queries; mutations do not retry (`queryClient.ts`).
- **Theming**: `GET /site/appearance` drives semantic CSS variables on `document.documentElement` (colours + `--font-sans` / `--font-mono`). `globals.css` supplies defaults and motion tokens. Admin draft preview scopes the same variables on a subtree only.

## Current Scope

This repo contains the **frontend application only**. It is suitable as a portfolio piece demonstrating structured feature folders, typed API access, admin workflows, and production-oriented tooling (TypeScript strict mode, ESLint 9, Vercel-oriented static hosting).
