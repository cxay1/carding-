"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronRight, BookOpen } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I redeem a gift card?",
    answer: "Go to Dashboard > Redeem, enter your code, and click Redeem. The value will be added to your balance.",
  },
  {
    question: "Why is my card not working?",
    answer: "Ensure you're in the correct region. Some cards are region-locked. Check the card details for region restrictions.",
  },
  {
    question: "How do I contact support?",
    answer: "Use the Support page to chat with AI or file a dispute. For urgent issues, use the Admin Escalation form.",
  },
  {
    question: "What payment methods are supported?",
    answer: "US users can pay with Stripe (Card, PayPal, Apple Pay). Nigeria users can pay with Paystack (Card, Bank Transfer, USSD).",
  },
];

export default function KnowledgeBase() {
  const [search, setSearch] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-800 rounded-xl p-6 max-w-xl">
      <h3 className="text-white font-medium mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Knowledge Base
      </h3>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help..."
          className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((faq, i) => (
          <div key={i} className="border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-700/50"
            >
              <span className="text-white text-sm">{faq.question}</span>
              {openFAQ === i ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openFAQ === i && (
              <div className="p-3 pt-0 border-t border-slate-700">
                <p className="text-slate-400 text-sm">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-400 text-center py-4">No results found</p>
      )}
    </div>
  );
}