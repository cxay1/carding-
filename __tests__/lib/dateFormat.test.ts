import { formatPrice, formatDate, formatDateTime } from "../lib/utils";

describe("lib/utils - formatDate", () => {
  it("formats date correctly", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });
});

describe("lib/utils - formatDateTime", () => {
  it("formats date and time correctly", () => {
    const result = formatDateTime("2024-01-15T10:30:00Z");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });
});