import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-emerald-600"
      : changeType === "negative"
        ? "text-red-600"
        : "text-gray-500";

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs font-medium ${changeColor}`}>{change}</p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
