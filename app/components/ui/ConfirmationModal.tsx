"use client";

import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  status: "idle" | "loading" | "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}

export default function ConfirmationModal({
  isOpen,
  status,
  title,
  message,
  onClose,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const icons = {
    idle: null,
    loading: <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />,
    success: <CheckCircle className="w-8 h-8 text-green-400" />,
    error: <AlertCircle className="w-8 h-8 text-red-400" />,
  };

  const bgColors = {
    idle: "bg-slate-800",
    loading: "bg-slate-800",
    success: "bg-green-900/20",
    error: "bg-red-900/20",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative ${bgColors[status]} rounded-xl p-8 max-w-md w-full mx-4 text-center`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">{icons[status]}</div>
        
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 mb-6">{message}</p>

        {(status === "success" || status === "error") && (
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}