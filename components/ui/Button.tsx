"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  "w-full rounded-2xl text-[17px] font-semibold py-4 transition-transform duration-150 ease-spring active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-onBrand shadow-soft",
  secondary:
    "bg-surface-dim text-ink dark:bg-white/10 dark:text-ink-onDark",
  ghost: "bg-transparent text-brand",
  destructive: "bg-danger/10 text-danger",
};

export function Button({ variant = "primary", className = "", children, ...rest }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
