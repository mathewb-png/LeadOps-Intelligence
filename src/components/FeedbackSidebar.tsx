import {
  Filter,
  Plus,
  X,
  AlertTriangle,
  Zap,
  Trophy,
  Sparkles,
  ShieldCheck,
  Upload,
  Send,
} from "lucide-react";
import { Lead, BatchValueBreakdown, RefinementSuggestion, ExclusionWord } from "@/types";
import { computeBatchValue, extractRefinementSuggestions } from "@/lib/richardScoring";

interface FeedbackSidebarProps {
  leads: Lead[];
  exclusions: ExclusionWord[];
  onAddExclusion: (word: string, fromTitles: string[]) => void;
  onRemoveExclusion: (word: string) => void;
}

export default function FeedbackSidebar({
  leads,
  exclusions,
  onAddExclusion,
  onRemoveExclusion,
}: FeedbackSidebarProps) {
  const batch = computeBatchValue(leads);
  const suggestions = extractRefinementSuggestions(leads);

  return (
    <div className="space-y-5">
      <BatchValueCard batch={batch} totalLeads={leads.length} />
      <EnrichmentStatsCard leads={leads} />
      <SuggestedExclusionsCard
        suggestions={suggestions}
        exclusions={exclusions}
        onAddExclusion={onAddExclusion}
      />
      <ActiveExclusionsCard exclusions={exclusions} onRemove={onRemoveExclusion} />
    </div>
  );
}

function EnrichmentStatsCard({ leads }: { leads: Lead[] }) {
  const enriched = leads.filter((l) => l.enriched).length;
  const verified = leads.filter((l) => l.emailStatus).length;
  const validEmails = leads.filter((l) => l.emailStatus === "valid").length;
  const crmSynced = leads.filter((l) => l.crmContactId).length;
  const outreachQueued = leads.filter((l) => l.outreachStatus === "queued" || l.outreachStatus === "sent").length;
  const withTech = leads.filter((l) => l.techStack && l.techStack.length > 0).length;

  const stats = [
    { icon: Sparkles, label: "Enriched", value: enriched, total: leads.length, color: "text-brand-600" },
    { icon: ShieldCheck, label: "Verified", value: verified, total: leads.length, color: "text-emerald-600", sub: `${validEmails} valid` },
    { icon: Upload, label: "CRM Synced", value: crmSynced, total: leads.length, color: "text-orange-600" },
    { icon: Send, label: "In Outreach", value: outreachQueued, total: leads.length, color: "text-blue-600" },
  ];

  if (enriched === 0 && verified === 0 && crmSynced === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Pipeline Progress
      </h3>
      <div className="space-y-2.5">
        {stats
          .filter((s) => s.value > 0)
          .map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{s.label}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {s.value}/{s.total} {s.sub ? `(${s.sub})` : ""}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-1.5 rounded-full bg-brand-500 transition-all"
                    style={{ width: `${s.total > 0 ? (s.value / s.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        {withTech > 0 && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 pt-1">
            {withTech} leads with tech stack data
          </p>
        )}
      </div>
    </div>
  );
}

function BatchValueCard({ batch, totalLeads }: { batch: BatchValueBreakdown; totalLeads: number }) {
  const rows = [
    { label: "Primary (9-10)",     emoji: "🟢", count: batch.score9to10.count, pts: batch.score9to10.points, per: 10 },
    { label: "Stakeholder (7-8)",  emoji: "🔵", count: batch.score7to8.count,  pts: batch.score7to8.points,  per: 8 },
    { label: "Influence (4-6)",    emoji: "🟡", count: batch.score4to6.count,  pts: batch.score4to6.points,  per: 5 },
    { label: "Peripheral (1-3)",   emoji: "🟠", count: batch.score1to3.count,  pts: batch.score1to3.points,  per: 2 },
    { label: "Irrelevant (0)",     emoji: "🔴", count: batch.score0.count,     pts: batch.score0.points,     per: 0 },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-5 py-3.5 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950 dark:to-amber-900/30">
        <Trophy className="h-5 w-5 text-amber-600" />
        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          Total Batch Value
        </h3>
        <span className="ml-auto text-xl font-bold text-amber-700 dark:text-amber-300">
          {batch.total} pts
        </span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-5 py-2.5 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {row.emoji} {row.label}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                {row.count} × {row.per}pt
              </span>
              <span className="w-12 text-right font-semibold text-gray-900 dark:text-gray-100">
                {row.pts}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{totalLeads} total leads</span>
        <span>Avg: {totalLeads > 0 ? (batch.total / totalLeads).toFixed(1) : 0} pts/lead</span>
      </div>
    </div>
  );
}

function SuggestedExclusionsCard({
  suggestions,
  exclusions,
  onAddExclusion,
}: {
  suggestions: RefinementSuggestion[];
  exclusions: ExclusionWord[];
  onAddExclusion: (word: string, fromTitles: string[]) => void;
}) {
  const activeWords = new Set(exclusions.filter((e) => e.active).map((e) => e.word));
  const filtered = suggestions.filter((s) => !activeWords.has(s.word));

  if (filtered.length === 0) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Suggested Exclusions
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No new exclusions to suggest. Low-scoring title keywords will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-5 py-3.5">
        <AlertTriangle className="h-4 w-4 text-orange-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Suggested Exclusions
        </h3>
      </div>
      <p className="px-5 pt-3 text-xs text-gray-500 dark:text-gray-400">
        Words found in low-scoring leads. Add them to filter out noise in future searches.
      </p>
      <div className="p-4 flex flex-wrap gap-2">
        {filtered.map((s) => (
          <button
            key={s.word}
            onClick={() => onAddExclusion(s.word, s.fromTitles)}
            className="group flex items-center gap-1.5 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950 px-2.5 py-1.5 text-xs font-medium text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
            title={`Found in: ${s.fromTitles.join(", ")}`}
          >
            <Plus className="h-3 w-3 opacity-60 group-hover:opacity-100" />
            {s.word}
            <span className="rounded bg-orange-200 dark:bg-orange-800 px-1 py-px text-[10px] font-bold text-orange-800 dark:text-orange-200">
              {s.occurrences}×
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActiveExclusionsCard({
  exclusions,
  onRemove,
}: {
  exclusions: ExclusionWord[];
  onRemove: (word: string) => void;
}) {
  const active = exclusions.filter((e) => e.active);

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Active Exclusions
        </h3>
        <span className="ml-auto text-xs text-gray-400">{active.length} active</span>
      </div>
      {active.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No exclusions active yet. Add suggested words above to refine future searches.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {active.map((exc) => (
            <span
              key={exc.word}
              className="group inline-flex items-center gap-1 rounded-md bg-red-50 dark:bg-red-950 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-200 dark:ring-red-800"
            >
              {exc.word}
              <button
                onClick={() => onRemove(exc.word)}
                className="rounded p-0.5 opacity-50 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
