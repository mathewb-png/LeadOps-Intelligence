/**
 * Derive a short, focused exclude list from the TARGET titles themselves.
 * If you're targeting "VP Marketing", the false positives are lower-level
 * marketing roles — not accountants or HR managers.
 * Keeps the list to ~10-15 entries max so the external tool stays usable.
 */

const NOISE_SUFFIXES = [
  "Coordinator", "Associate", "Assistant", "Representative",
  "Intern", "Trainee", "Clerk", "Specialist", "Analyst",
];

const NOISE_PREFIXES = ["Junior", "Entry Level"];

function extractCoreFunctions(targetTitles: string[]): string[] {
  const functions = new Set<string>();

  for (const title of targetTitles) {
    const cleaned = title
      .replace(/\b(VP|Vice President|SVP|EVP|Chief|Head of|Director of|Senior|Sr\.?|Manager of|Lead)\b/gi, "")
      .replace(/\b(C-Suite|C-Level)\b/gi, "")
      .replace(/\bof\b/gi, "")
      .trim()
      .replace(/\s{2,}/g, " ");

    if (cleaned.length > 1) {
      functions.add(cleaned);
    }
  }

  return Array.from(functions);
}

export interface SmartExclusions {
  categories: { id: string; label: string; keywords: string[] }[];
  allKeywords: string[];
  totalCount: number;
}

export function buildSmartExclusions(
  _targetIndustries: string[],
  targetTitles: string[],
  _languageCode: string,
  activeUserExclusions: string[]
): SmartExclusions {
  if (targetTitles.length === 0) {
    return { categories: [], allKeywords: [], totalCount: 0 };
  }

  const coreFunctions = extractCoreFunctions(targetTitles);
  const targetLower = new Set(targetTitles.map((t) => t.toLowerCase()));
  const generated = new Set<string>();

  for (const fn of coreFunctions) {
    for (const suffix of NOISE_SUFFIXES) {
      const candidate = `${fn} ${suffix}`;
      if (!targetLower.has(candidate.toLowerCase())) {
        generated.add(candidate);
      }
    }
    for (const prefix of NOISE_PREFIXES) {
      const candidate = `${prefix} ${fn}`;
      if (!targetLower.has(candidate.toLowerCase())) {
        generated.add(candidate);
      }
    }
  }

  // Cap to 15 to stay lean
  const derived = Array.from(generated).slice(0, 15);

  const categories: { id: string; label: string; keywords: string[] }[] = [];
  const allKeywords: string[] = [];

  if (derived.length > 0) {
    categories.push({
      id: "derived",
      label: "Lower-Level Noise",
      keywords: derived,
    });
    allKeywords.push(...derived);
  }

  if (activeUserExclusions.length > 0) {
    const userOnly = activeUserExclusions.filter(
      (w) => !allKeywords.some((ek) => ek.toLowerCase() === w.toLowerCase())
    );
    if (userOnly.length > 0) {
      categories.push({ id: "custom", label: "Custom", keywords: userOnly });
      allKeywords.push(...userOnly);
    }
  }

  return {
    categories,
    allKeywords,
    totalCount: allKeywords.length,
  };
}
