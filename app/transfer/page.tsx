"use client";

import { useState } from "react";
import { Send, CreditCard, Mail, MessageSquare, CheckCircle, Clock } from "lucide-react";

export default function TransferPage() {
  const [step, setStep] = useState<"select" | "recipient" | "confirm" | "success">("select");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const myCards = [
    { id: "card_1", brand: "Amazon", denomination: 50, code: "AMZN50****1234" },
    { id: "card_2", brand: "Steam", denomination: 25, code: "STM25****5678" },
    { id: "card_3", brand: "Netflix", denomination: 30, code: "NFX30****9012" },
  ];

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 2000));
    setSending(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Gift Card Sent!</h2>
          <p className="text-slate-400 mb-6">
            Your gift card has been sent to {recipient}
          </p>
          <button
            onClick={() => setStep("select")}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Transfer Gift Card</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {["select", "recipient", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s 
                  ? "bg-primary-600 text-white" 
                  : ["select", "recipient", "confirm"].indexOf(step) > i 
                    ? "bg-green-600 text-white" 
                    : "bg-slate-700 text-slate-400"
              }`}>
                {i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${
                step === s ? "text-white" : "text-slate-400"
              }`}>
                {s === "select" ? "Select Card" : s === "recipient" ? "Recipient" : "Confirm"}
              </span>
            </div>
          ))}
        </div>

        {step === "select" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Select a gift card to send</h2>
            {myCards.map((card) => (
              <button
                key={card.id}
                onClick={() => {
                  setSelectedCard(card.id);
                  setStep("recipient");
                }}
                className={`w-full p-4 bg-slate-800 rounded-xl flex items-center justify-between text-left transition ${
                  selectedCard === card.id ? "ring-2 ring-primary-600" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{card.brand}</p>
                    <p className="text-slate-400 text-sm">${card.denomination} • {card.code}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === "recipient" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Recipient Details</h2>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Recipient Email
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="friend@example.com"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("select")}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                Back
              </button>
              <button
                onClick={() => setStep("confirm")}
                disabled={!recipient}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Confirm Transfer</h2>

            <div className="bg-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Gift Card</span>
                <span className="text-white">Amazon $50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To</span>
                <span className="text-white">{recipient}</span>
              </div>
              {message && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Message</span>
                  <span className="text-white">{message}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("recipient")}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                Back
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {sending ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Gift Card
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}