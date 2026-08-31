import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StatsEditor from "./StatsEditor";

const mocks = vi.hoisted(() => ({
  content: { stats: [] },
  saveSection: vi.fn(),
}));

vi.mock("../context/ContentContext", () => ({
  useContent: () => ({
    content: mocks.content,
    saveSection: mocks.saveSection,
  }),
}));

describe("StatsEditor", () => {
  beforeEach(() => {
    mocks.saveSection.mockReset();
    vi.stubGlobal("alert", vi.fn());
  });

  it("saves statistics without editor-only identifiers", async () => {
    render(<StatsEditor />);

    fireEvent.click(screen.getByRole("button", { name: /add stat/i }));
    fireEvent.change(screen.getByDisplayValue("New Stat"), {
      target: { value: "Awards won" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(mocks.saveSection).toHaveBeenCalledWith("stats", [
      { label: "Awards won", value: "100+" },
    ]);
  });
});
