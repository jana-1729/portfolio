import { Marquee } from "@/components/effects/marquee";
import { skillGroups } from "@/lib/data";

export function TechMarquee() {
  const flat = skillGroups.flatMap((g) => g.items).slice(0, 24);
  return (
    <div className="border-y border-[var(--color-border)] py-6">
      <Marquee>
        {flat.map((t, i) => (
          <span key={i} className="font-mono text-sm text-[var(--color-muted)]">{t}</span>
        ))}
      </Marquee>
    </div>
  );
}
