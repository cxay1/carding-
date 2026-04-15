import { render, screen } from "@testing-library/react";
import RegionBadge from "../components/ui/RegionBadge";

describe("components/ui/RegionBadge", () => {
  it("renders US region", () => {
    render(<RegionBadge region="US" />);
    expect(screen.getByText(/🇺🇸/)).toBeInTheDocument();
    expect(screen.getByText(/United States/)).toBeInTheDocument();
  });

  it("renders NG region", () => {
    render(<RegionBadge region="NG" />);
    expect(screen.getByText(/🇳🇬/)).toBeInTheDocument();
    expect(screen.getByText(/Nigeria/)).toBeInTheDocument();
  });

  it("renders small size", () => {
    render(<RegionBadge region="US" size="sm" />);
    expect(screen.getByText(/🇺🇸/)).toBeInTheDocument();
  });
});