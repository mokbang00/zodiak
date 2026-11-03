# Next.js App Structure & Context Separation

Purpose: a reusable reference for standing up a new Next.js (App Router, TypeScript) project with the same directory structure and client-safe vs server-only context separation. Copy this file into any new project and adapt the domain names; the structural rules are domain-agnostic.

This is a structural companion to `context-for-claude-code.md` (the living project-context doc). That doc records business rules specific to a project. This file records only the shape of the project and the boundaries between contexts — the parts you can replicate wholesale.

---

## 1. Top-level directory layout

```
project-root/
├── app/                          # Next.js App Router (App Router, TypeScript)
│   ├── layout.tsx                # Root layout (metadata, theme, providers)
│   ├── page.tsx                  # Homepage
│   ├── loading.tsx               # Root loading skeleton
│   ├── manifest.ts               # PWA manifest (Next native convention)
│   ├── favicon.ico
│   ├── globals.css
│   ├── instrumentation.ts        # OpenTelemetry / cron scheduling hooks
│   ├── middleware.ts             # Edge middleware (auth, redirects, exclusions)
│   ├── <domain>/                 # One folder per business domain
│   │   ├── page.tsx              # Domain index page (Server Component)
│   │   ├── loading.tsx           # Segment-level loading skeleton (auto-wraps children via Suspense)
│   │   ├── new/                  # Create route
│   │   │   └── page.tsx
│   │   ├── [id]/                 # Dynamic detail route
│   │   │   └── page.tsx
│   │   ├── <subdomain>/          # Nested domain concern
│   │   └── *.tsx                 # Domain components used only by this domain's pages
│   ├── actions/                  # Server Actions ("use server"), one file per domain concern
│   │   ├── <domain>.ts
│   │   └── ...
│   ├── api/                      # Route handlers
│   │   ├── <domain>/
│   │   │   └── route.ts
│   │   ├── auth/
│   │   │   └── route.ts
│   │   └── cron/                 # Scheduled jobs (secret-header guarded)
│   ├── lib/                      # SERVER-ONLY. Prisma queries, session checks, business logic.
│   │   ├── prisma.ts             # Singleton PrismaClient (driver adapter if using Prisma 7+ with Postgres)
│   │   ├── auth.config.ts        # Edge-safe auth config (no database)
│   │   ├── auth.ts               # Node-runtime auth extending auth.config.ts (uses database)
│   │   ├── acl.ts                # Authorization helpers
│   │   ├── auditLog.ts           # Audit logging — never throws into the caller
│   │   └── ...                   # any module that imports database, auth, or server-only code
│   ├── components/               # App-scoped components (mix of server & client)
│   │   ├── RouteLoading.tsx
│   │   └── ...
│   ├── types/                    # Domain TypeScript types (shared across server + client)
│   ├── generated/                # Generated database client (regenerate after schema changes)
│   └── uploads/[...path]/route.ts # Protected file-serving route
├── components/                   # Root components — CLIENT-SAFE (UI primitives, no database/auth)
│   └── ui/                       # UI primitives (button, input, select, dialog, etc.)
├── lib/                          # Root lib — CLIENT-SAFE. No database, no session/auth, no server-only imports.
│   ├── utils.ts                  # Helper functions (cn(), format, date helpers)
│   └── ...                       # anything importable by a "use client" component
├── prisma/                       # Database schema and migrations (if using Prisma)
│   ├── schema.prisma             # Data model — source of truth
│   └── migrations/
├── public/                       # Static assets
│   ├── icons/                    # PWA icons
│   └── uploads/                  # User uploads (auth-gated; exclude from public CDN)
├── scripts/                      # One-off / maintenance scripts (seed, import, etc.)
├── e2e/                          # End-to-end regression suite
├── types/                        # Root-level shared types (if any)
├── docs/                         # Documentation
├── .env                          # NEVER commit. Real secrets.
├── .env.example                  # Placeholders ONLY. Sanity-check before every commit.
├── .gitignore
├── AGENTS.md                     # Next.js agent rules (auto-managed by next dev; keep committed)
├── context-for-claude-code.md    # LIVING project-context doc (business rules)
├── next.config.ts                # Next config
├── tsconfig.json
├── package.json
├── package-lock.json             # Authoritative lockfile (pick one package manager; do not mix)
├── next-env.d.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── components.json               # UI library config (why primitives live in root components/ui/)
└── docker-compose.yml / ecosystem.config.js / deploy/  # Deployment plumbing
```

---

## 2. The context separation rule (the one boundary that matters)

This project enforces a hard line between **two `lib` trees** and **two component trees**. Violating it leaks server-only code (database client, auth, session) into the browser bundle, which breaks builds and exposes secrets.

| Tree                    | Safe for `"use client"`? | May import database client? | May import auth/session? | Typical contents                                                       |
| ----------------------- | -------------------------- | --------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| Root `lib/`           | ✅ Yes                     | ❌ No                       | ❌ No                    | Pure utilities, `fetch()` wrappers around API routes, format helpers |
| Root `components/ui/` | ✅ Yes                     | ❌ No                       | ❌ No                    | UI primitives (button, input, select, dialog, etc.)                    |
| `app/lib/`            | ❌ No — server only       | ✅ Yes                      | ✅ Yes                   | Database queries, audit logging, auth, business logic                  |
| `app/components/`     | Mixed — check each file   | ⚠ Only if server-only      | ⚠ Only if server-only   | Route-level components, domain components                              |
| `app/actions/`        | ❌ No — `"use server"`  | ✅ Yes                      | ✅ Yes                   | Server Actions (mutations)                                             |
| `app/api/`            | ❌ No — route handlers    | ✅ Yes                      | ✅ Yes                   | Route handlers                                                         |

**Rule before creating a new file:**

> Does this file need anything server-only (database client, auth, session)?
> → If **yes**: put it in `app/lib/` or `app/actions/` or `app/api/`.
> → If **no**: put it in root `lib/` or root `components/ui/`.

**Name-collision landmine (do not reintroduce):**
Two trees used to share the same filename:

- root `lib/search.ts` — client-safe `fetch()` wrappers around API routes
- `app/lib/searchClauses.ts` — server-only database query builders

They were deliberately given distinct filenames so autocomplete can never land an edit in the wrong tree. If you add a module with the same conceptual name in both trees, give them distinct filenames.

---

## 3. Domain folder convention

Every domain gets ONE folder under `app/`. Follow this template:

```
app/<domain>/
├── page.tsx                  # index/list page (Server Component)
├── loading.tsx               # segment loading skeleton
├── new/                      # create route
│   └── page.tsx              # Server Component: auth check → data fetch → render form
├── [id]/                     # detail route
│   └── page.tsx
├── history/                  # list/archive route (optional)
│   └── page.tsx
├── settings/                 # admin config for this domain (optional)
│   └── page.tsx
├── <Domain>Form.tsx          # shared form component (client or server as needed)
├── <Domain>List.tsx          # shared table/list component
└── loading.tsx               # repeat at any segment that needs its own skeleton
```

**Page pattern (Server Component):**

1. Run auth / session check.
2. Run authorization check (route-level enforcement, not just link-hiding — the URL is still guessable even when navigation hides the link).
3. Fetch data with the database client (in parallel via `Promise.all` where independent).
4. Render — pass plain data down to client components as props. Never pass the database client or session object to the client.

**Authorization layers (three layers, know which you're editing):**

1. `middleware.ts` — Edge runtime, coarse per-role route-prefix gate. Safety-net fallback only. Excludes auth entry points and pre-auth static assets.
2. `app/lib/acl.ts` — fine-grained authorization helpers used inside pages and actions.
3. Server actions — call authorization checks before mutating. Never trust a client-supplied role.

---

## 4. Server Actions convention

All mutating logic lives in `app/actions/` as `"use server"` files.

```
app/actions/<domain>.ts
```

Conventions:

- File starts with `"use server";` on line 1.
- Import database client, auth, and audit logging from `app/lib/`.
- Validate all inputs with a schema library (define the schema in `app/lib/<domain>Schema.ts`, not inside the `"use server"` file — exporting a schema object from a `"use server"` file throws at runtime; re-export as a type instead).
- Every mutating action is audit-logged. Audit logging never throws into the caller (a logging failure must not break the operation it's logging).
- Money: store/convert in integer cents, exactly once end-to-end.
- Bulk loops inside a database transaction need an explicit timeout (default 5s will expire on large imports).
- Never share one relation object between a database `create()` and an `update()` call — build the `create()` shape separately.

---

## 5. API route convention

Route handlers under `app/api/<domain>/route.ts`.

- Use `export const config = { matcher: [...] }` only in `middleware.ts`; individual route handlers do not need matchers.
- Route handlers that are auth entry points must be excluded from `middleware.ts`'s auth-redirect matcher, otherwise unauthenticated callers get redirected to `/login` instead of receiving JSON.
- Route handlers used by logged-in forms do their own session check and return JSON `401` instead of an HTML redirect, so fetches stay parseable.
- Cron routes are guarded by a secret header, not a browser session.

---

## 6. Loading & performance conventions

- **Route-level loading**: every top-level route segment (`app/<domain>/loading.tsx`) renders a shared loading skeleton. Next wraps the segment's `page.tsx` in a Suspense boundary automatically; nested dynamic routes inherit their parent's `loading.tsx` for free.
- **Instant click feedback**: a top progress bar (e.g. `nextjs-toploader`) in `app/layout.tsx` shows the instant a `<Link>` is clicked, before the server responds. This solves "can I tell if it's loading" on slow connections better than `loading.tsx` alone.
- **PWA** (optional): `app/manifest.ts` (Next native convention, served at `/manifest.webmanifest`) + icons in `public/icons/`. `middleware.ts` excludes `manifest.webmanifest` and `icons/` from auth redirects (install-prompt machinery fetches them with no session cookie).
- **Service worker**: one file only handling both push and PWA asset caching. A page can only be controlled by one service worker per scope.

---

## 7. Environment & package-manager rules

- Pick **one** package manager (npm, yarn, or pnpm). Use its lockfile as authoritative. Do not mix package managers or introduce multiple lockfiles — mixing caused dependency-version drift regressions.
- **Database client version lock:** database CLI, client, and adapter packages must all be on the same major version. Never run dependency auto-fix commands blindly — they can downgrade the database CLI to a breaking major version. Pin vulnerable transitive dependencies via overrides instead.
- **`.env` must never be committed.** `.env.example` must contain placeholders only; sanity-check before every commit that touches it.
- **Local dev database:** verify the database name before running anything destructive — it can change between sessions.
- **Commands:** generate database client after any schema change (before typecheck); apply migrations to the database (never reset a database with real data); build with the framework's recommended bundler; restart the dev server after schema/migration changes even after regenerating the client (the dev server can hold a stale client module in memory).
- **Cache corruption:** if the dev server reports "client reference manifest does not exist," clear the framework cache (`.next`) and restart.

---

## 8. Things NOT to redo (regression guardrails)

- Don't commit real secrets into `.env.example`.
- Don't run dependency auto-fix (`--force`) without checking what it changes first.
- Don't mix package managers.
- Don't put relation-only actions (e.g. clearing a relation) in the same object used for both database `create()` and `update()`.
- Don't loop per-row inside a single database transaction without an explicit timeout once row count can plausibly exceed a couple hundred.

---

## 9. Replication checklist for a new project

When standing up a new project with the same requirements, work through this in order:

1. [ ] Scaffold Next.js App Router + TypeScript.
2. [ ] Create root directory structure: `app/`, `app/lib/`, `app/actions/`, `app/api/`, `components/ui/`, `lib/`, `prisma/` (or equivalent), `public/`, `scripts/`, `e2e/`.
3. [ ] Set up database client singleton in `app/lib/`.
4. [ ] Set up `middleware.ts` (Edge auth) with exclusions for auth entry points and pre-auth static assets.
5. [ ] Create authorization helpers in `app/lib/` (fine-grained route/page-level checks).
6. [ ] Enforce the two-lib-tree boundary: root `lib/` + `components/ui/` = client-safe; `app/lib/` = server-only. Give colliding files distinct names.
7. [ ] Add domain folders under `app/<domain>/` following the template in §3.
8. [ ] Add server actions in `app/actions/<domain>.ts` (`"use server"`, input validation, audit logging, explicit transaction timeouts).
9. [ ] Add route handlers in `app/api/<domain>/route.ts`.
1. [ ] Add `loading.tsx` at every top-level route segment; wire a top progress bar in `app/layout.tsx`.
1. [ ] Add `.env.example` with placeholders only; `.env` gitignored with real values.
1. [ ] Lock database CLI/client/adapter to the same major; use overrides for vulnerable transitive deps instead of auto-fix `--force`.
1. [ ] Add end-to-end regression specs for each bug fixed manually.
1. [ ] If file uploads are needed, add a protected file-serving route (auth-gated; exclude from public CDN).

---

## 10. What is NOT portable

Do **not** copy these into a new project without rewriting — they are business rules, not structure:

- Authorization keys and role defaults
- Database models, schema, and migration history
- Business logic inside server actions
- Print or document-layout specifics
- Push notification / service worker contents
- Any domain-specific business feature
- `context-for-claude-code.md` itself — regenerate it for the new project's business rules

---

**Owner note:** `context-for-claude-code.md` is the living business-rules doc for a project. This file (`PROJECT-STRUCTURE-AND-CONTEXT-SEPARATION.md`) is the structural template. When you replicate this structure elsewhere, create a new `context-for-claude-code.md` in the new project and keep the two documents separate: structure here, business rules there.
