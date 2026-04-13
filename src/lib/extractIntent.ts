/**
 * Strips email filler, greetings, signatures, and conversational noise from
 * raw campaign goal text.  Returns a structured intent with the cleaned goal
 * string plus any industries, titles, and company types it could extract.
 */

export interface CampaignIntent {
  cleanedGoal: string;
  industries: string[];
  titles: string[];
  companyTypes: string[];
}

const EMAIL_FILLER = [
  /^(hi|hello|hey|dear|good\s+(morning|afternoon|evening))[^.!\n]*/gim,
  /^(regards|best|thanks|thank\s+you|cheers|sincerely|kind\s+regards)[^.!\n]*/gim,
  /^sent\s+from\s+.*/gim,
  /^-{2,}.*$/gm,
  /^_{2,}.*$/gm,
  /^\s*(from|to|cc|bcc|subject|date):\s+.*/gim,
  /\b(please\s+)?(see|find|check|review|refer\s+to)\s+(the\s+)?(below|above|attached|following|account\s+criteria\s+email)[^.!\n]*/gi,
  /\b(as\s+)?(discussed|mentioned|per\s+our\s+conversation|per\s+our\s+call)[^.!\n]*/gi,
  /^\d+[\.\)]\s*/gm,
  /^[-•·]\s*/gm,
  /\betc\.{0,3}\b/gi,
  /\bplease\b/gi,
  /\bwe\s+would\s+like\s+to\b/gi,
  /\bwe\s+want\s+to\b/gi,
  /\bwe\s+need\s+to\b/gi,
  /\bI\s+would\s+like\s+to\b/gi,
  /\bI\s+want\s+to\b/gi,
  /\bI\s+need\s+to\b/gi,
  /\bwe\s+are\s+looking\s+(for|to)\b/gi,
  /\bsome\s+titles\s+to\s+consider\s*(here)?:?\b/gi,
  /\baccount\s+criteria\b/gi,
  /\bemail\s+below\b/gi,
];

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "Roofing": ["roofing", "roofer", "roof"],
  "Solar": ["solar", "photovoltaic", "pv panels"],
  "HVAC": ["hvac", "heating", "ventilation", "air conditioning", "climatisation"],
  "Cleaning": ["cleaning", "janitorial", "nettoyage"],
  "Pest Control": ["pest", "pestcontrol", "pest control", "exterminator", "nuisible"],
  "Landscaping": ["landscaping", "landscape", "lawn", "garden", "paysagiste"],
  "Plumbing": ["plumbing", "plumber", "plomberie"],
  "Electrical": ["electrical", "electrician", "électricien"],
  "Construction": ["construction", "building", "contractor", "bâtiment"],
  "Real Estate": ["real estate", "realty", "property", "immobilier"],
  "SaaS": ["saas", "software as a service"],
  "eCommerce": ["ecommerce", "e-commerce", "online store", "shopify"],
  "FinTech": ["fintech", "financial technology"],
  "MarTech": ["martech", "marketing technology"],
  "Cloud": ["cloud", "aws", "azure", "gcp"],
  "FinOps": ["finops", "cloud cost", "cloud spend"],
  "Cybersecurity": ["cybersecurity", "infosec", "security"],
  "Healthcare": ["healthcare", "health", "medical", "santé"],
  "Insurance": ["insurance", "assurance"],
  "Automotive": ["automotive", "auto", "automobile"],
  "Restaurant": ["restaurant", "food service", "restauration"],
  "Hospitality": ["hospitality", "hotel", "hôtellerie"],
  "Retail": ["retail", "store", "commerce"],
  "Manufacturing": ["manufacturing", "factory", "fabrication"],
  "Logistics": ["logistics", "shipping", "freight", "transport"],
  "Education": ["education", "edtech", "training", "formation"],
  "Legal": ["legal", "law firm", "juridique", "avocat"],
  "Accounting": ["accounting", "bookkeeping", "comptabilité"],
  "Marketing": ["marketing", "seo", "growth", "digital marketing"],
  "Consulting": ["consulting", "consultancy", "conseil"],
};

const TITLE_PATTERNS = [
  /\b(ceo|cfo|cto|coo|cmo|cio|cpo)\b/gi,
  /\b(founder|co-founder|cofounder|owner|partner)\b/gi,
  /\b(vp|vice\s+president)\s+(of\s+)?[\w\s]+/gi,
  /\b(director|directeur|directrice)\s+(of\s+)?[\w\s]+/gi,
  /\b(head\s+of)\s+[\w\s]+/gi,
  /\b(manager|responsable|gérant)\s+(of\s+|de\s+)?[\w\s]+/gi,
  /\b(chief\s+\w+\s+officer)\b/gi,
];

const COMPANY_TYPE_KEYWORDS: Record<string, string[]> = {
  "commercial": ["commercial", "commerciale", "commerciaux"],
  "residential": ["residential", "résidentiel", "maison", "homes"],
  "industrial": ["industrial", "industriel", "usine"],
  "offices": ["office", "offices", "bureau", "bureaux"],
  "buildings": ["building", "buildings", "bâtiment", "immeuble"],
  "restaurants": ["restaurant", "restaurants"],
  "retail": ["retail", "store", "magasin", "boutique"],
  "enterprise": ["enterprise", "corporate", "fortune 500"],
  "startup": ["startup", "start-up", "growth-stage"],
  "mid-market": ["mid-market", "midmarket", "mid market", "smb", "sme"],
};

function extractListItems(text: string): string[] {
  const items: string[] = [];
  const lines = text.split(/\n/);
  for (const line of lines) {
    const cleaned = line.replace(/^\s*[-•·\d.)]+\s*/, "").trim();
    if (cleaned.length >= 3 && cleaned.length <= 80 && !cleaned.includes("@")) {
      items.push(cleaned);
    }
  }
  return items;
}

export function extractCampaignIntent(rawText: string): CampaignIntent {
  let text = rawText;

  for (const pattern of EMAIL_FILLER) {
    text = text.replace(pattern, " ");
  }

  text = text.replace(/\s+/g, " ").trim();

  const lower = rawText.toLowerCase();
  const industries: string[] = [];
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      industries.push(industry);
    }
  }

  const titles: string[] = [];
  for (const pattern of TITLE_PATTERNS) {
    const matches = rawText.matchAll(new RegExp(pattern));
    for (const match of matches) {
      const title = match[0].trim();
      if (title.length >= 2 && !titles.some((t) => t.toLowerCase() === title.toLowerCase())) {
        titles.push(title);
      }
    }
  }

  const companyTypes: string[] = [];
  for (const [type, keywords] of Object.entries(COMPANY_TYPE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      companyTypes.push(type);
    }
  }

  const listItems = extractListItems(rawText);
  for (const item of listItems) {
    const itemLower = item.toLowerCase();
    for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
      if (keywords.some((kw) => itemLower.includes(kw)) && !industries.includes(industry)) {
        industries.push(industry);
      }
    }
  }

  let cleanedGoal = text;
  if (industries.length > 0) {
    cleanedGoal = industries.join(", ");
    if (companyTypes.length > 0) {
      cleanedGoal += ` (${companyTypes.join(", ")})`;
    }
  } else if (listItems.length > 0) {
    cleanedGoal = listItems.join(", ");
  }

  return { cleanedGoal, industries, titles, companyTypes };
}
