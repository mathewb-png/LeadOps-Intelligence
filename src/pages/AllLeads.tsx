import { useState, useMemo } from "react";
import { Download, ArrowUpDown } from "lucide-react";
import { mockLeads } from "@/data/mockLeads";
import { Lead } from "@/types";
import LeadCard from "@/components/LeadCard";

type SortField = "score" | "companyName" | "lastActivity";
type SortDir = "asc" | "desc";

export default function AllLeads() {
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("leadops-saved");
    return stored ? new Set(JSON.parse(stored)) : new Set();
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

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    return [...mockLeads].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "score") return (a.score - b.score) * dir;
      if (sortField === "companyName") return a.companyName.localeCompare(b.companyName) * dir;
      return a.lastActivity.localeCompare(b.lastActivity) * dir;
    });
  }, [sortField, sortDir]);

  const exportCSV = () => {
    const headers = ["Company", "Contact", "Title", "Email", "Phone", "Industry", "Location", "Score", "Status"];
    const rows = mockLeads.map((l) => [
      l.companyName, l.contactName, l.contactTitle, l.email, l.phone, l.industry, l.location, l.score, l.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leadops-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            {mockLeads.length} leads in your pipeline
          </p>
        </div>
        <button onClick={exportCSV} className="btn-secondary">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="flex gap-2">
        {(["score", "companyName", "lastActivity"] as SortField[]).map((field) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              sortField === field
                ? "bg-brand-50 text-brand-700"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <ArrowUpDown className="h-3 w-3" />
            {field === "companyName" ? "Name" : field === "lastActivity" ? "Activity" : "Score"}
            {sortField === field && (sortDir === "asc" ? " ↑" : " ↓")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            saved={savedIds.has(lead.id)}
            onToggleSave={toggleSave}
          />
        ))}
      </div>
    </div>
  );
}
