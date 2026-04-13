import { Users, Crown, Shield, Eye, Search, Loader2 } from "lucide-react";
import { PersonaOutput } from "@/types";

interface PersonaArchitectProps {
  persona: PersonaOutput | null;
  onFetchLeads: () => void;
  fetchingLeads: boolean;
}

export default function PersonaArchitect({ persona, onFetchLeads, fetchingLeads }: PersonaArchitectProps) {
  if (!persona) return null;

  return (
    <div className="card overflow-hidden animate-in">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-brand-600" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Generated Persona
          </h2>
        </div>
        <button
          onClick={onFetchLeads}
          disabled={fetchingLeads}
          className="btn-primary"
        >
          {fetchingLeads ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching Leads...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Fetch Leads from Apollo
            </>
          )}
        </button>
      </div>

      <div className="p-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <TierBlock
            icon={Crown}
            label="Tier 1 — Primary Targets"
            color="text-emerald-600"
            bg="bg-emerald-50 dark:bg-emerald-950"
            titles={persona.tier1Titles}
          />
          <TierBlock
            icon={Shield}
            label="Tier 2 — Stakeholders"
            color="text-blue-600"
            bg="bg-blue-50 dark:bg-blue-950"
            titles={persona.tier2Titles}
          />
          <TierBlock
            icon={Eye}
            label="Tier 3 — Influencers"
            color="text-amber-600"
            bg="bg-amber-50 dark:bg-amber-950"
            titles={persona.tier3Titles}
          />
        </div>

        <div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Industry Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {persona.industryKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-lg bg-brand-50 dark:bg-brand-950 px-3 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300 ring-1 ring-inset ring-brand-500/20"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TierBlock({
  icon: Icon,
  label,
  color,
  bg,
  titles,
}: {
  icon: typeof Crown;
  label: string;
  color: string;
  bg: string;
  titles: string[];
}) {
  return (
    <div className={`rounded-xl ${bg} p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className={`text-sm font-semibold ${color}`}>{label}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {titles.map((t) => (
          <span
            key={t}
            className="rounded-md bg-white dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
