interface LeadScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function LeadScoreBadge({ score, size = "md" }: LeadScoreBadgeProps) {
  const color =
    score >= 80
      ? "bg-emerald-100 text-emerald-800 ring-emerald-500/30"
      : score >= 60
        ? "bg-amber-100 text-amber-800 ring-amber-500/30"
        : "bg-red-100 text-red-800 ring-red-500/30";

  const sizeClass =
    size === "sm"
      ? "h-7 w-7 text-xs"
      : size === "lg"
        ? "h-12 w-12 text-lg"
        : "h-9 w-9 text-sm";

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold ring-2 ${color} ${sizeClass}`}
    >
      {score}
    </div>
  );
}
