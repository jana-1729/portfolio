"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PillNav } from "@/components/nav/pill-nav";
import { MobileDock } from "@/components/nav/mobile-dock";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { projects } from "@/lib/data";
import type { Project } from "@/types";

const CommandPalette = dynamic(
  () => import("@/components/nav/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);
const TerminalOverlay = dynamic(
  () => import("@/components/terminal/terminal-overlay").then((m) => m.TerminalOverlay),
  { ssr: false },
);
const ProjectModal = dynamic(
  () => import("@/components/projects/project-modal").then((m) => m.ProjectModal),
  { ssr: false },
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useKeyboardShortcut({ key: "`", preventDefault: false }, () => setTerminalOpen((v) => !v));
  useKeyboardShortcut({ key: "k", meta: true }, () => setCmdOpen((v) => !v));

  function openProject(slug: string) {
    const p = projects.find((x) => x.slug === slug);
    if (p) setActiveProject(p);
  }

  useEffect(() => {
    const onOpen = (e: Event) => openProject((e as CustomEvent<string>).detail);
    window.addEventListener("open-project", onOpen);
    return () => window.removeEventListener("open-project", onOpen);
  }, []);

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
