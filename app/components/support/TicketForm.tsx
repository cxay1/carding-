"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface TicketFormProps {
  onSubmit: (data: { subject: string; message: string; priority: string }) => void;
}

export default function TicketForm({ onSubmit }: TicketFormProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ subject, message, priority });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-white font-medium mb-2">Ticket Created</h3>
        <p className="text-slate-400">We'll respond within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-slate-400 text-sm mb-1">Subject</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
      </div>
      
      <div>
        <label className="block text-slate-400 text-sm mb-1">Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none" />
      </div>

      <div>
        <label className="block text-slate-400 text-sm mb-1">Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
        Submit Ticket
      </button>
    </form>
  );
}