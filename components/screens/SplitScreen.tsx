"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";
import { splitAmountEqually } from "@/lib/split";

const MAX_INSTALLMENTS = 12;

export function SplitScreen() {
  const total = usePaymentStore(
    (s) => s.totalAmount
  );

  const setInstallmentCount = usePaymentStore(
    (s) => s.setInstallmentCount
  );

  const goTo = usePaymentStore(
    (s) => s.goTo
  );

  const [count, setCount] = useState(2);

  if (total == null) return null;

  const preview = splitAmountEqually(
    total,
    count
  );

  return (
    <main className="mobile-screen">
      <button
        onClick={() => goTo("amount")}
        className="mobile-back"
      >
        ‹ Back
      </button>

      <div className="split-header">
        <h1 className="screen-title">
          Split your payment
        </h1>

        <p className="screen-subtitle">
          ₹{total.toLocaleString("en-IN")} total
        </p>
      </div>

      <div className="split-selector">
        <button
          type="button"
          onClick={() =>
            setCount((current) =>
              Math.max(2, current - 1)
            )
          }
          className="round-control"
          aria-label="Decrease installments"
        >
          −
        </button>

        <div className="split-count">
          {count}
        </div>

        <button
          type="button"
          onClick={() =>
            setCount((current) =>
              Math.min(
                MAX_INSTALLMENTS,
                current + 1
              )
            )
          }
          className="round-control"
          aria-label="Increase installments"
        >
          +
        </button>
      </div>

      <p className="split-caption">
        payments
      </p>

      <div className="split-list">
        {preview.map((amount, index) => (
          <div
            key={index}
            className="split-row"
          >
            <span>
              Payment {index + 1}
            </span>

            <strong>
              ₹
              {amount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </div>
        ))}
      </div>

      <Button
        onClick={() =>
          setInstallmentCount(count)
        }
        className="mobile-primary-button"
      >
        Continue
      </Button>
    </main>
  );
}
