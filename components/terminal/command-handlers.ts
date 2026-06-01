import { profile, projects } from "@/lib/data";

export type CmdResult = { output: string; navigate?: string; close?: boolean };

export function runCommand(input: string): CmdResult {
  const cmd = input.trim().toLowerCase();
  if (!cmd) return { output: "" };

  if (cmd === "help") {
    return {
      output: [
        "available commands:",
        "  whoami          → who am I",
        "  ls projects     → list projects",
        "  cat about.md    → print bio",
        "  open <target>   → open linkedin | github | medium | resume",
        "  goto <section>  → jump to section (hero, about, projects, ...)",
        "  clear           → clear screen",
        "  exit            → close terminal",
      ].join("\n"),
    };
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
