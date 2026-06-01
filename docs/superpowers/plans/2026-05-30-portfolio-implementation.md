# Aurora Editorial Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark, cinematic single-page portfolio for Janarthanan S using Next.js 15, shadcn/ui, Tailwind v4, Framer Motion, and Lucide — with floating pill nav, ⌘K command palette, project modal slide-overs, animated aurora hero, and a terminal-mode easter egg.

**Architecture:** Single Next.js App Router page composed of section components driven by typed data in `lib/data.ts`. Effects (aurora, cursor, marquee, counter) live in `components/effects/`. Nav layer (pill nav, command palette, mobile dock) is fixed/overlay. Project modal renders Markdown from `content/projects/*.md`. Terminal mode is a full-screen overlay component.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Framer Motion · Lucide React · `cmdk` · `react-markdown` + `remark-gfm` · Vitest + Testing Library · Playwright (smoke).

**Reference spec:** `docs/superpowers/specs/2026-05-30-portfolio-design.md`.

---

## File map (locked at plan time)

```
portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── opengraph-image.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                 — shadcn primitives (button, dialog, card, badge, command, accordion, tooltip, sheet, separator)
│   ├── sections/           — hero, about, metrics, experience, projects, skills, awards, github, contact
│   ├── effects/            — aurora-bg, grid-bg, cursor-glow, magnetic-button, animated-counter, marquee
│   ├── nav/                — pill-nav, mobile-dock, command-palette
│   ├── projects/           — project-card, project-modal
│   ├── terminal/           — terminal-overlay, command-handlers
│   └── layout/             — section-shell, section-label, footer
├── lib/
│   ├── data.ts             — typed profile/experience/projects/skills/awards/metrics
│   ├── github.ts           — fetch with fallback
│   ├── projects.ts         — read content/projects/*.md
│   └── utils.ts            — cn() + shortcut helpers
├── content/
│   ├── projects/
│   │   ├── workflows-platform.md
│   │   ├── salesforce-rag.md
│   │   └── integrations-design-system.md
│   └── github-fallback.json
├── hooks/
│   ├── use-active-section.ts
│   ├── use-keyboard-shortcut.ts
│   └── use-mounted.ts
├── public/
│   ├── resume.pdf
│   └── avatar-placeholder.svg
├── types/index.ts
├── tests/                  — Vitest unit tests
├── e2e/                    — Playwright smoke
└── (config files)
```

---

## Task 1: Bootstrap Next.js 15 project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.eslintrc.json`, `.prettierrc`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next-env.d.ts`

- [ ] **Step 1: Initialize project**

Run from `/Users/janarthanans/Documents/Projects/portfolio`:

```bash
pnpm dlx create-next-app@latest . \
  --typescript --tailwind --app --src-dir=false \
  --eslint --import-alias "@/*" --turbopack=false --use-pnpm --no-git
```

When prompted to overwrite, accept (we already have `.gitignore`, `docs/`, `ref/` committed; they survive).

- [ ] **Step 2: Verify install**

Run: `pnpm install && pnpm run dev`
Expected: dev server starts on `http://localhost:3000` showing the default Next welcome page. Stop with Ctrl+C.

- [ ] **Step 3: Pin Tailwind v4**

Verify `package.json` lists `tailwindcss@^4` and `@tailwindcss/postcss`. If not (Next 15 templates may still ship v3), upgrade:

```bash
pnpm add -D tailwindcss@latest @tailwindcss/postcss@latest
```

Replace `postcss.config.mjs` with:

```js
const config = {
  plugins: { "@tailwindcss/postcss": {} },
};
export default config;
```

- [ ] **Step 4: Add core deps**

```bash
pnpm add framer-motion lucide-react cmdk clsx tailwind-merge class-variance-authority react-markdown remark-gfm
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node @playwright/test
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 portfolio project

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Theme tokens, fonts, globals

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: Write `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a14;
  --color-bg-elevated: #11111c;
  --color-fg: #fafafa;
  --color-muted: #8b8ba7;
  --color-border: #1f1f33;
  --color-violet: #a855f7;
  --color-cyan: #06b6d4;
  --color-pink: #ec4899;
  --color-success: #10b981;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

@layer base {
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::selection { background: color-mix(in oklch, var(--color-violet) 40%, transparent); }
  :focus-visible { outline: 2px solid var(--color-violet); outline-offset: 2px; border-radius: 4px; }
}

@layer utilities {
  .glass {
    background: color-mix(in oklch, var(--color-bg-elevated) 70%, transparent);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid color-mix(in oklch, var(--color-fg) 8%, transparent);
  }
  .text-gradient {
    background: linear-gradient(90deg, var(--color-violet), var(--color-cyan), var(--color-pink));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .grid-bg {
    background-image:
      radial-gradient(color-mix(in oklch, var(--color-fg) 6%, transparent) 1px, transparent 1px);
    background-size: 24px 24px;
  }
}

@keyframes aurora-1 {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(6vw, 4vh) scale(1.15); }
}
@keyframes aurora-2 {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(-8vw, -3vh) scale(1.1); }
}
@keyframes aurora-3 {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(4vw, -6vh) scale(.9); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
}
```

- [ ] **Step 2: Write `app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://janarthanan.dev"),
  title: { default: "Janarthanan S — Member of Technical Staff", template: "%s · Janarthanan S" },
  description: "Senior Software Engineer & Fullstack Developer building integrations, design systems, and AI tooling at SurveySparrow.",
  keywords: ["Janarthanan S", "Software Engineer", "Fullstack", "React", "Next.js", "Node.js", "SurveySparrow", "MTS", "Portfolio"],
  authors: [{ name: "Janarthanan S" }],
  openGraph: {
    title: "Janarthanan S — Member of Technical Staff",
    description: "I build the web at scale.",
    url: "https://janarthanan.dev",
    siteName: "Janarthanan S",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Janarthanan S", description: "I build the web at scale." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-3 focus:py-2 focus:bg-[var(--color-bg-elevated)] focus:rounded-md">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Write `app/page.tsx` placeholder**

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gradient text-2xl font-semibold">portfolio bootstrapping…</p>
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run: `pnpm run dev`
Open `http://localhost:3000` → see "portfolio bootstrapping…" in violet/cyan/pink gradient on dark bg. Inter font visible. Stop server.

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat(theme): tailwind v4 tokens, fonts, base styles

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: shadcn/ui primitives

**Files:**
- Create: `components.json`, `lib/utils.ts`, `components/ui/{button,card,dialog,badge,command,accordion,tooltip,sheet,separator,scroll-area}.tsx`

- [ ] **Step 1: Init shadcn**

```bash
pnpm dlx shadcn@latest init -d
```

Accept defaults except: style `default`, base color `neutral`, CSS variables `yes`, RSC `yes`, alias `@/components` and `@/lib/utils`.

- [ ] **Step 2: Add primitives**

```bash
pnpm dlx shadcn@latest add button card dialog badge command accordion tooltip sheet separator scroll-area
```

- [ ] **Step 3: Override `lib/utils.ts`**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Verify import**

In `app/page.tsx`, temporarily replace body:

```tsx
import { Button } from "@/components/ui/button";
export default function HomePage() {
  return <main className="min-h-screen flex items-center justify-center"><Button>Click me</Button></main>;
}
```

Run `pnpm run dev` → shadcn button renders. Revert `app/page.tsx` to bootstrapping placeholder.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(ui): add shadcn primitives

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Typed data layer

**Files:**
- Create: `types/index.ts`, `lib/data.ts`, `tests/data.test.ts`, `vitest.config.ts`, `tests/setup.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

- [ ] **Step 2: Write `tests/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add test scripts to `package.json`**

In `package.json` `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 4: Write `types/index.ts`**

```ts
import type { LucideIcon } from "lucide-react";

export type Social = "linkedin" | "github" | "medium" | "email" | "phone";

export type Profile = {
  name: string;
  role: string;
  company: string;
  location: string;
  available: boolean;
  email: string;
  phone: string;
  resumeUrl: string;
  socials: Record<"linkedin" | "github" | "medium", string>;
  taglines: string[];
  bio: string[];
};

export type Metric = {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  icon: LucideIcon;
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  bullets: string[];
  tech: string[];
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  cover: { from: string; to: string };
  tech: string[];
  links?: { live?: string; repo?: string };
};

export type SkillGroup = {
  name: string;
  icon: LucideIcon;
  items: string[];
};

export type Award = {
  title: string;
  org: string;
  year: string;
  description: string;
};

export type NavItem = { id: string; label: string; icon: LucideIcon };
```

- [ ] **Step 5: Write `lib/data.ts`**

```ts
import { Users, Activity, Plug, Zap, Code2, Server, Database, Cloud, Brain, FlaskConical, Home, User, BarChart3, Briefcase, FolderGit2, Sparkles, Trophy, Github, Mail } from "lucide-react";
import type { Profile, Metric, Experience, Project, SkillGroup, Award, NavItem } from "@/types";

export const profile: Profile = {
  name: "Janarthanan S",
  role: "Member of Technical Staff",
  company: "SurveySparrow",
  location: "Chennai, India",
  available: true,
  email: "janarthanans.in@gmail.com",
  phone: "+91 9345762325",
  resumeUrl: "/resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/janarthanan-s-6731a5214/",
    github: "https://github.com/JanarthananGCT",
    medium: "https://medium.com/@janarthanans.in",
  },
  taglines: [
    "I build the web at scale.",
    "Fullstack engineer · Design systems · LLM tooling",
    "20+ production integrations · 100K+ users",
  ],
  bio: [
    "Member of Technical Staff and Fullstack Software Engineer with 2.5+ years architecting end-to-end features across React, Node.js, TypeScript, and AWS.",
    "I've shipped 20+ production integrations, owned a React design system used across 100K+ users, and led platform-level work on workflows, ticketing, and RAG-grounded knowledge bases at SurveySparrow.",
  ],
};

export const metrics: Metric[] = [
  { value: 100000, suffix: "+", label: "Users served", icon: Users },
  { value: 99.9, suffix: "%", decimals: 1, label: "Uptime", icon: Activity },
  { value: 20, suffix: "+", label: "Production integrations", icon: Plug },
  { value: 1000, suffix: "+ req/s", label: "Peak throughput", icon: Zap },
];

export const experience: Experience[] = [
  {
    company: "SurveySparrow",
    role: "Member of Technical Staff",
    start: "Jan 2024",
    end: "Present",
    location: "Chennai, India",
    bullets: [
      "Architected and shipped 10+ production-grade integrations (Jira, Zoho CRM, BigQuery, Databricks, Microsoft Fabric, IBM watsonx, Oracle ADW) at 99.9% uptime, handling 1000+ req/sec.",
      "Designed @sparrowengg/integrations-templates-frontend — a TypeScript-first React design system adopted across 20+ integrations, cutting dev time by 30% and onboarding by 40%.",
      "Optimized frontend to Lighthouse 88 (from 52); LCP 4.2s → 2.1s; bundle -40%; build time -35%; +15% mobile conversion.",
      "Built the Workflows v2→v3 platform with zero-downtime migration: conditional branching, parallel multi-action execution, streamlined execution graphs.",
      "Shipped Ticketing module with live SSE replies (WebSocket fallback), reducing latency 3s→1.2s; Lexical-based collaborative rich-text editor.",
      "Built a Salesforce-grounded RAG knowledge base with vector embeddings to deflect support tickets and surface accurate answers in real time.",
      "Authored RFCs and architecture design docs adopted as team-wide standards across 200+ enterprise customers.",
    ],
    tech: ["React", "Next.js", "Vue 3", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Elasticsearch", "AWS", "GitHub Actions", "Jenkins"],
  },
  {
    company: "BOSCH Global Software Solutions",
    role: "Project Trainee",
    start: "Jul 2023",
    end: "Sep 2023",
    location: "Coimbatore, India",
    bullets: [
      "Automated end-to-end testing using Robot Framework, cutting manual QA effort by 50%.",
      "Re-engineered performance-sensitive backend modules in Rust, achieving 2-3x faster execution; integrated with Python via PyO3.",
    ],
    tech: ["Rust", "Python", "Robot Framework", "PyO3"],
  },
  {
    company: "Government College of Technology, Coimbatore",
    role: "B.Tech, Information Technology",
    start: "Mar 2020",
    end: "Mar 2024",
    location: "Coimbatore, India",
    bullets: [
      "Bachelor of Technology in Information Technology.",
    ],
    tech: [],
  },
];

export const projects: Project[] = [
  {
    slug: "workflows-platform",
    title: "SurveySparrow Workflows v3",
    tagline: "No-code automation platform powering 200+ enterprise customers.",
    cover: { from: "#a855f7", to: "#06b6d4" },
    tech: ["React", "TypeScript", "Node.js", "Reactflow", "PostgreSQL", "Redis"],
  },
  {
    slug: "salesforce-rag",
    title: "Salesforce RAG Knowledge Base",
    tagline: "Vector-embedding-powered semantic retrieval reducing support ticket volume.",
    cover: { from: "#ec4899", to: "#f59e0b" },
    tech: ["Python", "FastAPI", "Pinecone", "OpenAI", "React"],
  },
  {
    slug: "integrations-design-system",
    title: "Integrations Templates Design System",
    tagline: "Reusable React design system adopted across 20+ integrations and 100K+ users.",
    cover: { from: "#10b981", to: "#06b6d4" },
    tech: ["React", "TypeScript", "Storybook", "Radix UI", "Tailwind"],
  },
];

export const skillGroups: SkillGroup[] = [
  { name: "Languages", icon: Code2, items: ["TypeScript", "JavaScript (ES6+)", "Python", "Go", "Rust", "SQL"] },
  { name: "Frontend", icon: Sparkles, items: ["React", "Next.js", "Vue 3", "Redux Toolkit", "TanStack Query", "Zustand", "Tailwind", "Radix UI", "Framer Motion", "Lexical", "Reactflow"] },
  { name: "Backend & APIs", icon: Server, items: ["Node.js", "Express", "FastAPI", "Hapi", "GraphQL", "gRPC", "WebSockets", "SSE", "OAuth 2.0", "OIDC", "JWT"] },
  { name: "Data", icon: Database, items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch", "BigQuery", "Databricks"] },
  { name: "Cloud & DevOps", icon: Cloud, items: ["AWS (S3, EC2, Lambda, CloudFront, API Gateway)", "GCP", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Sentry"] },
  { name: "AI & LLM", icon: Brain, items: ["Claude / Claude Code", "OpenAI", "MCP", "Agentic Workflows", "RAG", "LLM Routing"] },
  { name: "Testing & Tooling", icon: FlaskConical, items: ["Jest", "Vitest", "Storybook", "Playwright", "Docusaurus", "Turborepo", "pnpm workspaces"] },
];

export const awards: Award[] = [
  { title: "Member of Technical Staff", org: "SurveySparrow", year: "2026", description: "Recognized for platform-level ownership across 10+ integrations, React design system serving 100K+ users, and enterprise ETL pipelines." },
  { title: "Dashing Debut Award", org: "SurveySparrow", year: "2024", description: "Awarded for rapid shipping velocity, technical excellence, and cross-functional impact across 200+ enterprise customers." },
];

export const navItems: NavItem[] = [
  { id: "hero", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "metrics", label: "Impact", icon: BarChart3 },
  { id: "experience", label: "Work", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "awards", label: "Awards", icon: Trophy },
  { id: "github", label: "GitHub", icon: Github },
  { id: "contact", label: "Contact", icon: Mail },
];
```

- [ ] **Step 6: Write `tests/data.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { profile, metrics, experience, projects, skillGroups, awards, navItems } from "@/lib/data";

describe("data layer", () => {
  it("profile has required fields", () => {
    expect(profile.name).toBeTruthy();
    expect(profile.email).toMatch(/@/);
    expect(profile.socials.linkedin).toMatch(/^https?:\/\//);
    expect(profile.taglines.length).toBeGreaterThan(0);
  });
  it("metrics are non-empty", () => {
    expect(metrics.length).toBe(4);
    metrics.forEach((m) => expect(m.value).toBeGreaterThan(0));
  });
  it("experience entries chronologically ordered (newest first)", () => {
    expect(experience[0].company).toBe("SurveySparrow");
    expect(experience[experience.length - 1].role).toMatch(/B\.Tech/);
  });
  it("projects expose 3 entries with covers", () => {
    expect(projects.length).toBe(3);
    projects.forEach((p) => {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(p.cover.from).toMatch(/^#/);
    });
  });
  it("skill groups + awards + navItems present", () => {
    expect(skillGroups.length).toBeGreaterThan(3);
    expect(awards.length).toBeGreaterThanOrEqual(2);
    expect(navItems.length).toBeGreaterThanOrEqual(8);
  });
});
```

- [ ] **Step 7: Run tests**

Run: `pnpm test`
Expected: 5 passing tests, 0 failing.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(data): typed profile, experience, projects, skills, awards

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Layout shell + section label

**Files:**
- Create: `components/layout/section-shell.tsx`, `components/layout/section-label.tsx`, `components/layout/footer.tsx`, `hooks/use-mounted.ts`, `tests/section-shell.test.tsx`

- [ ] **Step 1: Write `hooks/use-mounted.ts`**

```ts
"use client";
import { useEffect, useState } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
```

- [ ] **Step 2: Write `components/layout/section-label.tsx`**

```tsx
type Props = { index: string; name: string };

export function SectionLabel({ index, name }: Props) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">
      <span className="text-[var(--color-violet)]">[</span> {index} / {name} <span className="text-[var(--color-violet)]">]</span>
    </p>
  );
}
```

- [ ] **Step 3: Write `components/layout/section-shell.tsx`**

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  id: string;
  label?: { index: string; name: string };
  className?: string;
  children: ReactNode;
};

export function SectionShell({ id, label, className = "", children }: Props) {
  const reduce = useReducedMotion();
  return (
    <section
      id={id}
      aria-labelledby={`${id}-label`}
      className={`relative mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32 scroll-mt-24 ${className}`}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {label && <SectionLabelInline {...label} id={`${id}-label`} />}
        {children}
      </motion.div>
    </section>
  );
}

function SectionLabelInline({ id, index, name }: { id: string; index: string; name: string }) {
  return (
    <p id={id} className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">
      <span className="text-[var(--color-violet)]">[</span> {index} / {name} <span className="text-[var(--color-violet)]">]</span>
    </p>
  );
}
```

- [ ] **Step 4: Write `components/layout/footer.tsx`**

```tsx
import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-10 px-5 md:px-8">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="font-mono text-xs text-[var(--color-muted)]">© {new Date().getFullYear()} {profile.name}</p>
        <p className="font-mono text-xs text-[var(--color-muted)]">Built with Next.js · shadcn/ui · Framer Motion · <span className="text-[var(--color-pink)]">♥</span></p>
        <p className="font-mono text-xs text-[var(--color-muted)]">Press <kbd className="px-1.5 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)]">⌘K</kbd> to explore</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Write `tests/section-shell.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionShell } from "@/components/layout/section-shell";

describe("SectionShell", () => {
  it("renders id and label", () => {
    render(
      <SectionShell id="about" label={{ index: "01", name: "about" }}>
        <p>content</p>
      </SectionShell>,
    );
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run tests**

Run: `pnpm test`
Expected: all tests pass (6 total).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(layout): section shell + label + footer

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Aurora background + grid + marquee + cursor glow

**Files:**
- Create: `components/effects/aurora-bg.tsx`, `components/effects/grid-bg.tsx`, `components/effects/marquee.tsx`, `components/effects/cursor-glow.tsx`

- [ ] **Step 1: Write `components/effects/aurora-bg.tsx`**

```tsx
"use client";
import { useReducedMotion } from "framer-motion";

export function AuroraBg({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const anim = reduce ? {} : undefined;
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0" style={{ filter: "blur(70px)", mixBlendMode: "screen" }}>
        <div
          className="absolute h-[50vw] w-[50vw] rounded-full"
          style={{
            top: "-10%", left: "-10%",
            background: "radial-gradient(circle, rgba(168,85,247,0.55) 0%, transparent 60%)",
            animation: reduce ? undefined : "aurora-1 18s ease-in-out infinite",
            ...anim,
          }}
        />
        <div
          className="absolute h-[60vw] w-[60vw] rounded-full"
          style={{
            bottom: "-20%", right: "-15%",
            background: "radial-gradient(circle, rgba(6,182,212,0.45) 0%, transparent 60%)",
            animation: reduce ? undefined : "aurora-2 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute h-[40vw] w-[40vw] rounded-full"
          style={{
            top: "30%", left: "30%",
            background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 60%)",
            animation: reduce ? undefined : "aurora-3 26s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/effects/grid-bg.tsx`**

```tsx
export function GridBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 grid-bg opacity-40"
      style={{ maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)" }}
    />
  );
}
```

- [ ] **Step 3: Write `components/effects/marquee.tsx`**

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Marquee({ children, speed = 30 }: { children: ReactNode; speed?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full overflow-hidden mask-fade" aria-hidden="true">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
      >
        {children}
        {children}
      </motion.div>
      <style>{`.mask-fade { mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent); }`}</style>
    </div>
  );
}
```

- [ ] **Step 4: Write `components/effects/cursor-glow.tsx`**

```tsx
"use client";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { damping: 25, stiffness: 200, mass: 0.5 });
  const sy = useSpring(y, { damping: 25, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y, reduce]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[60] h-[400px] w-[400px] rounded-full"
      style={{
        x: sx, y: sy,
        translateX: "-50%", translateY: "-50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 60%)",
        filter: "blur(40px)",
      }}
    />
  );
}
```

- [ ] **Step 5: Visual smoke**

Replace `app/page.tsx` body temporarily:

```tsx
import { AuroraBg } from "@/components/effects/aurora-bg";
import { GridBg } from "@/components/effects/grid-bg";
import { CursorGlow } from "@/components/effects/cursor-glow";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AuroraBg />
      <GridBg />
      <CursorGlow />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <h1 className="text-gradient text-5xl font-bold">Aurora live</h1>
      </div>
    </main>
  );
}
```

Run `pnpm run dev`, open `http://localhost:3000`. Confirm: animated aurora visible, dotted grid, cursor glow follows mouse (desktop). Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(effects): aurora bg, grid bg, marquee, cursor glow

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Animated counter + magnetic button

**Files:**
- Create: `components/effects/animated-counter.tsx`, `components/effects/magnetic-button.tsx`, `tests/animated-counter.test.tsx`

- [ ] **Step 1: Write `components/effects/animated-counter.tsx`**

```tsx
"use client";
import { motion, useInView, useMotionValue, useTransform, useReducedMotion, animate } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({ to, decimals = 0, suffix = "", duration = 1.6, className = "" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => {
    const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
    return `${n}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduce) { mv.set(to); return; }
    const controls = animate(mv, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, to, duration, mv, reduce]);

  return <motion.span ref={ref} className={className} aria-label={`${to}${suffix}`}>{rounded}</motion.span>;
}
```

- [ ] **Step 2: Write `components/effects/magnetic-button.tsx`**

```tsx
"use client";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { type ReactNode, useRef } from "react";

type Props = { children: ReactNode; strength?: number; className?: string };

export function MagneticButton({ children, strength = 0.3, className = "" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }
  function onLeave() { x.set(0); y.set(0); }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Write `tests/animated-counter.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedCounter } from "@/components/effects/animated-counter";

describe("AnimatedCounter", () => {
  it("renders aria-label with final value + suffix", () => {
    render(<AnimatedCounter to={100} suffix="+" />);
    expect(screen.getByLabelText("100+")).toBeInTheDocument();
  });
  it("renders aria-label with decimals", () => {
    render(<AnimatedCounter to={99.9} decimals={1} suffix="%" />);
    expect(screen.getByLabelText("99.9%")).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: all tests pass (8 total).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(effects): animated counter + magnetic button

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Active section hook + keyboard shortcut hook

**Files:**
- Create: `hooks/use-active-section.ts`, `hooks/use-keyboard-shortcut.ts`, `tests/use-active-section.test.tsx`

- [ ] **Step 1: Write `hooks/use-active-section.ts`**

```ts
"use client";
import { useEffect, useState } from "react";

export function useActiveSection(ids: string[], rootMargin = "-40% 0px -55% 0px") {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}
```

- [ ] **Step 2: Write `hooks/use-keyboard-shortcut.ts`**

```ts
"use client";
import { useEffect } from "react";

type Options = { key: string; meta?: boolean; ctrl?: boolean; alt?: boolean; shift?: boolean; preventDefault?: boolean };

export function useKeyboardShortcut({ key, meta, ctrl, alt, shift, preventDefault = true }: Options, handler: (e: KeyboardEvent) => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMeta = meta ? e.metaKey || e.ctrlKey : true;
      const isCtrl = ctrl ? e.ctrlKey : true;
      const isAlt = alt ? e.altKey : !e.altKey || !alt;
      const isShift = shift ? e.shiftKey : !e.shiftKey || !shift;
      if (e.key.toLowerCase() === key.toLowerCase() && isMeta && isCtrl && isAlt && isShift) {
        if (preventDefault) e.preventDefault();
        handler(e);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, meta, ctrl, alt, shift, preventDefault, handler]);
}
```

- [ ] **Step 3: Write `tests/use-active-section.test.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useActiveSection } from "@/hooks/use-active-section";

describe("useActiveSection", () => {
  it("returns first id as default", () => {
    const { result } = renderHook(() => useActiveSection(["hero", "about"]));
    expect(result.current).toBe("hero");
  });
  it("uses IntersectionObserver when available", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    // @ts-expect-error mock
    window.IntersectionObserver = vi.fn(() => ({ observe, disconnect, unobserve: vi.fn() }));
    document.body.innerHTML = '<div id="hero"></div><div id="about"></div>';
    renderHook(() => useActiveSection(["hero", "about"]));
    expect(observe).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(hooks): active-section observer + keyboard shortcut

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Pill nav + mobile dock

**Files:**
- Create: `components/nav/pill-nav.tsx`, `components/nav/mobile-dock.tsx`

- [ ] **Step 1: Write `components/nav/pill-nav.tsx`**

```tsx
"use client";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { useActiveSection } from "@/hooks/use-active-section";

export function PillNav({ onOpenCommand }: { onOpenCommand: () => void }) {
  const active = useActiveSection(navItems.map((n) => n.id));

  return (
    <nav
      aria-label="Primary"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 hidden md:block"
    >
      <div className="glass rounded-full px-2 py-2 flex items-center gap-1">
        {navItems.map((n) => {
          const isActive = active === n.id;
          return (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isActive ? "text-white" : "text-[var(--color-muted)] hover:text-white"}`}
            >
              {isActive && (
                <motion.span
                  layoutId="pill-active"
                  className="absolute inset-0 rounded-full bg-[var(--color-violet)]/30 border border-[var(--color-violet)]/60"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{n.label}</span>
            </a>
          );
        })}
        <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />
        <button
          onClick={onOpenCommand}
          className="px-3 py-1.5 rounded-full text-xs font-mono text-[var(--color-muted)] hover:text-white flex items-center gap-1.5"
          aria-label="Open command palette"
        >
          <kbd className="text-[10px] px-1 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">⌘K</kbd>
          search
        </button>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Write `components/nav/mobile-dock.tsx`**

```tsx
"use client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems, profile } from "@/lib/data";

export function MobileDock({ onOpenCommand }: { onOpenCommand: () => void }) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="fixed top-4 right-4 z-40 glass rounded-full p-2.5"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-[var(--color-bg)] border-[var(--color-border)]">
          <p className="font-mono text-xs text-[var(--color-muted)] mb-6 uppercase tracking-widest">{profile.name}</p>
          <nav aria-label="Mobile">
            <ul className="space-y-3">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="flex items-center gap-3 py-2 text-lg hover:text-[var(--color-violet)]">
                    <n.icon className="h-4 w-4" /> {n.label}
                  </a>
                </li>
              ))}
              <li>
                <button onClick={onOpenCommand} className="flex items-center gap-3 py-2 text-lg text-[var(--color-muted)] hover:text-white">
                  Search…
                </button>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(nav): floating pill nav + mobile dock

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Command palette

**Files:**
- Create: `components/nav/command-palette.tsx`, `tests/command-palette.test.tsx`

- [ ] **Step 1: Write `components/nav/command-palette.tsx`**

```tsx
"use client";
import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { navItems, profile, projects } from "@/lib/data";
import { Copy, Download, Terminal, ExternalLink, FolderGit2 } from "lucide-react";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onToggleTerminal: () => void;
  onOpenProject: (slug: string) => void;
};

export function CommandPalette({ open, onOpenChange, onToggleTerminal, onOpenProject }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);

  useKeyboardShortcut({ key: "k", meta: true }, () => onOpenChange(!open));

  function run(fn: () => void | Promise<void>) {
    Promise.resolve(fn()).finally(() => onOpenChange(false));
  }
  function copyEmail() {
    navigator.clipboard?.writeText(profile.email);
    setFeedback("Email copied");
    setTimeout(() => setFeedback(null), 2000);
  }
  function go(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {navItems.map((n) => (
            <CommandItem key={n.id} onSelect={() => run(() => go(n.id))}>
              <n.icon className="mr-2 h-4 w-4" />
              {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem key={p.slug} onSelect={() => run(() => onOpenProject(p.slug))}>
              <FolderGit2 className="mr-2 h-4 w-4" />
              {p.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(copyEmail)}>
            <Copy className="mr-2 h-4 w-4" /> Copy email
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(profile.resumeUrl, "_blank"))}>
            <Download className="mr-2 h-4 w-4" /> Open resume
          </CommandItem>
          <CommandItem onSelect={() => run(onToggleTerminal)}>
            <Terminal className="mr-2 h-4 w-4" /> Toggle terminal mode
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(profile.socials.linkedin, "_blank"))}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open LinkedIn
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(profile.socials.github, "_blank"))}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open GitHub
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(profile.socials.medium, "_blank"))}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open Medium
          </CommandItem>
        </CommandGroup>
      </CommandList>
      {feedback && (
        <div className="absolute bottom-3 right-3 text-xs font-mono text-[var(--color-success)]" role="status">{feedback}</div>
      )}
    </CommandDialog>
  );
}
```

- [ ] **Step 2: Write `tests/command-palette.test.tsx`**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPalette } from "@/components/nav/command-palette";

describe("CommandPalette", () => {
  it("renders nav, project, and action groups when open", () => {
    render(<CommandPalette open={true} onOpenChange={() => {}} onToggleTerminal={() => {}} onOpenProject={() => {}} />);
    expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
    expect(screen.getByText("Navigate")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
  it("filters by input text", async () => {
    render(<CommandPalette open={true} onOpenChange={() => {}} onToggleTerminal={() => {}} onOpenProject={() => {}} />);
    const input = screen.getByPlaceholderText(/Type a command/i);
    await userEvent.type(input, "resume");
    expect(screen.getByText(/Open resume/i)).toBeInTheDocument();
  });
  it("invokes onOpenProject when project selected", async () => {
    const onOpenProject = vi.fn();
    render(<CommandPalette open={true} onOpenChange={() => {}} onToggleTerminal={() => {}} onOpenProject={onOpenProject} />);
    await userEvent.click(screen.getByText(/Workflows v3/i));
    expect(onOpenProject).toHaveBeenCalledWith("workflows-platform");
  });
});
```

- [ ] **Step 3: Run tests**

Run: `pnpm test`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(nav): ⌘K command palette

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Hero section

**Files:**
- Create: `components/sections/hero.tsx`

- [ ] **Step 1: Write `components/sections/hero.tsx`**

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuroraBg } from "@/components/effects/aurora-bg";
import { GridBg } from "@/components/effects/grid-bg";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { profile } from "@/lib/data";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-5 md:px-8">
      <AuroraBg />
      <GridBg />
      <div className="relative z-10 w-full max-w-6xl">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-6 flex items-center gap-3"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
            </span>
            Available
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {profile.location}</span>
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[0.95]"
        >
          {profile.name}
          <br />
          <span className="text-gradient">builds the web<br />at scale.</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg md:text-xl text-[var(--color-muted)] leading-relaxed"
        >
          {profile.role} at {profile.company}. 2.5+ years architecting end-to-end features across React, Node.js, TypeScript, and AWS — shipping 20+ integrations serving 100K+ users at 99.9% uptime.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton>
            <Button asChild size="lg" className="rounded-full bg-[var(--color-violet)] hover:bg-[var(--color-violet)]/90 text-white">
              <a href="#projects">View work <ArrowRight className="ml-1.5 h-4 w-4" /></a>
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button asChild variant="outline" size="lg" className="rounded-full border-[var(--color-border)] bg-transparent hover:bg-[var(--color-bg-elevated)]">
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"><Download className="mr-1.5 h-4 w-4" /> Resume</a>
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button asChild variant="ghost" size="lg" className="rounded-full hover:bg-[var(--color-bg-elevated)]">
              <a href="#contact">Contact</a>
            </Button>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/hero";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <CursorGlow />
      <main className="relative">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Visual smoke**

Run `pnpm run dev` → hero fills viewport, aurora animating, three CTAs visible, gradient on tagline, availability pulse. Stop.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(sections): hero with aurora + CTAs

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Tech marquee + About section

**Files:**
- Create: `components/sections/about.tsx`, `components/sections/tech-marquee.tsx`

- [ ] **Step 1: Write `components/sections/tech-marquee.tsx`**

```tsx
import { Marquee } from "@/components/effects/marquee";
import { skillGroups } from "@/lib/data";

export function TechMarquee() {
  const flat = skillGroups.flatMap((g) => g.items).slice(0, 24);
  return (
    <div className="border-y border-[var(--color-border)] py-6">
      <Marquee>
        {flat.map((t, i) => (
          <span key={i} className="font-mono text-sm text-[var(--color-muted)]">{t}</span>
        ))}
      </Marquee>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/sections/about.tsx`**

```tsx
import { SectionShell } from "@/components/layout/section-shell";
import { profile } from "@/lib/data";

export function About() {
  return (
    <SectionShell id="about" label={{ index: "01", name: "about" }}>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
            Engineer who <span className="text-gradient">ships at scale</span>, owns the platform, and writes the docs.
          </h2>
          {profile.bio.map((p, i) => (
            <p key={i} className="text-[var(--color-muted)] text-base md:text-lg leading-relaxed mb-4">{p}</p>
          ))}
        </div>
        <aside className="glass rounded-2xl p-6 space-y-5 h-fit">
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-1">Currently</p>
            <p className="font-medium">{profile.role}</p>
            <p className="text-sm text-[var(--color-muted)]">{profile.company}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-1">Based in</p>
            <p className="font-medium">{profile.location}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-1">Status</p>
            <p className="font-medium text-[var(--color-success)]">Open to interesting problems</p>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 3: Wire into `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { About } from "@/components/sections/about";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <CursorGlow />
      <main className="relative">
        <Hero />
        <TechMarquee />
        <About />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Visual smoke**

Run `pnpm run dev`, scroll past hero — marquee loops, about section animates in, glass aside visible right side desktop / below content mobile.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(sections): about + tech marquee

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: Metrics section

**Files:**
- Create: `components/sections/metrics.tsx`

- [ ] **Step 1: Write `components/sections/metrics.tsx`**

```tsx
import { SectionShell } from "@/components/layout/section-shell";
import { AnimatedCounter } from "@/components/effects/animated-counter";
import { metrics } from "@/lib/data";

export function Metrics() {
  return (
    <SectionShell id="metrics" label={{ index: "02", name: "impact" }}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-12 max-w-3xl">
        Numbers from production. <span className="text-gradient">Not vanity.</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="glass rounded-2xl p-6 relative overflow-hidden">
            <m.icon className="absolute top-4 right-4 h-5 w-5 text-[var(--color-violet)]/60" aria-hidden="true" />
            <p className="text-3xl md:text-5xl font-bold tracking-tight">
              <AnimatedCounter to={m.value} decimals={m.decimals} suffix={m.suffix} />
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{m.label}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`**

Add `import { Metrics } from "@/components/sections/metrics";` and `<Metrics />` after `<About />`.

- [ ] **Step 3: Visual smoke**

Run dev server. Scroll to metrics — counters animate from 0 → final values, icons visible, glass cards.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(sections): impact metrics with animated counters

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: Experience timeline

**Files:**
- Create: `components/sections/experience.tsx`

- [ ] **Step 1: Write `components/sections/experience.tsx`**

```tsx
"use client";
import { SectionShell } from "@/components/layout/section-shell";
import { experience } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function Experience() {
  return (
    <SectionShell id="experience" label={{ index: "03", name: "experience" }}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-12 max-w-3xl">
        Roles that <span className="text-gradient">shipped real things.</span>
      </h2>
      <div className="relative">
        <span className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-violet)] via-[var(--color-cyan)] to-[var(--color-pink)] opacity-40" aria-hidden="true" />
        <Accordion type="multiple" defaultValue={[`exp-0`]} className="space-y-4">
          {experience.map((e, i) => (
            <AccordionItem key={i} value={`exp-${i}`} className="border-none">
              <div className="relative pl-10">
                <span className="absolute left-[7px] top-6 h-3 w-3 rounded-full bg-[var(--color-violet)] ring-4 ring-[var(--color-bg)]" aria-hidden="true" />
                <div className="glass rounded-2xl p-5">
                  <AccordionTrigger className="hover:no-underline py-0">
                    <div className="text-left flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-lg md:text-xl font-semibold">{e.role}</h3>
                        <span className="text-[var(--color-muted)]">·</span>
                        <span className="text-[var(--color-violet)] font-medium">{e.company}</span>
                      </div>
                      <p className="font-mono text-xs text-[var(--color-muted)] mt-1">
                        {e.start} → {e.end} · {e.location}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <ul className="space-y-2 mb-4">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="text-[var(--color-muted)] text-sm md:text-base leading-relaxed flex gap-2">
                          <span className="text-[var(--color-violet)] mt-1">▹</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {e.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {e.tech.map((t) => (
                          <Badge key={t} variant="outline" className="font-mono text-[10px] border-[var(--color-border)] text-[var(--color-muted)]">{t}</Badge>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`**

Import `Experience` and add `<Experience />` after `<Metrics />`.

- [ ] **Step 3: Visual smoke**

Run dev server. Scroll to experience. First card open by default. Click to expand others. Timeline gradient line visible left side.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(sections): experience timeline with accordion

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 15: Project markdown content + reader

**Files:**
- Create: `content/projects/workflows-platform.md`, `content/projects/salesforce-rag.md`, `content/projects/integrations-design-system.md`, `lib/projects.ts`

- [ ] **Step 1: Write `content/projects/workflows-platform.md`**

```md
## Problem

SurveySparrow's existing workflow engine was a sync-only execution model with no branching, no parallelism, and tightly coupled UI. Enterprise customers needed multi-step automation across surveys, contacts, integrations, and AI nodes — without writing code.

## Solution

Re-architected Workflows v2 → v3 with conditional branching, parallel multi-action execution, and a streamlined execution graph that runs both synchronous and asynchronous nodes.

## Architecture

- **Frontend:** React + Reactflow canvas for visual graph editing, Zustand for graph state, dynamic node panel.
- **Backend:** Event-driven Node.js executor with DAG resolution, Redis-backed queue, PostgreSQL state checkpoints.
- **Migration:** Dual-write + shadow execution to migrate v2 customers zero-downtime.

## Stack

React · TypeScript · Reactflow · Zustand · Node.js · Redis · PostgreSQL · AWS Lambda

## Results

- Zero downtime across hundreds of active customer workflows during cutover.
- 200+ enterprise customers building no-code automation as a result.
- Foundation for AI-action nodes (RAG, summarization, classification).

## Links

> Internal SurveySparrow product. Demo on request.
```

- [ ] **Step 2: Write `content/projects/salesforce-rag.md`**

```md
## Problem

Customer support was drowning in repeat tickets that could be answered from internal docs — but agents had to manually search Salesforce, Confluence, and runbooks. Response times suffered.

## Solution

Built a RAG knowledge base grounded in Salesforce + internal docs. Vector embeddings + semantic retrieval surface accurate, context-aware answers in real time.

## Architecture

- **Ingestion:** Salesforce Connector + Notion exporter → chunker → embedding model → vector store.
- **Retrieval:** Hybrid (BM25 + vector) with reranker for top-k context selection.
- **Generation:** Claude/OpenAI with strict citation grounding; refuses to answer outside retrieved context.

## Stack

Python · FastAPI · Pinecone · OpenAI · React · TypeScript

## Results

- Significant deflection of support ticket volume.
- Drastically reduced response times for L1 issues.
- Reusable RAG pattern adopted across other internal tools.

## Links

> Internal SurveySparrow tool. Architecture diagram on request.
```

- [ ] **Step 3: Write `content/projects/integrations-design-system.md`**

```md
## Problem

20+ integration UIs were diverging — every team built their own auth screen, polling indicator, field mapper. Onboarding was slow, bugs duplicated across packages.

## Solution

Designed `@sparrowengg/integrations-templates-frontend` — a TypeScript-first React design system with Storybook documentation, semantic versioning, and WCAG 2.1 AA compliance baked in.

## Architecture

- **Tokens:** Theme tokens + Radix UI primitives.
- **Components:** Field mapper, OAuth handshake screen, polling status, error fallback, sync history.
- **Distribution:** pnpm workspaces + Turborepo, published via internal npm registry.
- **DX:** Storybook for visuals, Vitest for unit, Playwright for snapshot.

## Stack

React · TypeScript · Radix UI · Tailwind · Storybook · Vitest · Turborepo · pnpm workspaces

## Results

- Adopted across 20+ integrations serving 100K+ users.
- 30% dev-time reduction, 40% faster onboarding.
- 99.9% component API stability across releases.

## Links

> Internal SurveySparrow package. Component catalog on request.
```

- [ ] **Step 4: Write `lib/projects.ts`**

```ts
import fs from "node:fs/promises";
import path from "node:path";

export async function getProjectContent(slug: string): Promise<string> {
  const file = path.join(process.cwd(), "content", "projects", `${slug}.md`);
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return `## Coming soon\n\nCase study for **${slug}** is being written.`;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(content): project case-study markdown stubs

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 16: Project card + modal

**Files:**
- Create: `components/projects/project-card.tsx`, `components/projects/project-modal.tsx`, `components/sections/projects.tsx`, `app/api/project/[slug]/route.ts`

- [ ] **Step 1: Write API route to serve markdown**

`app/api/project/[slug]/route.ts`:

```ts
import { getProjectContent } from "@/lib/projects";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const md = await getProjectContent(slug);
  return NextResponse.json({ slug, md });
}
```

- [ ] **Step 2: Write `components/projects/project-card.tsx`**

```tsx
"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/badge";

type Props = { project: Project; onOpen: () => void };

export function ProjectCard({ project, onOpen }: Props) {
  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group text-left glass rounded-2xl overflow-hidden flex flex-col hover:border-[var(--color-violet)]/40 transition-colors"
      aria-label={`Open ${project.title} case study`}
    >
      <div
        className="aspect-[16/10] relative"
        style={{ background: `linear-gradient(135deg, ${project.cover.from}, ${project.cover.to})` }}
      >
        <div className="absolute inset-0 grid-bg opacity-25 mix-blend-overlay" />
        <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest text-white/80">case study</div>
        <ArrowUpRight className="absolute top-3 right-3 h-5 w-5 text-white/80 group-hover:scale-110 transition-transform" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg md:text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)] flex-1">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <Badge key={t} variant="outline" className="font-mono text-[10px] border-[var(--color-border)] text-[var(--color-muted)]">{t}</Badge>
          ))}
          {project.tech.length > 4 && <Badge variant="outline" className="font-mono text-[10px] border-[var(--color-border)] text-[var(--color-muted)]">+{project.tech.length - 4}</Badge>}
        </div>
      </div>
    </motion.button>
  );
}
```

- [ ] **Step 3: Write `components/projects/project-modal.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Project } from "@/types";

type Props = { project: Project | null; onClose: () => void };

export function ProjectModal({ project, onClose }: Props) {
  const [md, setMd] = useState<string>("");

  useEffect(() => {
    if (!project) return;
    setMd("Loading…");
    fetch(`/api/project/${project.slug}`).then((r) => r.json()).then((d) => setMd(d.md)).catch(() => setMd("Failed to load."));
  }, [project]);

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl bg-[var(--color-bg)] border-[var(--color-border)] p-0 max-h-[85vh] overflow-hidden flex flex-col">
        {project && (
          <>
            <div
              className="aspect-[16/6] relative shrink-0"
              style={{ background: `linear-gradient(135deg, ${project.cover.from}, ${project.cover.to})` }}
            >
              <div className="absolute inset-0 grid-bg opacity-25 mix-blend-overlay" />
            </div>
            <DialogHeader className="px-6 pt-6 shrink-0">
              <DialogTitle className="text-2xl">{project.title}</DialogTitle>
              <DialogDescription className="text-[var(--color-muted)]">{project.tagline}</DialogDescription>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.tech.map((t) => (
                  <Badge key={t} variant="outline" className="font-mono text-[10px] border-[var(--color-border)] text-[var(--color-muted)]">{t}</Badge>
                ))}
              </div>
            </DialogHeader>
            <ScrollArea className="px-6 pb-6 flex-1">
              <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-semibold prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-2 prose-p:text-[var(--color-muted)] prose-li:text-[var(--color-muted)] prose-strong:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

Install `@tailwindcss/typography`:

```bash
pnpm add -D @tailwindcss/typography
```

Add to `app/globals.css` after `@import "tailwindcss";`:

```css
@plugin "@tailwindcss/typography";
```

- [ ] **Step 4: Write `components/sections/projects.tsx`**

```tsx
"use client";
import { useState } from "react";
import { SectionShell } from "@/components/layout/section-shell";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectModal } from "@/components/projects/project-modal";
import { projects } from "@/lib/data";
import type { Project } from "@/types";

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  return (
    <SectionShell id="projects" label={{ index: "04", name: "projects" }}>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-3xl">
          Selected <span className="text-gradient">work.</span>
        </h2>
        <p className="font-mono text-xs text-[var(--color-muted)]">click card → case study</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} onOpen={() => setOpen(p)} />
        ))}
      </div>
      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </SectionShell>
  );
}
```

- [ ] **Step 5: Wire into `app/page.tsx`**

Import `Projects` and add `<Projects />` after `<Experience />`.

- [ ] **Step 6: Visual smoke**

Run dev server. Projects section shows 3 cards. Click each → modal opens with markdown rendered. Esc closes.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(sections): projects + case-study modal

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 17: Skills section

**Files:**
- Create: `components/sections/skills.tsx`

- [ ] **Step 1: Write `components/sections/skills.tsx`**

```tsx
import { SectionShell } from "@/components/layout/section-shell";
import { skillGroups } from "@/lib/data";

export function Skills() {
  return (
    <SectionShell id="skills" label={{ index: "05", name: "skills" }}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-12 max-w-3xl">
        Stack <span className="text-gradient">I reach for.</span>
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillGroups.map((g) => (
          <div key={g.name} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <g.icon className="h-4 w-4 text-[var(--color-violet)]" />
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">{g.name}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-violet)]/60 transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`**

Import `Skills` and add after `<Projects />`.

- [ ] **Step 3: Visual smoke**

Skills section: 6-7 categorized glass cards, badge cloud per category with hover.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(sections): categorized skills grid

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 18: Awards section

**Files:**
- Create: `components/sections/awards.tsx`

- [ ] **Step 1: Write `components/sections/awards.tsx`**

```tsx
import { Trophy } from "lucide-react";
import { SectionShell } from "@/components/layout/section-shell";
import { awards } from "@/lib/data";

export function Awards() {
  return (
    <SectionShell id="awards" label={{ index: "06", name: "awards" }}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-12 max-w-3xl">
        Recognition that <span className="text-gradient">reinforces the work.</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-5">
        {awards.map((a, i) => (
          <article key={i} className="glass rounded-2xl p-6 flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-[var(--color-violet)]/15 border border-[var(--color-violet)]/40 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-[var(--color-violet)]" />
            </div>
            <div>
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">{a.year} · {a.org}</p>
              <h3 className="text-lg md:text-xl font-semibold mt-1">{a.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{a.description}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`** — after `<Skills />`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(sections): awards & recognition

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 19: GitHub section (with fallback)

**Files:**
- Create: `lib/github.ts`, `content/github-fallback.json`, `components/sections/github.tsx`

- [ ] **Step 1: Write `content/github-fallback.json`**

```json
{
  "user": "JanarthananGCT",
  "totalContributions": 1200,
  "topRepos": [
    { "name": "portfolio", "description": "This site.", "language": "TypeScript", "stars": 0, "url": "https://github.com/JanarthananGCT" },
    { "name": "design-system-experiments", "description": "Component primitives + Storybook.", "language": "TypeScript", "stars": 0, "url": "https://github.com/JanarthananGCT" },
    { "name": "rust-experiments", "description": "Rust + PyO3 perf experiments.", "language": "Rust", "stars": 0, "url": "https://github.com/JanarthananGCT" },
    { "name": "llm-tooling", "description": "MCP servers + agent workflows.", "language": "Python", "stars": 0, "url": "https://github.com/JanarthananGCT" }
  ]
}
```

- [ ] **Step 2: Write `lib/github.ts`**

```ts
import fallback from "@/content/github-fallback.json";

export type GithubRepo = { name: string; description: string; language: string; stars: number; url: string };
export type GithubData = { user: string; totalContributions: number; topRepos: GithubRepo[] };

export async function getGithub(): Promise<GithubData> {
  try {
    const user = fallback.user;
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=4`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("github api failed");
    const repos = (await res.json()) as Array<{ name: string; description: string | null; language: string | null; stargazers_count: number; html_url: string }>;
    return {
      user,
      totalContributions: fallback.totalContributions,
      topRepos: repos.map((r) => ({
        name: r.name,
        description: r.description ?? "",
        language: r.language ?? "—",
        stars: r.stargazers_count,
        url: r.html_url,
      })),
    };
  } catch {
    return fallback as GithubData;
  }
}
```

- [ ] **Step 3: Write `components/sections/github.tsx`**

```tsx
import { Star, GitBranch, ExternalLink } from "lucide-react";
import { SectionShell } from "@/components/layout/section-shell";
import { getGithub } from "@/lib/github";

export async function Github() {
  const data = await getGithub();
  return (
    <SectionShell id="github" label={{ index: "07", name: "github" }}>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-3xl">
          What I ship <span className="text-gradient">in the open.</span>
        </h2>
        <a
          href={`https://github.com/${data.user}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[var(--color-muted)] hover:text-white flex items-center gap-1.5"
        >
          @{data.user} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {data.topRepos.map((r) => (
          <a
            key={r.name}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-5 hover:border-[var(--color-violet)]/40 transition-colors block"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-[var(--color-violet)]" />
                <h3 className="font-semibold">{r.name}</h3>
              </div>
              <span className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                <Star className="h-3 w-3" /> {r.stars}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-2">{r.description || "—"}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-cyan)]">{r.language}</p>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 4: Wire into `app/page.tsx`** — after `<Awards />`. Note `Github` is async; can be used directly in RSC.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(sections): github repos with fallback

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 20: Contact section

**Files:**
- Create: `components/sections/contact.tsx`

- [ ] **Step 1: Write `components/sections/contact.tsx`**

```tsx
"use client";
import { useState } from "react";
import { Copy, Check, Linkedin, Github, BookOpen, Mail, Phone, MapPin } from "lucide-react";
import { SectionShell } from "@/components/layout/section-shell";
import { profile } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <SectionShell id="contact" label={{ index: "08", name: "contact" }}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Got an idea <span className="text-gradient">worth shipping?</span>
          </h2>
          <p className="mt-6 text-[var(--color-muted)] text-lg leading-relaxed">
            Available for senior engineering roles, contracting on platform / design-system work, and interesting LLM-tooling collaborations.
          </p>
          <div className="mt-8 space-y-3 font-mono text-sm">
            <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--color-violet)]" /> {profile.email}</p>
            <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-[var(--color-violet)]" /> {profile.phone}</p>
            <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[var(--color-violet)]" /> {profile.location}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">Quick actions</p>
            <div className="space-y-2">
              <Button onClick={copyEmail} className="w-full justify-start gap-2 bg-[var(--color-bg-elevated)] hover:bg-[var(--color-violet)]/10 text-white" variant="ghost">
                {copied ? <Check className="h-4 w-4 text-[var(--color-success)]" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy email"}
              </Button>
              <Button asChild className="w-full justify-start gap-2 bg-[var(--color-bg-elevated)] hover:bg-[var(--color-violet)]/10 text-white" variant="ghost">
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="h-4 w-4" /> Open resume
                </a>
              </Button>
            </div>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">Find me on</p>
            <div className="flex gap-2">
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="glass rounded-full p-3 hover:border-[var(--color-violet)]/60 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="glass rounded-full p-3 hover:border-[var(--color-violet)]/60 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href={profile.socials.medium} target="_blank" rel="noopener noreferrer" aria-label="Medium" className="glass rounded-full p-3 hover:border-[var(--color-violet)]/60 transition-colors">
                <BookOpen className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`** — after `<Github />`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(sections): contact with copy-email + socials

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 21: Terminal mode overlay

**Files:**
- Create: `components/terminal/command-handlers.ts`, `components/terminal/terminal-overlay.tsx`, `tests/terminal.test.ts`

- [ ] **Step 1: Write `components/terminal/command-handlers.ts`**

```ts
import { profile, projects } from "@/lib/data";

export type CmdResult = { output: string; navigate?: string; close?: boolean };

export function runCommand(input: string): CmdResult {
  const cmd = input.trim().toLowerCase();
  if (!cmd) return { output: "" };

  if (cmd === "help") {
    return { output: [
      "available commands:",
      "  whoami          → who am I",
      "  ls projects     → list projects",
      "  cat about.md    → print bio",
      "  open <target>   → open linkedin | github | medium | resume",
      "  goto <section>  → jump to section (hero, about, projects, ...)",
      "  clear           → clear screen",
      "  exit            → close terminal",
    ].join("\n") };
  }
  if (cmd === "whoami") {
    return { output: `${profile.name} · ${profile.role} @ ${profile.company} · ${profile.location}` };
  }
  if (cmd === "ls projects") {
    return { output: projects.map((p, i) => `  ${i + 1}. ${p.slug.padEnd(30)} ${p.title}`).join("\n") };
  }
  if (cmd === "cat about.md") {
    return { output: profile.bio.join("\n\n") };
  }
  if (cmd === "clear") return { output: "__CLEAR__" };
  if (cmd === "exit") return { output: "bye.", close: true };

  if (cmd.startsWith("open ")) {
    const target = cmd.slice(5).trim();
    if (target === "linkedin") return { output: `→ ${profile.socials.linkedin}`, navigate: profile.socials.linkedin };
    if (target === "github") return { output: `→ ${profile.socials.github}`, navigate: profile.socials.github };
    if (target === "medium") return { output: `→ ${profile.socials.medium}`, navigate: profile.socials.medium };
    if (target === "resume") return { output: `→ ${profile.resumeUrl}`, navigate: profile.resumeUrl };
    return { output: `unknown target: ${target}` };
  }
  if (cmd.startsWith("goto ")) {
    const target = cmd.slice(5).trim();
    return { output: `→ scrolling to #${target}`, navigate: `#${target}` };
  }

  return { output: `command not found: ${cmd}. type 'help'` };
}
```

- [ ] **Step 2: Write `components/terminal/terminal-overlay.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runCommand } from "@/components/terminal/command-handlers";
import { profile } from "@/lib/data";

type Line = { kind: "in" | "out"; text: string };

export function TerminalOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `${profile.name.toLowerCase().replace(/ /g, "")}@portfolio:~$ type 'help' for commands` },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input;
    setInput("");
    const result = runCommand(cmd);
    if (result.output === "__CLEAR__") { setLines([]); return; }
    setLines((l) => [...l, { kind: "in", text: cmd }, { kind: "out", text: result.output }]);
    if (result.navigate) {
      if (result.navigate.startsWith("#")) {
        document.getElementById(result.navigate.slice(1))?.scrollIntoView({ behavior: "smooth" });
        onClose();
      } else {
        window.open(result.navigate, "_blank");
      }
    }
    if (result.close) setTimeout(onClose, 400);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.96, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 10 }}
            className="w-full max-w-3xl h-[70vh] glass rounded-2xl font-mono text-sm text-[var(--color-fg)] overflow-hidden flex flex-col"
          >
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border)]">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-[var(--color-muted)]">~/janarthanan — zsh</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto leading-relaxed">
              {lines.map((l, i) => (
                <div key={i} className={l.kind === "in" ? "text-[var(--color-cyan)]" : "whitespace-pre-wrap"}>
                  {l.kind === "in" ? <span className="text-[var(--color-violet)]">$ </span> : null}
                  {l.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={submit} className="border-t border-[var(--color-border)] p-3 flex items-center gap-2">
              <span className="text-[var(--color-violet)]">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none placeholder:text-[var(--color-muted)]"
                placeholder="type a command and press enter"
                autoComplete="off"
                spellCheck={false}
                aria-label="terminal input"
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Write `tests/terminal.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { runCommand } from "@/components/terminal/command-handlers";

describe("terminal command parser", () => {
  it("whoami returns identity line", () => {
    const r = runCommand("whoami");
    expect(r.output).toMatch(/Janarthanan/i);
  });
  it("ls projects lists 3 slugs", () => {
    const r = runCommand("ls projects");
    expect(r.output.split("\n").length).toBe(3);
  });
  it("open linkedin yields navigate url", () => {
    const r = runCommand("open linkedin");
    expect(r.navigate).toMatch(/linkedin/i);
  });
  it("clear returns __CLEAR__", () => {
    expect(runCommand("clear").output).toBe("__CLEAR__");
  });
  it("exit closes", () => {
    expect(runCommand("exit").close).toBe(true);
  });
  it("unknown command falls through", () => {
    expect(runCommand("foo")).toMatchObject({ output: expect.stringMatching(/not found/i) });
  });
});
```

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(terminal): full-screen terminal-mode easter egg

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 22: Page orchestration + global keyboard shortcuts

**Files:**
- Create: `components/app-shell.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `components/app-shell.tsx`**

```tsx
"use client";
import { useState } from "react";
import { PillNav } from "@/components/nav/pill-nav";
import { MobileDock } from "@/components/nav/mobile-dock";
import { CommandPalette } from "@/components/nav/command-palette";
import { TerminalOverlay } from "@/components/terminal/terminal-overlay";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { projects } from "@/lib/data";
import { ProjectModal } from "@/components/projects/project-modal";
import type { Project } from "@/types";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useKeyboardShortcut({ key: "`", preventDefault: false }, () => setTerminalOpen((v) => !v));

  function openProject(slug: string) {
    const p = projects.find((x) => x.slug === slug);
    if (p) setActiveProject(p);
  }

  return (
    <>
      <CursorGlow />
      <PillNav onOpenCommand={() => setCmdOpen(true)} />
      <MobileDock onOpenCommand={() => setCmdOpen(true)} />
      {children}
      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onToggleTerminal={() => setTerminalOpen((v) => !v)}
        onOpenProject={openProject}
      />
      <TerminalOverlay open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
```

- [ ] **Step 2: Update `app/page.tsx`** to compose everything

```tsx
import { AppShell } from "@/components/app-shell";
import { Hero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { About } from "@/components/sections/about";
import { Metrics } from "@/components/sections/metrics";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Awards } from "@/components/sections/awards";
import { Github } from "@/components/sections/github";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <AppShell>
      <main className="relative">
        <Hero />
        <TechMarquee />
        <About />
        <Metrics />
        <Experience />
        <Projects />
        <Skills />
        <Awards />
        <Github />
        <Contact />
      </main>
      <Footer />
    </AppShell>
  );
}
```

Note: `<Projects />` keeps its own internal modal too. To avoid two modals, switch `<Projects />` to use the AppShell modal via context, or remove its internal modal. Simplest: remove the `<ProjectModal />` line and `useState` modal from `components/sections/projects.tsx` and have the section trigger `window.dispatchEvent(new CustomEvent("open-project", { detail: p.slug }))`, listened in AppShell. Update `components/sections/projects.tsx`:

```tsx
"use client";
import { SectionShell } from "@/components/layout/section-shell";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <SectionShell id="projects" label={{ index: "04", name: "projects" }}>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-3xl">
          Selected <span className="text-gradient">work.</span>
        </h2>
        <p className="font-mono text-xs text-[var(--color-muted)]">click card → case study</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <ProjectCard
            key={p.slug}
            project={p}
            onOpen={() => window.dispatchEvent(new CustomEvent("open-project", { detail: p.slug }))}
          />
        ))}
      </div>
    </SectionShell>
  );
}
```

Add listener in `components/app-shell.tsx` inside an effect (so card clicks bubble up to single modal):

```tsx
import { useEffect } from "react";
// ...inside AppShell after useState lines:
useEffect(() => {
  const onOpen = (e: Event) => openProject((e as CustomEvent<string>).detail);
  window.addEventListener("open-project", onOpen);
  return () => window.removeEventListener("open-project", onOpen);
}, []);
```

- [ ] **Step 3: Visual smoke**

Run dev server. Verify:
- Pill nav top desktop, mobile dock right top mobile
- ⌘K opens palette, Esc closes
- `` ` `` (backtick) opens terminal, Esc closes
- Project card opens single modal; from palette opens same modal
- Active section highlights as you scroll

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(shell): page orchestration + global shortcuts

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 23: Resume asset + OG image + sitemap + robots + JSON-LD

**Files:**
- Create: `public/resume.pdf` (copy), `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`
- Modify: `app/layout.tsx` to inject JSON-LD

- [ ] **Step 1: Copy resume to public**

```bash
cp ref/Janarthanan_SDE.pdf public/resume.pdf
```

- [ ] **Step 2: Write `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Janarthanan S — Member of Technical Staff";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a14",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          color: "white",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(168,85,247,.55), transparent 50%), radial-gradient(circle at 10% 90%, rgba(6,182,212,.45), transparent 50%)" }} />
        <div style={{ position: "relative", fontFamily: "monospace", fontSize: 20, letterSpacing: 6, textTransform: "uppercase", opacity: 0.6, display: "flex" }}>portfolio · 2026</div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, display: "flex" }}>Janarthanan S</div>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em", background: "linear-gradient(90deg, #a855f7, #06b6d4, #ec4899)", backgroundClip: "text", color: "transparent", display: "flex" }}>builds the web at scale.</div>
          <div style={{ fontSize: 24, opacity: 0.7, marginTop: 12, display: "flex" }}>Member of Technical Staff · SurveySparrow</div>
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 3: Write `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://janarthanan.dev", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
```

- [ ] **Step 4: Write `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: "https://janarthanan.dev/sitemap.xml" };
}
```

- [ ] **Step 5: Write `app/not-found.tsx`**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center">
        <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-3">404</p>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          You took a <span className="text-gradient">wrong turn.</span>
        </h1>
        <Link href="/" className="font-mono text-sm text-[var(--color-violet)] hover:underline">← back home</Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Inject JSON-LD in `app/layout.tsx`**

Inside `<body>` of `RootLayout`, before `{children}`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Janarthanan S",
      jobTitle: "Member of Technical Staff",
      worksFor: { "@type": "Organization", name: "SurveySparrow" },
      url: "https://janarthanan.dev",
      sameAs: [
        "https://www.linkedin.com/in/janarthanan-s-6731a5214/",
        "https://github.com/JanarthananGCT",
        "https://medium.com/@janarthanans.in",
      ],
    }),
  }}
/>
```

- [ ] **Step 7: Verify**

Run: `pnpm run build && pnpm start`
Open `http://localhost:3000`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, and a bogus path to confirm 404 page.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(seo): OG image, sitemap, robots, JSON-LD, 404

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 24: Playwright smoke + a11y + reduced-motion check

**Files:**
- Create: `playwright.config.ts`, `e2e/portfolio.spec.ts`

- [ ] **Step 1: Init Playwright**

```bash
pnpm dlx playwright install --with-deps chromium
```

- [ ] **Step 2: Add `@axe-core/playwright`**

```bash
pnpm add -D @axe-core/playwright
```

- [ ] **Step 3: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: { command: "pnpm run dev", url: "http://localhost:3000", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
```

- [ ] **Step 4: Write `e2e/portfolio.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home renders all main sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Janarthanan/i })).toBeVisible();
  for (const id of ["hero", "about", "metrics", "experience", "projects", "skills", "awards", "github", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeVisible({ timeout: 10_000 });
  }
});

test("⌘K opens command palette", async ({ page, browserName }) => {
  test.skip(browserName === "webkit");
  await page.goto("/");
  await page.keyboard.press("Meta+k");
  await expect(page.getByPlaceholder(/Type a command/i)).toBeVisible();
});

test("project card opens modal", async ({ page }) => {
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Open .* case study/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("a11y violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test("reduced motion disables aurora animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#hero")).toBeVisible();
});
```

- [ ] **Step 5: Run e2e**

Run: `pnpm test:e2e`
Expected: all tests pass. If a11y serious violations exist, fix them inline (most likely missing `aria-label` or contrast). Re-run until clean.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test(e2e): playwright smoke + a11y + reduced-motion

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 25: Polish pass + README

**Files:**
- Create: `README.md`
- Audit/modify as needed

- [ ] **Step 1: Lighthouse audit**

Run: `pnpm run build && pnpm start` in one terminal. In another:
```bash
pnpm dlx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless" --output=json --output-path=./lighthouse-report.json --quiet
```

Open `lighthouse-report.json` or run with `--view`. Verify scores ≥90 on all categories. If performance <90:
- Confirm `next/image` for any images
- Confirm dynamic imports for `TerminalOverlay`, `ProjectModal`, `CommandPalette` in `app-shell.tsx`:

```tsx
import dynamic from "next/dynamic";
const TerminalOverlay = dynamic(() => import("@/components/terminal/terminal-overlay").then(m => m.TerminalOverlay), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/nav/command-palette").then(m => m.CommandPalette), { ssr: false });
const ProjectModal = dynamic(() => import("@/components/projects/project-modal").then(m => m.ProjectModal), { ssr: false });
```

- Confirm aurora is not running while off-screen (already wrapped in hero only).

Re-run lighthouse, confirm targets met.

- [ ] **Step 2: Delete lighthouse-report.json**

```bash
rm lighthouse-report.json
```

- [ ] **Step 3: Write `README.md`**

```md
# Janarthanan S — Portfolio

Aurora Editorial portfolio for Janarthanan S, MTS at SurveySparrow. Built with Next.js 15, shadcn/ui, Tailwind v4, Framer Motion, and Lucide.

## Stack

- Next.js 15 (App Router, RSC) · TypeScript
- Tailwind v4 + @tailwindcss/typography
- shadcn/ui · Lucide icons
- Framer Motion · cmdk
- Vitest + Testing Library · Playwright + axe

## Run

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
pnpm test         # unit
pnpm test:e2e     # playwright
```

## Edit content

All copy lives in `lib/data.ts`. Project case studies in `content/projects/*.md`. GitHub fallback in `content/github-fallback.json`. Resume at `public/resume.pdf`.

## Deploy

Vercel — `vercel --prod`. Edge runtime is used for OG image. No env vars required.

## Easter eggs

- `⌘K` / `Ctrl+K` — command palette
- `` ` `` (backtick) — terminal mode
```

- [ ] **Step 4: Final verification**

Run all checks:
```bash
pnpm test && pnpm test:e2e && pnpm run build
```

Confirm: all green, build succeeds, no warnings about deprecated APIs.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: polish pass + README

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Spec coverage check

| Spec requirement | Implementing task |
|---|---|
| Aurora Editorial visual direction (B+D+A hybrid) | Task 2 (tokens), Task 6 (aurora) |
| Single-page scroll + pill nav + ⌘K + project modals | Task 9, 10, 16, 22 |
| Balanced motion (CSS aurora, FM stagger, no WebGL, reduced-motion) | Tasks 5-7, gated everywhere |
| Palette + Dark only + Stack | Task 1, 2, 3 |
| Sections: Hero, About, Metrics, Experience, Projects, Skills, Awards, GitHub, Contact, Footer | Tasks 11-20 |
| Terminal mode easter egg | Task 21 |
| `lib/data.ts` single-source data | Task 4 |
| Aurora effect via SVG, blur, mix-blend | Task 6 |
| Command palette groups (Navigate, Projects, Actions) | Task 10 |
| Project modal slide-over with markdown | Task 16 |
| Active-section highlighting | Tasks 8, 9 |
| Mobile dock | Task 9, 22 |
| `prefers-reduced-motion` honored | Tasks 2, 6, 7, 11 (motion components), Task 24 (test) |
| WCAG 2.1 AA | Task 24 a11y test enforces |
| Skip-to-content | Task 2 |
| Semantic landmarks | Tasks 5, 11-20 |
| Performance budget (LCP, CLS, INP, bundle) | Task 25 lighthouse |
| OG dynamic image | Task 23 |
| Sitemap, robots, JSON-LD | Task 23 |
| 404 page | Task 23 |
| Resume static | Task 23 |
| GitHub fallback JSON | Task 19 |
| Out-of-scope items skipped | (correctly absent) |
| Testing strategy (Vitest + Playwright + axe + reduced-motion) | Tasks 4, 5, 7, 10, 21, 24 |
| Edge handling: clipboard fallback to mailto | Task 20 |
| Edge handling: GitHub API failure → fallback | Task 19 |

All spec requirements have an implementing task.

## Notes

- Tailwind v4 uses `@theme` and `@plugin` directives; if the active version is still v3 at install time, the plan's Task 1 Step 3 pins v4 explicitly.
- Component file paths and exported names are consistent across tasks (e.g., `CommandPalette` imported in both Task 10 and Task 22).
- The "single modal" refactor in Task 22 step 2 explicitly replaces the modal from Task 16 to avoid double-modal collision.
