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
