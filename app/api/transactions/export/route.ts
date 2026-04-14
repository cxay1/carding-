import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  // Mock transactions
  const transactions = [
    { id: "1", amount: 50, currency: "USD", status: "COMPLETED", createdAt: "2024-01-15" },
  ];

  if (format === "csv") {
    const headers = ["ID", "Amount", "Currency", "Status", "Date"];
    const rows = transactions.map(t => [t.id, t.amount, t.currency, t.status, t.createdAt].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=transactions.csv",
      },
    });
  }

  return NextResponse.json({ transactions });
}