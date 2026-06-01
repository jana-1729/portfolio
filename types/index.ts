import type { LucideIcon } from "lucide-react";

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
