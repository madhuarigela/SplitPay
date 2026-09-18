"use client";

import { useCallback, useState } from "react";
import { QrScanner } from "@/components/QrScanner";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";
import { parseUpiQr, UpiParseError } from "@/lib/upi";

export function ScanScreen() {
  const goTo = usePaymentStore((s) => s.goTo);
  const setPayeeFromScan = usePaymentStore(
    (s) => s.setPayeeFromScan
  );

  const [error, setError] = useState<string | null>(null);

  const handleDecoded = useCallback(
    (raw: string) => {
      try {
        const payee = parseUpiQr(raw);

        const prefill = payee.am
          ? Number(payee.am)
          : undefined;

        setPayeeFromScan(
          {
            vpa: payee.pa,
            name: payee.pn,
          },
          prefill
        );
      } catch (err) {
        if (err instanceof UpiParseError) {
          setError(
            err.message +
              " — try scanning again or enter the UPI ID manually."
          );
        } else {
          setError(
            "Couldn't read that code. Try again or enter the UPI ID manually."
          );
        }
      }
    },
    [setPayeeFromScan]
  );

  const handleError = useCallback(
    (message: string) => {
      setError(message);
    },
    []
  );

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-16 safe-top safe-bottom">
      <button
        onClick={() => goTo("home")}
        className="mb-6 self-start text-[17px] text-brand"
      >
        ‹ Back
      </button>

      <h1 className="mb-1 text-[22px] font-semibold">
        Scan to pay
      </h1>

      <p className="mb-6 text-[15px] text-ink-soft dark:text-ink-onDarkSoft">
        Point the camera at the merchant's UPI QR code.
      </p>

      <QrScanner
        onDecoded={handleDecoded}
        onError={handleError}
      />

      {error && (
        <div className="mt-6 animate-sheet-in rounded-2xl bg-danger/10 p-4 text-[14px] text-danger">
          {error}
        </div>
      )}

      <div className="mt-auto pt-8">
        <Button
          variant="secondary"
          onClick={() => goTo("home")}
        >
          Enter UPI ID instead
        </Button>
      </div>
    </div>
  );
}
