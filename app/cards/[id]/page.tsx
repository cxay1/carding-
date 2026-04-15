"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft, Copy, ExternalLink, QrCode, Gift, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import CardQRCode from "../components/cards/CardQRCode";

export default function CardDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "card_123";
  
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const card = {
    id,
    code: "AMZN50-US-ABCD1234",
    denomination: 50,
    currency: "USD",
    region: "US",
    status: "UNUSED",
    brand: "Amazon",
    expiresAt: "2025-12-31",
    purchasedAt: "2024-01-15",
    qrData: "AMZN50USABCD1234",
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(card.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    UNUSED: "bg-green-600",
    USED: "bg-slate-600",
    EXPIRED: "bg-red-600",
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Gift Card Details</h1>
        </div>

        {/* Card Visual */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 mb-6 text-white">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-primary-200 text-sm">Brand</p>
              <p className="text-2xl font-bold">{card.brand}</p>
            </div>
            <Gift className="w-8 h-8 text-primary-300" />
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">${card.denomination}</p>
            <p className="text-primary-200">{card.region}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-400 text-sm">Status</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${statusColors[card.status as keyof typeof statusColors]}`}>
              {card.status}
            </span>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Currency</p>
            <p className="text-white">{card.currency}</p>
          </div>
        </div>

        {/* Code Section */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Gift Card Code</h2>
          
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg mb-4">
            <code className="text-white font-mono text-lg">{card.code}</code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          <button
            onClick={() => setShowQR(!showQR)}
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300"
          >
            <QrCode className="w-4 h-4" />
            {showQR ? "Hide QR Code" : "Show QR Code"}
          </button>

          {showQR && (
            <div className="mt-4 flex justify-center">
              <CardQRCode code={card.qrData} size={200} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-slate-700">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Purchased
              </span>
              <span className="text-white">{new Date(card.purchasedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-700">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Expires
              </span>
              <span className="text-white">{new Date(card.expiresAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Region
              </span>
              <span className="text-white">{card.region === "US" ? "🇺🇸 United States" : "🇳🇬 Nigeria"}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          {card.status === "UNUSED" && (
            <button className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Use Code
            </button>
          )}
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
            <ExternalLink className="w-4 h-4" />
            Open in Store
          </button>
        </div>
      </div>
    </div>
  );
}