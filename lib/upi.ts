// UPI deep-link spec (informal, NPCI): upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=INR&tn=<note>&tr=<ref>
// Only pa is strictly required; everything else is best-effort merchant metadata.

export interface UpiPayee {
  pa: string; // payee VPA, e.g. "shop@okhdfcbank"
  pn?: string; // payee name
  am?: string; // amount, as a decimal string
  cu?: string; // currency, expected "INR"
  tn?: string; // transaction note
  mc?: string; // merchant category code
}

export class UpiParseError extends Error {}

/** A VPA is handle@bank-handle. Keep this permissive — banks mint many suffixes. */
const VPA_PATTERN = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-]{1,64}$/;

export function isValidVpa(vpa: string): boolean {
  return VPA_PATTERN.test(vpa.trim());
}

/**
 * Parses a scanned UPI QR payload (a upi://pay?... URI) into its fields.
 * Throws UpiParseError for anything that isn't a well-formed UPI intent —
 * callers should catch this and show a "not a UPI code" message rather
 * than a generic scan failure.
 */
export function parseUpiQr(raw: string): UpiPayee {
  const trimmed = raw.trim();
  if (!trimmed) throw new UpiParseError("Empty QR payload");

  let url: URL;
  try {
    // Some scanners hand back "upi://pay?..." others "UPI://PAY?..." — normalize scheme case only.
    const normalized = trimmed.replace(/^upi:\/\//i, "upi://");
    url = new URL(normalized);
  } catch {
    throw new UpiParseError("QR code is not a valid URI");
  }

  if (url.protocol.toLowerCase() !== "upi:") {
    throw new UpiParseError("QR code is not a UPI payment code");
  }

  const params = url.searchParams;
  const pa = params.get("pa");
  if (!pa || !isValidVpa(pa)) {
    throw new UpiParseError("QR code is missing a valid payee UPI ID");
  }

  const am = params.get("am") ?? undefined;
  if (am !== undefined && !isValidAmountString(am)) {
    // Malformed amount in the QR itself: drop it, let the user enter one instead of failing the scan.
    return {
      pa,
      pn: params.get("pn") ?? undefined,
      cu: params.get("cu") ?? undefined,
      tn: params.get("tn") ?? undefined,
      mc: params.get("mc") ?? undefined,
    };
  }

  return {
    pa,
    pn: params.get("pn") ?? undefined,
    am,
    cu: params.get("cu") ?? undefined,
    tn: params.get("tn") ?? undefined,
    mc: params.get("mc") ?? undefined,
  };
}

/** Accepts "120", "120.5", "120.50" — rejects negative, zero, NaN, and >2 decimal places. */
export function isValidAmountString(value: string): boolean {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return false;
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

/** Rounds to paise-safe 2 decimals as a plain string (avoids float drift like 10.1 -> "10.099999"). */
export function toAmountString(rupees: number): string {
  return (Math.round(rupees * 100) / 100).toFixed(2);
}

export interface BuildUpiLinkOptions {
  payeeVpa: string;
  payeeName?: string;
  amount: string; // decimal rupees, e.g. "250.00"
  note?: string;
  refId?: string; // used to distinguish installments in the payer's UPI app history
}

/** Builds a upi://pay deep link. Callers should validate amount/vpa before calling this. */
export function buildUpiLink(opts: BuildUpiLinkOptions): string {
  const params = new URLSearchParams();
  params.set("pa", opts.payeeVpa);
  if (opts.payeeName) params.set("pn", opts.payeeName);
  params.set("am", opts.amount);
  params.set("cu", "INR");
  if (opts.note) params.set("tn", opts.note);
  if (opts.refId) params.set("tr", opts.refId);
  return `upi://pay?${params.toString()}`;
}

/** True when the current environment is unlikely to be able to open a upi:// link (e.g. desktop browser). */
export function likelySupportsUpiIntents(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return /android|iphone|ipad|ipod/.test(ua);
}
