import { useState, useMemo } from "react";
import { ArrowUpDown, Download, ChevronDown, ChevronUp, FileSpreadsheet } from "lucide-react";
import { Lead } from "@/types";
import RichardScoreBadge from "./RichardScoreBadge";
import TierBadge from "./TierBadge";
import { exportStrategicSheet } from "@/lib/exportXlsx";

interface LeadDataGridProps {
  leads: Lead[];
  campaignGoal: string;
}

type SortKey = "richardScore" | "name" | "company" | "jobTitle" | "tier";
type SortDir = "asc" | "desc";

export default function LeadDataGrid({ leads, campaignGoal }: LeadDataGridProps) {
  const [sortKey, setSortKey] = useState<SortKey>("richardScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "richardScore") return (a.richardScore - b.richardScore) * dir;
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [leads, sortKey, sortDir]);

  const SortIcon = ({ field }: { field: SortKey }) => (
    <ArrowUpDown
      className={`ml-1 inline h-3 w-3 ${sortKey === field ? "text-brand-600" : "text-gray-400"}`}
    />
  );

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Lead Results
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {leads.length} leads scored &middot; sorted by {sortKey}
          </p>
        </div>
        <button
          onClick={() => exportStrategicSheet(leads, campaignGoal)}
          className="btn-primary"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Download Strategic Sheet
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th
                className="cursor-pointer whitespace-nowrap px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                onClick={() => toggleSort("name")}
              >
                Name <SortIcon field="name" />
              </th>
              <th
                className="cursor-pointer whitespace-nowrap px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                onClick={() => toggleSort("company")}
              >
                Company <SortIcon field="company" />
              </th>
              <th
                className="cursor-pointer whitespace-nowrap px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                onClick={() => toggleSort("jobTitle")}
              >
                Job Title <SortIcon field="jobTitle" />
              </th>
              <th
                className="cursor-pointer whitespace-nowrap px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                onClick={() => toggleSort("richardScore")}
              >
                Richard Score <SortIcon field="richardScore" />
              </th>
              <th
                className="cursor-pointer whitespace-nowrap px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                onClick={() => toggleSort("tier")}
              >
                Tier <SortIcon field="tier" />
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sorted.map((lead) => (
              <>
                <tr
                  key={lead.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <td className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-900 dark:text-gray-100">
                    {lead.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-gray-600 dark:text-gray-300">
                    {lead.company}
                  </td>
                  <td className="px-6 py-3.5 text-gray-600 dark:text-gray-300">
                    {lead.jobTitle}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <RichardScoreBadge score={lead.richardScore} />
                  </td>
                  <td className="px-6 py-3.5">
                    <TierBadge tier={lead.tier} />
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                      className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {expandedId === lead.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedId === lead.id && (
                  <tr key={`${lead.id}-detail`} className="bg-gray-50/50 dark:bg-gray-800/20">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid gap-3 sm:grid-cols-4 text-sm">
                        <div>
                          <span className="text-xs font-medium text-gray-400">Email</span>
                          <p className="text-gray-700 dark:text-gray-300">{lead.email}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-400">Phone</span>
                          <p className="text-gray-700 dark:text-gray-300">{lead.phone || "—"}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-400">Industry</span>
                          <p className="text-gray-700 dark:text-gray-300">{lead.industry}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-400">Location</span>
                          <p className="text-gray-700 dark:text-gray-300">{lead.location}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
