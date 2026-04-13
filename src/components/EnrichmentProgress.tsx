import {
  CheckCircle2,
  Loader2,
  Database,
  Globe,
  Shield,
  Search,
  Fingerprint,
  BarChart3,
  Cpu,
} from "lucide-react";
import type { EnrichmentProgress as ProgressType } from "@/services/enrichmentPipeline";

interface EnrichmentProgressProps {
  progress: ProgressType | null;
  isRunning: boolean;
  leadCount: number;
}

const STAGE_META: Record<string, { icon: React.ReactNode; color: string }> = {
  Clearbit:    { icon: <Database className="h-3.5 w-3.5" />,    color: "text-blue-500" },
  BuiltWith:   { icon: <Cpu className="h-3.5 w-3.5" />,         color: "text-violet-500" },
  Crunchbase:  { icon: <Globe className="h-3.5 w-3.5" />,       color: "text-emerald-500" },
  "Hunter.io": { icon: <Search className="h-3.5 w-3.5" />,      color: "text-orange-500" },
  RocketReach: { icon: <Fingerprint className="h-3.5 w-3.5" />, color: "text-pink-500" },
  ZeroBounce:  { icon: <Shield className="h-3.5 w-3.5" />,      color: "text-cyan-500" },
  Scoring:     { icon: <BarChart3 className="h-3.5 w-3.5" />,   color: "text-amber-500" },
};

const ALL_STAGES = ["Clearbit", "BuiltWith", "Crunchbase", "Hunter.io", "RocketReach", "ZeroBounce", "Scoring"];

export default function EnrichmentProgress({ progress, isRunning, leadCount }: EnrichmentProgressProps) {
  if (!isRunning && !progress) return null;

  const completed = progress?.completedStages || [];
  const pct = progress
    ? Math.round((completed.length / ALL_STAGES.length) * 100)
    : 0;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isRunning ? (
            <Loader2 className="h-4 w-4 text-brand-600 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {isRunning ? "Enriching Data from All APIs..." : "Enrichment Complete"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{leadCount} leads</span>
          <span>{completed.length}/{ALL_STAGES.length} APIs</span>
          <span className="font-bold text-brand-600">{pct}%</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stage indicators */}
      <div className="px-6 py-3 flex flex-wrap gap-2">
        {ALL_STAGES.map((stage) => {
          const meta = STAGE_META[stage] || { icon: <Database className="h-3.5 w-3.5" />, color: "text-gray-400" };
          const isDone = completed.includes(stage);
          const isActive = isRunning && progress?.stage?.includes(stage.split(".")[0]) && !isDone;
          const stagePct = isActive && progress ? Math.round((progress.current / progress.total) * 100) : 0;

          return (
            <div
              key={stage}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                isDone
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  : isActive
                  ? "bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 ring-1 ring-brand-300 dark:ring-brand-700"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : isActive ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span className={meta.color}>{meta.icon}</span>
              )}
              <span>{stage}</span>
              {isActive && <span className="text-[10px] opacity-70">{stagePct}%</span>}
            </div>
          );
        })}
      </div>

      {/* Current stage detail */}
      {isRunning && progress && (
        <div className="px-6 pb-3">
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
            <span>{progress.stage}</span>
            <span>{progress.current}/{progress.total}</span>
          </div>
          <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-300"
              style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
