import { AppShell } from "@/components/app-shell";
import { Hero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { About } from "@/components/sections/about";
import { Metrics } from "@/components/sections/metrics";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Awards } from "@/components/sections/awards";
import { Github } from "@/components/sections/github";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <AppShell>
      <main className="relative">
        <Hero />
        <TechMarquee />
        <About />
        <Metrics />
        <Experience />
        <Projects />
        <Skills />
        <Awards />
        <Github />
        <Contact />
      </main>
    </AppShell>
  );
}
