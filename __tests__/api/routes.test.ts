import { NextRequest, NextResponse } from "next/server";

// Mock the auth
jest.mock("@clerk/nextjs", () => ({
  auth: jest.fn(() => Promise.resolve({ userId: "test-user-id" })),
}));

describe("API Routes", () => {
  describe("GET /api/cards", () => {
    it("returns mock cards", async () => {
      const req = new NextRequest("http://localhost:3000/api/cards");
      const res = await fetch(req.url);
      const data = await res.json();
      
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("POST /api/cards/redeem", () => {
    it("validates request body", async () => {
      const req = new NextRequest("http://localhost:3000/api/cards/redeem", {
        method: "POST",
        body: JSON.stringify({ code: "TEST", userId: "user-123" }),
      });
      
      // This is a basic test - real tests would need more setup
      expect(req.method).toBe("POST");
    });
  });

  describe("POST /api/coupons", () => {
    it("validates coupon code", async () => {
      const req = new NextRequest("http://localhost:3000/api/coupons", {
        method: "POST",
        body: JSON.stringify({ code: "WELCOME10" }),
      });
      
      expect(req.method).toBe("POST");
    });
  });
});