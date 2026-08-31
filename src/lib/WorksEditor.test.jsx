import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WorksEditor from "./WorksEditor";

const mocks = vi.hoisted(() => ({
  content: { featuredWorks: [] },
  saveSection: vi.fn(),
}));

vi.mock("../context/ContentContext", () => ({
  useContent: () => ({
    content: mocks.content,
    saveSection: mocks.saveSection,
  }),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ token: "test-token" }),
}));

describe("WorksEditor", () => {
  it("opens a work form and persists a new work item", async () => {
    render(<WorksEditor />);

    fireEvent.click(screen.getByRole("button", { name: /add new/i }));
    fireEvent.change(screen.getByDisplayValue("New Work"), {
      target: { value: "Launch Film" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add work/i }));

    expect(mocks.saveSection).toHaveBeenCalledWith(
      "featuredWorks",
      expect.arrayContaining([
        expect.objectContaining({ title: "Launch Film" }),
      ]),
    );
  });
});
