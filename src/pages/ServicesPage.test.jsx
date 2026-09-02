import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultContent } from "../data/seedContent";
import ServicesPage from "./ServicesPage";

vi.mock("../context/ContentContext", () => ({
  useContent: () => ({ content: defaultContent }),
}));

vi.mock("../components/FilmCard", () => ({
  default: ({ item }) => <div>{item.title}</div>,
}));

vi.mock("../components/ReelModal", () => ({
  default: () => null,
}));

describe("ServicesPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders video production and switches its subsections", () => {
    render(<ServicesPage />);

    expect(screen.getByText(/flagship division/i)).toBeInTheDocument();
    expect(screen.getByText("TELEVISION COMMERCIALS")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "AV" }));

    expect(screen.getByText("AUDIO VISUALS")).toBeInTheDocument();
    expect(screen.getByText("ALWAYS ON NETWORK")).toBeInTheDocument();
  });

  it("switches between the service categories", () => {
    render(<ServicesPage />);

    fireEvent.click(screen.getByRole("button", { name: "POST PRODUCTION" }));
    expect(screen.getByText(/editing, color grading/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "EVENT" }));
    expect(screen.getByText(/live event coverage/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "CREATIVE" }));
    expect(screen.getByText(/concept development/i)).toBeInTheDocument();
  });
});
