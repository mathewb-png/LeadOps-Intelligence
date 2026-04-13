import { useMemo, useState } from "react";
import {
  Building2,
  Home,
  Landmark,
  Factory,
  HelpCircle,
  Download,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { Lead, CampaignLocale } from "@/types";
import { classifyCompany, CompanyClassification } from "@/lib/richardScoring";

interface CompanyClassificationReportProps {
  leads: Lead[];
  locale: CampaignLocale;
  onExport: () => void;
}

const CATEGORY_META: Record<
  CompanyClassification["category"],
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  "Likely Residential": {
    icon: <Home className="h-3.5 w-3.5" />,
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
  "Mixed-Use": {
    icon: <Building2 className="h-3.5 w-3.5" />,
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  Commercial: {
    icon: <Landmark className="h-3.5 w-3.5" />,
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
  },
  Industrial: {
    icon: <Factory className="h-3.5 w-3.5" />,
    color: "text-violet-700 dark:text-violet-300",
    bgColor: "bg-violet-50 dark:bg-violet-950",
  },
  Unknown: {
    icon: <HelpCircle className="h-3.5 w-3.5" />,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800",
  },
};

type SortField = "company" | "employees" | "category" | "industry";

export default function CompanyClassificationReport({
  leads,
  locale,
  onExport,
}: CompanyClassificationReportProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("category");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const classifications = useMemo(() => {
    const seen = new Set<string>();
    const results: CompanyClassification[] = [];
    for (const lead of leads) {
      const key = lead.company.toLowerCase();
      if (seen.has(key) || !lead.company) continue;
      seen.add(key);
      results.push(classifyCompany(lead, locale.countryCode));
    }
    return results;
  }, [leads]);

  const filtered = useMemo(() => {
    let list = classifications;
    if (filterCategory !== "all") {
      list = list.filter((c) => c.category === filterCategory);
    }
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "company":
          cmp = a.companyName.localeCompare(b.companyName);
          break;
        case "employees":
          cmp = (parseInt(a.employees) || 0) - (parseInt(b.employees) || 0);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "industry":
          cmp = a.industry.localeCompare(b.industry);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [classifications, filterCategory, sortField, sortDir]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of classifications) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, [classifications]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  if (classifications.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Building2 className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Import or fetch leads to see Company Data Analysis & Classification.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
            <Building2 className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Company Data Analysis & Classification
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {classifications.length} unique companies analyzed &middot; {locale.country} ({locale.language})
            </p>
          </div>
        </div>
        <button onClick={onExport} className="btn-primary text-xs">
          <Download className="h-3.5 w-3.5" />
          Export XLSX
        </button>
      </div>

      {/* Category Summary */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          {(Object.keys(CATEGORY_META) as CompanyClassification["category"][]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const count = categoryCounts[cat] || 0;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? "all" : cat)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  filterCategory === cat
                    ? `${meta.bgColor} ${meta.color} ring-2 ring-current ring-offset-1 dark:ring-offset-gray-900`
                    : `${meta.bgColor} ${meta.color} opacity-80 hover:opacity-100`
                }`}
              >
                {meta.icon}
                <span>{cat}</span>
                <span className="rounded-full bg-white/60 dark:bg-black/30 px-1.5 py-0.5 text-[10px] font-bold">
                  {count}
                </span>
              </button>
            );
          })}
          {filterCategory !== "all" && (
            <button
              onClick={() => setFilterCategory("all")}
              className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <SortableHeader field="company" current={sortField} dir={sortDir} onSort={handleSort}>
                Company Name
              </SortableHeader>
              <SortableHeader field="employees" current={sortField} dir={sortDir} onSort={handleSort}>
                # Employees
              </SortableHeader>
              <SortableHeader field="industry" current={sortField} dir={sortDir} onSort={handleSort}>
                Industry
              </SortableHeader>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Website</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Address</th>
              <SortableHeader field="category" current={sortField} dir={sortDir} onSort={handleSort}>
                Category
              </SortableHeader>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 min-w-[200px]">
                Reasoning
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((c, i) => {
              const meta = CATEGORY_META[c.category];
              return (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-gray-100">
                    {c.companyName}
                  </td>
                  <td className="px-3 py-2.5 text-center text-gray-600 dark:text-gray-300">
                    {c.employees}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-300">{c.industry}</td>
                  <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 font-mono">
                    {c.website ? (
                      <a
                        href={`https://${c.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-600 dark:hover:text-brand-400 underline"
                      >
                        {c.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 max-w-[180px] truncate">
                    {c.address || "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium ${meta.bgColor} ${meta.color}`}
                    >
                      {meta.icon}
                      {c.category}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                    {c.reasoning}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          No companies match the selected filter.
        </div>
      )}
    </div>
  );
}

function SortableHeader({
  field,
  current,
  dir,
  onSort,
  children,
}: {
  field: SortField;
  current: SortField;
  dir: "asc" | "desc";
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}) {
  return (
    <th
      onClick={() => onSort(field)}
      className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown
          className={`h-3 w-3 ${field === current ? "text-brand-600" : "opacity-30"}`}
        />
        {field === current && (
          <ChevronDown
            className={`h-2.5 w-2.5 text-brand-600 transition-transform ${dir === "desc" ? "rotate-180" : ""}`}
          />
        )}
      </span>
    </th>
  );
}
