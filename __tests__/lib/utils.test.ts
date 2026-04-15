import { formatPrice, truncate, generateId } from "../lib/utils";

describe("lib/utils", () => {
  describe("formatPrice", () => {
    it("formats USD amount correctly", () => {
      expect(formatPrice(50, "USD")).toBe("$50");
    });

    it("formats NGN amount correctly", () => {
      expect(formatPrice(5000, "NGN")).toBe("₦5,000");
    });

    it("formats large amounts with commas", () => {
      expect(formatPrice(10000, "USD")).toBe("$10,000");
    });
  });

  describe("truncate", () => {
    it("truncates long strings", () => {
      expect(truncate("hello world", 5)).toBe("hello...");
    });

    it("does not truncate short strings", () => {
      expect(truncate("hi", 10)).toBe("hi");
    });
  });

  describe("generateId", () => {
    it("generates unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it("generates ID with prefix", () => {
      expect(generateId("card")).toContain("card");
    });
  });
});