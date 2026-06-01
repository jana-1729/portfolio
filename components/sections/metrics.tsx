import { SectionShell } from "@/components/layout/section-shell";
import { AnimatedCounter } from "@/components/effects/animated-counter";
import { metrics } from "@/lib/data";

export function Metrics() {
  return (
    <SectionShell id="metrics" label={{ index: "02", name: "impact" }}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-12 max-w-3xl">
        Numbers from production. <span className="text-gradient">Not vanity.</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="glass rounded-2xl p-6 relative overflow-hidden">
            <m.icon className="absolute top-4 right-4 h-5 w-5 text-[var(--color-violet)]/60" aria-hidden="true" />
            <p className="text-3xl md:text-5xl font-bold tracking-tight">
              <AnimatedCounter to={m.value} decimals={m.decimals} suffix={m.suffix} />
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{m.label}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
