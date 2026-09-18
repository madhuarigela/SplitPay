"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";
import { isValidVpa } from "@/lib/upi";

export function HomeScreen() {
  const goTo = usePaymentStore((s) => s.goTo);
  const setPayeeManual = usePaymentStore(
    (s) => s.setPayeeManual
  );

  const [manualOpen, setManualOpen] = useState(false);
  const [vpaInput, setVpaInput] = useState("");
  const [vpaError, setVpaError] =
    useState<string | null>(null);

  function submitManualVpa() {
    const trimmed = vpaInput.trim();

    if (!isValidVpa(trimmed)) {
      setVpaError(
        "That doesn't look like a valid UPI ID."
      );
      return;
    }

    setVpaError(null);
    setPayeeManual(trimmed);
  }

  return (
    <main className="mobile-screen home-screen">
      <div className="home-center">
        <div className="brand-logo">
          S
        </div>

        <h1 className="brand-title">
          SplitPay
        </h1>

        <p className="brand-subtitle">
          Pay any UPI bill in simple installments.
          Scan, split, and pay.
        </p>
      </div>

      <div className="home-actions">
        {!manualOpen ? (
          <>
            <Button
              onClick={() => goTo("scan")}
              className="mobile-primary-button"
            >
              Scan QR
              <span className="button-arrow">
                →
              </span>
            </Button>

            <button
              type="button"
              onClick={() => setManualOpen(true)}
              className="mobile-text-action"
            >
              Enter UPI ID manually
            </button>
          </>
        ) : (
          <div className="manual-panel animate-sheet-in">
            <input
              autoFocus
              inputMode="email"
              autoComplete="off"
              placeholder="name@bank"
              value={vpaInput}
              onChange={(event) => {
                setVpaInput(event.target.value);
                setVpaError(null);
              }}
              className="mobile-input"
            />

            {vpaError && (
              <p className="error-message">
                {vpaError}
              </p>
            )}

            <Button
              onClick={submitManualVpa}
              className="mobile-primary-button"
            >
              Continue
            </Button>

            <button
              type="button"
              onClick={() => {
                setManualOpen(false);
                setVpaError(null);
              }}
              className="mobile-text-action"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
