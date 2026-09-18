"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onDecoded: (rawText: string) => void;
  onError: (message: string) => void;
}

const ELEMENT_ID = "splitpay-qr-region";

export function QrScanner({ onDecoded, onError }: Props) {
  const scannerRef =
    useRef<import("html5-qrcode").Html5Qrcode | null>(null);

  const decodedRef = useRef(false);
  const stoppingRef = useRef(false);

  const [status, setStatus] = useState<
    "starting" | "running" | "denied" | "unsupported"
  >("starting");

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      if (
        typeof window === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setStatus("unsupported");
        onError("Camera scanning isn't supported in this browser.");
        return;
      }

      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        if (cancelled) return;

        const scanner = new Html5Qrcode(ELEMENT_ID, false);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            if (decodedRef.current || stoppingRef.current || cancelled) {
              return;
            }

            decodedRef.current = true;
            stoppingRef.current = true;

            try {
              await scanner.stop();
            } catch {}

            if (!cancelled) {
              scannerRef.current = null;
              onDecoded(decodedText);
            }
          },
          () => {}
        );

        if (!cancelled) {
          setStatus("running");
        }
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof Error ? err.message : String(err);

        if (/permission|denied|NotAllowed/i.test(message)) {
          setStatus("denied");
          onError(
            "Camera access was denied. Allow camera access or enter the UPI ID manually."
          );
        } else if (/NotFoundError|no camera/i.test(message)) {
          setStatus("unsupported");
          onError("No camera was found on this device.");
        } else {
          setStatus("unsupported");
          onError(
            "Couldn't start the camera. Try again or enter the UPI ID manually."
          );
        }
      }
    }

    startScanner();

    return () => {
      cancelled = true;

      const scanner = scannerRef.current;

      if (scanner && !stoppingRef.current) {
        stoppingRef.current = true;

        scanner
          .stop()
          .catch(() => {})
          .finally(() => {
            scannerRef.current = null;
          });
      }
    };
  }, [onDecoded, onError]);

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
