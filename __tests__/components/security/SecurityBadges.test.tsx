import { render, screen } from "@testing-library/react";
import SecurityBadges from "../components/security/SecurityBadges";

describe("components/security/SecurityBadges", () => {
  it("renders all security badges", () => {
    render(<SecurityBadges />);
    
    expect(screen.getByText(/PCI DSS Compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/AES-256 Encryption/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7 Support/i)).toBeInTheDocument();
  });

  it("renders badge icons", () => {
    render(<SecurityBadges />});
    expect(screen.getByText(/🔒/)).toBeInTheDocument();
    expect(screen.getByText(/🛡️/)).toBeInTheDocument();
    expect(screen.getByText(/🎧/)).toBeInTheDocument();
  });
});