import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { mockLeads } from "@/data/mockLeads";
import { SearchFilters } from "@/types";
import SearchFiltersPanel from "@/components/SearchFilters";
import LeadCard from "@/components/LeadCard";
import EmptyState from "@/components/EmptyState";

export default function SearchLeads() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("leadops-saved");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    industry: "",
    location: "",
    employeeRange: "",
    revenueRange: "",
    status: "",
    minScore: 0,
  });

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("leadops-saved", JSON.stringify([...next]));
      return next;
    });
  };

  const filtered = useMemo(() => {
    return mockLeads.filter((lead) => {
      const q = filters.query.toLowerCase();
      if (
        q &&
        !lead.companyName.toLowerCase().includes(q) &&
        !lead.contactName.toLowerCase().includes(q) &&
        !lead.industry.toLowerCase().includes(q) &&
        !lead.email.toLowerCase().includes(q) &&
        !lead.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
      if (filters.industry && lead.industry !== filters.industry) return false;
      if (filters.location && lead.location !== filters.location) return false;
      if (filters.employeeRange && lead.employeeCount !== filters.employeeRange) return false;
      if (filters.revenueRange && lead.revenue !== filters.revenueRange) return false;
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.minScore && lead.score < filters.minScore) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Leads</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search and filter your lead database to find the perfect prospects.
        </p>
      </div>

      <SearchFiltersPanel
        filters={filters}
        onChange={setFilters}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{filtered.length}</span> lead
          {filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              saved={savedIds.has(lead.id)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No leads found"
          description="Try adjusting your search criteria or clearing filters to see more results."
          action={{ label: "Clear filters", onClick: () => setFilters({
            query: "", industry: "", location: "", employeeRange: "", revenueRange: "", status: "", minScore: 0
          })}}
        />
      )}
    </div>
  );
}
