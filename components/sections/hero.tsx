"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { AuroraBg } from "@/components/effects/aurora-bg";
import { GridBg } from "@/components/effects/grid-bg";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { profile } from "@/lib/data";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-5 md:px-8 overflow-hidden">
      <AuroraBg />
      <GridBg />
      <div className="relative z-10 w-full max-w-6xl">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-6 flex items-center gap-3 flex-wrap"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
            </span>
            Available
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {profile.location}</span>
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[0.95]"
        >
          {profile.name}
          <br />
          <span className="text-gradient">builds the web<br />at scale.</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg md:text-xl text-[var(--color-muted)] leading-relaxed"
        >
          {profile.role} at {profile.company}. 2.5+ years architecting end-to-end features across React, Node.js, TypeScript, and AWS — shipping 20+ integrations serving 100K+ users at 99.9% uptime.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton>
            <a href="#projects" className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-violet)] hover:bg-[var(--color-violet)]/90 text-white px-6 py-3 text-sm font-medium transition-colors">
              View work <ArrowRight className="h-4 w-4" />
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] px-6 py-3 text-sm font-medium transition-colors">
              <Download className="h-4 w-4" /> Resume
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href="#contact" className="inline-flex items-center gap-1.5 rounded-full hover:bg-[var(--color-bg-elevated)] px-6 py-3 text-sm font-medium transition-colors">
              Contact
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
