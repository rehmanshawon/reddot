import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppErrorBoundary from "./AppErrorBoundary";

vi.mock("../lib/errorReporting", () => ({
  captureException: vi.fn(),
}));

function BrokenChild() {
  throw new Error("render failed");
}

describe("AppErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("shows a reload action when a child throws", () => {
    render(
      <AppErrorBoundary>
        <BrokenChild />
      </AppErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: /something went wrong/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/reload the page/i)).toBeInTheDocument();
  });

  it("reloads the page when requested", () => {
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });

    render(
      <AppErrorBoundary>
        <BrokenChild />
      </AppErrorBoundary>,
    );
    const reloadButtons = screen.getAllByRole("button", {
      name: /reload page/i,
    });
    fireEvent.click(reloadButtons[reloadButtons.length - 1]);

    expect(reload).toHaveBeenCalledOnce();
  });
});
