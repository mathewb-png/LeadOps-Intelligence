import { LOCALIZED_EXCLUDE_KEYWORDS } from "@/lib/richardScoring";

/**
 * Categorized exclude keywords.  Only categories that could produce false
 * positives for a given campaign are included in the output.
 */

interface ExcludeCategory {
  id: string;
  label: string;
  en: string[];
  priority: number; // 1 = always include, 2 = include unless target overlaps, 3 = situational
}

const CATEGORIES: ExcludeCategory[] = [
  {
    id: "hr",
    label: "HR & Recruiting",
    priority: 1,
    en: [
      "hr", "human resources", "people ops", "people operations",
      "recruiting", "recruiter", "talent acquisition", "staffing",
    ],
  },
  {
    id: "finance",
    label: "Finance & Accounting",
    priority: 1,
    en: [
      "accounting", "accountant", "finance", "financial", "controller",
      "controlling", "treasurer", "payroll", "bookkeeper", "auditor",
      "comptable", "cpa",
    ],
  },
  {
    id: "legal",
    label: "Legal & Compliance",
    priority: 1,
    en: [
      "legal", "counsel", "attorney", "lawyer", "compliance",
      "paralegal", "litigation",
    ],
  },
  {
    id: "sales_support",
    label: "Sales & Account Mgmt",
    priority: 1,
    en: [
      "sales", "selling", "account executive", "account manager",
      "account", "accounts", "business development representative",
      "sdr", "bdr", "inside sales",
    ],
  },
  {
    id: "customer_service",
    label: "Customer Service & Support",
    priority: 1,
    en: [
      "customer success", "customer service", "client service",
      "support", "service desk", "help desk", "call center",
      "customer support",
    ],
  },
  {
    id: "admin",
    label: "Admin & Assistants",
    priority: 1,
    en: [
      "assistant", "associate", "coordinator", "secretary",
      "receptionist", "office manager", "administrative",
      "clerk", "data entry",
    ],
  },
  {
    id: "junior",
    label: "Junior & Intern",
    priority: 1,
    en: [
      "intern", "trainee", "apprentice", "junior", "entry level",
      "graduate", "student",
    ],
  },
  {
    id: "procurement",
    label: "Procurement & Purchasing",
    priority: 2,
    en: [
      "procurement", "purchasing", "buyer", "sourcing",
      "supply chain analyst",
    ],
  },
  {
    id: "retail",
    label: "Retail & Store",
    priority: 2,
    en: [
      "store", "store manager", "boutique", "boutique manager",
      "retail", "retail operations", "shop manager", "cashier",
      "visual merchandising", "merchandiser",
    ],
  },
  {
    id: "hospitality",
    label: "Hospitality & Events",
    priority: 3,
    en: [
      "hospitality", "event", "events", "exhibitions",
      "sponsorship", "sponsoring", "catering", "front desk",
      "concierge", "banquet",
    ],
  },
  {
    id: "training",
    label: "Training & Education",
    priority: 3,
    en: [
      "training", "learning", "academy", "instructor",
      "teacher", "tutor", "curriculum",
    ],
  },
  {
    id: "branch",
    label: "Branch & Counter",
    priority: 3,
    en: [
      "branch", "branch manager", "counter", "teller",
      "commerce detail",
    ],
  },
  {
    id: "misc_support",
    label: "Misc. Support Roles",
    priority: 2,
    en: [
      "supervisor", "deputy", "specialist", "technician",
      "dispatcher", "scheduler", "logistics coordinator",
    ],
  },
];

// Industries where certain categories should NOT be excluded
// (e.g. don't exclude "hospitality" if targeting Hotel industry)
const INDUSTRY_OVERRIDES: Record<string, string[]> = {
  "Hospitality":  ["hospitality"],
  "Restaurant":   ["hospitality"],
  "Hotel":        ["hospitality"],
  "Retail":       ["retail"],
  "eCommerce":    ["retail"],
  "Education":    ["training"],
  "Legal":        ["legal"],
  "Accounting":   ["finance"],
  "Insurance":    ["finance"],
  "FinTech":      ["finance"],
  "Banking":      ["finance"],
  "Recruiting":   ["hr"],
  "Staffing":     ["hr"],
  "Sales":        ["sales_support"],
};

export interface SmartExclusions {
  categories: { id: string; label: string; keywords: string[] }[];
  allKeywords: string[];
  totalCount: number;
}

export function buildSmartExclusions(
  targetIndustries: string[],
  targetTitles: string[],
  languageCode: string,
  activeUserExclusions: string[]
): SmartExclusions {
  // Determine which categories to suppress based on target industry
  const suppressedCategories = new Set<string>();
  for (const industry of targetIndustries) {
    const overrides = INDUSTRY_OVERRIDES[industry];
    if (overrides) {
      for (const catId of overrides) suppressedCategories.add(catId);
    }
  }

  // Also suppress categories if target titles contain keywords from that category
  const allTitlesLower = targetTitles.map((t) => t.toLowerCase()).join(" ");
  for (const cat of CATEGORIES) {
    if (cat.en.some((kw) => allTitlesLower.includes(kw))) {
      suppressedCategories.add(cat.id);
    }
  }

  // Build filtered categories
  const result: { id: string; label: string; keywords: string[] }[] = [];
  const allKeywords: string[] = [];

  for (const cat of CATEGORIES) {
    if (suppressedCategories.has(cat.id)) continue;

    const keywords = [...cat.en];
    allKeywords.push(...keywords);
    result.push({ id: cat.id, label: cat.label, keywords });
  }

  // Add localized exclude keywords (filtered by same category logic)
  const localized = LOCALIZED_EXCLUDE_KEYWORDS[languageCode] || [];
  if (localized.length > 0) {
    const localizedFiltered = localized.filter(
      (kw) => !allKeywords.some((ek) => ek.toLowerCase() === kw.toLowerCase())
    );
    if (localizedFiltered.length > 0) {
      allKeywords.push(...localizedFiltered);
      result.push({
        id: "localized",
        label: `Localized (${languageCode.toUpperCase()})`,
        keywords: localizedFiltered,
      });
    }
  }

  // Add user-specific exclusions
  if (activeUserExclusions.length > 0) {
    const userOnly = activeUserExclusions.filter(
      (w) => !allKeywords.some((ek) => ek.toLowerCase() === w.toLowerCase())
    );
    if (userOnly.length > 0) {
      allKeywords.push(...userOnly);
      result.push({ id: "custom", label: "Custom", keywords: userOnly });
    }
  }

  return {
    categories: result,
    allKeywords,
    totalCount: allKeywords.length,
  };
}
