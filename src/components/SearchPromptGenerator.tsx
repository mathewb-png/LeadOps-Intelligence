import { useMemo, useState, createContext, useContext } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { PersonaOutput, CampaignLocale, ExclusionWord, Lead } from "@/types";
import { buildSearchPrompt, SearchPromptFields } from "@/lib/buildSearchPrompt";

type CopyFormat = "comma" | "newline";
const CopyFormatCtx = createContext<CopyFormat>("comma");

function joinItems(items: string[], format: CopyFormat): string {
  return format === "comma" ? items.join(", ") : items.join("\n");
}

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
  const [copyFormat, setCopyFormat] = useState<CopyFormat>("comma");

  const fields: SearchPromptFields = useMemo(
    () => buildSearchPrompt(campaignGoal, persona, locale, activeExclusions, leads.length > 0 ? leads : undefined),
    [campaignGoal, persona, locale, activeExclusions, leads]
  );

  const totalTags =
    1 + fields.personTitles.length + fields.personLocations.length +
    fields.companyKeywords.length + fields.excludeTitles.length;

  return (
    <CopyFormatCtx.Provider value={copyFormat}>
    <div>
      {/* Format toggle + prompt char count */}
      <div className="px-5 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Copy each field into your lead search tool — {fields.prompt.length}/250 chars
        </p>
        <button
          onClick={() => setCopyFormat((f) => (f === "comma" ? "newline" : "comma"))}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          title={`Copy format: ${copyFormat === "comma" ? "comma-separated" : "one per line"}`}
        >
          {copyFormat === "comma" ? (
            <ToggleRight className="h-4 w-4 text-brand-600" />
          ) : (
            <ToggleLeft className="h-4 w-4 text-gray-400" />
          )}
          {copyFormat === "comma" ? "Comma" : "Lines"}
        </button>
      </div>

      {/* Condensed Prompt */}
      <div className="px-5 pb-4">
        <div className="relative">
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-gray-900 dark:bg-black px-4 py-3 pr-12 text-sm text-emerald-400 font-mono leading-relaxed">
            {fields.prompt}
          </pre>
          <CopyButton text={fields.prompt} className="absolute top-2 right-2" />
        </div>
      </div>

      {/* Live Preview */}
      <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-4 w-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Live Preview</h3>
          <span className="text-xs text-gray-400">{totalTags} tags</span>
        </div>

        <div className="space-y-2.5">
          <PreviewRow label="Company Job Title" items={[fields.companyJobTitle]} color="violet" />
          <PreviewRow label="Person Titles" items={fields.personTitles} color="violet" />
          <PreviewRow label="Person Locations" items={fields.personLocations} color="violet" />
          <PreviewRow label="Company Keywords" items={fields.companyKeywords} color="violet" />
          <PreviewRow label="Exclude Titles" items={fields.excludeTitles} color="red" />
        </div>
      </div>
    </div>
    </CopyFormatCtx.Provider>
  );
}

/* ── Live Preview Row ── */

function PreviewRow({
  label,
  items,
  color,
}: {
  label: string;
  items: string[];
  color: "violet" | "red";
}) {
  if (items.length === 0) return null;

  const borderColor = color === "red"
    ? "border-red-200 dark:border-red-800/50 bg-red-50/30 dark:bg-red-950/20"
    : "border-violet-200 dark:border-violet-800/50 bg-violet-50/30 dark:bg-violet-950/20";
  const tagColor = color === "red"
    ? "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300"
    : "bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300";
  const labelColor = color === "red"
    ? "text-red-600 dark:text-red-400"
    : "text-violet-600 dark:text-violet-400";

  const fmt = useContext(CopyFormatCtx);
  const copyText = joinItems(items, fmt);

  return (
    <div className={`flex flex-wrap items-center gap-1.5 rounded-lg border px-3 py-2 ${borderColor}`}>
      <span className={`text-[11px] font-semibold mr-1 shrink-0 ${labelColor}`}>{label}:</span>
      {items.map((item) => (
        <span
          key={item}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${tagColor}`}
        >
          {item}
          <span className="text-[9px] opacity-40">×</span>
        </span>
      ))}
      <CopyButton text={copyText} size="sm" className="ml-auto shrink-0" />
    </div>
  );
}

/* ── Copy Button ── */

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
