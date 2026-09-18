"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onDecoded: (rawText: string) => void;
  onError: (message: string) => void;
}

const ELEMENT_ID = "splitpay-qr-region";

export function QrScanner({ onDecoded, onError }: Props) {
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const [status, setStatus] = useState<"starting" | "running" | "denied" | "unsupported">(
    "starting"
  );

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        onError("Camera scanning isn't supported in this browser.");
        return;
      }

      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;

      const scanner = new Html5Qrcode(ELEMENT_ID, /* verbose */ false);
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // Stop on first successful decode — this is a one-shot scan, not a live feed.
            scanner
              .stop()
              .catch(() => {})
              .finally(() => onDecoded(decodedText));
          },
          () => {
            // Per-frame decode misses are expected and noisy; ignore them.
          }
        );
        if (!cancelled) setStatus("running");
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        if (/permission|denied|NotAllowed/i.test(message)) {
          setStatus("denied");
          onError("Camera access was denied. Allow camera access or enter the UPI ID manually.");
        } else if (/NotFoundError|no camera/i.test(message)) {
          setStatus("unsupported");
          onError("No camera was found on this device.");
        } else {
          setStatus("unsupported");
          onError("Couldn't start the camera. Try again or enter the UPI ID manually.");
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <div
        id={ELEMENT_ID}
        className="mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-xl3 bg-black"
      />
      {status === "starting" && (
        <p className="mt-4 text-center text-[15px] text-ink-soft dark:text-ink-onDarkSoft">
          Starting camera…
        </p>
      )}
    </div>
  );
}
