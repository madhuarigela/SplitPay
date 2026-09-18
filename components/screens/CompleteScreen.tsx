"use client";

import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";

export function CompleteScreen() {
  const payee = usePaymentStore((s) => s.payee);
  const installments = usePaymentStore((s) => s.installments);
  const reset = usePaymentStore((s) => s.reset);

  const total = installments.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <main className="mobile-screen complete-screen">
      <div className="complete-content">
        <div className="success-icon animate-pop">
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
          >
            <circle
              cx="36"
              cy="36"
              r="36"
              className="fill-brand"
            />
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

        <h1 className="complete-title">
          All paid
        </h1>

        <p className="complete-copy">
          ₹{total.toLocaleString("en-IN")} paid across{" "}
          {installments.length}{" "}
          {installments.length === 1
            ? "part"
            : "parts"}{" "}
          to{" "}
          {payee?.name ?? payee?.vpa}.
        </p>
      </div>

      <Button
        onClick={reset}
        className="mobile-primary-button"
      >
        Split another payment
      </Button>
    </main>
  );
}
