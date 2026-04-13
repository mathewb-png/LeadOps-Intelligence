import { useState } from "react";
import {
  History,
  ChevronDown,
  ChevronRight,
  Trash2,
  RotateCcw,
  PlusCircle,
  Globe,
  Users,
  Calendar,
} from "lucide-react";
import { SavedCampaign } from "@/types";

interface CampaignHistoryProps {
  campaigns: SavedCampaign[];
  activeCampaignId: string | null;
  onRestore: (campaign: SavedCampaign) => void;
  onDelete: (id: string) => void;
  onNewCampaign: () => void;
}

export default function CampaignHistory({
  campaigns,
  activeCampaignId,
  onRestore,
  onDelete,
  onNewCampaign,
}: CampaignHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  if (campaigns.length === 0 && !activeCampaignId) return null;

  const sorted = [...campaigns].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <History className="h-4 w-4 text-brand-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Campaign History
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {campaigns.length} saved campaign{campaigns.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNewCampaign();
          }}
          className="flex items-center gap-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 px-3 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          New Campaign
        </button>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 max-h-64 overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="px-5 py-4 text-xs text-gray-400 dark:text-gray-500">
              No saved campaigns yet. Campaigns are auto-saved when you generate a persona or fetch leads.
            </p>
          ) : (
            sorted.map((c) => {
              const isActive = c.id === activeCampaignId;
              return (
                <div
                  key={c.id}
                  className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                    isActive
                      ? "bg-brand-50/50 dark:bg-brand-950/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {c.name}
                      {isActive && (
                        <span className="ml-2 rounded bg-brand-100 dark:bg-brand-900 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 dark:text-brand-300">
                          ACTIVE
                        </span>
                      )}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {c.locale.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {c.leadCount} leads
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(c.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!isActive && (
                      <button
                        onClick={() => onRestore(c)}
                        className="rounded-md p-1.5 text-gray-400 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Restore campaign"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(c.id)}
                      className="rounded-md p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      title="Delete campaign"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}
