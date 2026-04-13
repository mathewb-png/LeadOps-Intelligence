import { LeadTier } from "@/types";
import { tierLabel, tierColor } from "@/lib/richardScoring";

interface TierBadgeProps {
  tier: LeadTier;
}

export default function TierBadge({ tier }: TierBadgeProps) {
  const c = tierColor(tier);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${c.bg} ${c.text} ${c.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {tierLabel(tier).split(" (")[0]}
    </span>
  );
}
