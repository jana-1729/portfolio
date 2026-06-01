import { describe, it, expect } from "vitest";
import { profile, metrics, experience, projects, skillGroups, awards, navItems } from "@/lib/data";

describe("data layer", () => {
  it("profile has required fields", () => {
    expect(profile.name).toBeTruthy();
    expect(profile.email).toMatch(/@/);
    expect(profile.socials.linkedin).toMatch(/^https?:\/\//);
    expect(profile.taglines.length).toBeGreaterThan(0);
  });
  it("metrics are non-empty", () => {
    expect(metrics.length).toBe(4);
    metrics.forEach((m) => expect(m.value).toBeGreaterThan(0));
  });
  it("experience entries chronologically ordered (newest first)", () => {
    expect(experience[0].company).toBe("SurveySparrow");
    expect(experience[experience.length - 1].role).toMatch(/B\.Tech/);
  });
  it("projects expose entries with covers", () => {
    expect(projects.length).toBeGreaterThanOrEqual(3);
    projects.forEach((p) => {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(p.cover.from).toMatch(/^#/);
    });
  });
  it("skill groups + awards + navItems present", () => {
    expect(skillGroups.length).toBeGreaterThan(3);
    expect(awards.length).toBeGreaterThanOrEqual(2);
    expect(navItems.length).toBeGreaterThanOrEqual(8);
  });
});
