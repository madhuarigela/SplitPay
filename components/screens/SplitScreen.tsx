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
    <main className="sp-screen sp-split">
      <button type="button" onClick={() => goTo("amount")} className="sp-back">
        ‹ Back
      </button>

      <div className="sp-section-head">
        <p className="sp-eyebrow">Split payment</p>
        <h1>How many parts?</h1>
        <p className="sp-muted">₹{total.toLocaleString("en-IN")} total</p>
      </div>

      <div className="sp-counter">
        <button
          type="button"
          onClick={() => setCount((c) => Math.max(2, c - 1))}
          disabled={count <= 2}
          aria-label="Decrease number of payments"
        >
          −
        </button>
        <div>
          <strong>{count}</strong>
          <span>payments</span>
        </div>
        <button
          type="button"
          onClick={() => setCount((c) => Math.min(MAX_INSTALLMENTS, c + 1))}
          disabled={count >= MAX_INSTALLMENTS}
          aria-label="Increase number of payments"
        >
          +
        </button>
      </div>

      <div className="sp-installments">
        {preview.map((amount, index) => (
          <div className="sp-installment" key={index}>
            <span>{index + 1}</span>
            <strong>
              ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </strong>
          </div>
        ))}
      </div>

      <div className="sp-bottom-action">
        <Button onClick={() => setInstallmentCount(count)}>Set up payment queue</Button>
      </div>
    </main>
  );
}
