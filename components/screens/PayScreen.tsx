"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { usePaymentStore } from "@/store/usePaymentStore";
import { likelySupportsUpiIntents } from "@/lib/upi";

const MAX_ATTEMPTS = 3;

export function PayScreen() {
  const activeIndex = usePaymentStore((s) => s.activeIndex);
  const installments = usePaymentStore((s) => s.installments);
  const payee = usePaymentStore((s) => s.payee);
  const markResult = usePaymentStore((s) => s.markResult);
  const retryInstallment = usePaymentStore((s) => s.retryInstallment);
  const goTo = usePaymentStore((s) => s.goTo);

  const inst = installments.find((i) => i.index === activeIndex);
  const [desktopWarning, setDesktopWarning] = useState(false);

  useEffect(() => {
    setDesktopWarning(!likelySupportsUpiIntents());
  }, []);

  if (!inst || !payee) {
    return (
      <main className="mobile-screen center-screen">
        <Button onClick={() => goTo("review")}>
          Back to payment plan
        </Button>
      </main>
    );
  }

  const current = inst;
  const canRetry = current.attempts < MAX_ATTEMPTS;

  function reopenApp() {
    const link = retryInstallment(current.index);

    if (link) {
      window.location.href = link;
    }
  }

  function confirmPaid() {
    markResult(current.index, "paid");
  }

  function confirmFailed() {
    markResult(current.index, "failed");
  }

  return (
    <main className="mobile-screen payment-screen">
      <button
        type="button"
        onClick={() => goTo("review")}
        className="mobile-back"
      >
        ‹ Payment plan
      </button>

      <div className="payment-content">
        <div className="payment-step">
          Payment {current.index + 1} of {installments.length}
        </div>

        <AmountDisplay
          rupees={current.amount}
          label={payee.name ?? payee.vpa}
        />

        {desktopWarning ? (
          <div className="warning-panel">
            This device may not open UPI apps directly. Use a phone with a
            UPI app installed.
          </div>
        ) : (
          <p className="payment-instruction">
            Open your UPI app and complete this payment. Return here when
            finished.
          </p>
        )}

        <Button
          onClick={reopenApp}
          disabled={!canRetry}
          className="mobile-primary-button payment-button"
        >
          {canRetry
            ? `Pay ₹${current.amount.toLocaleString("en-IN")}`
            : "No attempts left"}
        </Button>

        <button
          type="button"
          onClick={confirmPaid}
          className="payment-confirm-link"
        >
          I've paid this part
        </button>

        <button
          type="button"
          onClick={confirmFailed}
          className="payment-failed-link"
        >
          Payment didn't go through
        </button>

        {current.attempts > 0 && (
          <p className="attempt-note">
            Attempt {current.attempts} of {MAX_ATTEMPTS}
          </p>
        )}
      </div>
    </main>
  );
}
