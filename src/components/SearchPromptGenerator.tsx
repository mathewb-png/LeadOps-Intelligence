import { useMemo, useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  MapPin,
  Briefcase,
  XCircle,
  Building2,
  Users,
} from "lucide-react";
import { PersonaOutput, CampaignLocale, ExclusionWord, Lead } from "@/types";
import { buildSearchPrompt, SearchPromptFields } from "@/lib/buildSearchPrompt";

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
    <div className="card overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
          <Sparkles className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Search Prompt
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Copy this into your lead search tool — {fields.prompt.length}/250 chars
          </p>
        </div>
      </div>

      {/* Condensed Prompt */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-gray-900 dark:bg-black px-4 py-3 pr-12 text-sm text-emerald-400 font-mono leading-relaxed">
            {fields.prompt}
          </pre>
          <CopyButton text={fields.prompt} className="absolute top-2 right-2" />
        </div>
      </div>

      {/* Structured Fields */}
      <div className="px-6 py-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FieldCard
          icon={<Briefcase className="h-3.5 w-3.5" />}
          label="Job Titles"
          items={fields.jobTitles}
          color="brand"
        />
        <FieldCard
          icon={<MapPin className="h-3.5 w-3.5" />}
          label="Locations"
          items={fields.locations}
          color="blue"
        />
        <FieldCard
          icon={<Building2 className="h-3.5 w-3.5" />}
          label="Company Keywords"
          items={fields.companyKeywords}
          color="emerald"
        />
        <FieldCard
          icon={<Users className="h-3.5 w-3.5" />}
          label="Seniority"
          items={fields.seniority}
          color="violet"
        />
        <FieldCard
          icon={<XCircle className="h-3.5 w-3.5" />}
          label="Exclude Titles"
          items={fields.excludeTitles}
          color="red"
        />
      </div>
    </div>
  );
}

const COLOR_MAP: Record<string, { tag: string; header: string }> = {
  brand: {
    tag: "bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 ring-brand-200 dark:ring-brand-800",
    header: "text-brand-700 dark:text-brand-300",
  },
  blue: {
    tag: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-800",
    header: "text-blue-700 dark:text-blue-300",
  },
  emerald: {
    tag: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-800",
    header: "text-emerald-700 dark:text-emerald-300",
  },
  violet: {
    tag: "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 ring-violet-200 dark:ring-violet-800",
    header: "text-violet-700 dark:text-violet-300",
  },
  red: {
    tag: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 ring-red-200 dark:ring-red-800",
    header: "text-red-700 dark:text-red-300",
  },
};

function FieldCard({
  icon,
  label,
  items,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  color: string;
}) {
  const colors = COLOR_MAP[color] || COLOR_MAP.brand;
  const copyText = items.join(", ");

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className={`flex items-center gap-1.5 text-xs font-semibold ${colors.header}`}>
            {icon} {label}
          </span>
        </div>
        <p className="text-[11px] text-gray-400">None</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${colors.header}`}>
          {icon} {label}
          <span className="text-[10px] font-normal text-gray-400">({items.length})</span>
        </span>
        <CopyButton text={copyText} size="sm" />
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${colors.tag}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function CopyButton({
  text,
  className = "",
  size = "md",
}: {
  text: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClass = size === "sm" ? "p-1" : "p-1.5";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <button
      onClick={handleCopy}
      className={`rounded-md ${sizeClass} transition-colors ${
        copied
          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600"
          : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      } ${className}`}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <Check className={iconSize} /> : <Copy className={iconSize} />}
    </button>
  );
}
