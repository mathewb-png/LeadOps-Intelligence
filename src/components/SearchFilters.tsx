import { Search, SlidersHorizontal, X } from "lucide-react";
import { SearchFilters as Filters } from "@/types";
import { industries, locations, employeeRanges, revenueRanges } from "@/data/mockLeads";

interface SearchFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

export default function SearchFiltersPanel({
  filters,
  onChange,
  showAdvanced,
  onToggleAdvanced,
}: SearchFiltersProps) {
  const update = (key: keyof Filters, value: string | number) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onChange({
      query: "",
      industry: "",
      location: "",
      employeeRange: "",
      revenueRange: "",
      status: "",
      minScore: 0,
    });
  };

  const hasActiveFilters =
    filters.industry ||
    filters.location ||
    filters.employeeRange ||
    filters.revenueRange ||
    filters.status ||
    filters.minScore > 0;

  return (
    <div className="card p-4 space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies, contacts, industries..."
            className="input pl-10"
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
          />
        </div>
        <button onClick={onToggleAdvanced} className="btn-secondary">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
              {[filters.industry, filters.location, filters.employeeRange, filters.revenueRange, filters.status, filters.minScore > 0 ? "1" : ""].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Industry</label>
              <select
                className="input"
                value={filters.industry}
                onChange={(e) => update("industry", e.target.value)}
              >
                <option value="">All Industries</option>
                {industries.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Location</label>
              <select
                className="input"
                value={filters.location}
                onChange={(e) => update("location", e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Employees</label>
              <select
                className="input"
                value={filters.employeeRange}
                onChange={(e) => update("employeeRange", e.target.value)}
              >
                <option value="">Any Size</option>
                {employeeRanges.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Revenue</label>
              <select
                className="input"
                value={filters.revenueRange}
                onChange={(e) => update("revenueRange", e.target.value)}
              >
                <option value="">Any Revenue</option>
                {revenueRanges.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => update("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Min Score: {filters.minScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => update("minScore", Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
            >
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
