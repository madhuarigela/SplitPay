"use client";

import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";

export function CompleteScreen() {
  const payee = usePaymentStore((s) => s.payee);
  const installments = usePaymentStore((s) => s.installments);
  const reset = usePaymentStore((s) => s.reset);

  const total = installments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="sp-screen sp-complete">
      <div className="sp-success-icon" aria-hidden="true">✓</div>
      <h1>All paid</h1>
      <div className="sp-complete-total">₹{total.toLocaleString("en-IN")}</div>
      <p className="sp-merchant-small">
        {installments.length} {installments.length === 1 ? "part" : "parts"} paid to {payee?.name ?? payee?.vpa}.
      </p>

      <div className="sp-bottom-action" style={{ width: "100%" }}>
        <Button onClick={reset}>Split another payment</Button>
      </div>
    </main>
  );
}
