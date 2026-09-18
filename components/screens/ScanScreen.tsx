"use client";

import { useCallback, useState } from "react";
import { QrScanner } from "@/components/QrScanner";
import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";
import { parseUpiQr, UpiParseError } from "@/lib/upi";

export function ScanScreen() {
  const goTo = usePaymentStore((s) => s.goTo);
  const setPayeeFromScan = usePaymentStore((s) => s.setPayeeFromScan);
  const [error, setError] = useState<string | null>(null);

  const handleDecoded = useCallback(
    (raw: string) => {
      try {
        const payee = parseUpiQr(raw);
        const prefill = payee.am ? Number(payee.am) : undefined;
        setPayeeFromScan({ vpa: payee.pa, name: payee.pn }, prefill);
      } catch (err) {
        if (err instanceof UpiParseError) {
          setError(err.message + " Try scanning again or enter the UPI ID manually.");
        } else {
          setError("Couldn't read that QR. Try again or enter the UPI ID manually.");
        }
      }
    },
    [setPayeeFromScan]
  );

  const handleError = useCallback((message: string) => {
    setError(message);
  }, []);

  return (
    <main className="sp-screen sp-scan">
      <button type="button" onClick={() => goTo("home")} className="sp-back">
        ‹ Back
      </button>

      <div className="sp-section-head">
        <p className="sp-eyebrow">Camera</p>
        <h1>Scan to pay</h1>
        <p className="sp-muted">Point your camera at the merchant's UPI QR.</p>
      </div>

      <div className="sp-scanner">
        <QrScanner onDecoded={handleDecoded} onError={handleError} />
      </div>

      {error && <div className="sp-warning">{error}</div>}

      <div className="sp-bottom-action">
        <Button variant="secondary" onClick={() => goTo("home")}>
          Enter UPI ID instead
        </Button>
      </div>
    </main>
  );
}
