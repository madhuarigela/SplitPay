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
  const retryInstallment = usePaymentStore(
    (s) => s.retryInstallment
  );
  const goTo = usePaymentStore((s) => s.goTo);

  const inst = installments.find(
    (i) => i.index === activeIndex
  );

  const [desktopWarning, setDesktopWarning] = useState(false);

  useEffect(() => {
    setDesktopWarning(!likelySupportsUpiIntents());
  }, []);

  if (!inst || !payee) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <Button onClick={() => goTo("review")}>
          Back to queue
        </Button>
      </div>
    );
  }

  const canRetry = inst.attempts < MAX_ATTEMPTS;

  function reopenApp() {
    if (!inst || !canRetry) return;

    const link = retryInstallment(inst.index);

    if (link) {
      window.location.href = link;
    }
  }

  function confirmPaid() {
    if (!inst) return;

    markResult(inst.index, "paid");
  }

  function confirmFailed() {
    if (!inst) return;

    markResult(inst.index, "failed");
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-16 safe-top safe-bottom">
      <div className="flex flex-1 flex-col items-center justify-center">
        <AmountDisplay
          rupees={inst.amount}
          label={`Part ${inst.index + 1} to ${
            payee.name ?? payee.vpa
          }`}
        />

        {desktopWarning && (
          <div className="mt-6 max-w-xs animate-sheet-in rounded-2xl bg-warn/10 p-4 text-center text-[14px] text-warn">
            This device may not open UPI apps directly.
            Use a phone with a UPI app installed.
          </div>
        )}

        {!desktopWarning && (
          <p className="mt-6 max-w-xs text-center text-[15px] text-ink-soft dark:text-ink-onDarkSoft">
            Complete this payment in your UPI app, then
            return here and confirm the result.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Button onClick={confirmPaid}>
          I've paid this part
        </Button>

        <Button
          variant="secondary"
          onClick={reopenApp}
          disabled={!canRetry}
        >
          {canRetry
            ? "Open UPI app again"
            : "No attempts left"}
        </Button>

        <Button
          variant="destructive"
          onClick={confirmFailed}
        >
          Payment didn't go through
        </Button>

        {inst.attempts > 0 && (
          <p className="text-center text-[13px] text-ink-faint">
            Attempt {inst.attempts} of {MAX_ATTEMPTS}
          </p>
        )}
      </div>
    </div>
  );
}