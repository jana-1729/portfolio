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
