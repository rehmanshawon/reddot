import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BtsEditor from "./BtsEditor";

const mocks = vi.hoisted(() => ({
  content: { btsGallery: [] },
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

describe("BtsEditor", () => {
  beforeEach(() => {
    mocks.saveSection.mockReset();
    vi.stubGlobal("alert", vi.fn());
  });

  it("adds a gallery item and saves it through the BTS content section", async () => {
    render(<BtsEditor />);

    fireEvent.click(screen.getByRole("button", { name: /add new image/i }));
    fireEvent.change(screen.getByDisplayValue("New BTS Shot"), {
      target: { value: "Lighting setup" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(mocks.saveSection).toHaveBeenCalledWith(
      "btsGallery",
      expect.arrayContaining([
        expect.objectContaining({ title: "Lighting setup", type: "still" }),
      ]),
    );
  });
});
