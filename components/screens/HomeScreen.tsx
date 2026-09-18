"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";
import { isValidVpa } from "@/lib/upi";

export function HomeScreen() {
  const goTo = usePaymentStore((s) => s.goTo);
  const setPayeeManual = usePaymentStore((s) => s.setPayeeManual);
  const [manualOpen, setManualOpen] = useState(false);
  const [vpaInput, setVpaInput] = useState("");
  const [vpaError, setVpaError] = useState<string | null>(null);

  function submitManualVpa() {
    const trimmed = vpaInput.trim();
    if (!isValidVpa(trimmed)) {
      setVpaError("Enter a valid UPI ID, such as name@bank.");
      return;
    }
    setVpaError(null);
    setPayeeManual(trimmed);
  }

  return (
    <main className="sp-screen sp-home">
      <div className="sp-brand">
        <div className="sp-logo" aria-hidden="true">S</div>
        <span>SplitPay</span>
      </div>

      <section className="sp-home-hero">
        <p className="sp-eyebrow">UPI payments, split simply</p>
        <h1>Split one payment into smaller payments.</h1>
        <p className="sp-muted">
          Scan a UPI QR, choose the number of parts, and pay them one at a time.
        </p>
      </section>

      <div className="sp-home-actions">
        {!manualOpen ? (
          <>
            <Button onClick={() => goTo("scan")}>Scan QR</Button>
            <button
              type="button"
              className="sp-secondary-action"
              onClick={() => setManualOpen(true)}
            >
              Enter UPI ID manually
            </button>
          </>
        ) : (
          <div className="sp-manual">
            <input
              autoFocus
              inputMode="email"
              autoComplete="off"
              placeholder="name@bank"
              value={vpaInput}
              onChange={(e) => {
                setVpaInput(e.target.value);
                setVpaError(null);
              }}
              className="sp-input"
              aria-label="UPI ID"
            />
            {vpaError && <p className="sp-warning">{vpaError}</p>}
            <Button onClick={submitManualVpa}>Continue</Button>
            <button
              type="button"
              className="sp-secondary-action"
              onClick={() => {
                setManualOpen(false);
                setVpaError(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
