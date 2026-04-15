import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "../components/ui/Checkbox";

describe("components/ui/Checkbox", () => {
  it("renders unchecked checkbox", () => {
    render(<Checkbox checked={false} onChange={jest.fn()} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders checked checkbox", () => {
    render(<Checkbox checked={true} onChange={jest.fn()} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("calls onChange when clicked", () => {
    const handleChange = jest.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);
    
    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("renders label when provided", () => {
    render(<Checkbox checked={false} onChange={jest.fn()} label="Remember me" />);
    expect(screen.getByText(/remember me/i)).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Checkbox checked={false} onChange={jest.fn()} disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});