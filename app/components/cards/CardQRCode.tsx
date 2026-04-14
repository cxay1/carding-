"use client";

import { useEffect, useRef } from "react";

interface CardQRCodeProps {
  code: string;
  size?: number;
}

export default function CardQRCode({ code, size = 200 }: CardQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const qrSize = size / 25;
    const data = code.split("").map(c => c.charCodeAt(0) % 2);
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";

    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        const idx = (y * 25 + x) % data.length;
        if (data[idx]) {
          ctx.fillRect(x * qrSize, y * qrSize, qrSize - 1, qrSize - 1);
        }
      }
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, qrSize * 7, qrSize * 7);
    ctx.fillRect((size - qrSize * 7), 0, qrSize * 7, qrSize * 7);
    ctx.fillRect(0, (size - qrSize * 7), qrSize * 7, qrSize * 7);

    ctx.fillStyle = "#000000";
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i === 3 && j === 3)) {
          ctx.fillRect(i * qrSize, j * qrSize, qrSize, qrSize);
          ctx.fillRect((size - (7 - i) * qrSize), j * qrSize, qrSize, qrSize);
          ctx.fillRect(i * qrSize, (size - (7 - j) * qrSize), qrSize, qrSize);
        }
      }
    }
  }, [code, size]);

  return (
    <div className="bg-white p-4 rounded-lg inline-block">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}