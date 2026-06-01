import { describe, it, expect } from "vitest";
import { runCommand } from "@/components/terminal/command-handlers";

describe("terminal command parser", () => {
  it("whoami returns identity line", () => {
    const r = runCommand("whoami");
    expect(r.output).toMatch(/Janarthanan/i);
  });
  it("ls projects lists all project slugs", () => {
    const r = runCommand("ls projects");
    expect(r.output.split("\n").length).toBeGreaterThanOrEqual(3);
  });
  it("open linkedin yields navigate url", () => {
    const r = runCommand("open linkedin");
    expect(r.navigate).toMatch(/linkedin/i);
  });
  it("clear returns __CLEAR__", () => {
    expect(runCommand("clear").output).toBe("__CLEAR__");
  });
  it("exit closes", () => {
    expect(runCommand("exit").close).toBe(true);
  });
  it("unknown command falls through", () => {
    expect(runCommand("foo")).toMatchObject({ output: expect.stringMatching(/not found/i) });
  });
});
