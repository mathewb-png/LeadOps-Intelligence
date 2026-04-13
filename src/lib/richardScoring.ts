import { Lead, LeadTier, BatchValueBreakdown, RefinementSuggestion } from "@/types";

// ─── Full ICP Scoring Rules (from Richard's framework) ─────────────────────

export interface ScoringRule {
  trigger: string;
  score: number;
  reason: string;
}

export const SCORING_RULES: ScoringRule[] = [
  { trigger: "chief marketing officer", score: 10, reason: "Direct marketing owner" },
  { trigger: "cmo", score: 10, reason: "Direct marketing owner" },
  { trigger: "chief growth officer", score: 10, reason: "Executive growth owner" },
  { trigger: "cgo", score: 10, reason: "Executive growth owner" },
  { trigger: "chief revenue officer", score: 10, reason: "CRO marketing ownership" },
  { trigger: "vp marketing", score: 10, reason: "Direct marketing owner" },
  { trigger: "svp marketing", score: 10, reason: "SVP Marketing keyword" },
  { trigger: "global vp marketing", score: 10, reason: "Global Marketing leadership" },
  { trigger: "director of marketing", score: 10, reason: "Direct marketing owner" },
  { trigger: "director marketing", score: 10, reason: "Marketing leadership" },
  { trigger: "head of marketing", score: 10, reason: "Direct marketing owner" },
  { trigger: "head marketing", score: 10, reason: "Marketing leadership" },
  { trigger: "vp growth", score: 10, reason: "Direct growth owner" },
  { trigger: "director of growth", score: 10, reason: "Direct growth owner" },
  { trigger: "director growth", score: 10, reason: "Growth ownership" },
  { trigger: "head of growth", score: 10, reason: "Direct growth owner" },
  { trigger: "head growth", score: 10, reason: "Growth ownership" },
  { trigger: "vp seo", score: 10, reason: "Direct SEO owner" },
  { trigger: "director of seo", score: 10, reason: "Direct SEO owner" },
  { trigger: "director seo", score: 10, reason: "SEO ownership" },
  { trigger: "head of seo", score: 10, reason: "Direct SEO owner" },
  { trigger: "head seo", score: 10, reason: "SEO ownership" },
  { trigger: "vp digital marketing", score: 10, reason: "Direct digital owner" },
  { trigger: "director of digital marketing", score: 10, reason: "Direct digital owner" },
  { trigger: "director digital marketing", score: 10, reason: "Digital Marketing leadership" },
  { trigger: "head of digital marketing", score: 10, reason: "Direct digital owner" },
  { trigger: "head digital marketing", score: 10, reason: "Digital Marketing leadership" },
  { trigger: "global digital marketing director", score: 10, reason: "Global pipeline ownership" },
  { trigger: "international marketing director", score: 10, reason: "Global pipeline ownership" },
  { trigger: "vp demand generation", score: 10, reason: "Pipeline owner" },
  { trigger: "director of demand generation", score: 10, reason: "Pipeline owner" },
  { trigger: "director demand generation", score: 10, reason: "Demand Gen ownership" },
  { trigger: "head of demand generation", score: 10, reason: "Pipeline owner" },
  { trigger: "head demand generation", score: 10, reason: "Demand Gen ownership" },
  { trigger: "vp performance marketing", score: 10, reason: "Acquisition owner" },
  { trigger: "director of performance marketing", score: 10, reason: "Acquisition owner" },
  { trigger: "director performance marketing", score: 10, reason: "Performance ownership" },
  { trigger: "head of performance marketing", score: 10, reason: "Acquisition owner" },
  { trigger: "head performance marketing", score: 10, reason: "Performance ownership" },
  { trigger: "vp revenue marketing", score: 10, reason: "Revenue pipeline owner" },
  { trigger: "director of revenue marketing", score: 10, reason: "Revenue pipeline owner" },
  { trigger: "director revenue marketing", score: 10, reason: "Revenue pipeline ownership" },
  { trigger: "head of revenue marketing", score: 10, reason: "Revenue pipeline owner" },
  { trigger: "head revenue marketing", score: 10, reason: "Revenue pipeline ownership" },
  { trigger: "vp acquisition marketing", score: 10, reason: "Acquisition ownership" },
  { trigger: "director acquisition marketing", score: 10, reason: "Acquisition ownership" },
  { trigger: "head acquisition marketing", score: 10, reason: "Acquisition ownership" },
  { trigger: "vp lifecycle marketing", score: 10, reason: "Lifecycle ownership" },
  { trigger: "director lifecycle marketing", score: 10, reason: "Lifecycle ownership" },
  { trigger: "head lifecycle marketing", score: 10, reason: "Lifecycle ownership" },
  { trigger: "director growth marketing", score: 10, reason: "Growth pipeline ownership" },
  { trigger: "head growth marketing", score: 10, reason: "Growth pipeline ownership" },
  { trigger: "vp content marketing", score: 9, reason: "AI content buyer" },
  { trigger: "director of content marketing", score: 9, reason: "AI content buyer" },
  { trigger: "director content marketing", score: 9, reason: "AI content buyer" },
  { trigger: "head of content marketing", score: 9, reason: "AI content buyer" },
  { trigger: "head content marketing", score: 9, reason: "AI content buyer" },
  { trigger: "vp marketing operations", score: 9, reason: "Martech owner" },
  { trigger: "director of marketing operations", score: 9, reason: "Martech owner" },
  { trigger: "director marketing operations", score: 9, reason: "MarTech ownership" },
  { trigger: "head of marketing operations", score: 9, reason: "Martech owner" },
  { trigger: "head marketing operations", score: 9, reason: "MarTech ownership" },
  { trigger: "chief growth officer", score: 9, reason: "Executive growth owner" },
  { trigger: "vp gtm", score: 8, reason: "GTM owner" },
  { trigger: "director of gtm", score: 8, reason: "GTM owner" },
  { trigger: "director gtm", score: 8, reason: "GTM ownership" },
  { trigger: "head of gtm", score: 8, reason: "GTM owner" },
  { trigger: "head gtm", score: 8, reason: "GTM ownership" },
  { trigger: "go to market", score: 8, reason: "GTM owner" },
  { trigger: "vp go to market", score: 8, reason: "GTM ownership" },
  { trigger: "director go to market", score: 8, reason: "GTM ownership" },
  { trigger: "head go to market", score: 8, reason: "GTM ownership" },
  { trigger: "director brand marketing", score: 8, reason: "Brand-to-demand bridge" },
  { trigger: "head brand marketing", score: 8, reason: "Brand-to-demand bridge" },
  { trigger: "head ai enablement", score: 8, reason: "AI transformation ownership" },
  { trigger: "vp operations", score: 7, reason: "Pipeline infrastructure influence" },
  { trigger: "svp operations", score: 7, reason: "Infrastructure ownership" },
  { trigger: "chief product officer", score: 7, reason: "Product-led growth alignment" },
  { trigger: "head ai enablement", score: 7, reason: "AI automation influence" },
  { trigger: "product marketing", score: 6, reason: "Relevant mainly for GTM" },
  { trigger: "chief product officer", score: 6, reason: "Relevant to GTM only" },
  { trigger: "vp strategy", score: 6, reason: "Strategic influence" },
  { trigger: "director strategy", score: 6, reason: "Strategic influence" },
  { trigger: "head strategy", score: 6, reason: "Strategic influence" },
  { trigger: "founder", score: 5, reason: "Useful mainly in smaller firms" },
  { trigger: "co-founder", score: 5, reason: "Exec authority variable" },
  { trigger: "cofounder", score: 5, reason: "Exec authority variable" },
  { trigger: "ceo", score: 4, reason: "Broad executive" },
  { trigger: "coo", score: 3, reason: "Operational stakeholder" },
  { trigger: "cto", score: 2, reason: "Technical stakeholder but not owner" },
  { trigger: "cio", score: 2, reason: "Technical stakeholder but not owner" },
  { trigger: "brand", score: 2, reason: "Often non-performance" },
  { trigger: "customer experience", score: 2, reason: "Low fit" },
  { trigger: "cfo", score: 1, reason: "Finance gatekeeper" },
  { trigger: "chief of staff", score: 1, reason: "Staff support role" },
  { trigger: "communications", score: 1, reason: "PR/comms function" },
  { trigger: "customer success", score: 0, reason: "Irrelevant" },
  { trigger: "business development", score: 0, reason: "Irrelevant" },
  { trigger: "sales", score: 0, reason: "Irrelevant" },
  { trigger: "account", score: 0, reason: "Irrelevant" },
  { trigger: "event", score: 0, reason: "Irrelevant" },
  { trigger: "events", score: 0, reason: "Irrelevant" },
];

// ─── ICP Include Keywords (Industry + Title Pairs) ─────────────────────────

export const ICP_INDUSTRIES = [
  "Software Development", "SaaS", "Internet", "Information Technology Services",
  "Marketing and Advertising", "Computer Software", "Financial Services Technology",
  "Cybersecurity", "Artificial Intelligence", "Machine Learning", "Cloud Computing",
  "Developer Tools", "Data Analytics", "Enterprise Software", "Business Intelligence",
  "MarTech", "FinTech", "HealthTech", "EdTech", "LegalTech", "PropTech", "HRTech",
  "Ecommerce Platforms", "B2B Marketplaces", "API Infrastructure", "Workflow Automation",
  "Sales Enablement Platforms", "CRM Platforms", "Product Analytics",
  "Growth Infrastructure Platforms", "AI Infrastructure Companies",
];

export const ICP_INCLUDE_TITLES = [
  "Chief Marketing Officer", "CMO", "Chief Growth Officer", "CGO",
  "Chief Revenue Officer Marketing", "VP Marketing", "SVP Marketing",
  "Global VP Marketing", "Director Marketing", "Head Marketing",
  "VP Growth", "Director Growth", "Head Growth",
  "VP SEO", "Director SEO", "Head SEO",
  "VP Digital Marketing", "Director Digital Marketing", "Head Digital Marketing",
  "VP Performance Marketing", "Director Performance Marketing", "Head Performance Marketing",
  "VP Demand Generation", "Director Demand Generation", "Head Demand Generation",
  "VP Content Marketing", "Director Content Marketing", "Head Content Marketing",
  "VP Acquisition Marketing", "Director Acquisition Marketing", "Head Acquisition Marketing",
  "VP Lifecycle Marketing", "Director Lifecycle Marketing", "Head Lifecycle Marketing",
  "VP Revenue Marketing", "Director Revenue Marketing", "Head Revenue Marketing",
  "VP GTM", "VP Go To Market", "Director GTM", "Director Go To Market",
  "Head GTM", "Head Go To Market",
  "Director Growth Marketing", "Head Growth Marketing",
  "Global Digital Marketing Director", "International Marketing Director",
  "VP Marketing Operations", "Director Marketing Operations", "Head Marketing Operations",
  "Head AI Enablement",
];

export const ICP_EXCLUDE_KEYWORDS = [
  "sales", "selling", "account", "accounts", "accounting", "accountant",
  "account executive", "account manager", "customer success", "customer service",
  "client service", "support", "service desk", "help desk",
  "hr", "human resources", "people ops", "people operations",
  "recruiting", "recruiter", "talent acquisition",
  "legal", "counsel", "finance", "financial", "controller", "controlling",
  "treasurer", "payroll", "procurement", "purchasing", "buyer",
  "assistant", "associate", "coordinator", "supervisor", "deputy", "specialist",
  "store", "store manager", "boutique", "boutique manager",
  "branch", "branch manager", "retail", "counter",
  "hospitality", "event", "events", "exhibitions",
  "sponsorship", "sponsoring", "training", "learning", "academy",
  "commerce detail", "gestionnaire", "ressources humaines", "responsable rh",
  "comptable", "retail operations", "visual merchandising", "shop manager",
];

export const MANAGEMENT_LEVELS = [
  { level: "C-Suite", include: true, priority: "High", reason: "Needed for selective executive buyers" },
  { level: "VP", include: true, priority: "High", reason: "Strong budget ownership" },
  { level: "Director", include: true, priority: "High", reason: "Common execution-level buyer" },
  { level: "Head", include: true, priority: "High", reason: "Modern functional owner title" },
  { level: "Founder", include: true, priority: "Medium", reason: "Useful for smaller companies only" },
  { level: "Owner", include: true, priority: "Medium", reason: "Too noisy in larger-company searches" },
  { level: "Partner", include: true, priority: "High", reason: "Usually irrelevant noise" },
];

export const SCORE_ACTION_MAP: { range: string; meaning: string; action: string }[] = [
  { range: "10", meaning: "Direct marketing / SEO / growth / demand / revenue owner", action: "Reach first" },
  { range: "8–9", meaning: "Strong adjacent buyer or influencer", action: "High priority" },
  { range: "6–7", meaning: "Relevant stakeholder", action: "Second wave" },
  { range: "4–5", meaning: "Broad executive influence", action: "Use selectively" },
  { range: "1–3", meaning: "Peripheral stakeholder", action: "Usually deprioritize" },
  { range: "0", meaning: "Irrelevant", action: "Do not contact" },
];

// ─── Localized Exclude Keywords ─────────────────────────────────────────────

export const LOCALIZED_EXCLUDE_KEYWORDS: Record<string, string[]> = {
  fr: [
    "ventes", "vente", "commercial", "commerciale", "chargé de clientèle",
    "gestionnaire de comptes", "comptable", "comptabilité",
    "ressources humaines", "responsable rh", "drh",
    "recrutement", "recruteur", "recruteuse",
    "juridique", "conseiller juridique", "avocat",
    "finance", "financier", "trésorier", "paie",
    "approvisionnement", "acheteur", "acheteuse",
    "assistant", "assistante", "coordinateur", "coordinatrice",
    "stagiaire", "adjoint", "adjointe", "spécialiste",
    "magasin", "responsable magasin", "boutique", "responsable boutique",
    "succursale", "responsable succursale", "détail",
    "hôtellerie", "événement", "événements", "événementiel",
    "parrainage", "formation", "apprentissage", "académie",
    "gestionnaire", "service client", "support client",
    "accueil", "secrétaire", "administration",
  ],
  de: [
    "verkauf", "vertrieb", "vertriebsleiter", "kundenbetreuer",
    "buchhalter", "buchhaltung", "buchführung",
    "personalwesen", "personalabteilung", "hr-leiter",
    "rekrutierung", "recruiter", "talentakquise",
    "rechtsabteilung", "rechtsanwalt", "jurist",
    "finanzen", "finanzbuchhalter", "schatzmeister", "lohnbuchhaltung",
    "beschaffung", "einkauf", "einkäufer",
    "assistent", "assistentin", "koordinator", "koordinatorin",
    "praktikant", "praktikantin", "stellvertreter", "spezialist",
    "filiale", "filialleiter", "einzelhandel",
    "gastgewerbe", "veranstaltung", "veranstaltungen",
    "sponsoring", "ausbildung", "schulung", "akademie",
    "sachbearbeiter", "kundendienst", "empfang", "sekretariat",
  ],
  es: [
    "ventas", "vendedor", "ejecutivo de cuentas", "gerente de cuentas",
    "contador", "contabilidad", "contable",
    "recursos humanos", "responsable rrhh", "director rrhh",
    "reclutamiento", "reclutador", "reclutadora",
    "legal", "abogado", "asesor jurídico",
    "finanzas", "financiero", "tesorero", "nómina",
    "compras", "adquisiciones", "comprador", "compradora",
    "asistente", "coordinador", "coordinadora",
    "pasante", "becario", "adjunto", "especialista",
    "tienda", "gerente de tienda", "boutique",
    "sucursal", "gerente de sucursal", "retail",
    "hostelería", "evento", "eventos",
    "patrocinio", "formación", "capacitación", "academia",
    "servicio al cliente", "soporte al cliente", "recepción",
  ],
  it: [
    "vendite", "venditore", "responsabile clienti", "account manager",
    "contabile", "contabilità",
    "risorse umane", "responsabile hr", "direttore hr",
    "selezione del personale", "recruiter",
    "legale", "avvocato", "consulente legale",
    "finanza", "finanziario", "tesoriere", "libro paga",
    "approvvigionamento", "acquisti", "acquirente",
    "assistente", "coordinatore", "coordinatrice",
    "stagista", "tirocinante", "vice", "specialista",
    "negozio", "responsabile negozio", "boutique",
    "filiale", "responsabile filiale", "dettaglio",
    "ospitalità", "evento", "eventi",
    "sponsorizzazione", "formazione", "accademia",
    "servizio clienti", "supporto clienti", "reception",
  ],
  nl: [
    "verkoop", "verkoopmedewerker", "accountmanager",
    "boekhouder", "boekhouding",
    "personeelszaken", "hr-manager", "hoofd hr",
    "werving", "recruiter",
    "juridisch", "advocaat",
    "financiën", "financieel", "penningmeester", "salarisadministratie",
    "inkoop", "inkoper",
    "assistent", "coördinator",
    "stagiair", "specialist",
    "winkel", "winkelmanager", "filiaal", "filiaalmanager",
    "horeca", "evenement", "evenementen",
    "sponsoring", "opleiding", "training", "academie",
    "klantenservice", "receptie",
  ],
  pt: [
    "vendas", "vendedor", "executivo de contas", "gerente de contas",
    "contador", "contabilidade",
    "recursos humanos", "responsável rh", "diretor rh",
    "recrutamento", "recrutador",
    "jurídico", "advogado", "assessor jurídico",
    "finanças", "financeiro", "tesoureiro", "folha de pagamento",
    "compras", "aquisições", "comprador",
    "assistente", "coordenador", "coordenadora",
    "estagiário", "estagiária", "especialista",
    "loja", "gerente de loja",
    "filial", "gerente de filial", "varejo",
    "hospitalidade", "evento", "eventos",
    "patrocínio", "treinamento", "academia",
    "atendimento ao cliente", "suporte ao cliente", "recepção",
  ],
};

export function getExcludeKeywordsForLocale(languageCode: string): string[] {
  const base = [...ICP_EXCLUDE_KEYWORDS];
  const localized = LOCALIZED_EXCLUDE_KEYWORDS[languageCode];
  if (localized) {
    return [...base, ...localized];
  }
  return base;
}

// ─── Scoring Engine ─────────────────────────────────────────────────────────

export function computeRichardScore(jobTitle: string, languageCode?: string): number {
  const t = jobTitle.toLowerCase().trim();

  for (const rule of SCORING_RULES) {
    if (t.includes(rule.trigger)) return rule.score;
  }

  if (/\b(marketing|seo|growth|demand gen)\b/.test(t) && /\b(head|lead|director|vp|chief|svp|senior)\b/.test(t)) {
    return 9;
  }
  if (/\b(gtm|go.to.market|operations|product)\b/.test(t) && /\b(head|lead|director|vp|chief|manager)\b/.test(t)) {
    return 7;
  }
  if (/\bceo\b/.test(t) || /\bfounder\b/.test(t)) {
    return 5;
  }
  if (/\b(it|finance|accounting)\b/.test(t)) {
    return 3;
  }

  const excludes = languageCode
    ? getExcludeKeywordsForLocale(languageCode)
    : ICP_EXCLUDE_KEYWORDS;

  for (const kw of excludes) {
    if (t.includes(kw)) return 0;
  }

  return 4;
}

export function getScoreReason(jobTitle: string): string {
  const t = jobTitle.toLowerCase().trim();
  for (const rule of SCORING_RULES) {
    if (t.includes(rule.trigger)) return rule.reason;
  }
  if (/\b(marketing|seo|growth|demand gen)\b/.test(t) && /\b(head|lead|director|vp|chief|svp|senior)\b/.test(t)) {
    return "Marketing leadership match";
  }
  if (/\b(gtm|go.to.market|operations|product)\b/.test(t) && /\b(head|lead|director|vp|chief|manager)\b/.test(t)) {
    return "GTM/Ops stakeholder match";
  }
  if (/\bceo\b/.test(t) || /\bfounder\b/.test(t)) return "Broad executive";
  if (/\b(it|finance|accounting)\b/.test(t)) return "Peripheral department";
  for (const kw of ICP_EXCLUDE_KEYWORDS) {
    if (t.includes(kw)) return "Excluded keyword match";
  }
  return "No specific rule matched";
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

// ─── Company Classification ─────────────────────────────────────────────────

export interface CompanyClassification {
  companyName: string;
  employees: string;
  industry: string;
  website: string;
  linkedinUrl: string;
  address: string;
  country: string;
  category: "Likely Residential" | "Mixed-Use" | "Commercial" | "Industrial" | "Unknown";
  reasoning: string;
}

const COMMERCIAL_KEYWORDS_BY_COUNTRY: Record<string, string[]> = {
  _default: [
    "avenue", "boulevard", "business park", "tech park", "industrial",
    "office park", "tower", "plaza", "center", "centre", "floor",
    "suite", "building", "campus",
  ],
  CH: [
    "grand-rue", "grand'rue", "rue centrale", "avenue", "place",
    "zone industrielle", "parc technologique", "centre", "bâtiment",
    "etage", "biopôle", "technopark", "world trade center",
  ],
  FR: [
    "avenue", "boulevard", "zone industrielle", "parc d'activités",
    "centre d'affaires", "tour", "immeuble", "étage", "bâtiment",
    "place", "zone commerciale", "technopole",
  ],
  DE: [
    "straße", "strasse", "allee", "gewerbepark", "industriegebiet",
    "büropark", "turm", "gebäude", "etage", "zentrum", "platz",
    "gewerbegebiet", "technologiepark",
  ],
  ES: [
    "avenida", "paseo", "polígono industrial", "parque empresarial",
    "centro de negocios", "torre", "edificio", "planta", "plaza",
  ],
  IT: [
    "viale", "corso", "zona industriale", "centro direzionale",
    "palazzo", "piano", "piazza", "parco tecnologico",
  ],
  NL: [
    "laan", "straat", "bedrijvenpark", "industrieterrein",
    "kantoorgebouw", "verdieping", "centrum", "plein",
  ],
};

const RESIDENTIAL_KEYWORDS_BY_COUNTRY: Record<string, string[]> = {
  _default: [
    "village", "hamlet", "cottage", "villa", "maison", "residence", "impasse",
    "lane", "drive", "court", "close", "way", "crescent", "terrace",
  ],
  CH: [
    "chemin", "ch.", "route de", "rue de la", "impasse", "sentier",
    "village", "hameau", "résidence", "villa", "le moulin",
    "gryon", "blonay", "puidoux", "lutry", "savigny", "romanel",
    "morges", "nyon", "gland", "aigle", "ollon", "vevey", "pully",
    "apples", "cronay", "ferreyres", "burtigny",
  ],
  FR: [
    "chemin", "rue de", "impasse", "allée", "sentier", "passage",
    "résidence", "villa", "hameau", "lotissement", "lieu-dit",
  ],
  DE: [
    "weg", "gasse", "pfad", "siedlung", "wohngebiet",
    "dorfstraße", "dorf", "wohnsiedlung",
  ],
  ES: [
    "calle", "camino", "callejón", "sendero", "urbanización",
    "residencial", "villa", "aldea",
  ],
  IT: [
    "via", "vicolo", "sentiero", "residenza", "villaggio",
    "frazione", "contrada",
  ],
  NL: [
    "weg", "steeg", "pad", "wijk", "woonwijk", "dorp",
  ],
};

function getKeywordsForCountry(byCountry: Record<string, string[]>, countryCode: string): string[] {
  const specific = byCountry[countryCode] || [];
  const fallback = byCountry._default || [];
  return [...new Set([...specific, ...fallback])];
}

export function classifyCompany(lead: Lead, countryCode?: string): CompanyClassification {
  const addr = (lead.location || "").toLowerCase();
  const emp = parseInt(lead.employeeCount) || 0;
  const industry = (lead.industry || "").toLowerCase();
  const cc = countryCode || "US";

  const commercialKw = getKeywordsForCountry(COMMERCIAL_KEYWORDS_BY_COUNTRY, cc);
  const residentialKw = getKeywordsForCountry(RESIDENTIAL_KEYWORDS_BY_COUNTRY, cc);

  let category: CompanyClassification["category"] = "Unknown";
  let reasoning = "";

  const hasCommercialAddr = commercialKw.some((kw) => addr.includes(kw));
  const hasResidentialAddr = residentialKw.some((kw) => addr.includes(kw));

  const isTinyCompany = emp > 0 && emp <= 10;
  const isMidSize = emp > 10 && emp <= 50;
  const isLarger = emp > 50;

  const isServiceIndustry = /consulting|accounting|media|events|tourism|food|wellness|art/i.test(industry);
  const isTechIndustry = /software|saas|it services|technology|ai|data|cloud|fintech/i.test(industry);
  const isTradeIndustry = /construction|architecture|engineering|environmental|renewable/i.test(industry);

  if (hasCommercialAddr && isLarger) {
    category = "Commercial";
    reasoning = `Large company (${emp} employees) at a commercial address.`;
  } else if (hasCommercialAddr && isMidSize) {
    category = "Commercial";
    reasoning = `Mid-size company in a commercial/office district.`;
  } else if (hasResidentialAddr && isTinyCompany && isServiceIndustry) {
    category = "Likely Residential";
    reasoning = `Small ${industry} company (${emp} employees) in a residential area; likely a home-based studio.`;
  } else if (hasResidentialAddr && isTinyCompany && isTechIndustry) {
    category = "Likely Residential";
    reasoning = `Tech startup (${emp} employees) in a residential village; likely a home office.`;
  } else if (hasResidentialAddr && isTinyCompany) {
    category = "Likely Residential";
    reasoning = `Small company in a rural/residential area; likely home-based.`;
  } else if (hasResidentialAddr && isMidSize && isTradeIndustry) {
    category = "Mixed-Use";
    reasoning = `${industry} firm in a village setting; likely a professional studio or trade shop.`;
  } else if (hasResidentialAddr && isMidSize) {
    category = "Mixed-Use";
    reasoning = `Mid-size company in a residential/suburban sector; likely professional villa office.`;
  } else if (!hasResidentialAddr && !hasCommercialAddr && isTinyCompany) {
    category = "Likely Residential";
    reasoning = `Small company (${emp} employees); address suggests home-based operation.`;
  } else if (!hasResidentialAddr && !hasCommercialAddr && isMidSize) {
    category = "Mixed-Use";
    reasoning = `Mid-size company; likely in a mixed commercial/residential zone.`;
  } else if (isLarger) {
    category = "Commercial";
    reasoning = `Larger company (${emp} employees); assumed commercial premises.`;
  } else if (addr) {
    category = "Mixed-Use";
    reasoning = `Could not conclusively classify; address and size suggest mixed-use.`;
  } else {
    category = "Unknown";
    reasoning = "Insufficient address data for classification.";
  }

  return {
    companyName: lead.company,
    employees: lead.employeeCount || "N/A",
    industry: lead.industry,
    website: lead.email ? lead.email.split("@")[1] || "" : "",
    linkedinUrl: lead.linkedinUrl || "",
    address: lead.location,
    country: cc,
    category,
    reasoning,
  };
}
