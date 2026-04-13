import { useState, useCallback } from "react";
import { Lead, PersonaOutput, ExclusionWord } from "@/types";
import IntentIntake from "@/components/IntentIntake";
import PersonaArchitect from "@/components/PersonaArchitect";
import LeadDataGrid from "@/components/LeadDataGrid";
import FeedbackSidebar from "@/components/FeedbackSidebar";
import { generatePersonaWithAI } from "@/services/analyzeLeadsWithAI";
import { fetchApolloData } from "@/services/fetchApolloData";
import {
  addExclusion,
  removeExclusion,
  fetchActiveExclusions,
} from "@/services/updateExclusionLogic";

export default function CampaignWorkspace() {
  const [campaignGoal, setCampaignGoal] = useState("");
  const [persona, setPersona] = useState<PersonaOutput | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [exclusions, setExclusions] = useState<ExclusionWord[]>(() => {
    const stored = localStorage.getItem("leadops-exclusions");
    return stored ? JSON.parse(stored) : [];
  });
  const [generatingPersona, setGeneratingPersona] = useState(false);
  const [fetchingLeads, setFetchingLeads] = useState(false);

  const handleGeneratePersona = useCallback(async () => {
    setGeneratingPersona(true);
    try {
      const result = await generatePersonaWithAI(campaignGoal);
      setPersona(result);
      setLeads([]);
    } finally {
      setGeneratingPersona(false);
    }
  }, [campaignGoal]);

  const handleFetchLeads = useCallback(async () => {
    if (!persona) return;
    setFetchingLeads(true);
    try {
      const allTitles = [
        ...persona.tier1Titles,
        ...persona.tier2Titles,
        ...persona.tier3Titles,
      ];
      const activeExclusions = exclusions
        .filter((e) => e.active)
        .map((e) => e.word);

      const fetched = await fetchApolloData({
        personaTitles: allTitles,
        industryKeywords: persona.industryKeywords,
        excludedWords: activeExclusions,
      });
      setLeads(fetched);
    } finally {
      setFetchingLeads(false);
    }
  }, [persona, exclusions]);

  const handleAddExclusion = useCallback(async (word: string, fromTitles: string[]) => {
    await addExclusion(word, fromTitles);
    const updated = await fetchActiveExclusions();
    setExclusions(updated);
  }, []);

  const handleRemoveExclusion = useCallback(async (word: string) => {
    await removeExclusion(word);
    const updated = await fetchActiveExclusions();
    setExclusions(updated);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Campaign Workspace
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Define your campaign, generate personas, fetch & score leads, and refine.
        </p>
      </div>

      <IntentIntake
        value={campaignGoal}
        onChange={setCampaignGoal}
        onSubmit={handleGeneratePersona}
        loading={generatingPersona}
      />

      <PersonaArchitect
        persona={persona}
        onFetchLeads={handleFetchLeads}
        fetchingLeads={fetchingLeads}
      />

      {leads.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <LeadDataGrid leads={leads} campaignGoal={campaignGoal} />
          <FeedbackSidebar
            leads={leads}
            exclusions={exclusions}
            onAddExclusion={handleAddExclusion}
            onRemoveExclusion={handleRemoveExclusion}
          />
        </div>
      )}
    </div>
  );
}
