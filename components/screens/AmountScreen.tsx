"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";
import { isValidAmountString } from "@/lib/upi";

export function AmountScreen() {
  const payee = usePaymentStore((s) => s.payee);
  const prefill = usePaymentStore((s) => s.totalAmount);
  const setTotalAmount = usePaymentStore((s) => s.setTotalAmount);
  const goTo = usePaymentStore((s) => s.goTo);

  const [value, setValue] = useState(prefill ? String(prefill) : "");
  const [error, setError] = useState<string | null>(null);

  function onDigit(d: string) {
    if (d === "." && value.includes(".")) return;
    if (value.replace(".", "").length >= 8) return;
    setValue((v) => v + d);
  }

  function onBackspace() {
    setValue((v) => v.slice(0, -1));
  }

  function submit() {
    if (!isValidAmountString(value || "0")) {
      setError("Enter an amount greater than ₹0.");
      return;
    }

    setError(null);
    setTotalAmount(Number(value));
  }

  return (
    <main className="mobile-screen">
      <button
        onClick={() => goTo("home")}
        className="mobile-back"
      >
        ‹ Back
      </button>

      <div className="mobile-content">
        <div className="payee-label">
          Paying
        </div>

        <div className="payee-name">
          {payee?.name ?? payee?.vpa}
        </div>

        <div className="amount-entry">
          <div className="amount-value">
            <span>₹</span>
            {value || "0"}
          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}
        </div>

        <Keypad
          onDigit={onDigit}
          onBackspace={onBackspace}
        />

        <Button
          onClick={submit}
          disabled={!value}
          className="mobile-primary-button"
        >
          Continue
        </Button>
      </div>
    </main>
  );
}

function Keypad({
  onDigit,
  onBackspace,
}: {
  onDigit: (d: string) => void;
  onBackspace: () => void;
}) {
  const keys = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    ".", "0", "⌫",
  ];

  return (
    <div className="mobile-keypad">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() =>
            key === "⌫"
              ? onBackspace()
              : onDigit(key)
          }
          className="keypad-key"
        >
          {key}
        </button>
      ))}
    </div>
  );
}
