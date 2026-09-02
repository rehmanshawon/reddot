import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultContent } from "../data/seedContent";
import AboutPage from "./AboutPage";
import BtsPage from "./BtsPage";

vi.mock("../context/ContentContext", () => ({
  useContent: () => ({ content: defaultContent }),
}));

vi.mock("../components/FilmCard", () => ({
  default: ({ item }) => <div>{item.title}</div>,
}));

vi.mock("../components/ReelModal", () => ({
  default: () => null,
}));

describe("public content pages", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the about content and service points", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { name: defaultContent.about.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultContent.about.description),
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultContent.about.points[0]),
    ).toBeInTheDocument();
  });

  it("separates BTS stills and videos into their sections", () => {
    render(<BtsPage />);

    expect(
      screen.getByRole("heading", { name: "On-set photography" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Behind-the-scenes footage" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultContent.btsGallery[0].title),
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultContent.btsGallery[4].title),
    ).toBeInTheDocument();
  });
});
