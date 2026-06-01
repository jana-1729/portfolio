"use client";
import { useState } from "react";
import { Copy, Check, Link2, BookOpen, Mail, Phone, MapPin, GitBranch } from "lucide-react";
import { SectionShell } from "@/components/layout/section-shell";
import { profile } from "@/lib/data";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <SectionShell id="contact" label={{ index: "08", name: "contact" }}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Got an idea <span className="text-gradient">worth shipping?</span>
          </h2>
          <p className="mt-6 text-[var(--color-muted)] text-lg leading-relaxed">
            Available for senior engineering roles, contracting on platform / design-system work, and interesting LLM-tooling collaborations.
          </p>
          <div className="mt-8 space-y-3 font-mono text-sm">
            <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--color-violet)]" /> {profile.email}</p>
            <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-[var(--color-violet)]" /> {profile.phone}</p>
            <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[var(--color-violet)]" /> {profile.location}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">Quick actions</p>
            <div className="space-y-2">
              <button
                onClick={copyEmail}
                className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-bg-elevated)] hover:bg-[var(--color-violet)]/10 transition-colors text-sm"
              >
                {copied ? <Check className="h-4 w-4 text-[var(--color-success)]" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy email"}
              </button>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-bg-elevated)] hover:bg-[var(--color-violet)]/10 transition-colors text-sm"
              >
                <BookOpen className="h-4 w-4" /> Open resume
              </a>
            </div>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">Find me on</p>
            <div className="flex gap-2">
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="glass rounded-full p-3 hover:border-[var(--color-violet)]/60 transition-colors">
                <Link2 className="h-4 w-4" />
              </a>
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="glass rounded-full p-3 hover:border-[var(--color-violet)]/60 transition-colors">
                <GitBranch className="h-4 w-4" />
              </a>
              <a href={profile.socials.medium} target="_blank" rel="noopener noreferrer" aria-label="Medium" className="glass rounded-full p-3 hover:border-[var(--color-violet)]/60 transition-colors">
                <BookOpen className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
