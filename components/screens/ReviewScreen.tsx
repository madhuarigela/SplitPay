"use client";

import { Button } from "@/components/ui/Button";
import { usePaymentStore } from "@/store/usePaymentStore";

const statusLabel: Record<string, string> = {
  pending: "Not paid",
  in_progress: "In progress",
  paid: "Paid",
  failed: "Failed — retry",
};

const statusColor: Record<string, string> = {
  pending: "text-ink-soft dark:text-ink-onDarkSoft",
  in_progress: "text-brand",
  paid: "text-brand",
  failed: "text-danger",
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
    if (link) window.location.href = link;
  }

  const next = nextPendingIndex();
  const total = installments.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-16 safe-top safe-bottom">
      <button onClick={() => goTo("split")} className="mb-6 self-start text-[17px] text-brand">
        ‹ Back
      </button>

      <h1 className="mb-1 text-[22px] font-semibold">Payment queue</h1>
      <p className="mb-6 text-[15px] text-ink-soft dark:text-ink-onDarkSoft">
        Paying {payee?.name ?? payee?.vpa} · ₹{paidTotal().toLocaleString("en-IN")} of{" "}
        ₹{total.toLocaleString("en-IN")} paid
      </p>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {installments.map((inst) => (
          <div
            key={inst.index}
            className="flex items-center justify-between rounded-2xl bg-surface-dim px-4 py-3 dark:bg-white/5"
          >
            <div>
              <div className="text-[17px] font-medium">Part {inst.index + 1}</div>
              <div className={`text-[13px] ${statusColor[inst.status]}`}>
                {statusLabel[inst.status]}
              </div>
            </div>
            <span className="text-[17px] font-medium tabular-nums">
              ₹{inst.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={payNext} disabled={next == null}>
          {next == null ? "All parts paid" : `Pay part ${next + 1}`}
        </Button>
      </div>
    </div>
  );
}
