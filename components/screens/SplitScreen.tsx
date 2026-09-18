"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";
import { splitAmountEqually } from "@/lib/split";

const MAX_INSTALLMENTS = 12;

export function SplitScreen() {
  const total = usePaymentStore((s) => s.totalAmount);
  const setInstallmentCount = usePaymentStore((s) => s.setInstallmentCount);
  const goTo = usePaymentStore((s) => s.goTo);
  const [count, setCount] = useState(2);

  if (total == null) return null;
  const preview = splitAmountEqually(total, count);

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-16 safe-top safe-bottom">
      <button onClick={() => goTo("amount")} className="mb-6 self-start text-[17px] text-brand">
        ‹ Back
      </button>

      <h1 className="mb-1 text-[22px] font-semibold">Split into how many?</h1>
      <p className="mb-8 text-[15px] text-ink-soft dark:text-ink-onDarkSoft">
        Total ₹{total.toLocaleString("en-IN")}
      </p>

      <div className="mb-8 flex items-center justify-center gap-8">
        <button
          onClick={() => setCount((c) => Math.max(2, c - 1))}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-dim text-[24px] font-medium active:scale-90 dark:bg-white/5"
          aria-label="Decrease"
        >
          −
        </button>
        <div className="text-[48px] font-semibold tabular-nums">{count}</div>
        <button
          onClick={() => setCount((c) => Math.min(MAX_INSTALLMENTS, c + 1))}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-dim text-[24px] font-medium active:scale-90 dark:bg-white/5"
          aria-label="Increase"
        >
          +
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {preview.map((amt, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl bg-surface-dim px-4 py-3 dark:bg-white/5"
          >
            <span className="text-[15px] text-ink-soft dark:text-ink-onDarkSoft">
              Part {i + 1}
            </span>
            <span className="text-[17px] font-medium tabular-nums">
              ₹{amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={() => setInstallmentCount(count)}>Set up queue</Button>
      </div>
    </div>
  );
}
