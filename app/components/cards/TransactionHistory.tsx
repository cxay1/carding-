"use client";

import { useState } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  gateway: string;
  status: string;
}

const mockTransactions: Transaction[] = [
  { id: "1", date: "2024-01-15", amount: 50, currency: "USD", gateway: "stripe", status: "COMPLETED" },
  { id: "2", date: "2024-01-10", amount: 25, currency: "USD", gateway: "stripe", status: "COMPLETED" },
  { id: "3", date: "2024-01-05", amount: 5000, currency: "NGN", gateway: "paystack", status: "COMPLETED" },
];

export default function TransactionHistory() {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const exportCSV = () => {
    const headers = ["ID", "Date", "Amount", "Currency", "Gateway", "Status"];
    const rows = mockTransactions.map(t => 
      [t.id, t.date, t.amount, t.currency, t.gateway, t.status].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-2 text-slate-400 text-sm">Date</th>
              <th className="text-left py-3 px-2 text-slate-400 text-sm">Amount</th>
              <th className="text-left py-3 px-2 text-slate-400 text-sm">Gateway</th>
              <th className="text-left py-3 px-2 text-slate-400 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((t) => (
              <tr key={t.id} className="border-b border-slate-700/50">
                <td className="py-3 px-2 text-slate-300">{t.date}</td>
                <td className="py-3 px-2 text-white">
                  {t.currency === "USD" ? "$" : "₦"}{t.amount}
                </td>
                <td className="py-3 px-2 text-slate-300 capitalize">{t.gateway}</td>
                <td className="py-3 px-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-600/20 text-green-400">
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mockTransactions.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          No transactions yet
        </div>
      )}

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2 bg-slate-700 rounded-lg disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="py-2 px-4 text-slate-400">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={mockTransactions.length < perPage}
          className="p-2 bg-slate-700 rounded-lg disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}