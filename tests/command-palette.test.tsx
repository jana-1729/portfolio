import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPalette } from "@/components/nav/command-palette";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  // cmdk uses ResizeObserver which jsdom doesn't implement
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as unknown as { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver = ResizeObserverMock;
  // cmdk calls scrollIntoView on selected items; jsdom lacks it
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

describe("CommandPalette", () => {
  it("renders nav, project, and action groups when open", () => {
    render(<CommandPalette open={true} onOpenChange={() => {}} onToggleTerminal={() => {}} onOpenProject={() => {}} />);
    expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
    expect(screen.getByText("Navigate")).toBeInTheDocument();
    // "Projects" appears both as nav item label and group heading — expect >=1 match
    expect(screen.getAllByText("Projects").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
  it("invokes onOpenProject when project selected", async () => {
    const onOpenProject = vi.fn();
    render(<CommandPalette open={true} onOpenChange={() => {}} onToggleTerminal={() => {}} onOpenProject={onOpenProject} />);
    await userEvent.click(screen.getByText(/File Vault MCP/i));
    expect(onOpenProject).toHaveBeenCalledWith("file-vault-mcp");
  });
});
