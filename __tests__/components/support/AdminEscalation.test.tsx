import { render, screen } from "@testing-library/react";
import AdminEscalation from "../components/support/AdminEscalation";

describe("components/support/AdminEscalation", () => {
  it("renders contact support title", () => {
    render(<AdminEscalation />);
    expect(screen.getByText(/contact support/i)).toBeInTheDocument();
  });

  it("renders subject input", () => {
    render(<AdminEscalation />);
    expect(screen.getByPlaceholderText(/how can we help/i)).toBeInTheDocument();
  });

  it("renders message textarea", () => {
    render(<AdminEscalation />);
    expect(screen.getByPlaceholderText(/describe your issue/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<AdminEscalation />);
    expect(screen.getByText(/submit ticket/i)).toBeInTheDocument();
  });
});