import { PersonaOutput, CampaignLocale, Lead } from "@/types";
import { ICP_EXCLUDE_KEYWORDS, LOCALIZED_EXCLUDE_KEYWORDS } from "@/lib/richardScoring";

export interface SearchPromptFields {
  companyJobTitle: string;
  personTitles: string[];
  personLocations: string[];
  companyKeywords: string[];
  excludeTitles: string[];
  seniority: string[];
  prompt: string;
}

const SENIORITY_MAP: Record<string, string[]> = {
  c_suite: ["ceo", "cfo", "cto", "coo", "cmo", "cio", "cpo", "chief"],
  founder: ["founder", "co-founder", "cofounder"],
  owner: ["owner", "proprietor"],
  partner: ["partner"],
  vp: ["vp", "vice president", "vice-president"],
  director: ["director", "directeur", "directrice"],
  head: ["head of", "head,"],
  manager: ["manager", "gérant", "gerant", "responsable", "lead"],
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

function deriveCompanyJobTitle(campaignGoal: string, persona: PersonaOutput): string {
  const goal = campaignGoal.trim().toLowerCase();

  const leadTypePatterns = [
    /(?:find|get|build|generate|create|search)\s+(.+?)\s+(?:leads?|contacts?|list)/i,
    /(.+?)\s+(?:leads?|contacts?|prospects?)/i,
  ];

  for (const pattern of leadTypePatterns) {
    const match = campaignGoal.match(pattern);
    if (match && match[1]) {
      const extracted = match[1].replace(/^(?:me|us|a|an|the)\s+/i, "").trim();
      if (extracted.length > 2 && extracted.length < 60) return extracted;
    }
  }

  if (persona.industryKeywords.length > 0) {
    return persona.industryKeywords.slice(0, 3).join(" ") + " leads";
  }

  if (goal.length > 0 && goal.length <= 50) return campaignGoal.trim();

  return "target leads";
}

function buildCondensedPrompt(
  companyJobTitle: string,
  keywords: string[],
  locations: string[],
  titles: string[],
  excludes: string[]
): string {
  const MAX = 250;

  const kwPart = keywords.slice(0, 6).join(", ");
  const locPart = locations.slice(0, 4).join(", ");
  const titlePart = titles.slice(0, 6).join(", ");

  let prompt = `build ${companyJobTitle} list: ${kwPart}`;
  if (locPart) prompt += ` in ${locPart}`;
  prompt += `. target: ${titlePart}`;

  if (excludes.length > 0) {
    const exPart = excludes.slice(0, 3).join(", ");
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

function mergeExcludes(activeExclusions: string[], languageCode: string): string[] {
  const set = new Set<string>();
  for (const w of ICP_EXCLUDE_KEYWORDS) set.add(w);
  const localized = LOCALIZED_EXCLUDE_KEYWORDS[languageCode] || [];
  for (const w of localized) set.add(w);
  for (const w of activeExclusions) set.add(w);
  return Array.from(set);
}

export function buildSearchPrompt(
  campaignGoal: string,
  persona: PersonaOutput,
  locale: CampaignLocale,
  exclusions: string[],
  leads?: Lead[]
): SearchPromptFields {
  const personTitles = [...persona.tier1Titles, ...persona.tier2Titles].slice(0, 15);
  const companyKeywords = extractIndustryKeywords(campaignGoal, persona);
  const personLocations = extractLocations(locale, leads);
  const seniority = detectSeniority(personTitles);
  const excludeTitles = mergeExcludes(exclusions, locale.languageCode);
  const companyJobTitle = deriveCompanyJobTitle(campaignGoal, persona);

  const prompt = buildCondensedPrompt(companyJobTitle, companyKeywords, personLocations, personTitles, excludeTitles);

  return {
    companyJobTitle,
    personTitles,
    personLocations,
    companyKeywords,
    excludeTitles,
    seniority,
    prompt,
  };
}
