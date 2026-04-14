"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function RedeemForm() {
  const { user } = useUser();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/cards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId: user?.id }),
      });
      if (res.ok) {
        setStatus("success");
        setCode("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter gift card code"
        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
      />
      <button
        onClick={handleRedeem}
        disabled={status === "loading" || !user}
        className="mt-4 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {status === "loading" ? "Redeeming..." : "Redeem Code"}
      </button>
      {status === "success" && (
        <div className="mt-4 p-4 bg-green-600/20 text-green-400 rounded-lg">
          Code redeemed successfully!
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 p-4 bg-red-600/20 text-red-400 rounded-lg">
          Invalid code or already used
        </div>
      )}
    </div>
  );
}