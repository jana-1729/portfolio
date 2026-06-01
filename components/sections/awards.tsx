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
