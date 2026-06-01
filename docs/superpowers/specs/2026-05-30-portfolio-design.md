# Aurora Editorial Portfolio — Design Spec

**Owner:** Janarthanan S
**Date:** 2026-05-30
**Status:** Draft → pending user review

## Goal

Build a personal portfolio site for Janarthanan S (Member of Technical Staff, SurveySparrow) that is interactive, UX-friendly, responsive, and creative. Visitors should grasp seniority, scope of impact (100K+ users, 20+ integrations, 99.9% uptime), and technical depth within 30 seconds, with room to explore each project and the engineering story in depth.

## Decisions (locked)

| Area | Decision |
|------|----------|
| Visual direction | Aurora Editorial — dark cinematic base, violet/cyan/pink aurora gradients, glass surfaces, monospace section labels |
| Layout | Single-page scroll + floating pill nav + ⌘K command palette + project modal slide-overs |
| Motion | Balanced: CSS/SVG aurora, Framer Motion stagger, no WebGL, `prefers-reduced-motion` respected |
| Palette | bg `#0a0a14`, foreground `#fafafa`, violet `#a855f7`, cyan `#06b6d4`, pink `#ec4899`, muted `#8b8ba7` |
| Theme | Dark only |
| Stack | Next.js 15 (App Router), TypeScript, Tailwind v4, shadcn/ui, Framer Motion, Lucide icons |
| Sections | Hero, About, Impact Metrics, Experience, Projects, Skills, Awards, GitHub, Contact, Footer |
| Easter egg | Terminal mode overlay (toggle via ⌘K or `~`) |
| Projects | 3 cards with dummy content driven by `content/projects/*.md` — real content added later by owner |

## Information architecture

```
/  (single-page scroll)
├── #hero              — name, role, CTA, aurora canvas, availability pill
├── #about             — bio, side stat grid
├── #metrics           — animated counters (4)
├── #experience        — vertical timeline (SurveySparrow MTS → BOSCH → Education)
├── #projects          — 3 cards → slide-over case-study Dialog
├── #skills            — categorized accordion + badge cloud
├── #awards            — recognition cards
├── #github            — contribution heatmap + top repos
├── #contact           — email reveal, socials, copy actions
└── footer             — minimal, ⌘K hint
```

Layered UI:
- **Floating pill nav** (top-center desktop, bottom-dock mobile) — active section via IntersectionObserver
- **Command palette** (`cmdk` via shadcn `Command`) — fuzzy search sections, projects, actions
- **Project modal** (shadcn `Dialog` as slide-over)
- **Terminal mode overlay** (full-screen, fixed)

## Component architecture

```
portfolio/
├── app/
│   ├── layout.tsx              — root, fonts, theme tokens, metadata
│   ├── page.tsx                — assembles all section components
│   ├── globals.css             — Tailwind v4 @theme tokens, aurora keyframes, base styles
│   ├── not-found.tsx
│   └── opengraph-image.tsx     — dynamic OG via next/og
├── components/
│   ├── ui/                     — shadcn primitives: button, dialog, card, badge, command, accordion, tooltip, sheet
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── metrics.tsx
│   │   ├── experience.tsx
│   │   ├── projects.tsx
│   │   ├── skills.tsx
│   │   ├── awards.tsx
│   │   ├── github.tsx
│   │   └── contact.tsx
│   ├── effects/
│   │   ├── aurora-bg.tsx       — 3 SVG radial-gradient blobs, infinite motion
│   │   ├── grid-bg.tsx         — subtle dotted grid overlay
│   │   ├── cursor-glow.tsx     — desktop-only cursor follower
│   │   ├── magnetic-button.tsx — hover-attractor wrapper
│   │   ├── animated-counter.tsx
│   │   └── marquee.tsx
│   ├── nav/
│   │   ├── pill-nav.tsx        — sticky pill with section anchors
│   │   ├── mobile-dock.tsx
│   │   └── command-palette.tsx — ⌘K overlay
│   ├── projects/
│   │   ├── project-card.tsx
│   │   └── project-modal.tsx
│   ├── terminal/
│   │   ├── terminal-overlay.tsx
│   │   └── command-handlers.ts
│   └── layout/
│       ├── section-shell.tsx   — consistent padding, max-width, animated entry
│       └── section-label.tsx   — `[ NN / name ]` monospace label
├── lib/
│   ├── data.ts                 — typed profile, experience[], projects[], skills[], awards[]
│   ├── github.ts               — fetch contributions + repos
│   ├── projects.ts             — read content/projects/*.md
│   └── utils.ts                — cn() + helpers
├── content/
│   └── projects/
│       ├── project-1.md
│       ├── project-2.md
│       └── project-3.md
├── public/
│   ├── avatar.jpg
│   ├── resume.pdf              — copy of ref/Janarthanan_SDE.pdf
│   └── og-fallback.png
├── hooks/
│   ├── use-active-section.ts
│   ├── use-keyboard-shortcut.ts
│   └── use-mounted.ts
└── types/
    └── index.ts
```

### Data shape (`lib/data.ts`)

```ts
export const profile = {
  name: "Janarthanan S",
  role: "Member of Technical Staff",
  company: "SurveySparrow",
  location: "Chennai, India",
  available: true,
  email: "janarthanans.in@gmail.com",
  phone: "+91 9345762325",
  socials: {
    linkedin: "https://www.linkedin.com/in/janarthanan-s-6731a5214/",
    github: "https://github.com/JanarthananGCT",
    medium: "https://medium.com/@janarthanans.in"
  },
  taglines: [
    "I build the web at scale.",
    "Member of Technical Staff @ SurveySparrow",
    "Fullstack · Design Systems · LLM Tooling"
  ]
}

export const metrics: Metric[] = [
  { value: 100_000, suffix: "+", label: "Users served" },
  { value: 20, suffix: "+", label: "Production integrations" },
  { value: 99.9, suffix: "%", label: "Uptime" },
  { value: 1000, suffix: "+ req/sec", label: "Peak throughput" }
]

export type Experience = {
  company: string
  role: string
  start: string
  end: string | "Present"
  location: string
  bullets: string[]
  tech: string[]
}

export type Project = {
  slug: string
  title: string
  tagline: string
  cover: { from: string; to: string }   // gradient stops
  tech: string[]
  links?: { live?: string; repo?: string }
}

export type SkillGroup = {
  name: string
  icon: LucideIcon
  items: string[]
}
```

### Aurora effect (`components/effects/aurora-bg.tsx`)

Three absolutely-positioned SVG circles with `radialGradient` fill:
- Blob A: violet, top-left, 50vw wide
- Blob B: cyan, bottom-right, 60vw wide
- Blob C: pink, center, 40vw wide

Framer Motion `animate` cycles `x`, `y`, `scale` between two states with `repeat: Infinity, repeatType: "mirror", ease: "easeInOut", duration: 18`. Container has `mix-blend-mode: screen` and `filter: blur(80px)`. Hidden when `prefers-reduced-motion`.

### Command palette (`components/nav/command-palette.tsx`)

Built on shadcn `Command` + `Dialog`. Groups:
- **Navigation** — Hero, About, Metrics, Experience, Projects, Skills, Awards, GitHub, Contact
- **Actions** — Copy email, Open Resume, Toggle Terminal Mode, View on LinkedIn, View on GitHub, View on Medium
- **Projects** — list (links to modal)

Triggered by `⌘K` / `Ctrl+K`. Escape closes. Returns focus to triggering element.

### Project modal (`components/projects/project-modal.tsx`)

shadcn `Dialog` styled as slide-over from right (desktop) or bottom sheet (mobile). Rendered MDX from `content/projects/[slug].md` with sections: Problem, Solution, Architecture, Stack, Results, Links. Closes on overlay click, Esc, or close button.

### Terminal mode (`components/terminal/terminal-overlay.tsx`)

Full-screen `position: fixed` overlay with typed prompt. Commands:
- `whoami` — returns role + bio
- `ls projects` — lists 3 projects
- `cat about.md` — prints bio
- `open <linkedin|github|medium|resume>` — launches URL
- `theme` — placeholder reply (single theme)
- `clear` — resets buffer
- `exit` / Esc — closes

State held in single React component, no shell. Auto-focus input on open.

## Motion strategy

| Element | Animation | Trigger |
|---------|-----------|---------|
| Aurora blobs | `x,y,scale` loop, 18s mirror ease | Mount (gated by reduced-motion) |
| Section entrance | `opacity 0→1, y 24→0`, stagger 80ms | `whileInView`, `once: true`, `margin: -100px` |
| Cards | `y: 0 → -4`, border glow | `whileHover` |
| Counters | `useMotionValue` lerp 0 → target over 1.5s | When in view |
| Pill nav active dot | `layout` motion | Active section change |
| Modal | slide-in from right 320ms cubic | Open |
| Cursor glow | spring follow, `position: fixed` blur dot | Mousemove (desktop only) |
| Marquee | infinite x-translate | Mount |

Global: `useReducedMotion()` short-circuits all `animate` props to identity.

## Responsive behavior

| Breakpoint | Behavior |
|-----------|----------|
| `< 640` | 1-col everything, pill nav → bottom mobile dock, hero 1-col stack, cursor glow off, modal → bottom sheet |
| `640-1024` | 2-col hero, 2-col projects, sticky pill nav top |
| `≥ 1024` | 2-col hero with right-side stat strip, 3-col projects, full pill nav, cursor glow on |

Touch targets ≥44px. Hover-only effects gated by `(hover: hover)` media query.

## Accessibility

- WCAG 2.1 AA contrast on all foreground/background pairs
- Semantic landmarks: `header`, `nav`, `main`, `section[aria-labelledby]`, `footer`
- Skip-to-content link as first focusable
- All icon-only buttons have `aria-label`
- Focus rings: shadcn default ring color tinted to violet
- `prefers-reduced-motion: reduce` disables aurora, marquee, cursor glow, transitions reduced to 0ms
- Keyboard map: `⌘K` palette, `~` terminal, `Esc` close any overlay, Tab order audited
- Modal focus trap via `Dialog` primitive
- Screen reader: visually hidden section anchors with descriptive text

## Performance budget

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥90 mobile, ≥95 desktop |
| LCP | ≤2.0s |
| CLS | <0.1 |
| INP | <200ms |
| First-load JS | <180KB gz |

Tactics:
- Static export (`output: "export"` not required; default SSG fine, deploy to Vercel)
- Aurora via SVG, not Canvas
- `next/font` self-hosted; 2 families (Inter Display + JetBrains Mono)
- `next/image` with AVIF/WebP, blur placeholders
- Dynamic import: terminal overlay, project modal, contact form, GitHub heatmap
- Tree-shake Lucide via per-icon imports
- Tailwind v4 oxide-only (no JIT-mode legacy)

## SEO + metadata

- `app/layout.tsx` exports Next.js Metadata: title, description, keywords, openGraph, twitter card
- `app/opengraph-image.tsx` dynamically renders SVG with name + role + accent gradient
- `app/sitemap.ts` + `app/robots.ts`
- JSON-LD `Person` schema injected via `<script type="application/ld+json">` in layout
- Canonical URL configurable via env

## Error + edge handling

- GitHub API failure → render skeleton + cached fallback JSON committed to `content/github-fallback.json`
- Email reveal: if clipboard API unavailable → fall back to `mailto:` link
- No JS: site still renders (sections are server components except interactive ones). Pill nav becomes plain anchor list. Modal-trigger buttons fall back to `mailto:` / external links for contact.

## Out of scope (this iteration)

- Blog / MDX writing section
- CMS integration
- Analytics (Plausible/Vercel can be added later via env)
- i18n
- Light theme
- Actual project case-study content (owner adds later; dummy markdown shipped)
- Backend contact form (form structure ships, wires to Resend/Formspree in follow-up)

## Testing strategy

- Component tests via Vitest + Testing Library for: command palette open/close, project modal lifecycle, terminal command parsing, animated counter math, active-section detection
- Visual smoke: Playwright snapshot of `/` at sm/md/lg
- A11y: `axe-core` Playwright assertion on `/` (no violations)
- Reduced-motion: Playwright run with `prefers-reduced-motion: reduce` confirming aurora hidden

## Open questions for owner

None blocking — owner deferred all design picks. Real project content + GitHub fallback JSON to be supplied later; spec ships with dummies.

## Success criteria

- Visitor on cold load understands name, role, seniority, and primary skills within first viewport
- Recruiter can reach contact + resume in ≤2 clicks
- All 3 projects explorable via modal without route change
- Lighthouse score meets budget on `vercel.app` deploy
- WCAG 2.1 AA axe pass on full page
- Works on Safari iOS 17+, Chrome desktop, Firefox desktop, Edge desktop
