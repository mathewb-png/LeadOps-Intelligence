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
}

export type LeadTier = "primary" | "stakeholder" | "influence" | "peripheral" | "irrelevant";

export interface CampaignGoal {
  id: string;
  description: string;
  createdAt: string;
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
