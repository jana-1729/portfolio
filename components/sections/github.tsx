import { Star, GitBranch, ExternalLink } from "lucide-react";
import { SectionShell } from "@/components/layout/section-shell";
import { getGithub } from "@/lib/github";

export async function Github() {
  const data = await getGithub();
  return (
    <SectionShell id="github" label={{ index: "07", name: "github" }}>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-3xl">
          What I ship <span className="text-gradient">in the open.</span>
        </h2>
        <a
          href={`https://github.com/${data.user}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[var(--color-muted)] hover:text-white flex items-center gap-1.5"
        >
          @{data.user} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {data.topRepos.map((r) => (
          <a
            key={r.name}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-5 hover:border-[var(--color-violet)]/40 transition-colors block"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-[var(--color-violet)]" />
                <h3 className="font-semibold">{r.name}</h3>
              </div>
              <span className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                <Star className="h-3 w-3" /> {r.stars}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-3">{r.description || "—"}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-cyan)]">{r.language}</p>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}
