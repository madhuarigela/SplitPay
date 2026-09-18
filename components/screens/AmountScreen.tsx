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
    <main className="sp-screen sp-amount">
      <button type="button" onClick={() => goTo("home")} className="sp-back">
        ‹ Back
      </button>

      <section className="sp-amount-main">
        <p className="sp-eyebrow">Paying</p>
        <h1>{payee?.name ?? payee?.vpa}</h1>
        <div className="sp-amount-value">
          <span>₹</span>{value || "0"}
        </div>
        {error && <p className="sp-warning">{error}</p>}
      </section>

      <Keypad onDigit={onDigit} onBackspace={onBackspace} />

      <div className="sp-bottom-action">
        <Button onClick={submit} disabled={!value}>Continue</Button>
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
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  return (
    <div className="sp-keypad">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          className="sp-key"
          onClick={() => (key === "⌫" ? onBackspace() : onDigit(key))}
          aria-label={key === "⌫" ? "Delete" : key}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
