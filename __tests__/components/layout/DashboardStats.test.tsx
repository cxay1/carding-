import { render, screen } from "@testing-library/react";
import DashboardStats from "../components/layout/DashboardStats";

describe("components/layout/DashboardStats", () => {
  it("renders balance", () => {
    render(<DashboardStats balance={100} totalCards={5} activeCards={3} pendingTransactions={1} />);
    expect(screen.getByText(/\$100/)).toBeInTheDocument();
  });

  it("renders total cards count", () => {
    render(<DashboardStats balance={100} totalCards={5} activeCards={3} pendingTransactions={1} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders active cards count", () => {
    render(<DashboardStats balance={100} totalCards={5} activeCards={3} pendingTransactions={1} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders pending transactions", () => {
    render(<DashboardStats balance={100} totalCards={5} activeCards={3} pendingTransactions={1} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders all stat labels", () => {
    render(<DashboardStats balance={0} totalCards={0} activeCards={0} pendingTransactions={0} />);
    expect(screen.getByText(/balance/i)).toBeInTheDocument();
    expect(screen.getByText(/total cards/i)).toBeInTheDocument();
    expect(screen.getByText(/active cards/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });
});