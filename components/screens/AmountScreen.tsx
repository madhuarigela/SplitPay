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
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-16 safe-top safe-bottom">
      <button onClick={() => goTo("home")} className="mb-6 self-start text-[17px] text-brand">
        ‹ Back
      </button>

      <div className="mb-2 text-center text-[15px] text-ink-soft dark:text-ink-onDarkSoft">
        Paying {payee?.name ?? payee?.vpa}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-[56px] font-semibold tracking-tight">
          <span className="mr-1 text-ink-soft dark:text-ink-onDarkSoft">₹</span>
          {value || "0"}
        </div>
        {error && <p className="mt-3 text-[14px] text-danger">{error}</p>}
      </div>

      <Keypad onDigit={onDigit} onBackspace={onBackspace} />

      <div className="mt-6">
        <Button onClick={submit} disabled={!value}>
          Continue
        </Button>
      </div>
    </div>
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
    <div className="grid grid-cols-3 gap-3">
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => (k === "⌫" ? onBackspace() : onDigit(k))}
          className="rounded-2xl bg-surface-dim py-4 text-[24px] font-medium transition-transform active:scale-95 dark:bg-white/5"
        >
          {k}
        </button>
      ))}
    </div>
  );
}
