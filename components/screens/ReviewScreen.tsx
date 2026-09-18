"use client";

import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";

const statusLabel: Record<string, string> = {
  pending: "Not paid",
  in_progress: "In progress",
  paid: "Paid",
  failed: "Payment failed — retry",
};

const statusColor: Record<string, string> = {
  pending: "text-ink-soft dark:text-ink-onDarkSoft",
  in_progress: "text-brand",
  paid: "text-brand",
  failed: "text-danger",
};

export function ReviewScreen() {
  const payee = usePaymentStore((s) => s.payee);
  const installments = usePaymentStore(
    (s) => s.installments
  );
  const goTo = usePaymentStore((s) => s.goTo);
  const nextPendingIndex = usePaymentStore(
    (s) => s.nextPendingIndex
  );
  const startInstallment = usePaymentStore(
    (s) => s.startInstallment
  );
  const paidTotal = usePaymentStore(
    (s) => s.paidTotal
  );

  function payNext() {
    const index = nextPendingIndex();

    if (index == null) return;

    const link = startInstallment(index);

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
    <main className="mobile-screen">
      <button
        onClick={() => goTo("split")}
        className="mobile-back"
      >
        ‹ Back
      </button>

      <div className="review-header">
        <div className="eyebrow">
          Ready to pay
        </div>

        <h1 className="screen-title">
          Payment plan
        </h1>

        <p className="screen-subtitle">
          {payee?.name ?? payee?.vpa}
        </p>
      </div>

      <div className="review-summary">
        <span>Total</span>

        <strong>
          ₹{total.toLocaleString("en-IN")}
        </strong>
      </div>

      <div className="review-progress">
        ₹{paidTotal().toLocaleString("en-IN")} paid
        <span>of ₹{total.toLocaleString("en-IN")}</span>
      </div>

      <div className="payment-list">
        {installments.map((inst) => (
          <div
            key={inst.index}
            className="payment-row"
          >
            <div className="payment-row-left">
              <div className="payment-number">
                {inst.index + 1}
              </div>

              <div>
                <div className="payment-row-title">
                  Payment {inst.index + 1}
                </div>

                <div
                  className={`payment-row-status ${statusColor[inst.status]}`}
                >
                  {statusLabel[inst.status]}
                </div>
              </div>
            </div>

            <strong className="payment-row-amount">
              ₹
              {inst.amount.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </strong>
          </div>
        ))}
      </div>

      <Button
        onClick={payNext}
        disabled={next == null}
        className="mobile-primary-button"
      >
        {next == null
          ? "All payments complete"
          : `Pay payment ${next + 1}`}
      </Button>
    </main>
  );
}
