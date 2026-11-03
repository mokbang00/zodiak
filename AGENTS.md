# Repository development guidelines

These instructions apply throughout this repository.

## Required references

Before implementation, read [TECHNNICAL-DOCS.md](TECHNNICAL-DOCS.md). It is the authoritative reference for project structure and client/server boundaries; the rules below are only a summary. Consult the full document for detailed conventions and regression guardrails.

Read [PRD-Slash-Page-Zodiak.md](PRD-Slash-Page-Zodiak.md) for product behavior and business requirements relevant to the task. Keep those requirements separate from structural guidance. Domain examples in the technical reference do not define this project's business rules.

## Core rules

- Use Next.js App Router with TypeScript. Organize each business domain under one `app/<domain>/` folder, keeping domain-specific components with its routes.
- Keep root `lib/` and `components/` client-safe: no database, auth/session, or server-only imports. Put server-only utilities and business logic in `app/lib/`, mutations in `app/actions/`, and route handlers in `app/api/`. Check each `app/components/` file's server/client boundary. Use distinct filenames for related modules in the two lib trees.
- Use Server Components for pages. Check authentication and fine-grained authorization before fetching protected data; fetch independent data in parallel. Pass plain data to client components, never the database client or session object. Middleware is only a coarse safety net; hiding navigation is not authorization.
- Put Server Actions in `app/actions/<domain>.ts`, starting with `"use server";`. Authorize before mutating and never trust client-supplied roles. Validate inputs with schemas defined in `app/lib/`, not exported schema objects from Server Action files.
- Audit-log every mutating action without allowing logging failures to break the operation. Store and convert money in integer cents exactly once end-to-end. Give bulk database transactions explicit timeouts and build separate relation shapes for create and update operations.
- Place API handlers under `app/api/<domain>/route.ts`. Logged-in form handlers must check sessions themselves and return JSON `401` responses when unauthenticated. Exclude auth entry points from middleware auth redirects; protect cron routes with a secret header.
- Provide a shared loading skeleton through `loading.tsx` for every top-level domain route segment, plus instant navigation feedback through a top progress bar in `app/layout.tsx`. If PWA support is used, exclude its pre-auth assets from auth redirects and use one service worker per scope for push and caching.
- Use one package manager and its authoritative lockfile. Keep database CLI, client, and adapters on the same major version. Review dependency fixes before applying them; do not blindly use force auto-fixes, and prefer overrides for vulnerable transitive dependencies.
- Never commit `.env` or real secrets. Keep `.env.example` limited to placeholders and check it before commits that touch it. Verify the target database before destructive operations and never reset a database containing real data. After schema changes, regenerate the database client before typechecking, apply migrations, and restart the dev server.

Maintain this file as a concise entry point; keep detailed structural guidance in the technical reference and business rules in the PRD.
