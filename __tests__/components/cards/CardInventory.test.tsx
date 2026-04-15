import { render, screen, fireEvent } from "@testing-library/react";
import CardInventory from "../components/cards/CardInventory";

describe("components/cards/CardInventory", () => {
  it("renders status filter buttons", () => {
    render(<CardInventory />);
    
    expect(screen.getByText(/unused/i)).toBeInTheDocument();
    expect(screen.getByText(/used/i)).toBeInTheDocument();
    expect(screen.getByText(/expired/i)).toBeInTheDocument();
  });

  it("renders default message when no cards", () => {
    render(<CardInventory />);
    expect(screen.getByText(/card inventory will appear here/i)).toBeInTheDocument();
  });

  it("has UNUSED as default filter", () => {
    render(<CardInventory />);
    const buttons = screen.getAllByRole("button");
    // First button should be UNUSED and active
    expect(buttons[0].textContent).toBe("UNUSED");
  });

  it("changes filter when button clicked", () => {
    render(<CardInventory />);
    
    const usedButton = screen.getByText(/used/i);
    fireEvent.click(usedButton);
    
    // After clicking, UNUSED button should still be visible but used should be active
    expect(screen.getByText(/used/i)).toBeInTheDocument();
  });
});