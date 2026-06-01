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

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onToggleTerminal: () => void;
  onOpenProject: (slug: string) => void;
};

export function CommandPalette({ open, onOpenChange, onToggleTerminal, onOpenProject }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);

  function run(fn: () => void | Promise<void>) {
    Promise.resolve(fn()).finally(() => onOpenChange(false));
  }
  function copyEmail() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(profile.email);
    }
    setFeedback("Email copied");
    setTimeout(() => setFeedback(null), 2000);
  }
  function go(id: string) {
    if (typeof document !== "undefined") document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

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
          <CommandItem onSelect={() => run(() => { window.open(profile.resumeUrl, "_blank"); })}>
            <Download className="mr-2 h-4 w-4" /> Open resume
          </CommandItem>
          <CommandItem onSelect={() => run(onToggleTerminal)}>
            <Terminal className="mr-2 h-4 w-4" /> Toggle terminal mode
          </CommandItem>
          <CommandItem onSelect={() => run(() => { window.open(profile.socials.linkedin, "_blank"); })}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open LinkedIn
          </CommandItem>
          <CommandItem onSelect={() => run(() => { window.open(profile.socials.github, "_blank"); })}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open GitHub
          </CommandItem>
          <CommandItem onSelect={() => run(() => { window.open(profile.socials.medium, "_blank"); })}>
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
