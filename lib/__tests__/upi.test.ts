import { describe, it, expect } from "vitest";
import {
  parseUpiQr,
  isValidVpa,
  isValidAmountString,
  buildUpiLink,
  UpiParseError,
} from "@/lib/upi";

describe("isValidVpa", () => {
  it("accepts well-formed VPAs", () => {
    expect(isValidVpa("shop@okhdfcbank")).toBe(true);
    expect(isValidVpa("john.doe_1@paytm")).toBe(true);
  });

  it("rejects malformed VPAs", () => {
    expect(isValidVpa("no-at-sign")).toBe(false);
    expect(isValidVpa("@bank")).toBe(false);
    expect(isValidVpa("name@")).toBe(false);
    expect(isValidVpa("")).toBe(false);
  });
});

describe("isValidAmountString", () => {
  it("accepts positive amounts with up to 2 decimals", () => {
    expect(isValidAmountString("100")).toBe(true);
    expect(isValidAmountString("99.99")).toBe(true);
    expect(isValidAmountString("0.5")).toBe(true);
  });

  it("rejects zero, negative, and malformed amounts", () => {
    expect(isValidAmountString("0")).toBe(false);
    expect(isValidAmountString("-10")).toBe(false);
    expect(isValidAmountString("10.999")).toBe(false);
    expect(isValidAmountString("abc")).toBe(false);
    expect(isValidAmountString("")).toBe(false);
  });
});

describe("parseUpiQr", () => {
  it("parses a well-formed UPI intent", () => {
    const result = parseUpiQr("upi://pay?pa=shop@okhdfcbank&pn=Shop&am=250.00&cu=INR");
    expect(result).toEqual({
      pa: "shop@okhdfcbank",
      pn: "Shop",
      am: "250.00",
      cu: "INR",
      tn: undefined,
      mc: undefined,
    });
  });

  it("drops a malformed amount but keeps the rest of the payload", () => {
    const result = parseUpiQr("upi://pay?pa=shop@okhdfcbank&am=not-a-number");
    expect(result.pa).toBe("shop@okhdfcbank");
    expect(result.am).toBeUndefined();
  });

  it("throws for a non-UPI URI", () => {
    expect(() => parseUpiQr("https://example.com")).toThrow(UpiParseError);
  });

  it("throws for missing payee VPA", () => {
    expect(() => parseUpiQr("upi://pay?pn=Shop")).toThrow(UpiParseError);
  });

  it("throws for empty payload", () => {
    expect(() => parseUpiQr("   ")).toThrow(UpiParseError);
  });

  it("throws for garbage that isn't a URI at all", () => {
    expect(() => parseUpiQr("::::not a uri::::")).toThrow(UpiParseError);
  });
});

describe("buildUpiLink", () => {
  it("builds a well-formed upi:// link with required fields", () => {
    const link = buildUpiLink({ payeeVpa: "shop@okhdfcbank", amount: "100.00" });
    expect(link).toContain("upi://pay?");
    expect(link).toContain("pa=shop%40okhdfcbank");
    expect(link).toContain("am=100.00");
    expect(link).toContain("cu=INR");
  });

  it("includes optional fields when provided", () => {
    const link = buildUpiLink({
      payeeVpa: "shop@okhdfcbank",
      amount: "50.00",
      payeeName: "Shop",
      note: "Installment 1",
      refId: "ref-1",
    });
    expect(link).toContain("pn=Shop");
    expect(link).toContain("tn=Installment+1");
    expect(link).toContain("tr=ref-1");
  });
});
