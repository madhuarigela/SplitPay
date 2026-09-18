interface Props {
  rupees: number;
  size?: "lg" | "xl";
  label?: string;
}

export function AmountDisplay({ rupees, size = "xl", label }: Props) {
  const [whole, decimal] = rupees.toFixed(2).split(".");
  return (
    <div className="text-center">
      {label && (
        <div className="text-[15px] text-ink-soft dark:text-ink-onDarkSoft mb-1">
          {label}
        </div>
      )}
      <div
        className={
          size === "xl"
            ? "text-[56px] leading-none font-semibold tracking-tight"
            : "text-[34px] leading-none font-semibold tracking-tight"
        }
      >
        <span className="text-[0.55em] align-top mr-1 text-ink-soft dark:text-ink-onDarkSoft">
          ₹
        </span>
        {Number(whole).toLocaleString("en-IN")}
        <span className="text-[0.5em] text-ink-soft dark:text-ink-onDarkSoft">.{decimal}</span>
      </div>
    </div>
  );
}
