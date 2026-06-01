import { SectionShell } from "@/components/layout/section-shell";
import { profile } from "@/lib/data";

export function About() {
  return (
    <SectionShell id="about" label={{ index: "01", name: "about" }}>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
            Engineer who <span className="text-gradient">ships at scale</span>, owns the platform, and writes the docs.
          </h2>
          {profile.bio.map((p, i) => (
            <p key={i} className="text-[var(--color-muted)] text-base md:text-lg leading-relaxed mb-4">{p}</p>
          ))}
        </div>
        <aside className="glass rounded-2xl p-6 space-y-5 h-fit">
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-1">Currently</p>
            <p className="font-medium">{profile.role}</p>
            <p className="text-sm text-[var(--color-muted)]">{profile.company}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-1">Based in</p>
            <p className="font-medium">{profile.location}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-1">Status</p>
            <p className="font-medium text-[var(--color-success)]">Open to interesting problems</p>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}
