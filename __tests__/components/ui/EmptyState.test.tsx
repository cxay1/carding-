import { render, screen } from "@testing-library/react";
import EmptyState from "../components/ui/EmptyState";

describe("components/ui/EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No items" description="There are no items to display" />);
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
    expect(screen.getByText(/no items to display/i)).toBeInTheDocument();
  });

  it("renders action button when provided", () => {
    const handleAction = jest.fn();
    render(<EmptyState title="No items" actionLabel="Add Item" onAction={handleAction} />);
    
    const button = screen.getByText(/add item/i);
    expect(button).toBeInTheDocument();
  });

  it("does not render action when not provided", () => {
    render(<EmptyState title="No items" description="Nothing here" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});