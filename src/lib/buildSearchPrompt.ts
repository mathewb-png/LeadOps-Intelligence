import { PersonaOutput, CampaignLocale, Lead } from "@/types";
import { buildSmartExclusions, SmartExclusions } from "@/lib/smartExclusions";

export interface SearchPromptFields {
  jobTitles: string[];
  excludeJobTitles: SmartExclusions;
  locations: string[];
  excludeLocations: string[];
  companyKeywords: string[];
  seniority: string[];
  prompt: string;
}

export type { SmartExclusions };

// Matches the exact seniority values in the external tool
const SENIORITY_MAP: Record<string, string[]> = {
  c_suite: ["ceo", "cfo", "cto", "coo", "cmo", "cio", "cpo", "chief"],
  founder: ["founder", "co-founder", "cofounder"],
  owner: ["owner", "proprietor"],
  partner: ["partner"],
  vp: ["vp", "vice president", "vice-president"],
  director: ["director", "directeur", "directrice"],
  head: ["head of", "head,"],
  manager: ["manager", "gérant", "gerant", "responsable"],
  senior: ["senior", "sr.", "principal"],
};

function detectSeniority(titles: string[]): string[] {
  const found = new Set<string>();
  for (const title of titles) {
    const lower = title.toLowerCase();
    for (const [level, keywords] of Object.entries(SENIORITY_MAP)) {
      if (keywords.some((kw) => lower.includes(kw))) {
        found.add(level);
      }
    }
  }
  return Array.from(found);
}

function extractLocations(locale: CampaignLocale, leads?: Lead[]): string[] {
  const locs: string[] = [];

  if (leads && leads.length > 0) {
    const locCounts = new Map<string, number>();
    for (const lead of leads) {
      if (lead.location) {
        const parts = lead.location.split(",").map((p) => p.trim());
        for (const part of parts) {
          if (part) locCounts.set(part, (locCounts.get(part) || 0) + 1);
        }
      }
    }
    const sorted = Array.from(locCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([loc]) => loc);

    for (const loc of sorted) {
      if (!locs.some((l) => l.toLowerCase() === loc.toLowerCase())) {
        locs.push(loc);
      }
    }
  }

  if (locale.region && !locs.some((l) => l.toLowerCase() === locale.region!.toLowerCase())) {
    locs.push(locale.region);
  }
  if (locale.country && locale.country !== "Global" && !locs.some((l) => l.toLowerCase() === locale.country.toLowerCase())) {
    locs.push(locale.country);
  }
  if (locale.countryCode && locale.countryCode !== "GLOBAL" && !locs.some((l) => l.toLowerCase() === locale.countryCode.toLowerCase())) {
    locs.push(locale.countryCode.toLowerCase());
  }

  return locs.slice(0, 12);
}

function extractIndustryKeywords(campaignGoal: string, persona: PersonaOutput): string[] {
  const keywords = [...persona.industryKeywords];

  const goalWords = campaignGoal
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const stopWords = new Set([
    "that", "this", "with", "from", "have", "been", "will", "want", "need",
    "find", "looking", "search", "leads", "people", "companies", "build",
    "list", "target", "campaign", "make", "create", "would", "like", "also",
    "could", "should", "please", "help", "think", "know", "about", "some",
    "more", "than", "very", "just", "into", "them", "then", "there", "their",
    "they", "what", "when", "where", "which", "while", "your", "each",
    "every", "other", "such", "only", "does", "doing", "done", "being",
    "were", "went", "discussed", "yesterday", "today", "tomorrow", "recently",
    "currently", "already", "here", "these", "those", "well", "much", "many",
    "most", "best", "good", "work", "working", "using", "used", "across",
  ]);

  for (const word of goalWords) {
    if (
      !stopWords.has(word) &&
      !keywords.some((kw) => kw.toLowerCase().includes(word))
    ) {
      keywords.push(word);
    }
  }

  return [...new Set(keywords)].slice(0, 10);
}

function buildCondensedPrompt(
  keywords: string[],
  locations: string[],
  titles: string[],
  excludes: string[]
): string {
  const MAX = 250;

  const kwPart = keywords.slice(0, 6).join(", ");
  const locPart = locations.slice(0, 4).join(", ");
  const titlePart = titles.slice(0, 6).join(", ");

  let prompt = `${kwPart} in ${locPart}. titles: ${titlePart}`;

  if (excludes.length > 0) {
    const exPart = excludes.slice(0, 4).join(", ");
    const withExclude = `${prompt}. exclude: ${exPart}`;
    if (withExclude.length <= MAX) {
      prompt = withExclude;
    }
  }

  if (prompt.length > MAX) {
    prompt = prompt.slice(0, MAX - 3) + "...";
  }

  return prompt;
}

export function buildSearchPrompt(
  campaignGoal: string,
  persona: PersonaOutput,
  locale: CampaignLocale,
  exclusions: string[],
  leads?: Lead[]
): SearchPromptFields {
  const jobTitles = [...persona.tier1Titles, ...persona.tier2Titles].slice(0, 15);
  const companyKeywords = extractIndustryKeywords(campaignGoal, persona);
  const locations = extractLocations(locale, leads);
  const seniority = detectSeniority(jobTitles);
  const excludeLocations: string[] = [];

  const excludeJobTitles = buildSmartExclusions(
    persona.industryKeywords,
    jobTitles,
    locale.languageCode,
    exclusions
  );

  const prompt = buildCondensedPrompt(companyKeywords, locations, jobTitles, excludeJobTitles.allKeywords);

  return {
    jobTitles,
    excludeJobTitles,
    locations,
    excludeLocations,
    companyKeywords,
    seniority,
    prompt,
  };
}
