import { getPaymentProvider, detectRegionFromHeader } from "../lib/geo";

describe("lib/geo - getPaymentProvider", () => {
  it("returns Stripe for US region", () => {
    const provider = getPaymentProvider("US");
    expect(provider.gateway).toBe("stripe");
    expect(provider.currency).toBe("USD");
    expect(provider.symbol).toBe("$");
  });

  it("returns Paystack for NG region", () => {
    const provider = getPaymentProvider("NG");
    expect(provider.gateway).toBe("paystack");
    expect(provider.currency).toBe("NGN");
    expect(provider.symbol).toBe("₦");
  });

  it("includes correct payment methods for US", () => {
    const provider = getPaymentProvider("US");
    expect(provider.methods).toContain("card");
    expect(provider.methods).toContain("paypal");
  });

  it("includes correct payment methods for Nigeria", () => {
    const provider = getPaymentProvider("NG");
    expect(provider.methods).toContain("card");
    expect(provider.methods).toContain("bank_transfer");
    expect(provider.methods).toContain("ussd");
  });
});

describe("lib/geo - detectRegionFromHeader", () => {
  it("returns NG for nigeria header", () => {
    expect(detectRegionFromHeader("nigeria")).toBe("NG");
  });

  it("returns US for us header", () => {
    expect(detectRegionFromHeader("us")).toBe("US");
  });

  it("returns US for null header", () => {
    expect(detectRegionFromHeader(null)).toBe("US");
  });
});