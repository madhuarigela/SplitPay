"use client";

import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";
import { MAX_INSTALLMENT_RUPEES, getRequiredInstallmentCount, splitAmountEqually } from "@/lib/split";

export function SplitScreen() {
  const total = usePaymentStore((s) => s.totalAmount);
  const setInstallmentCount = usePaymentStore((s) => s.setInstallmentCount);
  const goTo = usePaymentStore((s) => s.goTo);

  if (total == null) return null;

  const count = getRequiredInstallmentCount(total);
  const preview = splitAmountEqually(total, count);
  const isSinglePayment = count === 1;

  return (
    <main className="sp-screen sp-split">
      <button type="button" onClick={() => goTo("amount")} className="sp-back" aria-label="Go back to amount">
        ‹ <span>Amount</span>
      </button>

      <div className="sp-section-head">
        <p className="sp-eyebrow">Payment plan</p>
        <h1>{isSinglePayment ? "Ready to pay." : "Your payment is split."}</h1>
        <p className="sp-muted">
          {isSinglePayment
            ? "This amount is already within the ₹1,999 limit."
            : "We split ₹" + total.toLocaleString("en-IN") + " automatically so every payment stays at or below ₹" + MAX_INSTALLMENT_RUPEES.toLocaleString("en-IN") + "."}
        </p>
      </div>

      <section className="sp-plan-summary" aria-label="Payment split summary">
        <div><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
        <div><span>{isSinglePayment ? "Payment" : "Payments"}</span><strong>{count}</strong></div>
      </section>

      <div className="sp-installments" aria-label="Installment amounts">
        {preview.map((amount, index) => (
          <div className="sp-installment" key={index}>
            <div className="sp-installment-leading">
              <span className="sp-installment-number">{index + 1}</span>
              <span>Payment {index + 1}</span>
            </div>
            <strong>₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
        ))}
      </div>

      <p className="sp-limit-note">Maximum per payment: ₹{MAX_INSTALLMENT_RUPEES.toLocaleString("en-IN")}</p>

      <div className="sp-bottom-action">
        <Button onClick={() => setInstallmentCount(count)}>
          {isSinglePayment ? "Continue to payment" : "Continue with " + count + " payments"}
        </Button>
      </div>
    </main>
  );
}
