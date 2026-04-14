"use client";

import { useEffect, useState } from "react";
import { CreditCard, ShoppingCart, Gift } from "lucide-react";
import { FeatureCard } from "@/components/lib/feature-card";

interface GiftCard {
  id: string;
  denomination: number;
  currency: string;
  region: string;
}

interface CardGridProps {
  regionFilter: "US" | "NG" | "ALL";
  setRegionFilter: (region: "US" | "NG" | "ALL") => void;
}

const icons = [CreditCard, ShoppingCart, Gift];

export default function CardGrid({ regionFilter, setRegionFilter }: CardGridProps) {
  const [cards, setCards] = useState<GiftCard[]>([]);

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then(setCards)
      .catch(() => setCards([]));
  }, []);

  const filteredCards = cards.filter(
    (card) => regionFilter === "ALL" || card.region === regionFilter
  );

  return (
    <div>
      <div className="flex gap-4 mb-6">
        {(["ALL", "US", "NG"] as const).map((region) => (
          <button
            key={region}
            onClick={() => setRegionFilter(region)}
            className={`px-4 py-2 rounded-lg ${
              regionFilter === region
                ? "bg-primary-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {region === "ALL" ? "All Regions" : region === "US" ? "🇺🇸 US" : "🇳🇬 Nigeria"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCards.length === 0 ? (
          <div className="col-span-full text-slate-400 text-center py-12">
            No cards available at the moment
          </div>
        ) : (
          filteredCards.map((card, index) => (
            <FeatureCard
              key={card.id}
              icon={icons[index % icons.length]}
              title={`$${card.denomination} ${card.region}`}
              description={`${card.currency} Gift Card`}
            />
          ))
        )}
      </div>
    </div>
  );
}