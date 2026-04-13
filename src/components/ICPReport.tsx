import { useState, useMemo } from "react";
import {
  Target,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  BarChart3,
  Shield,
  Users,
} from "lucide-react";
import { Lead, CampaignLocale } from "@/types";
import {
  SCORING_RULES,
  ICP_INDUSTRIES,
  ICP_INCLUDE_TITLES,
  ICP_EXCLUDE_KEYWORDS,
  MANAGEMENT_LEVELS,
  LOCALIZED_EXCLUDE_KEYWORDS,
  SCORE_ACTION_MAP,
  getScoreReason,
  ScoringRule,
} from "@/lib/richardScoring";

interface ICPReportProps {
  leads: Lead[];
  campaignGoal: string;
  locale: CampaignLocale;
  onExport: () => void;
}

type Section = "scoring" | "include" | "exclude" | "mgmt" | "legend" | "applied";

export default function ICPReport({ leads, campaignGoal, locale, onExport }: ICPReportProps) {
  const localizedExcludes = LOCALIZED_EXCLUDE_KEYWORDS[locale.languageCode] || [];
  const [expanded, setExpanded] = useState<Set<Section>>(new Set(["applied", "legend"]));

  const toggle = (section: Section) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const appliedScoring = useMemo(() => {
    const titleMap = new Map<string, { score: number; reason: string; count: number }>();
    for (const lead of leads) {
      const existing = titleMap.get(lead.jobTitle);
      if (existing) {
        existing.count++;
      } else {
        titleMap.set(lead.jobTitle, {
          score: lead.richardScore,
          reason: getScoreReason(lead.jobTitle),
          count: 1,
        });
      }
    }
    return Array.from(titleMap.entries())
      .map(([title, data]) => ({ title, ...data }))
      .sort((a, b) => b.score - a.score);
  }, [leads]);

  const uniqueRules = useMemo(() => {
    const seen = new Set<string>();
    const deduped: ScoringRule[] = [];
    for (const rule of SCORING_RULES) {
      const key = `${rule.trigger}-${rule.score}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(rule);
      }
    }
    return deduped;
  }, []);

  const scoreColor = (score: number) => {
    if (score >= 9) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950";
    if (score >= 7) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950";
    if (score >= 4) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950";
    if (score >= 1) return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950";
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950">
            <Target className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              ICP Targeting Framework
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {locale.country} &middot; {locale.language}
              {campaignGoal ? ` — ${campaignGoal}` : ""}
            </p>
          </div>
        </div>
        <button onClick={onExport} className="btn-primary text-xs">
          <Download className="h-3.5 w-3.5" />
          Export XLSX
        </button>
      </div>

      {/* Summary Banner */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{ICP_INCLUDE_TITLES.length}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Include Titles</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{ICP_EXCLUDE_KEYWORDS.length + localizedExcludes.length}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Exclude Keywords</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{ICP_INDUSTRIES.length}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Target Industries</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{uniqueRules.length}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Scoring Rules</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">

        {/* Section: Applied Scoring (per lead) */}
        {leads.length > 0 && (
          <CollapsibleSection
            id="applied"
            title="Applied Title Scores"
            subtitle={`${appliedScoring.length} unique titles in your dataset`}
            icon={<BarChart3 className="h-4 w-4 text-emerald-600" />}
            expanded={expanded.has("applied")}
            onToggle={() => toggle("applied")}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Title</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400">Score</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Reason</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400">Leads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {appliedScoring.map((row) => (
                    <tr key={row.title}>
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-medium">{row.title}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold ${scoreColor(row.score)}`}>
                          {row.score}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{row.reason}</td>
                      <td className="px-3 py-2 text-center text-gray-500 dark:text-gray-400">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsibleSection>
        )}

        {/* Section: Score Legend */}
        <CollapsibleSection
          id="legend"
          title="Score Meaning & Action"
          subtitle="How to interpret and act on each score range"
          icon={<Shield className="h-4 w-4 text-blue-600" />}
          expanded={expanded.has("legend")}
          onToggle={() => toggle("legend")}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 w-20">Score</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Meaning</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 w-40">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {SCORE_ACTION_MAP.map((row) => (
                  <tr key={row.range}>
                    <td className="px-3 py-2.5 text-center">
                      <span className="inline-block rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-[11px] font-bold text-gray-900 dark:text-gray-100">
                        {row.range}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{row.meaning}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-gray-100">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* Section: Full Scoring Rules */}
        <CollapsibleSection
          id="scoring"
          title="Full Scoring Rules"
          subtitle={`${uniqueRules.length} trigger → score → reason rules`}
          icon={<BarChart3 className="h-4 w-4 text-violet-600" />}
          expanded={expanded.has("scoring")}
          onToggle={() => toggle("scoring")}
        >
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0">
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Trigger</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 w-16">Score</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {uniqueRules.map((rule, i) => (
                  <tr key={i}>
                    <td className="px-3 py-1.5 text-gray-900 dark:text-gray-100 font-mono">{rule.trigger}</td>
                    <td className="px-3 py-1.5 text-center">
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${scoreColor(rule.score)}`}>
                        {rule.score}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-gray-600 dark:text-gray-300">{rule.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* Section: Include Titles + Industries */}
        <CollapsibleSection
          id="include"
          title="Include Keywords"
          subtitle={`${ICP_INCLUDE_TITLES.length} titles × ${ICP_INDUSTRIES.length} industries`}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          expanded={expanded.has("include")}
          onToggle={() => toggle("include")}
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Titles</h4>
              <div className="flex flex-wrap gap-1.5">
                {ICP_INCLUDE_TITLES.map((title) => (
                  <span
                    key={title}
                    className="rounded-md bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Industries</h4>
              <div className="flex flex-wrap gap-1.5">
                {ICP_INDUSTRIES.map((ind) => (
                  <span
                    key={ind}
                    className="rounded-md bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-300"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Section: Exclude Keywords */}
        <CollapsibleSection
          id="exclude"
          title="Exclude Keywords"
          subtitle={`${ICP_EXCLUDE_KEYWORDS.length} English + ${localizedExcludes.length} ${locale.language} keywords`}
          icon={<XCircle className="h-4 w-4 text-red-500" />}
          expanded={expanded.has("exclude")}
          onToggle={() => toggle("exclude")}
        >
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">English</h4>
              <div className="flex flex-wrap gap-1.5">
                {ICP_EXCLUDE_KEYWORDS.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-md bg-red-50 dark:bg-red-950 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:text-red-300"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            {localizedExcludes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{locale.language}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {localizedExcludes.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-orange-50 dark:bg-orange-950 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:text-orange-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Section: Management Levels */}
        <CollapsibleSection
          id="mgmt"
          title="Management Level Filter"
          subtitle="Which seniority levels to include and their priority"
          icon={<Users className="h-4 w-4 text-indigo-600" />}
          expanded={expanded.has("mgmt")}
          onToggle={() => toggle("mgmt")}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Level</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400">Include</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400">Priority</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {MANAGEMENT_LEVELS.map((level) => (
                  <tr key={level.level}>
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">{level.level}</td>
                    <td className="px-3 py-2 text-center">
                      {level.include ? (
                        <CheckCircle2 className="inline h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="inline h-4 w-4 text-red-500" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          level.priority === "High"
                            ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {level.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{level.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function CollapsibleSection({
  id: _id,
  title,
  subtitle,
  icon,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {icon}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
        )}
      </button>
      {expanded && <div className="px-6 pb-4">{children}</div>}
    </div>
  );
}
