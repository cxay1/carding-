import {
  validateGiftCardCode,
  validateEmail,
  validateAmount,
  giftCardCodeSchema,
  emailSchema,
  amountSchema,
} from "../lib/validation";

describe("lib/validation", () => {
  describe("validateGiftCardCode", () => {
    it("accepts valid gift card codes", () => {
      const result = validateGiftCardCode("AMZN50-US-XXXX");
      expect(result.success).toBe(true);
    });

    it("rejects codes that are too short", () => {
      const result = validateGiftCardCode("ABC");
      expect(result.success).toBe(false);
    });

    it("rejects codes with special characters", () => {
      const result = validateGiftCardCode("AMZN@50!");
      expect(result.success).toBe(false);
    });
  });

  describe("validateEmail", () => {
    it("accepts valid email addresses", () => {
      const result = validateEmail("test@example.com");
      expect(result.success).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      const result = validateEmail("not-an-email");
      expect(result.success).toBe(false);
    });
  });

  describe("validateAmount", () => {
    it("accepts positive amounts", () => {
      const result = validateAmount(50);
      expect(result.success).toBe(true);
    });

    it("rejects negative amounts", () => {
      const result = validateAmount(-10);
      expect(result.success).toBe(false);
    });

    it("rejects amounts over 10000", () => {
      const result = validateAmount(15000);
      expect(result.success).toBe(false);
    });
  });
});