export interface Lead {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  employeeCount: string;
  richardScore: number;
  tier: LeadTier;
  source: string;
  fetchedAt: string;
  excluded: boolean;
  emailStatus?: EmailValidationStatus;
  enriched?: boolean;
  techStack?: string[];
  fundingRaised?: number;
  estimatedRevenue?: string;
  linkedinUrl?: string;
  crmContactId?: string;
  outreachStatus?: "not_sent" | "queued" | "sent";
  companyDescription?: string;
  companyFoundedYear?: number;
  companyDomain?: string;
  companyLocation?: string;
  investors?: string[];
  lastFundingType?: string;
  lastFundingDate?: string;
  emailConfidence?: number;
}

export type LeadTier = "primary" | "stakeholder" | "influence" | "peripheral" | "irrelevant";

export interface CampaignGoal {
  id: string;
  description: string;
  createdAt: string;
}

export interface CampaignLocale {
  country: string;
  countryCode: string;
  language: string;
  languageCode: string;
  region?: string;
  timezone?: string;
}

export interface PersonaOutput {
  tier1Titles: string[];
  tier2Titles: string[];
  tier3Titles: string[];
  industryKeywords: string[];
}

export interface ExclusionWord {
  id: string;
  word: string;
  frequency: number;
  addedAt: string;
  active: boolean;
}

export interface BatchValueBreakdown {
  score9to10: { count: number; points: number };
  score7to8: { count: number; points: number };
  score4to6: { count: number; points: number };
  score1to3: { count: number; points: number };
  score0: { count: number; points: number };
  total: number;
}

export interface RefinementSuggestion {
  word: string;
  occurrences: number;
  fromTitles: string[];
}

export type ThemeMode = "light" | "dark";

// ─── Hunter.io ───

export interface HunterEmailResult {
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  confidence: number;
  type: "personal" | "generic";
  sources: { domain: string; uri: string }[];
}

export interface HunterDomainSearch {
  domain: string;
  organization: string;
  emails: HunterEmailResult[];
  totalResults: number;
}

export interface HunterVerification {
  email: string;
  status: "valid" | "invalid" | "accept_all" | "webmail" | "disposable" | "unknown";
  score: number;
  regexp: boolean;
  gibberish: boolean;
  disposable: boolean;
  webmail: boolean;
  mxRecords: boolean;
  smtpServer: boolean;
  smtpCheck: boolean;
}

// ─── RocketReach ───

export interface RocketReachContact {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  email: string;
  phones: { number: string; type: string }[];
  linkedinUrl: string;
  location: string;
  industry: string;
}

export interface RocketReachSearchParams {
  name?: string;
  currentTitle?: string[];
  currentEmployer?: string;
  keywords?: string[];
  location?: string;
  pageSize?: number;
}

// ─── Clearbit ───

export interface ClearbitCompany {
  id: string;
  name: string;
  domain: string;
  category: { sector: string; industryGroup: string; industry: string; subIndustry: string };
  description: string;
  url: string;
  logo: string;
  legalName: string;
  sector: string;
  tags: string[];
  tech: string[];
  techCategories: string[];
  metrics: {
    raised: number;
    alexaUsRank: number;
    alexaGlobalRank: number;
    employees: number;
    employeesRange: string;
    marketCap: number | null;
    annualRevenue: number | null;
    estimatedAnnualRevenue: string;
    fiscalYearEnd: number | null;
  };
  location: string;
  geo: { streetNumber: string; street: string; city: string; state: string; stateCode: string; postalCode: string; country: string; countryCode: string };
  foundedYear: number;
  twitter: { handle: string; followers: number } | null;
  linkedin: { handle: string } | null;
}

export interface ClearbitPerson {
  id: string;
  fullName: string;
  email: string;
  title: string;
  role: string;
  seniority: string;
  company: ClearbitCompany | null;
  linkedinHandle: string;
  twitterHandle: string;
  location: string;
}

export interface EnrichedCompany {
  domain: string;
  name: string;
  industry: string;
  employeeCount: number;
  employeeRange: string;
  estimatedRevenue: string;
  techStack: string[];
  fundingRaised: number;
  foundedYear: number;
  location: string;
  description: string;
  enrichedAt: string;
  source: "clearbit" | "crunchbase" | "builtwith" | "merged";
}

// ─── Crunchbase ───

export interface CrunchbaseFundingRound {
  type: string;
  seriesName: string;
  moneyRaised: number;
  currency: string;
  announcedDate: string;
  leadInvestors: string[];
}

export interface CrunchbaseCompany {
  uuid: string;
  name: string;
  shortDescription: string;
  foundedOn: string;
  numEmployeesEnum: string;
  revenueRange: string;
  categories: string[];
  headquartersLocation: string;
  totalFundingUsd: number;
  lastFundingType: string;
  lastFundingDate: string;
  ipoStatus: "private" | "public" | "delisted";
  fundingRounds: CrunchbaseFundingRound[];
  investors: string[];
  website: string;
}

// ─── BuiltWith ───

export interface BuiltWithTechnology {
  name: string;
  category: string;
  subcategory: string;
  firstDetected: string;
  lastDetected: string;
  isPremium: boolean;
}

export interface BuiltWithProfile {
  domain: string;
  technologies: BuiltWithTechnology[];
  categories: string[];
  spend: { monthly: number; currency: string } | null;
}

// ─── ZeroBounce ───

export type EmailValidationStatus =
  | "valid"
  | "invalid"
  | "catch-all"
  | "spamtrap"
  | "abuse"
  | "do_not_mail"
  | "unknown";

export interface EmailVerification {
  email: string;
  status: EmailValidationStatus;
  subStatus: string;
  freeEmail: boolean;
  didYouMean: string | null;
  account: string;
  domain: string;
  processedAt: string;
}

export interface EmailBatchResult {
  batchId: string;
  totalEmails: number;
  validCount: number;
  invalidCount: number;
  catchAllCount: number;
  unknownCount: number;
  results: EmailVerification[];
  completedAt: string;
}

// ─── Groq ───

export interface GroqScoreResult {
  leadId: string;
  richardScore: number;
  reasoning: string;
  model: string;
  latencyMs: number;
}

// ─── HubSpot CRM ───

export interface HubSpotContact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  richardScore: number;
  tier: LeadTier;
  lifecycleStage: string;
}

export interface HubSpotDeal {
  id: string;
  dealName: string;
  pipeline: string;
  stage: string;
  amount: number;
  associatedContactId: string;
}

export interface CRMSyncResult {
  synced: number;
  created: number;
  updated: number;
  failed: number;
  errors: { leadId: string; error: string }[];
  syncedAt: string;
}

// ─── Instantly.ai ───

export interface InstantlyCampaign {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  accountId: string;
  createdAt: string;
}

export interface InstantlyLeadPayload {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  customVariables: Record<string, string>;
}

export interface OutreachCampaign {
  campaignId: string;
  campaignName: string;
  leadsAdded: number;
  leadsSkipped: number;
  status: "queued" | "processing" | "completed" | "failed";
  startedAt: string;
}

// ─── Slack ───

export interface SlackNotification {
  channel: string;
  message: string;
  batchSummary: {
    totalLeads: number;
    primaryCount: number;
    avgScore: number;
    batchValue: number;
    topLeads: { name: string; company: string; score: number }[];
  };
  sentAt: string;
}

// ─── Excel Upload ───

export interface UploadedFileResult {
  fileName: string;
  totalRows: number;
  parsedLeads: number;
  skippedRows: number;
  errors: string[];
  columnMapping: Record<string, string>;
}

export interface ColumnMapping {
  name?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  industry?: string;
  location?: string;
  [key: string]: string | undefined;
}

// ─── Email Templates ───

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export type EmailVariable =
  | "{{firstName}}"
  | "{{lastName}}"
  | "{{fullName}}"
  | "{{company}}"
  | "{{jobTitle}}"
  | "{{industry}}"
  | "{{richardScore}}"
  | "{{tier}}"
  | "{{campaignGoal}}";

// ─── Saved Campaigns ───

export interface SavedCampaign {
  id: string;
  name: string;
  campaignGoal: string;
  locale: CampaignLocale;
  persona: PersonaOutput | null;
  leadCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Aggregated Pipeline Status ───

export interface PipelineStatus {
  enrichment: { status: "idle" | "running" | "done"; enrichedCount: number };
  verification: { status: "idle" | "running" | "done"; verifiedCount: number; validCount: number };
  crmSync: { status: "idle" | "running" | "done"; syncResult: CRMSyncResult | null };
  outreach: { status: "idle" | "running" | "done"; campaign: OutreachCampaign | null };
  slackNotified: boolean;
}
