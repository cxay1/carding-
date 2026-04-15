import { render, screen } from "@testing-library/react";
import DisputeStatus from "../components/dispute/DisputeStatus";

describe("components/dispute/DisputeStatus", () => {
  it("renders PENDING status", () => {
    render(<DisputeStatus status="PENDING" />);
    expect(screen.getByText(/pending review/i)).toBeInTheDocument();
  });

  it("renders UNDER_REVIEW status", () => {
    render(<DisputeStatus status="UNDER_REVIEW" />);
    expect(screen.getByText(/under review/i)).toBeInTheDocument();
  });

  it("renders RESOLVED status", () => {
    render(<DisputeStatus status="RESOLVED" />);
    expect(screen.getByText(/resolved/i)).toBeInTheDocument();
  });

  it("renders REJECTED status", () => {
    render(<DisputeStatus status="REJECTED" />);
    expect(screen.getByText(/rejected/i)).toBeInTheDocument();
  });

  it("displays resolution message when provided", () => {
    render(<DisputeStatus status="RESOLVED" resolution="Code was invalid" />);
    expect(screen.getByText(/code was invalid/i)).toBeInTheDocument();
  });
});