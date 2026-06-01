"use client";
import { SectionShell } from "@/components/layout/section-shell";
import { experience } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function Experience() {
  return (
    <SectionShell id="experience" label={{ index: "03", name: "experience" }}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-12 max-w-3xl">
        Roles that <span className="text-gradient">shipped real things.</span>
      </h2>
      <div className="relative">
        <span
          className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-violet)] via-[var(--color-cyan)] to-[var(--color-pink)] opacity-40"
          aria-hidden="true"
        />
        <Accordion multiple defaultValue={["exp-0"]} className="space-y-4">
          {experience.map((e, i) => (
            <AccordionItem key={i} value={`exp-${i}`} className="border-none">
              <div className="relative pl-10">
                <span
                  className="absolute left-[7px] top-6 h-3 w-3 rounded-full bg-[var(--color-violet)] ring-4 ring-[var(--color-bg)]"
                  aria-hidden="true"
                />
                <div className="glass rounded-2xl p-5">
                  <AccordionTrigger className="hover:no-underline py-0">
                    <div className="text-left flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-lg md:text-xl font-semibold">{e.role}</h3>
                        <span className="text-[var(--color-muted)]">·</span>
                        <span className="text-[var(--color-violet)] font-medium">{e.company}</span>
                      </div>
                      <p className="font-mono text-xs text-[var(--color-muted)] mt-1">
                        {e.start} → {e.end} · {e.location}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <ul className="space-y-2 mb-4">
                      {e.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="text-[var(--color-muted)] text-sm md:text-base leading-relaxed flex gap-2"
                        >
                          <span className="text-[var(--color-violet)] mt-1">▹</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {e.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {e.tech.map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="font-mono text-[10px] border-[var(--color-border)] text-[var(--color-muted)]"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionShell>
  );
}
