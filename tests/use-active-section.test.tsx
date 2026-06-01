import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useActiveSection } from "@/hooks/use-active-section";

describe("useActiveSection", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  it("returns first id as default", () => {
    const { result } = renderHook(() => useActiveSection(["hero", "about"]));
    expect(result.current).toBe("hero");
  });
  it("uses IntersectionObserver when sections exist", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    // @ts-expect-error mock
    window.IntersectionObserver = vi.fn(function () {
      return { observe, disconnect, unobserve: vi.fn(), takeRecords: () => [] };
    });
    document.body.innerHTML = '<div id="hero"></div><div id="about"></div>';
    renderHook(() => useActiveSection(["hero", "about"]));
    expect(observe).toHaveBeenCalledTimes(2);
  });
});
