"use client";

import { useState } from "react";
import { Headphones, Send } from "lucide-react";

export default function AdminEscalation() {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;
    
    await fetch("/api/support/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 max-w-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-white font-medium mb-2">Ticket Created</h3>
          <p className="text-slate-400 text-sm mb-4">
            A support agent will respond within 24 hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSubject("");
              setMessage("");
            }}
            className="text-primary-400 text-sm hover:text-primary-300"
          >
            Create another ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 max-w-xl">
      <h3 className="text-white font-medium mb-4 flex items-center gap-2">
        <Headphones className="w-5 h-5" />
        Contact Support
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-slate-400 text-sm mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="How can we help?"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500"
          />
        </div>
        
        <div>
          <label className="block text-slate-400 text-sm mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue..."
            rows={4}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Send className="w-4 h-4" />
          Submit Ticket
        </button>
      </div>
    </div>
  );
}