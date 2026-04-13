import { useState, useCallback } from "react";
import { Lead, PersonaOutput, ExclusionWord, PipelineStatus, EmailTemplate } from "@/types";
import IntentIntake from "@/components/IntentIntake";
import PersonaArchitect from "@/components/PersonaArchitect";
import LeadDataGrid from "@/components/LeadDataGrid";
import FeedbackSidebar from "@/components/FeedbackSidebar";
import PipelineActionBar from "@/components/PipelineActionBar";
import LeadUploader from "@/components/LeadUploader";
import EmailTemplateEditor from "@/components/EmailTemplateEditor";
import { generatePersonaWithAI } from "@/services/analyzeLeadsWithAI";
import { fetchApolloData } from "@/services/fetchApolloData";
import { enrichCompany } from "@/services/clearbitService";
import { getTechStack } from "@/services/builtWithService";
import { validateBatch } from "@/services/zeroBounceService";
import { syncBatchToCRM } from "@/services/hubspotService";
import { addBatchToCampaign } from "@/services/instantlyService";
import { sendBatchSummary } from "@/services/slackService";
import { scoreLeadsWithGroq } from "@/services/groqService";
import {
  addExclusion,
  removeExclusion,
  fetchActiveExclusions,
} from "@/services/updateExclusionLogic";

const INITIAL_PIPELINE: PipelineStatus = {
  enrichment: { status: "idle", enrichedCount: 0 },
  verification: { status: "idle", verifiedCount: 0, validCount: 0 },
  crmSync: { status: "idle", syncResult: null },
  outreach: { status: "idle", campaign: null },
  slackNotified: false,
};

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
  const [pipeline, setPipeline] = useState<PipelineStatus>(INITIAL_PIPELINE);
  const [showUploader, setShowUploader] = useState(false);

  const handleLeadsImported = useCallback((imported: Lead[]) => {
    setLeads((prev) => {
      const existingEmails = new Set(prev.map((l) => l.email));
      const deduped = imported.filter((l) => !existingEmails.has(l.email));
      return [...prev, ...deduped];
    });
    setPipeline(INITIAL_PIPELINE);
    setShowUploader(false);
  }, []);

  const handleGeneratePersona = useCallback(async () => {
    setGeneratingPersona(true);
    try {
      const result = await generatePersonaWithAI(campaignGoal);
      setPersona(result);
      setLeads([]);
      setPipeline(INITIAL_PIPELINE);
    } finally {
      setGeneratingPersona(false);
    }
  }, [campaignGoal]);

  const handleFetchLeads = useCallback(async () => {
    if (!persona) return;
    setFetchingLeads(true);
    try {
      const allTitles = [...persona.tier1Titles, ...persona.tier2Titles, ...persona.tier3Titles];
      const activeExclusions = exclusions.filter((e) => e.active).map((e) => e.word);
      const fetched = await fetchApolloData({
        personaTitles: allTitles,
        industryKeywords: persona.industryKeywords,
        excludedWords: activeExclusions,
      });
      setLeads(fetched);
      setPipeline(INITIAL_PIPELINE);
    } finally {
      setFetchingLeads(false);
    }
  }, [persona, exclusions]);

  const handleEnrich = useCallback(async () => {
    setPipeline((p) => ({ ...p, enrichment: { status: "running", enrichedCount: 0 } }));
    try {
      const enriched = await Promise.all(
        leads.map(async (lead) => {
          const domain = lead.email.split("@")[1] || `${lead.company.toLowerCase().replace(/\s/g, "")}.com`;
          const [company, tech] = await Promise.all([
            enrichCompany(domain),
            getTechStack(domain),
          ]);
          return {
            ...lead,
            enriched: true,
            techStack: company.techStack.length > 0 ? company.techStack : tech.technologies.map((t) => t.name),
            estimatedRevenue: company.estimatedRevenue,
            fundingRaised: company.fundingRaised,
          };
        })
      );
      setLeads(enriched);
      setPipeline((p) => ({
        ...p,
        enrichment: { status: "done", enrichedCount: enriched.length },
      }));
    } catch {
      setPipeline((p) => ({ ...p, enrichment: { status: "idle", enrichedCount: 0 } }));
    }
  }, [leads]);

  const handleVerifyEmails = useCallback(async () => {
    setPipeline((p) => ({
      ...p,
      verification: { status: "running", verifiedCount: 0, validCount: 0 },
    }));
    try {
      const emails = leads.map((l) => l.email);
      const result = await validateBatch(emails);
      const statusMap = new Map(result.results.map((r) => [r.email, r.status]));
      setLeads((prev) =>
        prev.map((l) => ({ ...l, emailStatus: statusMap.get(l.email) || l.emailStatus }))
      );
      setPipeline((p) => ({
        ...p,
        verification: {
          status: "done",
          verifiedCount: result.totalEmails,
          validCount: result.validCount,
        },
      }));
    } catch {
      setPipeline((p) => ({
        ...p,
        verification: { status: "idle", verifiedCount: 0, validCount: 0 },
      }));
    }
  }, [leads]);

  const handleSyncCRM = useCallback(async () => {
    setPipeline((p) => ({ ...p, crmSync: { status: "running", syncResult: null } }));
    try {
      const qualified = leads.filter((l) => l.richardScore >= 7);
      const result = await syncBatchToCRM(qualified);
      setLeads((prev) =>
        prev.map((l) =>
          l.richardScore >= 7 ? { ...l, crmContactId: `hs-${l.id}` } : l
        )
      );
      setPipeline((p) => ({ ...p, crmSync: { status: "done", syncResult: result } }));
    } catch {
      setPipeline((p) => ({ ...p, crmSync: { status: "idle", syncResult: null } }));
    }
  }, [leads]);

  const handleStartOutreach = useCallback(async () => {
    setPipeline((p) => ({ ...p, outreach: { status: "running", campaign: null } }));
    try {
      const result = await addBatchToCampaign("camp-demo-1", leads);
      setLeads((prev) =>
        prev.map((l) =>
          l.richardScore >= 7 ? { ...l, outreachStatus: "queued" as const } : l
        )
      );
      setPipeline((p) => ({ ...p, outreach: { status: "done", campaign: result } }));
    } catch {
      setPipeline((p) => ({ ...p, outreach: { status: "idle", campaign: null } }));
    }
  }, [leads]);

  const handleNotifySlack = useCallback(async () => {
    await sendBatchSummary(leads);
    setPipeline((p) => ({ ...p, slackNotified: true }));
  }, [leads]);

  const handleScoreWithGroq = useCallback(async () => {
    const rescored = await scoreLeadsWithGroq(leads);
    setLeads(rescored);
  }, [leads]);

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

  const handleSendOutreach = useCallback(
    async (_template: EmailTemplate) => {
      await handleStartOutreach();
    },
    [handleStartOutreach]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Campaign Workspace
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Define your campaign, import or fetch leads, score, enrich, write emails, and launch outreach.
          </p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className={showUploader ? "btn-secondary" : "btn-primary"}
        >
          {showUploader ? "Hide Uploader" : "Upload Excel / CSV"}
        </button>
      </div>

      {showUploader && <LeadUploader onLeadsImported={handleLeadsImported} />}

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
        <>
          <PipelineActionBar
            leads={leads}
            status={pipeline}
            onEnrich={handleEnrich}
            onVerifyEmails={handleVerifyEmails}
            onSyncCRM={handleSyncCRM}
            onStartOutreach={handleStartOutreach}
            onNotifySlack={handleNotifySlack}
            onScoreWithGroq={handleScoreWithGroq}
          />

          <EmailTemplateEditor
            leads={leads}
            campaignGoal={campaignGoal}
            onSendOutreach={handleSendOutreach}
          />

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <LeadDataGrid leads={leads} campaignGoal={campaignGoal} />
            <FeedbackSidebar
              leads={leads}
              exclusions={exclusions}
              onAddExclusion={handleAddExclusion}
              onRemoveExclusion={handleRemoveExclusion}
            />
          </div>
        </>
      )}
    </div>
  );
}
