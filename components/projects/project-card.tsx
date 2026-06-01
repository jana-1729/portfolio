"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/badge";

type Props = { project: Project; onOpen: () => void };

export function ProjectCard({ project, onOpen }: Props) {
  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group text-left glass rounded-2xl overflow-hidden flex flex-col hover:border-[var(--color-violet)]/40 transition-colors"
      aria-label={`Open ${project.title} case study`}
    >
      <div
        className="aspect-[16/10] relative"
        style={{ background: `linear-gradient(135deg, ${project.cover.from}, ${project.cover.to})` }}
      >
        <div className="absolute inset-0 grid-bg opacity-25 mix-blend-overlay" />
        <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest text-white/80">case study</div>
        <ArrowUpRight className="absolute top-3 right-3 h-5 w-5 text-white/80 group-hover:scale-110 transition-transform" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg md:text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)] flex-1">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <Badge key={t} variant="outline" className="font-mono text-[10px] border-[var(--color-border)] text-[var(--color-muted)]">{t}</Badge>
          ))}
          {project.tech.length > 4 && <Badge variant="outline" className="font-mono text-[10px] border-[var(--color-border)] text-[var(--color-muted)]">+{project.tech.length - 4}</Badge>}
        </div>
      </div>
    </motion.button>
  );
}
