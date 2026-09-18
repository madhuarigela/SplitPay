"use client";

import { usePaymentStore } from "@/store/usePaymentStore";

export function CompleteScreen() {
  const payee = usePaymentStore((s) => s.payee);
  const installments = usePaymentStore((s) => s.installments);
  const reset = usePaymentStore((s) => s.reset);

  const total = installments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="sp-screen sp-complete">
      <div className="sp-success-icon">✓</div>

      <p className="sp-eyebrow">Payment complete</p>
      <h1>All paid</h1>

      <div className="sp-complete-total">₹{total.toLocaleString("en-IN")}</div>

      <p className="sp-muted">
        {installments.length} payment{installments.length !== 1 ? "s" : ""} completed
      </p>

      {payee && (
        <div className="sp-merchant-small">
          {payee.name || payee.vpa}
        </div>
      )}

      <div className="sp-bottom-action">
        <button className="sp-primary sp-button-reset" onClick={reset}>
          Split another payment
        </button>
      </div>
    </main>
  );
}
