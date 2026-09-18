interface Props {
  total: number;
  statuses: ("pending" | "in_progress" | "paid" | "failed")[];
}

const dotColor: Record<Props["statuses"][number], string> = {
  pending: "bg-ink-faint/50",
  in_progress: "bg-brand/50",
  paid: "bg-brand",
  failed: "bg-danger",
};

export function ProgressDots({ total, statuses }: Props) {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${dotColor[statuses[i] ?? "pending"]}`}
        />
      ))}
    </div>
  );
}
