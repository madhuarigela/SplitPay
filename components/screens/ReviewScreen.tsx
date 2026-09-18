"use client";

import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";

const statusLabel: Record<string, string> = {
  pending: "Not paid",
  in_progress: "Ready",
  paid: "Paid",
  failed: "Payment failed — retry",
};

export function ReviewScreen() {
  const payee = usePaymentStore((s) => s.payee);
  const installments = usePaymentStore((s) => s.installments);
  const goTo = usePaymentStore((s) => s.goTo);
  const nextPendingIndex = usePaymentStore((s) => s.nextPendingIndex);
  const startInstallment = usePaymentStore((s) => s.startInstallment);
  const paidTotal = usePaymentStore((s) => s.paidTotal);

  function payNext() {
    const index = nextPendingIndex();
    if (index == null) return;
    const link = startInstallment(index);
    if (link) window.location.href = link;
  }

  const next = nextPendingIndex();
  const total = installments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="sp-screen">
      <button type="button" onClick={() => goTo("split")} className="sp-back">
        ‹ Back
      </button>

      <div className="sp-section-head">
        <p className="sp-eyebrow">Payment queue</p>
        <h1>Ready to pay</h1>
      </div>

      <div className="sp-merchant">
        <span>Merchant</span>
        <strong>{payee?.name ?? payee?.vpa}</strong>
      </div>

      <div className="sp-total-row">
        <span>Total</span>
        <strong>₹{total.toLocaleString("en-IN")}</strong>
      </div>

      <div className="sp-total-row">
        <span>Paid</span>
        <strong>₹{paidTotal().toLocaleString("en-IN")}</strong>
      </div>

      <div className="sp-queue">
        {installments.map((inst) => (
          <div className="sp-queue-row" key={inst.index}>
            <div className={`sp-step ${inst.status === "paid" ? "is-paid" : ""}`}>
              {inst.status === "paid" ? "✓" : inst.index + 1}
            </div>
            <div className="sp-queue-info">
              <strong>Payment {inst.index + 1}</strong>
              <span>{statusLabel[inst.status]}</span>
            </div>
            <strong style={{ marginLeft: "auto" }}>
              ₹{inst.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </strong>
          </div>
        ))}
      </div>

      <div className="sp-bottom-action">
        <Button onClick={payNext} disabled={next == null}>
          {next == null ? "All payments complete" : `Pay payment ${next + 1}`}
        </Button>
      </div>
    </main>
  );
}
