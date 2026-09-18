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
      <main className="sp-screen sp-center">
        <Button onClick={() => goTo("review")} className="sp-primary">
          Back to payment plan
        </Button>
      </main>
    );
  }

  const current = inst;
  const canRetry = current.attempts < MAX_ATTEMPTS;

  function reopenApp() {
    const link = retryInstallment(current.index);
    if (link) window.location.href = link;
  }

  return (
    <main className="sp-screen sp-pay">
      <button className="sp-back" onClick={() => goTo("review")}>
        ‹ Payment plan
      </button>

      <section className="sp-pay-main">
        <p className="sp-eyebrow">
          Payment {current.index + 1} of {installments.length}
        </p>

        <AmountDisplay
          rupees={current.amount}
          label={payee.name ?? payee.vpa}
        />

        {desktopWarning ? (
          <div className="sp-warning">
            This device may not open UPI apps directly.
          </div>
        ) : (
          <p className="sp-muted sp-pay-note">
            Open your UPI app and complete this payment. Return here when finished.
          </p>
        )}
      </section>

      <div className="sp-pay-actions">
        <Button
          onClick={reopenApp}
          disabled={!canRetry}
          className="sp-primary"
        >
          {canRetry
            ? `Pay ₹${current.amount.toLocaleString("en-IN")}`
            : "No attempts left"}
        </Button>

        <button className="sp-text-action" onClick={() => markResult(current.index, "paid")}>
          I've paid this part
        </button>

        <button className="sp-danger-action" onClick={() => markResult(current.index, "failed")}>
          Payment didn't go through
        </button>

        {current.attempts > 0 && (
          <p className="sp-attempt">
            Attempt {current.attempts} of {MAX_ATTEMPTS}
          </p>
        )}
      </div>
    </main>
  );
}
