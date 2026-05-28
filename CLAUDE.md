# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Memory

At the start of every session, read `MEMORY.md` AND `AGENTS.md` in the project root for ongoing context, decisions, and notes that are not captured in the code or git history.

Type `/memory` at the end of a session to review changes and update AGENTS.md.

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
/memory       # Review sesi dan update AGENTS.md
```

No test suite is configured.

## Architecture

**What it is:** A Braille learning platform for visually impaired students, with teacher-facing classroom/student management, an AI tutor chatbot, text-to-Braille conversion, and progress tracking.

**Stack:**
- Next.js 16 (App Router), React 19, TypeScript 5
- Supabase (PostgreSQL + Auth) — no ORM, raw Supabase SDK calls
- TailwindCSS 4, shadcn/ui (New York style), Radix UI
- React Hook Form + Zod for form validation

**Route groups:**
- `app/(auth)/` — login, register, forgot/reset-password (public)
- `app/(dashboard)/` — protected pages: learn, converter, braille-reference, practice, progress, settings, students, classrooms, reports
- `app/auth/callback` — Supabase OAuth callback handler

**Auth flow:** `proxy.ts` (middleware) protects dashboard routes. Supabase email/password auth with required email confirmation. Server actions live in `app/(auth)/actions.ts`. Server-side Supabase client uses cookies (`lib/supabase/server.ts`); browser client is `lib/supabase/client.ts`.

**Data pattern:** Most pages are Server Components that fetch from Supabase at load time. Interactive sections are Client Components (`"use client"`). No global state library — local `useState` only.

**Key lib files:**
- `lib/braille.ts` — text ↔ Braille conversion, dot patterns, alphabet/number/punctuation mappings
- `lib/speech.ts` — `TextToSpeech` class wrapping Web Speech API (voice selection, spell-out mode)
- `lib/data/modules/` — static learning module data per-grade (Kelas 7, 8, 9) with 29 modules total
- `lib/tutorial/` — Driver.js tutorial step definitions

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL          # e.g. http://localhost:3000
```

## Deployment

Configured for **Netlify** (`netlify.toml`) as primary target. `next.config.ts` disables image optimization and adds trailing slashes. `wrangler.toml` exists for a Cloudflare Workers fallback but is secondary.

## Conventions

- Path alias `@/*` maps to the repo root (configured in `tsconfig.json`).
- shadcn/ui components live in `components/ui/`; domain components are grouped under `components/braille/`, `components/chat/`, `components/dashboard/`, `components/learning/`.
- Server actions for a route are colocated in `_actions/` subdirectory; private components in `_components/`.
