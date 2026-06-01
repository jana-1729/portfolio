import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionShell } from "@/components/layout/section-shell";

beforeAll(() => {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
});

describe("SectionShell", () => {
  it("renders id and label", () => {
    const { container } = render(
      <SectionShell id="about" label={{ index: "01", name: "about" }}>
        <p>content</p>
      </SectionShell>,
    );
    expect(container.querySelector("#about")).toBeTruthy();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
