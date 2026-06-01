"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  id: string;
  label?: { index: string; name: string };
  className?: string;
  children: ReactNode;
};

export function SectionShell({ id, label, className = "", children }: Props) {
  const reduce = useReducedMotion();
  return (
    <section
      id={id}
      aria-labelledby={label ? `${id}-label` : undefined}
      className={`relative mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32 scroll-mt-24 ${className}`}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {label && (
          <p id={`${id}-label`} className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">
            <span className="text-[var(--color-violet)]">[</span> {label.index} / {label.name} <span className="text-[var(--color-violet)]">]</span>
          </p>
        )}
        {children}
      </motion.div>
    </section>
  );
}
