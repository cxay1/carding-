import { render, screen } from "@testing-library/react";
import Pagination from "../components/ui/Pagination";

describe("components/ui/Pagination", () => {
  it("renders pagination controls", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);
    expect(screen.getByText(/1/i)).toBeInTheDocument();
  });

  it("shows multiple pages", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("does not render when only one page", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("calls onPageChange when page is clicked", () => {
    const handleChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={handleChange} />);
    
    // Click on page 2
    const page2 = screen.getByText("2");
    page2.parentElement?.click();
    
    expect(handleChange).toHaveBeenCalledWith(2);
  });
});