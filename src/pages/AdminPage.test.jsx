import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdminPage from "./AdminPage";

const mocks = vi.hoisted(() => ({
  content: {
    site: {
      heroTag: "Tag",
      heroTitle: "Title",
      heroText: "Text",
      agencyIntro: "Intro",
    },
    about: {
      title: "About",
      description: "Description",
      points: ["Point one"],
    },
    leadership: [{ name: "Leader" }],
    team: [{ name: "Team member" }],
  },
  saveSection: vi.fn(),
  resetContent: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "admin@example.com" },
    logout: vi.fn(),
  }),
}));

vi.mock("../context/ContentContext", () => ({
  useContent: () => ({
    content: mocks.content,
    isLoading: false,
    error: "",
    saveSection: mocks.saveSection,
    resetContent: mocks.resetContent,
  }),
}));

vi.mock("../lib/WorksEditor", () => ({ default: () => <div /> }));
vi.mock("../lib/BtsEditor", () => ({ default: () => <div /> }));
vi.mock("../lib/StatsEditor", () => ({ default: () => <div /> }));

describe("AdminPage", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("saves homepage copy and shows a success status", async () => {
    mocks.saveSection.mockResolvedValueOnce({});
    render(<AdminPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /save homepage copy/i }),
    );

    expect(mocks.saveSection).toHaveBeenCalledWith("site", mocks.content.site);
    expect(await screen.findByText("Homepage copy saved.")).toBeInTheDocument();
  });

  it("saves valid JSON sections as parsed values", async () => {
    mocks.saveSection.mockResolvedValueOnce({});
    render(<AdminPage />);

    fireEvent.click(screen.getByRole("button", { name: /save leadership/i }));

    expect(mocks.saveSection).toHaveBeenCalledWith("leadership", [
      { name: "Leader" },
    ]);
    expect(await screen.findByText("Leadership saved.")).toBeInTheDocument();
  });

  it("rejects invalid JSON without sending a request", async () => {
    render(<AdminPage />);
    const leadershipField = screen.getByLabelText("Leadership profiles");

    fireEvent.change(leadershipField, { target: { value: "{invalid" } });
    fireEvent.click(screen.getByRole("button", { name: /save leadership/i }));

    expect(mocks.saveSection).not.toHaveBeenCalled();
    expect(
      await screen.findByText(
        "Could not save leadership. Please provide valid JSON.",
      ),
    ).toBeInTheDocument();
  });

  it("resets sample content and shows a success status", async () => {
    mocks.resetContent.mockResolvedValueOnce({});
    render(<AdminPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /reset sample content/i }),
    );

    expect(mocks.resetContent).toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Sample content restored."),
    ).toBeInTheDocument();
  });
});
