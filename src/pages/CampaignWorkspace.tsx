import { useState, useCallback, useRef, useEffect } from "react";
import { Lead, PersonaOutput, ExclusionWord, CampaignLocale, SavedCampaign } from "@/types";
import IntentIntake from "@/components/IntentIntake";
import PersonaArchitect from "@/components/PersonaArchitect";
import LeadDataGrid from "@/components/LeadDataGrid";
import FeedbackSidebar from "@/components/FeedbackSidebar";
import EnrichmentProgress from "@/components/EnrichmentProgress";
import LeadUploader from "@/components/LeadUploader";
import ICPReport from "@/components/ICPReport";
import CompanyClassificationReport from "@/components/CompanyClassificationReport";
import KeywordManager from "@/components/KeywordManager";
import CampaignHistory from "@/components/CampaignHistory";
import SearchPromptGenerator from "@/components/SearchPromptGenerator";
import { generatePersonaWithAI } from "@/services/analyzeLeadsWithAI";
import { fetchApolloData } from "@/services/fetchApolloData";
import { runFullEnrichment, EnrichmentProgress as EnrichmentProgressType } from "@/services/enrichmentPipeline";
import { exportFullReport, exportICPFramework, exportCompanyClassification } from "@/lib/exportXlsx";
import { getDefaultLocale, detectLocaleFromLeads } from "@/lib/localeData";
import {
  addExclusion,
  removeExclusion,
  fetchActiveExclusions,
} from "@/services/updateExclusionLogic";
import {
  Target,
  Building2,
  Table2,
  FileSpreadsheet,
  Download,
  Filter,
} from "lucide-react";

const CAMPAIGNS_KEY = "leadops-campaigns";

function loadCampaigns(): SavedCampaign[] {
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistCampaigns(campaigns: SavedCampaign[]) {
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

function deriveName(goal: string): string {
  if (!goal.trim()) return "Untitled Campaign";
  const cleaned = goal.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const words = cleaned.split(/\s+/).slice(0, 5);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

type ResultsTab = "data" | "icp" | "classification" | "keywords";

export default function CampaignWorkspace() {
  const [campaignGoal, setCampaignGoal] = useState("");
  const [locale, setLocale] = useState<CampaignLocale>(getDefaultLocale);
  const [persona, setPersona] = useState<PersonaOutput | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [exclusions, setExclusions] = useState<ExclusionWord[]>(() => {
    const stored = localStorage.getItem("leadops-exclusions");
    return stored ? JSON.parse(stored) : [];
  });
  const [generatingPersona, setGeneratingPersona] = useState(false);
  const [fetchingLeads, setFetchingLeads] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState<EnrichmentProgressType | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [resultsTab, setResultsTab] = useState<ResultsTab>("data");
  const enrichAbort = useRef(false);

  const enrichmentRef = useRef<HTMLDivElement>(null);
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>(loadCampaigns);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

  const saveCampaign = useCallback(() => {
    if (!campaignGoal.trim() && !persona) return;
    setCampaigns((prev) => {
      const now = new Date().toISOString();
      let updated: SavedCampaign[];
      if (activeCampaignId) {
        updated = prev.map((c) =>
          c.id === activeCampaignId
            ? { ...c, name: deriveName(campaignGoal), campaignGoal, locale, persona, leadCount: leads.length, updatedAt: now }
            : c
        );
      } else {
        const id = crypto.randomUUID();
        const newCampaign: SavedCampaign = {
          id,
          name: deriveName(campaignGoal),
          campaignGoal,
          locale,
          persona,
          leadCount: leads.length,
          createdAt: now,
          updatedAt: now,
        };
        updated = [newCampaign, ...prev];
        setActiveCampaignId(id);
      }
      persistCampaigns(updated);
      return updated;
    });
  }, [campaignGoal, locale, persona, leads.length, activeCampaignId]);

  const handleRestoreCampaign = useCallback((campaign: SavedCampaign) => {
    setCampaignGoal(campaign.campaignGoal);
    setLocale(campaign.locale);
    setPersona(campaign.persona);
    setLeads([]);
    setEnrichmentProgress(null);
    setActiveCampaignId(campaign.id);
  }, []);

  const handleDeleteCampaign = useCallback((id: string) => {
    setCampaigns((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      persistCampaigns(updated);
      return updated;
    });
    if (activeCampaignId === id) setActiveCampaignId(null);
  }, [activeCampaignId]);

  const handleNewCampaign = useCallback(() => {
    saveCampaign();
    setCampaignGoal("");
    setLocale(getDefaultLocale());
    setPersona(null);
    setLeads([]);
    setEnrichmentProgress(null);
    setActiveCampaignId(null);
  }, [saveCampaign]);

  const runEnrichment = useCallback(async (rawLeads: Lead[], loc: CampaignLocale) => {
    setEnriching(true);
    enrichAbort.current = false;
    try {
      const enriched = await runFullEnrichment(rawLeads, loc, (progress) => {
        if (!enrichAbort.current) setEnrichmentProgress(progress);
      });
      if (!enrichAbort.current) setLeads(enriched);
    } finally {
      setEnriching(false);
    }
  }, []);

  const handleLeadsImported = useCallback((imported: Lead[]) => {
    setLeads((prev) => {
      const existingEmails = new Set(prev.map((l) => l.email));
      const deduped = imported.filter((l) => !existingEmails.has(l.email));
      const merged = [...prev, ...deduped];

      const detected = detectLocaleFromLeads(merged);
      if (detected.countryCode) {
        setLocale((loc) => ({
          ...loc,
          ...(detected.country && { country: detected.country }),
          ...(detected.countryCode && { countryCode: detected.countryCode }),
          ...(detected.language && { language: detected.language }),
          ...(detected.languageCode && { languageCode: detected.languageCode }),
          ...(detected.timezone && { timezone: detected.timezone }),
        }));
      }

      // Auto-enrich after import
      setTimeout(() => runEnrichment(merged, locale), 100);

      return merged;
    });
    setShowUploader(false);
  }, [locale, runEnrichment]);

  const handleLaunchCampaign = useCallback(async () => {
    setGeneratingPersona(true);
    try {
      const result = await generatePersonaWithAI(campaignGoal);
      setPersona(result);
      setLeads([]);
      setEnrichmentProgress(null);

      // Auto-save after persona
      saveCampaign();

      // Auto-chain: fetch leads immediately
      setFetchingLeads(true);
      try {
        const allTitles = [...result.tier1Titles, ...result.tier2Titles, ...result.tier3Titles];
        const activeExclusions = exclusions.filter((e) => e.active).map((e) => e.word);
        const fetched = await fetchApolloData({
          personaTitles: allTitles,
          industryKeywords: result.industryKeywords,
          excludedWords: activeExclusions,
          locale,
        });
        setLeads(fetched);
        setTimeout(() => {
          enrichmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        await runEnrichment(fetched, locale);
        saveCampaign();
      } finally {
        setFetchingLeads(false);
      }
    } finally {
      setGeneratingPersona(false);
    }
  }, [campaignGoal, exclusions, locale, runEnrichment, saveCampaign]);

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

  const TABS: { id: ResultsTab; label: string; icon: React.ReactNode }[] = [
    { id: "data", label: "Lead Data", icon: <Table2 className="h-4 w-4" /> },
    { id: "keywords", label: "Keywords", icon: <Filter className="h-4 w-4" /> },
    { id: "icp", label: "ICP Framework", icon: <Target className="h-4 w-4" /> },
    { id: "classification", label: "Company Analysis", icon: <Building2 className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Campaign Workspace
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Define your campaign, select target country &amp; language, and let all APIs scrape &amp; enrich your leads automatically.
          </p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className={`${showUploader ? "btn-secondary" : "btn-primary"} flex items-center gap-2`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          {showUploader ? "Hide Uploader" : "Upload Excel / CSV"}
        </button>
      </div>

      <CampaignHistory
        campaigns={campaigns}
        activeCampaignId={activeCampaignId}
        onRestore={handleRestoreCampaign}
        onDelete={handleDeleteCampaign}
        onNewCampaign={handleNewCampaign}
      />

      {showUploader && <LeadUploader onLeadsImported={handleLeadsImported} languageCode={locale.languageCode} />}

      <IntentIntake
        value={campaignGoal}
        onChange={setCampaignGoal}
        locale={locale}
        onLocaleChange={setLocale}
        onSubmit={handleLaunchCampaign}
        loading={generatingPersona || fetchingLeads}
      />

      <PersonaArchitect
        persona={persona}
      />

      {persona && (
        <SearchPromptGenerator
          campaignGoal={campaignGoal}
          persona={persona}
          locale={locale}
          exclusions={exclusions}
          leads={leads}
        />
      )}

      {leads.length > 0 && (
        <>
          <div ref={enrichmentRef}>
            <EnrichmentProgress
              progress={enrichmentProgress}
              isRunning={enriching}
              leadCount={leads.length}
            />
          </div>

          {/* Results Tab Navigation + Unified Export */}
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setResultsTab(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    resultsTab === tab.id
                      ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => exportFullReport(leads, campaignGoal, locale)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Full Report</span>
              <span className="sm:hidden">XLSX</span>
            </button>
          </div>

          {/* Tab Content */}
          {resultsTab === "data" && (
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

          {resultsTab === "keywords" && (
            <KeywordManager
              leads={leads}
              locale={locale}
              exclusions={exclusions}
              onAddExclusion={handleAddExclusion}
              onRemoveExclusion={handleRemoveExclusion}
            />
          )}

          {resultsTab === "icp" && (
            <ICPReport
              leads={leads}
              campaignGoal={campaignGoal}
              locale={locale}
              onExport={() => exportICPFramework(leads, campaignGoal, locale)}
            />
          )}

          {resultsTab === "classification" && (
            <CompanyClassificationReport
              leads={leads}
              locale={locale}
              onExport={() => exportCompanyClassification(leads, locale)}
            />
          )}
        </>
      )}
    </div>
  );
}
