"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";

export function HomeScreen() {
  const goTo = usePaymentStore((s) => s.goTo);
  const setPayeeManual = usePaymentStore((s) => s.setPayeeManual);

  const [showManual, setShowManual] = useState(false);
  const [upi, setUpi] = useState("");

  function submit() {
    const value = upi.trim();
    if (!value) return;
    setPayeeManual(value);
  }

  return (
    <main className="sp-screen sp-home">
      <div className="sp-brand">
        <div className="sp-logo">S</div>
        <span>SplitPay</span>
      </div>

      <section className="sp-home-hero">
        <p className="sp-eyebrow">UPI payments</p>
        <h1>Split one payment<br />into smaller payments.</h1>
        <p className="sp-muted">
          Simple. Private. On your device.
        </p>
      </section>

      <div className="sp-home-actions">
        <Button onClick={() => goTo("scan")} className="sp-primary">
          Scan QR
        </Button>

        {!showManual ? (
          <button
            className="sp-secondary-action"
            onClick={() => setShowManual(true)}
          >
            Enter UPI ID
          </button>
        ) : (
          <div className="sp-manual">
            <input
              autoFocus
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="merchant@upi"
              className="sp-input"
              inputMode="email"
              autoCapitalize="none"
            />
            <Button onClick={submit} className="sp-primary">
              Continue
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

