"use client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navItems, profile } from "@/lib/data";

export function MobileDock({ onOpenCommand }: { onOpenCommand: () => void }) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger
          render={
            <button
              className="fixed top-4 right-4 z-40 glass rounded-full p-2.5"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          }
        />
        <SheetContent side="right" className="bg-[var(--color-bg)] border-[var(--color-border)]">
          <SheetHeader>
            <SheetTitle className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">{profile.name}</SheetTitle>
          </SheetHeader>
          <nav aria-label="Mobile" className="px-4 pb-4">
            <ul className="space-y-3 mt-4">
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
