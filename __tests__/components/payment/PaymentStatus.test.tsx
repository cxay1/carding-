import { render, screen } from "@testing-library/react";
import PaymentStatus from "../components/payment/PaymentStatus";

describe("components/payment/PaymentStatus", () => {
  it("renders pending status", () => {
    render(<PaymentStatus status="pending" amount={50} currency="USD" />);
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  it("renders completed status", () => {
    render(<PaymentStatus status="completed" amount={100} currency="USD" />);
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });

  it("renders failed status", () => {
    render(<PaymentStatus status="failed" amount={25} currency="USD" />);
    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });

  it("renders refunded status", () => {
    render(<PaymentStatus status="refunded" amount={75} currency="USD" />);
    expect(screen.getByText(/refunded/i)).toBeInTheDocument();
  });

  it("displays amount with currency symbol", () => {
    render(<PaymentStatus status="completed" amount={50} currency="USD" />);
    expect(screen.getByText(/\$50/)).toBeInTheDocument();
  });

  it("displays NGN currency", () => {
    render(<PaymentStatus status="completed" amount={5000} currency="NGN" />);
    expect(screen.getByText(/₦5000/)).toBeInTheDocument();
  });
});