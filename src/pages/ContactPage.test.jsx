import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ContactPage from "./ContactPage";

describe("ContactPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders contact details and the message form", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", { name: /let's make something/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "SEND A MESSAGE" }),
    ).toBeInTheDocument();
    expect(screen.getByText("hello@reddot.com.bd")).toBeInTheDocument();
  });

  it("requires all message fields before submission", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("button", { name: "SEND MESSAGE" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("NAME")).toBeRequired();
    expect(screen.getByLabelText("EMAIL")).toBeRequired();
    expect(screen.getByLabelText("SUBJECT")).toBeRequired();
    expect(screen.getByLabelText("MESSAGE")).toBeRequired();
  });

  it("shows a confirmation and allows starting another message", () => {
    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("NAME"), {
      target: { value: "Asha Karim" },
    });
    fireEvent.change(screen.getByLabelText("EMAIL"), {
      target: { value: "asha@example.com" },
    });
    fireEvent.change(screen.getByLabelText("SUBJECT"), {
      target: { value: "Campaign brief" },
    });
    fireEvent.change(screen.getByLabelText("MESSAGE"), {
      target: { value: "We would like to discuss a new film." },
    });
    fireEvent.click(screen.getByRole("button", { name: "SEND MESSAGE" }));

    expect(
      screen.getByRole("heading", { name: "THANK YOU" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/message has been received/i)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "SEND ANOTHER MESSAGE" }),
    );

    expect(
      screen.getByRole("heading", { name: "SEND A MESSAGE" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("NAME")).toHaveValue("");
  });
});
