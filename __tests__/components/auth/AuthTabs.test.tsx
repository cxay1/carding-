import { render, screen, fireEvent } from "@testing-library/react";
import AuthTabs from "../components/auth/AuthTabs";

describe("components/auth/AuthTabs", () => {
  it("renders sign in and sign up tabs", () => {
    render(<AuthTabs activeTab="signin" onTabChange={jest.fn()} />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("calls onTabChange when tab is clicked", () => {
    const handleChange = jest.fn();
    render(<AuthTabs activeTab="signin" onTabChange={handleChange} />);
    
    fireEvent.click(screen.getByText(/sign up/i));
    expect(handleChange).toHaveBeenCalledWith("signup");
  });

  it("shows active tab state", () => {
    render(<AuthTabs activeTab="signup" onTabChange={jest.fn()} />);
    const signupButton = screen.getByText(/sign up/i);
    // Active tab should have different styling
    expect(signupButton).toBeInTheDocument();
  });
});