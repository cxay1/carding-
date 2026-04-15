import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../components/ui/Button";

describe("components/ui/Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("is disabled when loading", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies variant styles", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");
  });
});