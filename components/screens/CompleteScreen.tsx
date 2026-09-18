"use client";

import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";

export function CompleteScreen() {
  const payee = usePaymentStore((s) => s.payee);
  const installments = usePaymentStore((s) => s.installments);
  const reset = usePaymentStore((s) => s.reset);

  const total = installments.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-10 pt-16 text-center safe-top safe-bottom">
      <div className="mb-6 animate-pop">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="36" className="fill-brand" />
          <path
            d="M22 37 L32 47 L50 27"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="48"
            className="animate-check-draw"
          />
        </svg>
      </div>

      <h1 className="mb-1 text-[24px] font-semibold">All paid</h1>
      <p className="mb-8 max-w-xs text-[15px] text-ink-soft dark:text-ink-onDarkSoft">
        ₹{total.toLocaleString("en-IN")} across {installments.length}{" "}
        {installments.length === 1 ? "part" : "parts"} to {payee?.name ?? payee?.vpa}.
      </p>

      <div className="w-full max-w-xs">
        <Button onClick={reset}>Split another payment</Button>
      </div>
    </div>
  );
}
