"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";
import { isValidVpa, buildUpiLink, likelySupportsUpiIntents } from "@/lib/upi";

const COFFEE_VPA = "splitpay.support@okicici"; // placeholder — swap for the real support VPA before shipping

export function HomeScreen() {
  const goTo = usePaymentStore((s) => s.goTo);
  const setPayeeManual = usePaymentStore((s) => s.setPayeeManual);
  const [manualOpen, setManualOpen] = useState(false);
  const [vpaInput, setVpaInput] = useState("");
  const [vpaError, setVpaError] = useState<string | null>(null);

  function submitManualVpa() {
    const trimmed = vpaInput.trim();
    if (!isValidVpa(trimmed)) {
      setVpaError("That doesn't look like a valid UPI ID (e.g. name@bank).");
      return;
    }
    setVpaError(null);
    setPayeeManual(trimmed);
  }

  function buyMeACoffee() {
    if (!likelySupportsUpiIntents()) return;
    window.location.href = buildUpiLink({
      payeeVpa: COFFEE_VPA,
      amount: "50.00",
      note: "Buy the SplitPay dev a coffee",
    });
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-16 safe-top safe-bottom">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-2xl font-bold text-brand-onBrand shadow-soft">
          S
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight">SplitPay</h1>
        <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-soft dark:text-ink-onDarkSoft">
          Pay any UPI bill in installments you set. Scan, split, and pay each part when you're
          ready.
        </p>
      </div>

      <div className="space-y-3">
        {!manualOpen ? (
          <>
            <Button onClick={() => goTo("scan")}>Scan QR</Button>
            <Button variant="secondary" onClick={() => setManualOpen(true)}>
              Enter UPI ID
            </Button>
          </>
        ) : (
          <div className="animate-sheet-in space-y-3">
            <input
              autoFocus
              inputMode="email"
              placeholder="name@bank"
              value={vpaInput}
              onChange={(e) => {
                setVpaInput(e.target.value);
                setVpaError(null);
              }}
              className="w-full rounded-2xl border border-line bg-surface-dim px-4 py-4 text-[17px] outline-none dark:border-line-dark dark:bg-white/5"
            />
            {vpaError && <p className="px-1 text-[13px] text-danger">{vpaError}</p>}
            <Button onClick={submitManualVpa}>Continue</Button>
            <Button variant="ghost" onClick={() => setManualOpen(false)}>
              Cancel
            </Button>
          </div>
        )}

        <button
          onClick={buyMeACoffee}
          className="mt-4 w-full text-center text-[13px] text-ink-faint transition-opacity active:opacity-60"
        >
          ☕ Buy me a coffee
        </button>
      </div>
    </div>
  );
}
