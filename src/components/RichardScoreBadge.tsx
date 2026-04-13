interface RichardScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function RichardScoreBadge({ score, size = "md" }: RichardScoreBadgeProps) {
  const color =
    score >= 9
      ? "bg-emerald-500 text-white ring-emerald-400"
      : score >= 7
        ? "bg-blue-500 text-white ring-blue-400"
        : score >= 4
          ? "bg-amber-500 text-white ring-amber-400"
          : score >= 1
            ? "bg-orange-500 text-white ring-orange-400"
            : "bg-red-500 text-white ring-red-400";

  const sizeClass =
    size === "sm"
      ? "h-6 w-6 text-[10px]"
      : size === "lg"
        ? "h-10 w-10 text-base"
        : "h-8 w-8 text-xs";

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold ring-2 ring-offset-1 dark:ring-offset-gray-900 ${color} ${sizeClass}`}
      title={`Richard Score: ${score}/10`}
    >
      {score}
    </div>
  );
}
