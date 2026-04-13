import { useMemo, useState } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import { PersonaOutput, CampaignLocale, ExclusionWord, Lead } from "@/types";
import { buildSearchPrompt, SearchPromptFields, SmartExclusions } from "@/lib/buildSearchPrompt";

interface SearchPromptGeneratorProps {
  campaignGoal: string;
  persona: PersonaOutput;
  locale: CampaignLocale;
  exclusions: ExclusionWord[];
  leads: Lead[];
}

export default function SearchPromptGenerator({
  campaignGoal,
  persona,
  locale,
  exclusions,
  leads,
}: SearchPromptGeneratorProps) {
  const activeExclusions = exclusions.filter((e) => e.active).map((e) => e.word);

  const fields: SearchPromptFields = useMemo(
    () => buildSearchPrompt(campaignGoal, persona, locale, activeExclusions, leads.length > 0 ? leads : undefined),
    [campaignGoal, persona, locale, activeExclusions, leads]
  );

  return (
    <div className="space-y-4">
      {/* Condensed Prompt */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">
          Full Prompt — {fields.prompt.length}/250 chars
        </p>
        <div className="relative">
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-gray-900 dark:bg-black px-4 py-3 pr-12 text-sm text-emerald-400 font-mono leading-relaxed">
            {fields.prompt}
          </pre>
          <CopyBtn value={fields.prompt} className="absolute top-2 right-2" />
        </div>
      </div>

      {/* Persona Fields — mirrors external tool */}
      <div className="px-5 pb-5 space-y-3">
        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Persona Filter Fields
        </p>

        <CopyRow label="Job Titles" items={fields.jobTitles} color="brand" />
        <ExcludeSection data={fields.excludeJobTitles} />
        <CopyRow label="Locations" items={fields.locations} color="blue" />
        {fields.excludeLocations.length > 0 && (
          <CopyRow label="Exclude Locations" items={fields.excludeLocations} color="red" />
        )}
        <CopyRow label="Company Keywords" items={fields.companyKeywords} color="emerald" />

        {/* Seniority — exact values matching external tool */}
        <SeniorityRow active={fields.seniority} />
      </div>
    </div>
  );
}

/* ── Copy Row — label + comma string + copy button ── */

const ROW_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  brand:   { bg: "bg-brand-50/50 dark:bg-brand-950/30",   text: "text-brand-700 dark:text-brand-300",   border: "border-brand-200 dark:border-brand-800" },
  red:     { bg: "bg-red-50/50 dark:bg-red-950/30",       text: "text-red-600 dark:text-red-400",       border: "border-red-200 dark:border-red-800" },
  blue:    { bg: "bg-blue-50/50 dark:bg-blue-950/30",     text: "text-blue-700 dark:text-blue-300",     border: "border-blue-200 dark:border-blue-800" },
  emerald: { bg: "bg-emerald-50/50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
};

function CopyRow({ label, items, color }: { label: string; items: string[]; color: string }) {
  const c = ROW_COLORS[color] || ROW_COLORS.brand;
  const commaStr = items.join(", ");

  if (items.length === 0) return null;

  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} px-4 py-3`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-semibold ${c.text}`}>
          {label}
          <span className="ml-1.5 text-[10px] font-normal text-gray-400">({items.length})</span>
        </span>
        <CopyBtn value={commaStr} />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed break-words">
        {commaStr}
      </p>
    </div>
  );
}

/* ── Seniority Row — chip selector matching external tool ── */

const ALL_SENIORITY = [
  "c_suite", "vp", "director", "manager", "senior",
  "entry", "founder", "head", "owner", "intern", "partner",
];

function SeniorityRow({ active }: { active: string[] }) {
  const commaStr = active.join(", ");

  return (
    <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/30 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
          Seniority
          <span className="ml-1.5 text-[10px] font-normal text-gray-400">({active.length})</span>
        </span>
        {active.length > 0 && <CopyBtn value={commaStr} />}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ALL_SENIORITY.map((s) => {
          const isActive = active.includes(s);
          return (
            <span
              key={s}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                isActive
                  ? "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200 ring-1 ring-violet-300 dark:ring-violet-700"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
              }`}
            >
              {s}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── Exclude Job Titles — smart categorized ── */

function ExcludeSection({ data }: { data: SmartExclusions }) {
  const [expanded, setExpanded] = useState(false);
  const commaStr = data.allKeywords.join(", ");

  if (data.totalCount === 0) return null;

  return (
    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30">
      {/* Header — always visible, copy all */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
            Exclude Job Titles
          </span>
          <span className="text-[10px] font-normal text-gray-400">
            ({data.totalCount}) — {data.categories.length} categories
          </span>
        </div>
        <div className="flex items-center gap-1">
          <CopyBtn value={commaStr} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            title={expanded ? "Collapse categories" : "Show categories"}
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Comma string — always visible */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed break-words line-clamp-3">
          {commaStr}
        </p>
      </div>

      {/* Expanded — show by category with individual copy */}
      {expanded && (
        <div className="border-t border-red-200 dark:border-red-800 px-4 py-3 space-y-2.5">
          {data.categories.map((cat) => (
            <div key={cat.id} className="rounded-md bg-red-100/50 dark:bg-red-900/20 px-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-red-700 dark:text-red-300">
                  {cat.label}
                  <span className="ml-1 text-[10px] font-normal text-gray-400">({cat.keywords.length})</span>
                </span>
                <CopyBtn value={cat.keywords.join(", ")} />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {cat.keywords.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Copy Button ── */

function CopyBtn({ value, className = "" }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`rounded-md p-1 transition-colors ${
        copied
          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600"
          : "bg-white/60 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      } ${className}`}
      title={copied ? "Copied!" : "Copy comma list"}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
