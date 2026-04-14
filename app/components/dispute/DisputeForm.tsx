"use client";

import { useState } from "react";

type DisputeType = "INVALID_CODE" | "ALREADY_USED" | "WRONG_REGION";

export default function DisputeForm() {
  const [type, setType] = useState<DisputeType>("INVALID_CODE");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await fetch("/api/support/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, description }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Dispute Submitted</h2>
        <p className="text-slate-400">
          Your dispute has been submitted. We'll review it within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 max-w-xl">
      <h2 className="text-xl font-semibold text-white mb-4">File a Dispute</h2>

      <div className="space-y-3 mb-4">
        {(["INVALID_CODE", "ALREADY_USED", "WRONG_REGION"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`w-full p-3 rounded-lg text-left ${
              type === t
                ? "bg-primary-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {t.replace("_", " ")}
          </button>
        ))}
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your issue..."
        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white h-32"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Submit Dispute
      </button>
    </div>
  );
}