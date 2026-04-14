"use client";

import { X } from "lucide-react";

interface GiftCard {
  id: string;
  denomination: number;
  currency: string;
  region: string;
}

interface QuickBuyModalProps {
  card: GiftCard | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function QuickBuyModal({ card, isOpen, onClose, onConfirm }: QuickBuyModalProps) {
  if (!isOpen || !card) return null;

  const fee = 0;
  const total = card.denomination + fee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-4">Quick Buy</h2>

        <div className="bg-slate-700 rounded-lg p-4 mb-4">
          <div className="flex justify-between text-slate-300">
            <span>Gift Card</span>
            <span className="text-white">
              ${card.denomination} {card.region}
            </span>
          </div>
          <div className="flex justify-between text-slate-400 mt-2 text-sm">
            <span>Processing Fee</span>
            <span>${fee.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-600 mt-3 pt-3 flex justify-between font-bold">
            <span className="text-white">Total</span>
            <span className="text-primary-400">${total}</span>
          </div>
        </div>

        <button
          onClick={onConfirm}
          className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}