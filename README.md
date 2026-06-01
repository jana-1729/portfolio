# Janarthanan S — Portfolio

Aurora Editorial portfolio for Janarthanan S, Member of Technical Staff at SurveySparrow. Dark, cinematic single-page Next.js site with a floating pill nav, ⌘K command palette, project case-study modals, animated aurora hero, and a terminal-mode easter egg.

## Stack

- Next.js 16 (App Router, RSC, Turbopack) · TypeScript · React 19
- Tailwind v4 + @tailwindcss/typography
- shadcn/ui (Base UI primitives) · Lucide icons
- Framer Motion · cmdk · react-markdown + remark-gfm
- Vitest + Testing Library (unit) · Playwright + axe (e2e + a11y)

## Run

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm test           # unit
pnpm test:e2e       # playwright
```

## Edit content

All copy lives in `lib/data.ts` (profile, experience, projects, skills, awards, metrics, navItems). Project case studies live in `content/projects/*.md`. GitHub fallback in `content/github-fallback.json`. Resume at `public/resume.pdf`.

## Deploy

Vercel-friendly. `vercel --prod`. Edge runtime is used for the dynamic OG image. No env vars required.

## Easter eggs

- `⌘K` / `Ctrl+K` — command palette (navigate, projects, copy email, open resume, toggle terminal)
- `` ` `` (backtick) — terminal mode overlay with `help`, `whoami`, `ls projects`, `cat about.md`, `open <target>`, `goto <section>`, `clear`, `exit`
