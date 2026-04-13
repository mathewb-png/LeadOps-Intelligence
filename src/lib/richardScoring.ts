import { Lead, LeadTier, BatchValueBreakdown, RefinementSuggestion } from "@/types";

const PRIMARY_KEYWORDS = [
  "head of seo", "seo lead", "seo director", "seo manager",
  "head of growth", "growth lead", "vp growth", "director of growth",
  "head of marketing", "marketing director", "vp marketing", "cmo",
  "head of finops", "finops lead", "finops director", "finops manager",
  "cloud cost", "cloud economics",
];

const STAKEHOLDER_KEYWORDS = [
  "gtm", "go-to-market", "go to market",
  "operations", "vp operations", "head of operations", "coo",
  "product lead", "head of product", "vp product", "cpo",
  "director of product", "product director",
];

const INFLUENCE_KEYWORDS = [
  "founder", "co-founder", "cofounder",
  "ceo", "chief executive",
  "managing director", "president",
  "partner", "general partner",
];

const PERIPHERAL_KEYWORDS = [
  "it support", "it specialist", "systems admin", "sysadmin",
  "finance analyst", "financial analyst", "accountant",
  "it manager", "it director",
  "finance manager", "finance director",
];

const IRRELEVANT_KEYWORDS = [
  "sales rep", "sales associate", "sdr", "bdr", "account executive",
  "hr ", "human resources", "people ops", "recruiter", "talent",
  "admin", "administrative", "office manager", "receptionist",
  "junior", "intern", "assistant", "coordinator", "clerk",
  "customer support", "customer service",
];

export function computeRichardScore(jobTitle: string): number {
  const t = jobTitle.toLowerCase().trim();

  for (const kw of PRIMARY_KEYWORDS) {
    if (t.includes(kw)) return 10;
  }
  if (/\b(seo|growth|finops)\b/.test(t) && /\b(head|lead|director|vp|chief|senior)\b/.test(t)) {
    return 9;
  }

  for (const kw of STAKEHOLDER_KEYWORDS) {
    if (t.includes(kw)) return 8;
  }
  if (/\b(gtm|operations|product)\b/.test(t) && /\b(head|lead|director|vp|chief|manager)\b/.test(t)) {
    return 7;
  }

  for (const kw of INFLUENCE_KEYWORDS) {
    if (t.includes(kw)) return 5;
  }
  if (/\bceo\b/.test(t) || /\bfounder\b/.test(t)) {
    return 6;
  }

  for (const kw of PERIPHERAL_KEYWORDS) {
    if (t.includes(kw)) return 2;
  }
  if (/\b(it|finance|accounting)\b/.test(t)) {
    return 3;
  }

  for (const kw of IRRELEVANT_KEYWORDS) {
    if (t.includes(kw)) return 0;
  }
  if (/\b(sales|hr|admin|junior|intern)\b/.test(t)) {
    return 0;
  }

  return 4;
}

export function scoreToTier(score: number): LeadTier {
  if (score >= 9) return "primary";
  if (score >= 7) return "stakeholder";
  if (score >= 4) return "influence";
  if (score >= 1) return "peripheral";
  return "irrelevant";
}

export function tierLabel(tier: LeadTier): string {
  const map: Record<LeadTier, string> = {
    primary: "Primary (9-10)",
    stakeholder: "Stakeholder (7-8)",
    influence: "Influence (4-6)",
    peripheral: "Peripheral (1-3)",
    irrelevant: "Irrelevant (0)",
  };
  return map[tier];
}

export function tierColor(tier: LeadTier) {
  const map: Record<LeadTier, { bg: string; text: string; ring: string; dot: string }> = {
    primary:     { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-500/30", dot: "bg-emerald-500" },
    stakeholder: { bg: "bg-blue-50 dark:bg-blue-950",      text: "text-blue-700 dark:text-blue-300",       ring: "ring-blue-500/30",    dot: "bg-blue-500" },
    influence:   { bg: "bg-amber-50 dark:bg-amber-950",    text: "text-amber-700 dark:text-amber-300",     ring: "ring-amber-500/30",   dot: "bg-amber-500" },
    peripheral:  { bg: "bg-orange-50 dark:bg-orange-950",  text: "text-orange-700 dark:text-orange-300",   ring: "ring-orange-500/30",  dot: "bg-orange-500" },
    irrelevant:  { bg: "bg-red-50 dark:bg-red-950",        text: "text-red-700 dark:text-red-300",         ring: "ring-red-500/30",     dot: "bg-red-500" },
  };
  return map[tier];
}

export function computeBatchValue(leads: Lead[]): BatchValueBreakdown {
  const buckets = { s910: 0, s78: 0, s46: 0, s13: 0, s0: 0 };

  for (const lead of leads) {
    const s = lead.richardScore;
    if (s >= 9) buckets.s910++;
    else if (s >= 7) buckets.s78++;
    else if (s >= 4) buckets.s46++;
    else if (s >= 1) buckets.s13++;
    else buckets.s0++;
  }

  return {
    score9to10: { count: buckets.s910, points: buckets.s910 * 10 },
    score7to8:  { count: buckets.s78,  points: buckets.s78 * 8 },
    score4to6:  { count: buckets.s46,  points: buckets.s46 * 5 },
    score1to3:  { count: buckets.s13,  points: buckets.s13 * 2 },
    score0:     { count: buckets.s0,   points: 0 },
    total:
      buckets.s910 * 10 +
      buckets.s78 * 8 +
      buckets.s46 * 5 +
      buckets.s13 * 2,
  };
}

const NOISE_STOPWORDS = new Set([
  "of", "the", "and", "at", "in", "for", "to", "a", "an", "&", "-", "/", "or",
]);

export function extractRefinementSuggestions(leads: Lead[]): RefinementSuggestion[] {
  const lowScoreLeads = leads.filter((l) => l.richardScore <= 2);
  const wordMap = new Map<string, { count: number; titles: Set<string> }>();

  for (const lead of lowScoreLeads) {
    const words = lead.jobTitle
      .toLowerCase()
      .split(/[\s,/&\-()]+/)
      .filter((w) => w.length > 1 && !NOISE_STOPWORDS.has(w));

    for (const word of new Set(words)) {
      const entry = wordMap.get(word) || { count: 0, titles: new Set<string>() };
      entry.count++;
      entry.titles.add(lead.jobTitle);
      wordMap.set(word, entry);
    }
  }

  return Array.from(wordMap.entries())
    .filter(([, v]) => v.count >= 1)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20)
    .map(([word, v]) => ({
      word,
      occurrences: v.count,
      fromTitles: Array.from(v.titles),
    }));
}
