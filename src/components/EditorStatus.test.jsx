import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EditorStatus from "./EditorStatus";

describe("EditorStatus", () => {
  it("renders success and error feedback accessibly", () => {
    const { rerender } = render(
      <EditorStatus status={{ type: "success", message: "Saved" }} />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Saved");

    rerender(<EditorStatus status={{ type: "error", message: "Failed" }} />);
    expect(screen.getByRole("status")).toHaveTextContent("Failed");
  });

  it("renders nothing without a status", () => {
    const { container } = render(<EditorStatus status={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
