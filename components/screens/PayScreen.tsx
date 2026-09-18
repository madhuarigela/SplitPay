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
  const [deepLinkOpened, setDeepLinkOpened] = useState(false);
  const [desktopWarning, setDesktopWarning] = useState(false);

  useEffect(() => {
    // The link itself was already opened by whoever routed us here (Review/retry).
    // We just track whether this environment could plausibly have handled it,
    // so we can be upfront instead of pretending the deep link definitely worked.
    setDesktopWarning(!likelySupportsUpiIntents());
    setDeepLinkOpened(true);
  }, [activeIndex]);

  if (!inst || !payee) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <Button onClick={() => goTo("review")}>Back to queue</Button>
      </div>
    );
  }

  const attemptsLeft = MAX_ATTEMPTS - inst.attempts;
  const canRetry = inst.attempts < MAX_ATTEMPTS;

  function reopenApp() {
    const link = retryInstallment(inst!.index);
    if (link) window.location.href = link;
  }

  function confirmPaid() {
    markResult(inst!.index, "paid");
  }

  function confirmFailed() {
    markResult(inst!.index, "failed");
    goTo("review");
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-16 safe-top safe-bottom">
      <div className="flex-1 flex flex-col items-center justify-center">
        <AmountDisplay rupees={inst.amount} label={`Part ${inst.index + 1} to ${payee.name ?? payee.vpa}`} />

        {desktopWarning && (
          <div className="mt-6 max-w-xs animate-sheet-in rounded-2xl bg-warn/10 p-4 text-center text-[14px] text-warn">
            This device may not open UPI apps directly. Use a phone with a UPI app installed, or
            scan the queue link there instead.
          </div>
        )}

        {!desktopWarning && deepLinkOpened && (
          <p className="mt-6 max-w-xs text-center text-[15px] text-ink-soft dark:text-ink-onDarkSoft">
            We opened your UPI app. Once you've completed or cancelled the payment there, come
            back and confirm below.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Button onClick={confirmPaid}>I've paid this part</Button>
        <Button variant="secondary" onClick={reopenApp} disabled={!canRetry}>
          {canRetry ? "Open UPI app again" : "No attempts left"}
        </Button>
        <Button variant="destructive" onClick={confirmFailed}>
          Payment didn't go through
        </Button>
        {inst.attempts > 1 && (
          <p className="text-center text-[13px] text-ink-faint">
            Attempt {inst.attempts} of {MAX_ATTEMPTS}
            {attemptsLeft <= 0 ? " — mark as failed and retry from the queue." : ""}
          </p>
        )}
      </div>
    </div>
  );
}
