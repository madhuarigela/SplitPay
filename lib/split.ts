/**
 * Split a payment into installments that never exceed ₹1,999.
 * Amounts are calculated in paise so the plan always sums exactly to the
 * original amount.
 */
export const MAX_INSTALLMENT_RUPEES = 1999;

export function getRequiredInstallmentCount(totalRupees: number): number {
  if (!Number.isFinite(totalRupees) || totalRupees <= 0) {
    throw new RangeError("Total amount must be a positive number");
  }

  return Math.max(1, Math.ceil(totalRupees / MAX_INSTALLMENT_RUPEES));
}

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
  index: number;
  amount: number;
}

export function buildInstallmentPlan(totalRupees: number, count?: number): InstallmentPlan[] {
  const requiredCount = getRequiredInstallmentCount(totalRupees);
  const requestedCount = count ?? requiredCount;

  if (requestedCount < requiredCount) {
    throw new RangeError(
      `At least ${requiredCount} installments are required for ₹${totalRupees.toLocaleString("en-IN")}.`
    );
  }

  return splitAmountEqually(totalRupees, requestedCount).map((amount, index) => ({
    index,
    amount,
  }));
}
