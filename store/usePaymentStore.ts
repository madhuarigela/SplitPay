"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildInstallmentPlan } from "@/lib/split";
import { buildUpiLink } from "@/lib/upi";

export type Screen =
  | "home"
  | "scan"
  | "amount"
  | "split"
  | "review"
  | "pay"
  | "complete";

export type InstallmentStatus = "pending" | "in_progress" | "paid" | "failed";

export interface Installment {
  index: number;
  amount: number;
  status: InstallmentStatus;
  attempts: number;
}

export interface PayeeInfo {
  vpa: string;
  name?: string;
  note?: string;
}

interface PaymentState {
  screen: Screen;
  payee: PayeeInfo | null;
  totalAmount: number | null;
  installments: Installment[];
  activeIndex: number | null;
  scanError: string | null;

  // navigation / setup
  goTo: (screen: Screen) => void;
  setPayeeFromScan: (payee: PayeeInfo, prefillAmount?: number) => void;
  setPayeeManual: (vpa: string, name?: string) => void;
  setScanError: (message: string | null) => void;
  setTotalAmount: (amount: number) => void;
  setInstallmentCount: (count: number) => void;

  // payment flow
  startInstallment: (index: number) => string | null; // returns the upi:// link to open
  markResult: (index: number, status: "paid" | "failed") => void;
  retryInstallment: (index: number) => string | null;
  reset: () => void;

  // derived
  nextPendingIndex: () => number | null;
  isComplete: () => boolean;
  paidTotal: () => number;
}

const initialState = {
  screen: "home" as Screen,
  payee: null as PayeeInfo | null,
  totalAmount: null as number | null,
  installments: [] as Installment[],
  activeIndex: null as number | null,
  scanError: null as string | null,
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      goTo: (screen) => set({ screen }),

      setPayeeFromScan: (payee, prefillAmount) =>
        set({
          payee,
          screen: "amount",
          scanError: null,
          totalAmount: prefillAmount ?? null,
        }),

      setPayeeManual: (vpa, name) =>
        set({ payee: { vpa, name }, screen: "amount", scanError: null }),

      setScanError: (message) => set({ scanError: message }),

      setTotalAmount: (amount) => set({ totalAmount: amount, screen: "split" }),

      setInstallmentCount: (count) => {
        const total = get().totalAmount;
        if (total == null) return;
        const plan = buildInstallmentPlan(total, count);
        set({
          installments: plan.map((p) => ({
            index: p.index,
            amount: p.amount,
            status: "pending",
            attempts: 0,
          })),
          screen: "review",
        });
      },

      startInstallment: (index) => {
        const state = get();
        const payee = state.payee;
        const inst = state.installments.find((i) => i.index === index);
        if (!payee || !inst) return null;

        const updated = state.installments.map((i) =>
          i.index === index
            ? { ...i, status: "in_progress" as const, attempts: i.attempts + 1 }
            : i
        );
        set({ installments: updated, activeIndex: index, screen: "pay" });

        return buildUpiLink({
          payeeVpa: payee.vpa,
          payeeName: payee.name,
          amount: inst.amount.toFixed(2),
          note: payee.note ?? "SplitPay installment",
          refId: `splitpay-${index + 1}-${Date.now()}`,
        });
      },

      markResult: (index, status) => {
        const state = get();
        const updated = state.installments.map((i) =>
          i.index === index ? { ...i, status } : i
        );
        const allPaid = updated.every((i) => i.status === "paid");
        set({
          installments: updated,
          screen: allPaid ? "complete" : state.screen,
        });
      },

      retryInstallment: (index) => get().startInstallment(index),

      reset: () => set({ ...initialState }),

      nextPendingIndex: () => {
        const found = get().installments.find(
          (i) => i.status === "pending" || i.status === "failed"
        );
        return found ? found.index : null;
      },

      isComplete: () => {
        const list = get().installments;
        return list.length > 0 && list.every((i) => i.status === "paid");
      },

      paidTotal: () =>
        get()
          .installments.filter((i) => i.status === "paid")
          .reduce((sum, i) => sum + i.amount, 0),
    }),
    {
      name: "splitpay-session",
      // Only persist what's needed to resume a queue after a browser/app kill —
      // never persist anything beyond this device-local session.
      partialize: (s) => ({
        screen: s.screen,
        payee: s.payee,
        totalAmount: s.totalAmount,
        installments: s.installments,
        activeIndex: s.activeIndex,
      }),
    }
  )
);
