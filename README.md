# SplitPay

Mobile-first UPI bill-splitting PWA. Scan a UPI QR (or type a UPI ID), pick an
amount, split it into installments, and pay each part through your own UPI
app — one deep link at a time, with explicit confirmation after each one.

No backend, no auth, no database, no analytics. Everything lives in
`localStorage` on the device for the duration of a split.

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm run build && npm start   # production
npm test          # vitest — lib/ unit tests
```

## Architecture

- `lib/upi.ts` — parses `upi://pay?...` QR payloads, validates VPAs/amounts,
  builds outgoing deep links. Pure functions, fully unit tested.
- `lib/split.ts` — paise-safe equal split of a total across N installments
  (integer-paise math, no float drift; leftover paise go to the first parts).
- `store/usePaymentStore.ts` — Zustand store, persisted to `localStorage`, is
  the single source of truth for the flow: which screen is active, the payee,
  the installment queue, and each installment's status/attempt count.
- `components/screens/*` — one component per step (Home → Scan → Amount →
  Split → Review → Pay → Complete). `app/page.tsx` just switches on
  `screen` from the store.
- `components/QrScanner.tsx` — thin wrapper around `html5-qrcode`, mapped
  onto distinct error states (camera denied, no camera, generic failure)
  rather than one generic "scan failed."

## Payment confirmation model

A client-only PWA has no way to know whether a UPI deep link actually
completed a payment — there's no backend to receive a callback. Rather than
guess or auto-advance, the Pay screen always requires an explicit tap:
**"I've paid this part"** or **"Payment didn't go through."** Marking a part
failed sends it back to the queue so it can be retried (capped at 3 attempts
per part) without losing the rest of the session.

## Known gaps to fill before shipping

- `public/icons/*.png` are referenced by `manifest.json` but not included —
  drop in real 192/512/512-maskable icons.
- `COFFEE_VPA` in `components/screens/HomeScreen.tsx` is a placeholder VPA.
- No real device testing of the `html5-qrcode` camera flow was possible in
  this environment — the QR parsing/validation logic is unit tested, but the
  live camera path should be checked on an actual Android/iOS UPI app pairing
  before release.
