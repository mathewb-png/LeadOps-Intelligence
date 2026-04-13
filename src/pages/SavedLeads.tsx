import { useState } from "react";
import { BookmarkCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockLeads } from "@/data/mockLeads";
import LeadCard from "@/components/LeadCard";
import EmptyState from "@/components/EmptyState";

export default function SavedLeads() {
  const navigate = useNavigate();
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

  const savedLeads = mockLeads.filter((l) => savedIds.has(l.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Leads</h1>
        <p className="mt-1 text-sm text-gray-500">
          {savedLeads.length} lead{savedLeads.length !== 1 ? "s" : ""} saved for follow-up
        </p>
      </div>

      {savedLeads.length > 0 ? (
        <div className="space-y-3">
          {savedLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              saved
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookmarkCheck}
          title="No saved leads yet"
          description="Bookmark leads from the search or all leads page to save them here for quick access."
          action={{
            label: "Find leads",
            onClick: () => navigate("/search"),
          }}
        />
      )}
    </div>
  );
}
