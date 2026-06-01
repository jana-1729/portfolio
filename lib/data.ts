import { Users, Activity, Plug, Zap, Code2, Server, Database, Cloud, Brain, FlaskConical, Home, User, BarChart3, Briefcase, FolderGit2, Sparkles, Trophy, GitBranch, Mail } from "lucide-react";
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
    github: "https://github.com/jana-1729",
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
  { value: 10000, suffix: "+", label: "Users served", icon: Users },
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
    slug: "file-vault-mcp",
    title: "File Vault MCP",
    tagline: "Model Context Protocol server for secure file vault operations — agent-callable file CRUD with permission scoping.",
    cover: { from: "#a855f7", to: "#06b6d4" },
    tech: ["TypeScript", "MCP", "Node.js", "Claude"],
    links: { repo: "https://github.com/jana-1729/file-vault-mcp" },
  },
  {
    slug: "agent-loop",
    title: "AgentLoop",
    tagline: "Multi-agent orchestration loop with tool routing and state checkpoints — experimental LLM agent runtime.",
    cover: { from: "#ec4899", to: "#f59e0b" },
    tech: ["TypeScript", "LLM", "Agentic Workflows", "Node.js"],
    links: { repo: "https://github.com/jana-1729/AgentLoop" },
  },
  {
    slug: "figma-i18n-extractor",
    title: "Figma i18n Extractor",
    tagline: "Figma plugin that extracts every text node in a frame and exports JSON for devs, designers, and localization teams.",
    cover: { from: "#10b981", to: "#06b6d4" },
    tech: ["TypeScript", "Figma Plugin API", "HTML"],
    links: { repo: "https://github.com/jana-1729/Figma-i18n-Extractor" },
  },
  {
    slug: "etl-connectors",
    title: "ETL Connectors & Data Integration Platform",
    tagline: "Enterprise data pipelines moving large-scale survey + analytics data across BigQuery, Databricks, Microsoft Fabric, AWS S3, Oracle ADW, IBM watsonx, Azure Synapse, Azure SQL, and Sharepoint.",
    cover: { from: "#0ea5e9", to: "#a855f7" },
    tech: ["Node.js", "TypeScript", "REST", "GraphQL", "OAuth 2.0", "Webhooks", "BigQuery", "Databricks", "AWS S3", "Microsoft Fabric", "Oracle ADW", "IBM watsonx", "Event-Driven"],
    links: { live: "https://surveysparrow.com/integrations/" },
  },
  {
    slug: "ui-component-library",
    title: "Frontend Component Library for Integrations",
    tagline: "TypeScript-first React design system powering every SurveySparrow integration UI — internal npm package with Storybook, Lexical, and design-system tokens.",
    cover: { from: "#10b981", to: "#0ea5e9" },
    tech: ["React", "TypeScript", "Design Systems", "Storybook", "Lexical", "npm Packages"],
    links: { live: "https://surveysparrow.com/integrations/" },
  },
  {
    slug: "jira-integration",
    title: "Jira Integration · Atlassian Marketplace",
    tagline: "Bi-directional Jira ↔ SurveySparrow integration: auto-create tickets from responses, embed surveys inside Jira issues, event-triggered survey shares, live OAuth sync.",
    cover: { from: "#2563eb", to: "#06b6d4" },
    tech: ["React", "Atlassian Forge", "Jira", "Atlassian Design System", "OAuth 2.0", "Polling"],
    links: { live: "https://marketplace.atlassian.com/apps/1234567/surveysparrow" },
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
  { id: "github", label: "GitHub", icon: GitBranch },
  { id: "contact", label: "Contact", icon: Mail },
];
