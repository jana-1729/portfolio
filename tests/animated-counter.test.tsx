import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedCounter } from "@/components/effects/animated-counter";

beforeAll(() => {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: class {
      observe() {} unobserve() {} disconnect() {}
    },
  });
});

describe("AnimatedCounter", () => {
  it("renders aria-label with final value + suffix", () => {
    render(<AnimatedCounter to={100} suffix="+" />);
    expect(screen.getByLabelText("100+")).toBeInTheDocument();
  });
  it("renders aria-label with decimals", () => {
    render(<AnimatedCounter to={99.9} decimals={1} suffix="%" />);
    expect(screen.getByLabelText("99.9%")).toBeInTheDocument();
  });
});
