import { LOCALIZED_EXCLUDE_KEYWORDS } from "@/lib/richardScoring";

/**
 * Smart exclusion engine.  Uses SPECIFIC role titles (not single words)
 * to avoid nuking legitimate results.
 *
 * e.g. "sales" would kill "VP Sales" — but "Sales Representative" won't.
 */

interface ExcludeCategory {
  id: string;
  label: string;
  en: string[];
}

const CATEGORIES: ExcludeCategory[] = [
  {
    id: "hr",
    label: "HR & Recruiting",
    en: [
      "HR Manager", "HR Director", "HR Coordinator", "HR Specialist",
      "Human Resources Manager", "Human Resources Director",
      "People Operations Manager", "Talent Acquisition Manager",
      "Talent Acquisition Specialist", "Recruiter", "Senior Recruiter",
      "Staffing Manager", "Staffing Coordinator",
    ],
  },
  {
    id: "finance",
    label: "Finance & Accounting",
    en: [
      "Accountant", "Senior Accountant", "Staff Accountant",
      "Accounting Manager", "Accounting Clerk",
      "Accounts Payable", "Accounts Receivable",
      "Financial Analyst", "Finance Manager",
      "Controller", "Comptroller", "Bookkeeper",
      "Treasurer", "Payroll Manager", "Payroll Specialist",
      "Auditor", "Tax Manager", "Tax Specialist",
    ],
  },
  {
    id: "legal",
    label: "Legal & Compliance",
    en: [
      "Legal Counsel", "General Counsel", "Attorney",
      "Paralegal", "Legal Assistant", "Legal Secretary",
      "Compliance Manager", "Compliance Officer",
      "Litigation Manager",
    ],
  },
  {
    id: "sales_reps",
    label: "Sales Reps & SDRs",
    en: [
      "Sales Representative", "Sales Associate", "Sales Coordinator",
      "Inside Sales Representative", "Outside Sales Representative",
      "Sales Development Representative", "SDR", "BDR",
      "Account Executive", "Account Coordinator",
      "Sales Engineer", "Sales Assistant",
      "Telesales", "Sales Consultant",
    ],
  },
  {
    id: "customer_service",
    label: "Customer Service",
    en: [
      "Customer Service Representative", "Customer Service Agent",
      "Customer Support Specialist", "Customer Support Agent",
      "Client Service Representative", "Client Service Coordinator",
      "Customer Success Manager", "Customer Success Associate",
      "Help Desk Analyst", "Help Desk Technician",
      "Service Desk Analyst", "Call Center Agent",
      "Call Center Manager", "Support Specialist",
    ],
  },
  {
    id: "admin",
    label: "Admin & Assistants",
    en: [
      "Administrative Assistant", "Executive Assistant",
      "Office Assistant", "Office Administrator",
      "Receptionist", "Front Desk Clerk",
      "Data Entry Clerk", "Data Entry Specialist",
      "Office Coordinator", "Administrative Coordinator",
      "Secretary", "File Clerk",
    ],
  },
  {
    id: "junior",
    label: "Junior & Entry-Level",
    en: [
      "Intern", "Trainee", "Apprentice",
      "Junior Analyst", "Junior Associate",
      "Graduate Trainee", "Entry Level Associate",
    ],
  },
  {
    id: "procurement",
    label: "Procurement",
    en: [
      "Procurement Specialist", "Procurement Officer",
      "Purchasing Agent", "Purchasing Coordinator",
      "Buyer", "Senior Buyer",
      "Supply Chain Analyst",
    ],
  },
  {
    id: "retail_store",
    label: "Retail & Store",
    en: [
      "Store Manager", "Assistant Store Manager",
      "Retail Associate", "Retail Sales Associate",
      "Store Associate", "Store Clerk",
      "Cashier", "Visual Merchandiser",
      "Shop Assistant", "Boutique Manager",
    ],
  },
  {
    id: "hospitality",
    label: "Hospitality & Events",
    en: [
      "Event Coordinator", "Event Planner", "Event Manager",
      "Concierge", "Banquet Manager", "Banquet Captain",
      "Catering Manager", "Catering Coordinator",
      "Front Desk Agent", "Bellhop",
    ],
  },
  {
    id: "training",
    label: "Training & Education",
    en: [
      "Training Coordinator", "Training Manager",
      "Learning Specialist", "Instructional Designer",
      "Teacher", "Tutor", "Instructor",
      "Curriculum Developer",
    ],
  },
];

const INDUSTRY_OVERRIDES: Record<string, string[]> = {
  "Hospitality":  ["hospitality"],
  "Restaurant":   ["hospitality"],
  "Hotel":        ["hospitality"],
  "Retail":       ["retail_store"],
  "eCommerce":    ["retail_store"],
  "Education":    ["training"],
  "Legal":        ["legal"],
  "Accounting":   ["finance"],
  "Insurance":    ["finance"],
  "FinTech":      ["finance"],
  "Banking":      ["finance"],
  "Recruiting":   ["hr"],
  "Staffing":     ["hr"],
};

// Localized titles (specific role titles, not single words)
const LOCALIZED_TITLES: Record<string, string[]> = {
  fr: [
    "Chargé de clientèle", "Gestionnaire de comptes", "Comptable",
    "Responsable RH", "DRH", "Responsable recrutement",
    "Recruteur", "Recruteuse", "Conseiller juridique", "Avocat",
    "Responsable paie", "Trésorier", "Acheteur", "Acheteuse",
    "Assistante administrative", "Coordinateur", "Coordinatrice",
    "Stagiaire", "Secrétaire", "Responsable magasin",
    "Hôtesse d'accueil", "Agent d'accueil",
    "Gestionnaire de paie", "Responsable comptable",
    "Agent commercial", "Chargé de communication",
  ],
  de: [
    "Buchhalter", "Personalleiter", "HR-Manager",
    "Recruiter", "Rechtsanwalt", "Jurist",
    "Sachbearbeiter", "Sekretariat", "Empfang",
    "Filialleiter", "Verkäufer", "Praktikant",
    "Assistent", "Koordinator", "Ausbildung",
  ],
  es: [
    "Contador", "Asistente administrativo", "Recepcionista",
    "Reclutador", "Abogado", "Pasante", "Becario",
    "Gerente de tienda", "Coordinador", "Especialista de nómina",
    "Ejecutivo de cuentas", "Servicio al cliente",
  ],
  it: [
    "Contabile", "Assistente amministrativo", "Receptionist",
    "Recruiter", "Avvocato", "Stagista", "Tirocinante",
    "Responsabile negozio", "Coordinatore",
    "Servizio clienti", "Responsabile HR",
  ],
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
  const suppressedCategories = new Set<string>();
  for (const industry of targetIndustries) {
    const overrides = INDUSTRY_OVERRIDES[industry];
    if (overrides) {
      for (const catId of overrides) suppressedCategories.add(catId);
    }
  }

  // Check if any target titles closely match an exclude title
  // (avoids suppressing "Sales Reps" category when user targets "VP Sales")
  const targetLower = new Set(targetTitles.map((t) => t.toLowerCase()));

  const result: { id: string; label: string; keywords: string[] }[] = [];
  const allKeywords: string[] = [];

  for (const cat of CATEGORIES) {
    if (suppressedCategories.has(cat.id)) continue;

    // Filter out any exclude title that exactly matches a target title
    const safe = cat.en.filter(
      (kw) => !targetLower.has(kw.toLowerCase())
    );

    if (safe.length === 0) continue;

    allKeywords.push(...safe);
    result.push({ id: cat.id, label: cat.label, keywords: safe });
  }

  // Localized specific titles
  const localized = LOCALIZED_TITLES[languageCode] || [];
  if (localized.length > 0) {
    const localizedSafe = localized.filter(
      (kw) =>
        !targetLower.has(kw.toLowerCase()) &&
        !allKeywords.some((ek) => ek.toLowerCase() === kw.toLowerCase())
    );
    if (localizedSafe.length > 0) {
      allKeywords.push(...localizedSafe);
      result.push({
        id: "localized",
        label: `Localized (${languageCode.toUpperCase()})`,
        keywords: localizedSafe,
      });
    }
  }

  // User custom exclusions
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
