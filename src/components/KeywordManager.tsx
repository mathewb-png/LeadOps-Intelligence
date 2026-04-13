import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Plus,
  X,
  AlertTriangle,
  Globe,
  Search,
} from "lucide-react";
import { Lead, ExclusionWord, CampaignLocale } from "@/types";
import {
  ICP_INCLUDE_TITLES,
  ICP_INDUSTRIES,
  ICP_EXCLUDE_KEYWORDS,
  LOCALIZED_EXCLUDE_KEYWORDS,
  extractRefinementSuggestions,
} from "@/lib/richardScoring";

interface KeywordManagerProps {
  leads: Lead[];
  locale: CampaignLocale;
  exclusions: ExclusionWord[];
  onAddExclusion: (word: string, fromTitles: string[]) => void;
  onRemoveExclusion: (word: string) => void;
}

export default function KeywordManager({
  leads,
  locale,
  exclusions,
  onAddExclusion,
  onRemoveExclusion,
}: KeywordManagerProps) {
  const [filter, setFilter] = useState("");
  const localizedExcludes = LOCALIZED_EXCLUDE_KEYWORDS[locale.languageCode] || [];
  const suggestions = extractRefinementSuggestions(leads);
  const activeWords = new Set(exclusions.filter((e) => e.active).map((e) => e.word));
  const newSuggestions = suggestions.filter((s) => !activeWords.has(s.word));

  const lc = filter.toLowerCase();
  const filteredInclude = filter ? ICP_INCLUDE_TITLES.filter((t) => t.toLowerCase().includes(lc)) : ICP_INCLUDE_TITLES;
  const filteredIndustries = filter ? ICP_INDUSTRIES.filter((t) => t.toLowerCase().includes(lc)) : ICP_INDUSTRIES;
  const filteredExcludeEn = filter ? ICP_EXCLUDE_KEYWORDS.filter((t) => t.toLowerCase().includes(lc)) : ICP_EXCLUDE_KEYWORDS;
  const filteredExcludeLocal = filter ? localizedExcludes.filter((t) => t.toLowerCase().includes(lc)) : localizedExcludes;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter keywords..."
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ── Include Titles ── */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-5 py-3 bg-emerald-50/50 dark:bg-emerald-950/30">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Include Titles
            </h3>
            <span className="ml-auto text-xs text-emerald-600/70 dark:text-emerald-400/70">
              {filteredInclude.length} titles
            </span>
          </div>
          <div className="p-4 flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
            {filteredInclude.map((title) => (
              <span
                key={title}
                className="rounded-md bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-800"
              >
                {title}
              </span>
            ))}
            {filteredInclude.length === 0 && (
              <p className="text-xs text-gray-400">No matching include titles.</p>
            )}
          </div>
        </div>

        {/* ── Target Industries ── */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-5 py-3 bg-blue-50/50 dark:bg-blue-950/30">
            <Globe className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
              Target Industries
            </h3>
            <span className="ml-auto text-xs text-blue-600/70 dark:text-blue-400/70">
              {filteredIndustries.length} industries
            </span>
          </div>
          <div className="p-4 flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
            {filteredIndustries.map((ind) => (
              <span
                key={ind}
                className="rounded-md bg-blue-50 dark:bg-blue-950 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-200 dark:ring-blue-800"
              >
                {ind}
              </span>
            ))}
            {filteredIndustries.length === 0 && (
              <p className="text-xs text-gray-400">No matching industries.</p>
            )}
          </div>
        </div>

        {/* ── Exclude Keywords (English) ── */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-5 py-3 bg-red-50/50 dark:bg-red-950/30">
            <XCircle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Exclude Keywords — English
            </h3>
            <span className="ml-auto text-xs text-red-500/70 dark:text-red-400/70">
              {filteredExcludeEn.length} keywords
            </span>
          </div>
          <div className="p-4 flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
            {filteredExcludeEn.map((kw) => (
              <span
                key={kw}
                className="rounded-md bg-red-50 dark:bg-red-950 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-200 dark:ring-red-800"
              >
                {kw}
              </span>
            ))}
            {filteredExcludeEn.length === 0 && (
              <p className="text-xs text-gray-400">No matching exclude keywords.</p>
            )}
          </div>
        </div>

        {/* ── Exclude Keywords (Localized) ── */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-5 py-3 bg-orange-50/50 dark:bg-orange-950/30">
            <XCircle className="h-4 w-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-300">
              Exclude Keywords — {locale.language}
            </h3>
            <span className="ml-auto text-xs text-orange-500/70 dark:text-orange-400/70">
              {filteredExcludeLocal.length} keywords
            </span>
          </div>
          <div className="p-4 flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
            {filteredExcludeLocal.length > 0 ? (
              filteredExcludeLocal.map((kw) => (
                <span
                  key={kw}
                  className="rounded-md bg-orange-50 dark:bg-orange-950 px-2.5 py-1 text-xs font-medium text-orange-700 dark:text-orange-300 ring-1 ring-inset ring-orange-200 dark:ring-orange-800"
                >
                  {kw}
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-400">
                {localizedExcludes.length === 0
                  ? `No localized exclude keywords for ${locale.language}.`
                  : "No matching keywords."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Suggested Exclusions from leads ── */}
      {newSuggestions.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-5 py-3 bg-amber-50/50 dark:bg-amber-950/30">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Suggested Exclusions
            </h3>
            <span className="ml-auto text-xs text-amber-600/70 dark:text-amber-400/70">
              {newSuggestions.length} suggestions from low-scoring leads
            </span>
          </div>
          <div className="p-4 flex flex-wrap gap-2">
            {newSuggestions.map((s) => (
              <button
                key={s.word}
                onClick={() => onAddExclusion(s.word, s.fromTitles)}
                className="group flex items-center gap-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
                title={`Found in: ${s.fromTitles.join(", ")}`}
              >
                <Plus className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                {s.word}
                <span className="rounded bg-amber-200 dark:bg-amber-800 px-1.5 py-px text-[10px] font-bold text-amber-800 dark:text-amber-200">
                  {s.occurrences}×
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Exclusions ── */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-5 py-3 bg-violet-50/50 dark:bg-violet-950/30">
          <XCircle className="h-4 w-4 text-violet-600" />
          <h3 className="text-sm font-semibold text-violet-800 dark:text-violet-300">
            Active Exclusions
          </h3>
          <span className="ml-auto text-xs text-violet-600/70 dark:text-violet-400/70">
            {exclusions.filter((e) => e.active).length} active
          </span>
        </div>
        <div className="p-4">
          {exclusions.filter((e) => e.active).length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No exclusions active. Add suggested words above or from the Lead Data sidebar to filter noise.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {exclusions
                .filter((e) => e.active)
                .map((exc) => (
                  <span
                    key={exc.word}
                    className="group inline-flex items-center gap-1.5 rounded-lg bg-violet-50 dark:bg-violet-950 px-3 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 ring-1 ring-inset ring-violet-200 dark:ring-violet-800"
                  >
                    {exc.word}
                    <button
                      onClick={() => onRemoveExclusion(exc.word)}
                      className="rounded p-0.5 opacity-50 hover:opacity-100 hover:bg-violet-100 dark:hover:bg-violet-900 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
