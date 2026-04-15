import { render, screen } from "@testing-library/react";
import Input from "../components/ui/Input";

describe("components/ui/Input", () => {
  it("renders input with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders input without label", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input error="Invalid email" />);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it("accepts input value", () => {
    render(<Input value="test@example.com" readOnly />);
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });
});