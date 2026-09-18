import { describe, it, expect } from "vitest";
import { splitAmountEqually, buildInstallmentPlan } from "@/lib/split";

describe("splitAmountEqually", () => {
  it("splits evenly divisible amounts exactly", () => {
    expect(splitAmountEqually(100, 4)).toEqual([25, 25, 25, 25]);
  });

  it("distributes leftover paise to the first installments, never losing money", () => {
    const parts = splitAmountEqually(100, 3);
    expect(parts).toEqual([33.34, 33.33, 33.33]);
    const sum = parts.reduce((a, b) => a + b, 0);
    expect(Math.round(sum * 100) / 100).toBe(100);
  });

  it("handles amounts with existing decimals without float drift", () => {
    const parts = splitAmountEqually(10.1, 3);
    const sum = Math.round(parts.reduce((a, b) => a + b, 0) * 100) / 100;
    expect(sum).toBe(10.1);
  });

  it("handles a single installment as the full amount", () => {
    expect(splitAmountEqually(250, 1)).toEqual([250]);
  });

  it("throws for a non-positive total", () => {
    expect(() => splitAmountEqually(0, 2)).toThrow(RangeError);
    expect(() => splitAmountEqually(-5, 2)).toThrow(RangeError);
  });

  it("throws for an invalid installment count", () => {
    expect(() => splitAmountEqually(100, 0)).toThrow(RangeError);
    expect(() => splitAmountEqually(100, 1.5)).toThrow(RangeError);
  });
});

describe("buildInstallmentPlan", () => {
  it("attaches a 0-based index to each installment", () => {
    const plan = buildInstallmentPlan(60, 3);
    expect(plan.map((p) => p.index)).toEqual([0, 1, 2]);
    expect(plan.map((p) => p.amount)).toEqual([20, 20, 20]);
  });
});
