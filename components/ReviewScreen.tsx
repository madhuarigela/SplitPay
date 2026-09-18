"use client";

import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";

const statusLabel: Record<string, string> = {
  pending: "Not paid",
  in_progress: "In progress",
  paid: "Paid",
  failed: "Failed — retry",
};

export function ReviewScreen() {
  const payee = usePaymentStore((s) => s.payee);
  const installments = usePaymentStore((s) => s.installments);
  const goTo = usePaymentStore((s) => s.goTo);
  const nextPendingIndex = usePaymentStore((s) => s.nextPendingIndex);
  const startInstallment = usePaymentStore((s) => s.startInstallment);
  const paidTotal = usePaymentStore((s) => s.paidTotal);

  function payNext() {
    const idx = nextPendingIndex();

    if (idx == null) return;

    const link = startInstallment(idx);

    if (link) {
      window.location.href = link;
    }
  }

  const next = nextPendingIndex();

  const total = installments.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <main className="sp-screen sp-review">
      <button
        type="button"
        onClick={() => goTo("split")}
        className="sp-back"
      >
        ‹ Back
      </button>

      <section className="sp-section-head">
        <p className="sp-eyebrow">Review</p>
        <h1>Payment queue</h1>
      </section>

      <div className="sp-merchant">
        <span>Paying</span>
        <strong>
          {payee?.name ?? payee?.vpa}
        </strong>
      </div>

      <div className="sp-total-row">
        <span>Paid</span>
        <strong>
          ₹{paidTotal().toLocaleString("en-IN")} of ₹
          {total.toLocaleString("en-IN")}
        </strong>
      </div>

      <section className="sp-queue">
        {installments.map((inst) => (
          <div
            key={inst.index}
            className="sp-queue-row"
          >
            <div
              className={`sp-step ${
                inst.status === "paid" ? "is-paid" : ""
              }`}
            >
              {inst.status === "paid"
                ? "✓"
                : inst.index + 1}
            </div>

            <div className="sp-queue-info">
              <strong>
                ₹{inst.amount.toLocaleString("en-IN")}
              </strong>

              <span>
                {statusLabel[inst.status] ?? "Not paid"}
              </span>
            </div>
          </div>
        ))}
      </section>

      <div className="sp-bottom-action">
        <Button
          onClick={payNext}
          disabled={next == null}
          className="sp-primary"
        >
          {next == null
            ? "All parts paid"
            : `Pay part ${next + 1}`}
        </Button>
      </div>
    </main>
  );
}
