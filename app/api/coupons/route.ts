import { NextResponse } from "next/server";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(4).max(20),
});

const COUPONS = new Map([
  ["WELCOME10", { discount: 10, type: "percent", minAmount: 0 }],
  ["SAVE5", { discount: 5, type: "fixed", minAmount: 25 }],
  ["FIRST20", { discount: 20, type: "percent", minAmount: 50, maxUses: 1 }],
]);

export async function POST(request: Request) {
  const body = await request.json();
  const result = couponSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ valid: false, message: "Invalid coupon code" }, { status: 400 });
  }

  const { code } = result.data.toUpperCase();
  const coupon = COUPONS.get(code);

  if (!coupon) {
    return NextResponse.json({ valid: false, message: "Invalid coupon code" }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    code,
    discount: coupon.discount,
    type: coupon.type,
    message: coupon.type === "percent" ? `${coupon.discount}% off` : `$${coupon.discount} off`,
  });
}

export async function GET() {
  return NextResponse.json({ coupons: Array.from(COUPONS.keys()) });
}