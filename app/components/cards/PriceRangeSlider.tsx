"use client";

import { useState } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onChange: (range: [number, number]) => void;
}

export default function PriceRangeSliderProps({ min, max, onChange }: PriceRangeSliderProps) {
  const [range, setRange] = useState<[number, number]>([min, max]);

  const handleChange = (value: number, index: 0 | 1) => {
    const newRange = [...range] as [number, number];
    newRange[index] = value;
    if (index === 0 && newRange[0] > newRange[1]) newRange[1] = newRange[0];
    if (index === 1 && newRange[1] < newRange[0]) newRange[0] = newRange[1];
    setRange(newRange);
    onChange(newRange);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">${range[0]}</span>
        <span className="text-slate-400">${range[1]}</span>
      </div>
      <div className="relative h-2">
        <div className="absolute inset-0 bg-slate-700 rounded-full" />
        <div
          className="absolute h-full bg-primary-600 rounded-full"
          style={{
            left: `${((range[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((range[1] - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
      <div className="flex gap-4">
        <input
          type="range"
          min={min}
          max={max}
          value={range[0]}
          onChange={(e) => handleChange(+e.target.value, 0)}
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={range[1]}
          onChange={(e) => handleChange(+e.target.value, 1)}
          className="w-full"
        />
      </div>
    </div>
  );
}