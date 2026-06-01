"use client";
import { SectionShell } from "@/components/layout/section-shell";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <SectionShell id="projects" label={{ index: "04", name: "projects" }}>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-3xl">
          Selected <span className="text-gradient">work.</span>
        </h2>
        <p className="font-mono text-xs text-[var(--color-muted)]">click card → case study</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <ProjectCard
            key={p.slug}
            project={p}
            onOpen={() => window.dispatchEvent(new CustomEvent("open-project", { detail: p.slug }))}
          />
        ))}
      </div>
    </SectionShell>
  );
}
