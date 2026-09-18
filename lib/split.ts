/**
 * Splits a total rupee amount into `count` installments with paise-level accuracy.
 * Working in integer paise avoids the classic 100/3 = 33.33333... float drift;
 * any leftover paise from the division are distributed one-by-one to the first
 * installments so the sum always equals the original total exactly.
 */
export function splitAmountEqually(totalRupees: number, count: number): number[] {
  if (!Number.isFinite(totalRupees) || totalRupees <= 0) {
    throw new RangeError("Total amount must be a positive number");
  }
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("Installment count must be a positive integer");
  }

  const totalPaise = Math.round(totalRupees * 100);
  const basePaise = Math.floor(totalPaise / count);
  const remainder = totalPaise - basePaise * count;

  return Array.from({ length: count }, (_, i) => {
    const paise = basePaise + (i < remainder ? 1 : 0);
    return paise / 100;
  });
}

export interface InstallmentPlan {
  index: number; // 0-based
  amount: number; // rupees
}

export function buildInstallmentPlan(totalRupees: number, count: number): InstallmentPlan[] {
  return splitAmountEqually(totalRupees, count).map((amount, index) => ({ index, amount }));
}
