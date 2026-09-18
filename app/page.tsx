"use client";

import { usePaymentStore } from "@/store/usePaymentStore";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { ScanScreen } from "@/components/screens/ScanScreen";
import { AmountScreen } from "@/components/screens/AmountScreen";
import { SplitScreen } from "@/components/screens/SplitScreen";
import { ReviewScreen } from "@/components/screens/ReviewScreen";
import { PayScreen } from "@/components/screens/PayScreen";
import { CompleteScreen } from "@/components/screens/CompleteScreen";

export default function Page() {
  const screen = usePaymentStore((s) => s.screen);

  return (
    <main key={screen} className="animate-sheet-in">
      {screen === "home" && <HomeScreen />}
      {screen === "scan" && <ScanScreen />}
      {screen === "amount" && <AmountScreen />}
      {screen === "split" && <SplitScreen />}
      {screen === "review" && <ReviewScreen />}
      {screen === "pay" && <PayScreen />}
      {screen === "complete" && <CompleteScreen />}
    </main>
  );
}
