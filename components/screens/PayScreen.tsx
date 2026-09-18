"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
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
  const [desktopWarning, setDesktopWarning] = useState(false);

  const currentInstallment = installments.find((item) => item.index === activeIndex);

  useEffect(() => {
    setDesktopWarning(!likelySupportsUpiIntents());
  }, []);

  if (!currentInstallment || !payee) {
    return (
      <main className="sp-screen sp-center">
        <Button onClick={() => goTo("review")}>Back to payment queue</Button>
      </main>
    );
  }

  const inst = currentInstallment;
  const canRetry = inst.attempts < MAX_ATTEMPTS;

  function reopenApp() {
    const link = retryInstallment(inst.index);
    if (link) window.location.href = link;
  }

  function confirmPaid() {
    markResult(inst.index, "paid");
  }

  function confirmFailed() {
    markResult(inst.index, "failed");
  }

  return (
    <main className="sp-screen sp-pay">
      <button type="button" onClick={() => goTo("review")} className="sp-back">
        ‹ Payment queue
      </button>

      <section className="sp-pay-main">
        <p className="sp-eyebrow">
          Payment {inst.index + 1} of {installments.length}
        </p>
        <h1>₹{inst.amount.toLocaleString("en-IN")}</h1>
        <p className="sp-muted">{payee.name ?? payee.vpa}</p>

        {desktopWarning ? (
          <div className="sp-warning">
            This device may not open UPI apps directly. Use a phone with a UPI app installed.
          </div>
        ) : (
          <p className="sp-muted sp-pay-note">
            Open your UPI app and complete this payment. Return here when finished.
          </p>
        )}
      </section>

      <div className="sp-pay-actions">
        <Button onClick={reopenApp} disabled={!canRetry}>
          {canRetry ? "Open UPI app" : "No attempts left"}
        </Button>

        <button type="button" className="sp-text-action" onClick={confirmPaid}>
          I've paid this part
        </button>

        <button type="button" className="sp-danger-action" onClick={confirmFailed}>
          Payment didn't go through
        </button>

        {inst.attempts > 0 && (
          <p className="sp-attempt">
            Attempt {inst.attempts} of {MAX_ATTEMPTS}
          </p>
        )}
      </div>
    </main>
  );
}
