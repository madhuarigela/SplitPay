"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  const variantClass =
    variant === "primary"
      ? "sp-primary"
      : variant === "secondary"
        ? "sp-secondary-button"
        : variant === "destructive"
          ? "sp-danger-button"
          : "sp-ghost-button";

  return (
    <button
      type="button"
      className={`${variantClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
