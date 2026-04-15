import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

describe("components/ui/LoadingSpinner", () => {
  it("renders with default size", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(<LoadingSpinner text="Please wait..." />);
    expect(screen.getByText(/please wait/i)).toBeInTheDocument();
  });

  it("renders different sizes", () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});