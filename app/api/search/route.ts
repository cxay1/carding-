import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "cards";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = [];
  
  if (type === "cards" || type === "all") {
    results.push(
      { id: "1", type: "card", title: "Amazon $50", subtitle: "US Region" },
      { id: "2", type: "card", title: "Steam $25", subtitle: "Global" }
    );
  }

  if (type === "transactions" || type === "all") {
    results.push({ id: "3", type: "transaction", title: "Payment #1234", subtitle: "$50 - Completed" });
  }

  return NextResponse.json({ results: results.slice(0, 10) });
}