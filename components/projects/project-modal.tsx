"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Project } from "@/types";

type Props = { project: Project | null; onClose: () => void };

export function ProjectModal({ project, onClose }: Props) {
  const [md, setMd] = useState<string>("");

  useEffect(() => {
    if (!project) return;
    setMd("Loading…");
    fetch(`/api/project/${project.slug}`)
      .then((r) => r.json())
      .then((d) => setMd(d.md))
      .catch(() => setMd("Failed to load."));
  }, [project]);

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl bg-[var(--color-bg)] border-[var(--color-border)] p-0 max-h-[90vh] overflow-hidden flex flex-col gap-0">
        {project && (
          <>
            {/* Cinematic hero */}
            <div
              className="relative shrink-0 px-8 pt-10 pb-8 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${project.cover.from} 0%, ${project.cover.to} 100%)`,
              }}
            >
              <div className="absolute inset-0 grid-bg opacity-30 mix-blend-overlay" aria-hidden="true" />
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background: "radial-gradient(ellipse at top right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)",
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-white/80" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">case study</span>
                </div>
                <DialogTitle className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                  {project.title}
                </DialogTitle>
                <DialogDescription className="mt-3 text-base md:text-lg text-white/85 max-w-2xl leading-snug">
                  {project.tagline}
                </DialogDescription>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 text-white/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {(project.links?.repo || project.links?.live) && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-black/30 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 hover:bg-black/50 transition-colors"
                      >
                        View live <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.links?.repo && (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-black/30 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 hover:bg-black/50 transition-colors"
                      >
                        View source <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto scroll-area-dark">
              <div className="px-8 py-8">
                <div className="prose prose-invert prose-sm md:prose-base max-w-none
                  prose-headings:font-semibold
                  prose-h2:text-base prose-h2:font-mono prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-[var(--color-muted)] prose-h2:mt-8 prose-h2:mb-3 prose-h2:first:mt-0
                  prose-p:text-[var(--color-fg)] prose-p:text-base prose-p:leading-relaxed
                  prose-li:text-[var(--color-fg)] prose-li:leading-relaxed prose-li:marker:text-[var(--color-violet)]
                  prose-strong:text-white
                  prose-a:text-[var(--color-violet)] prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-[var(--color-violet)] prose-blockquote:bg-[var(--color-bg-elevated)] prose-blockquote:rounded-r-md prose-blockquote:py-2 prose-blockquote:not-italic prose-blockquote:text-[var(--color-muted)]
                  prose-code:text-[var(--color-cyan)] prose-code:bg-[var(--color-bg-elevated)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
