"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";

export function AmountScreen() {
  const payee = usePaymentStore((s) => s.payee);
  const setTotalAmount = usePaymentStore((s) => s.setTotalAmount);
  const goTo = usePaymentStore((s) => s.goTo);

  const [value, setValue] = useState("");

  function add(char: string) {
    if (char === "." && value.includes(".")) return;
    if (value.length >= 8) return;

    if (char === "." && value === "") {
      setValue("0.");
      return;
    }

    setValue(value + char);
  }

  function backspace() {
    setValue((v) => v.slice(0, -1));
  }

  function submit() {
    const amount = Number(value);

    if (!value || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    setTotalAmount(amount);
  }

  return (
    <main className="sp-screen sp-amount">
      <button
        type="button"
        className="sp-back"
        onClick={() => goTo("home")}
      >
        ‹ Back
      </button>

      <section className="sp-amount-main">
        <p className="sp-eyebrow">Payment amount</p>

        <h1>How much?</h1>

        <div className="sp-amount-value">
          <span>₹</span>
          {value || "0"}
        </div>

        {payee && (
          <p className="sp-muted">
            Paying {payee.name || payee.vpa}
          </p>
        )}
      </section>

      <section className="sp-keypad">
        {[
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          ".",
          "0",
          "⌫",
        ].map((key) => (
          <button
            type="button"
            key={key}
            className="sp-key"
            onClick={() =>
              key === "⌫" ? backspace() : add(key)
            }
          >
            {key}
          </button>
        ))}
      </section>

      <Button
        onClick={submit}
        disabled={!value || Number(value) <= 0}
        className="sp-primary"
      >
        Continue
      </Button>
    </main>
  );
}
