"use client";

import { useState } from "react";
import { Key, CheckCircle, XCircle } from "lucide-react";

interface VerifyCodeProps {
  onVerify: (code: string) => Promise<boolean>;
}

export default function VerifyCode({ onVerify }: VerifyCodeProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setStatus("idle");
    const valid = await onVerify(code);
    setStatus(valid ? "valid" : "invalid");
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter gift card code"
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white uppercase font-mono"
          maxLength={20}
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={code.length < 8 || loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>

      {status === "valid" && (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          Valid code
        </div>
      )}

      {status === "invalid" && (
        <div className="flex items-center gap-2 text-red-400">
          <XCircle className="w-5 h-5" />
          Invalid or already used
        </div>
      )}
    </div>
  );
}