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

  if (total == null) {
    return (
      <main className="sp-screen sp-center">
        <Button
          onClick={() => goTo("amount")}
          className="sp-primary"
        >
          Enter amount
        </Button>
      </main>
    );
  }

  const preview = splitAmountEqually(total, count);

  function update(next: number) {
    if (next < 2 || next > MAX_INSTALLMENTS) return;

    setCount(next);
    setInstallmentCount(next);
  }

  return (
    <main className="sp-screen sp-split">
      <button
        type="button"
        className="sp-back"
        onClick={() => goTo("amount")}
      >
        ‹ Back
      </button>

      <section className="sp-section-head">
        <p className="sp-eyebrow">Split payment</p>
        <h1>Split ₹{total.toLocaleString("en-IN")}</h1>
      </section>

      <div className="sp-counter">
        <button
          type="button"
          onClick={() => update(count - 1)}
          disabled={count <= 2}
          aria-label="Decrease payments"
        >
          −
        </button>

        <div>
          <strong>{count}</strong>
          <span>payments</span>
        </div>

        <button
          type="button"
          onClick={() => update(count + 1)}
          disabled={count >= MAX_INSTALLMENTS}
          aria-label="Increase payments"
        >
          +
        </button>
      </div>

      <section className="sp-installments">
        {preview.map((amount, index) => (
          <div
            className="sp-installment"
            key={index}
          >
            <span>{index + 1}</span>

            <strong>
              ₹{amount.toLocaleString("en-IN")}
            </strong>
          </div>
        ))}
      </section>

      <div className="sp-bottom-action">
        <Button
          onClick={() => goTo("review")}
          className="sp-primary"
        >
          Set up payment queue
        </Button>
      </div>
    </main>
  );
}
