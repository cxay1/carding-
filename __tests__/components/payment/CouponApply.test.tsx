import { render, screen } from "@testing-library/react";
import CouponApply from "../components/payment/CouponApply";

describe("components/payment/CouponApply", () => {
  const mockOnApply = (code: string) => {
    if (code === "WELCOME10") {
      return { valid: true, discount: 10 };
    }
    return { valid: false, message: "Invalid coupon" };
  };

  it("renders input field", () => {
    render(<CouponApply onApply={mockOnApply} />);
    expect(screen.getByPlaceholderText(/coupon code/i)).toBeInTheDocument();
  });

  it("renders apply button", () => {
    render(<CouponApply onApply={mockOnApply} />);
    expect(screen.getByText(/apply/i)).toBeInTheDocument();
  });

  it("shows success message for valid coupon", async () => {
    render(<CouponApply onApply={mockOnApply} />);
    
    const input = screen.getByPlaceholderText(/coupon code/i);
    const applyButton = screen.getByText(/apply/i);
    
    // Type coupon code
    input.setAttribute("value", "WELCOME10");
    applyButton.parentElement?.click();
    
    // Should show success
    expect(screen.getByText(/coupon applied/i)).toBeInTheDocument();
  });

  it("shows error for invalid coupon", () => {
    render(<CouponApply onApply={mockOnApply} />);
    
    const input = screen.getByPlaceholderText(/coupon code/i);
    const applyButton = screen.getByText(/apply/i);
    
    input.setAttribute("value", "INVALID");
    applyButton.parentElement?.click();
    
    expect(screen.getByText(/invalid coupon/i)).toBeInTheDocument();
  });
});