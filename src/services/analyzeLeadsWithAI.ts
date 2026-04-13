import { Lead } from "@/types";
import { computeRichardScore, scoreToTier } from "@/lib/richardScoring";
import { extractCampaignIntent } from "@/lib/extractIntent";

/**
 * ─── API LANDING ZONE: AI-Powered Lead Analysis ───
 *
 * Cursor Shortcut:
 *   @analyzeLeadsWithAI "Connect this to OpenAI GPT-4o. Use 'Structured Outputs'
 *   to return a JSON array of scores based on the 0-10 Richard-Style logic in my prompt."
 *
 * OpenAI Structured Outputs reference:
 *   POST https://api.openai.com/v1/chat/completions
 *   model: "gpt-4o"
 *   response_format: { type: "json_schema", json_schema: { ... } }
 *
 * Expected schema:
 *   {
 *     "scores": [
 *       { "leadId": "string", "richardScore": 0-10, "reasoning": "string" }
 *     ]
 *   }
 *
 * System prompt should encode the Richard-Style scoring rubric:
 *   9-10 Primary: Heads of SEO, Growth, Marketing, FinOps
 *   7-8  Stakeholder: GTM, Operations, Product leaders
 *   4-6  Influence: Founders/CEOs at mid-sized firms
 *   1-3  Peripheral: IT or Finance support roles
 *   0    Irrelevant: Sales, HR, Admin, Junior roles
 */

interface AIScoreResult {
  leadId: string;
  richardScore: number;
  reasoning: string;
}

export async function analyzeLeadsWithAI(leads: Lead[]): Promise<Lead[]> {
  console.log("[analyzeLeadsWithAI] Placeholder called for", leads.length, "leads");

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real OpenAI / Gemini call
  // ═══════════════════════════════════════════════
  //
  //  const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //    method: "POST",
  //    headers: {
  //      "Content-Type": "application/json",
  //      "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  //    },
  //    body: JSON.stringify({
  //      model: "gpt-4o",
  //      response_format: {
  //        type: "json_schema",
  //        json_schema: {
  //          name: "lead_scores",
  //          schema: {
  //            type: "object",
  //            properties: {
  //              scores: {
  //                type: "array",
  //                items: {
  //                  type: "object",
  //                  properties: {
  //                    leadId: { type: "string" },
  //                    richardScore: { type: "integer", minimum: 0, maximum: 10 },
  //                    reasoning: { type: "string" },
  //                  },
  //                  required: ["leadId", "richardScore", "reasoning"],
  //                },
  //              },
  //            },
  //            required: ["scores"],
  //          },
  //        },
  //      },
  //      messages: [
  //        { role: "system", content: RICHARD_SCORING_SYSTEM_PROMPT },
  //        { role: "user", content: JSON.stringify(leads.map(l => ({ id: l.id, jobTitle: l.jobTitle, company: l.company }))) },
  //      ],
  //    }),
  //  });

  await new Promise((r) => setTimeout(r, 800));

  return leads.map((lead) => {
    const richardScore = computeRichardScore(lead.jobTitle);
    return { ...lead, richardScore, tier: scoreToTier(richardScore) };
  });
}

// Maps detected industries to relevant decision-maker titles
const INDUSTRY_PERSONA_MAP: Record<string, { tier1: string[]; tier2: string[]; keywords: string[] }> = {
  "Roofing":       { tier1: ["Owner", "General Manager", "Operations Manager"], tier2: ["Project Manager", "Estimator", "Sales Manager"], keywords: ["Roofing", "Contracting", "Home Services"] },
  "Solar":         { tier1: ["Owner", "CEO", "VP Sales"], tier2: ["Operations Manager", "Project Manager", "Business Development Manager"], keywords: ["Solar", "Renewable Energy", "Clean Energy"] },
  "HVAC":          { tier1: ["Owner", "General Manager", "Operations Director"], tier2: ["Service Manager", "Sales Manager", "Branch Manager"], keywords: ["HVAC", "Mechanical Contracting", "Heating & Cooling"] },
  "Cleaning":      { tier1: ["Owner", "General Manager", "Operations Manager"], tier2: ["Area Manager", "Branch Manager", "Business Development"], keywords: ["Cleaning", "Janitorial", "Facility Services"] },
  "Pest Control":  { tier1: ["Owner", "General Manager", "Branch Manager"], tier2: ["Operations Manager", "Service Manager", "Sales Manager"], keywords: ["Pest Control", "Pest Management", "Extermination"] },
  "Landscaping":   { tier1: ["Owner", "General Manager", "Operations Manager"], tier2: ["Crew Manager", "Estimator", "Account Manager"], keywords: ["Landscaping", "Lawn Care", "Grounds Maintenance"] },
  "Plumbing":      { tier1: ["Owner", "Master Plumber", "General Manager"], tier2: ["Service Manager", "Operations Manager", "Estimator"], keywords: ["Plumbing", "Mechanical", "Water Systems"] },
  "Electrical":    { tier1: ["Owner", "Master Electrician", "General Manager"], tier2: ["Project Manager", "Estimator", "Operations Manager"], keywords: ["Electrical", "Contracting", "Power Systems"] },
  "Construction":  { tier1: ["Owner", "CEO", "VP Operations"], tier2: ["Project Manager", "Superintendent", "Estimator"], keywords: ["Construction", "General Contracting", "Building"] },
  "Real Estate":   { tier1: ["Broker", "Managing Director", "CEO"], tier2: ["VP Sales", "Director of Leasing", "Property Manager"], keywords: ["Real Estate", "Commercial Property", "Leasing"] },
  "SaaS":          { tier1: ["Head of Growth", "VP Marketing", "CMO"], tier2: ["Head of GTM", "VP Sales", "Director of Product"], keywords: ["SaaS", "Software", "Technology"] },
  "eCommerce":     { tier1: ["Head of eCommerce", "VP Digital", "CMO"], tier2: ["Head of Growth", "Director of Marketing", "VP Sales"], keywords: ["eCommerce", "D2C", "Online Retail"] },
  "FinTech":       { tier1: ["Head of Product", "CTO", "VP Engineering"], tier2: ["Head of Compliance", "VP Operations", "Director of Growth"], keywords: ["FinTech", "Financial Services", "Banking"] },
  "FinOps":        { tier1: ["Head of FinOps", "VP Cloud Economics", "Director of FinOps"], tier2: ["VP Engineering", "Head of Infrastructure", "Director of DevOps"], keywords: ["FinOps", "Cloud Infrastructure", "Cost Management"] },
  "Marketing":     { tier1: ["Head of SEO", "VP Growth", "Marketing Director", "Head of Digital Marketing"], tier2: ["Head of GTM", "VP Product Marketing", "Content Director", "CMO"], keywords: ["Digital Marketing", "MarTech", "SEO", "Growth"] },
  "Cybersecurity": { tier1: ["CISO", "VP Security", "Director of InfoSec"], tier2: ["Head of IT", "CTO", "Security Architect"], keywords: ["Cybersecurity", "InfoSec", "Data Protection"] },
  "Healthcare":    { tier1: ["CEO", "COO", "VP Operations"], tier2: ["Medical Director", "Head of Administration", "VP Clinical"], keywords: ["Healthcare", "Medical", "Health Services"] },
  "Restaurant":    { tier1: ["Owner", "General Manager", "Director of Operations"], tier2: ["Regional Manager", "Executive Chef", "Franchise Owner"], keywords: ["Restaurant", "Food Service", "Hospitality"] },
  "Hospitality":   { tier1: ["General Manager", "Director of Operations", "VP Hospitality"], tier2: ["Revenue Manager", "Head of Sales", "Regional Director"], keywords: ["Hospitality", "Hotels", "Tourism"] },
  "Insurance":     { tier1: ["Agency Owner", "Managing Director", "VP Sales"], tier2: ["Director of Underwriting", "Head of Claims", "Regional Manager"], keywords: ["Insurance", "Risk Management", "Underwriting"] },
  "Consulting":    { tier1: ["Managing Partner", "Principal", "Director"], tier2: ["VP Strategy", "Head of Delivery", "Practice Lead"], keywords: ["Consulting", "Advisory", "Strategy"] },
  "Manufacturing": { tier1: ["Plant Manager", "VP Operations", "Director of Manufacturing"], tier2: ["Production Manager", "Supply Chain Director", "Quality Manager"], keywords: ["Manufacturing", "Production", "Industrial"] },
  "Logistics":     { tier1: ["VP Logistics", "Director of Operations", "CEO"], tier2: ["Fleet Manager", "Warehouse Director", "Supply Chain Manager"], keywords: ["Logistics", "Supply Chain", "Transportation"] },
  "Retail":        { tier1: ["Store Owner", "Regional Manager", "VP Retail"], tier2: ["District Manager", "Merchandising Director", "Head of Sales"], keywords: ["Retail", "Store Operations", "Merchandising"] },
  "Education":     { tier1: ["Head of School", "Dean", "VP Academic"], tier2: ["Director of Programs", "Department Head", "Curriculum Director"], keywords: ["Education", "EdTech", "Training"] },
  "Legal":         { tier1: ["Managing Partner", "Senior Partner", "Director"], tier2: ["Head of Operations", "Office Manager", "Practice Group Leader"], keywords: ["Legal", "Law", "Professional Services"] },
  "Accounting":    { tier1: ["Managing Partner", "Director", "VP Finance"], tier2: ["Tax Director", "Audit Manager", "Controller"], keywords: ["Accounting", "CPA", "Financial Services"] },
};

export async function generatePersonaWithAI(
  campaignGoal: string
): Promise<{
  tier1Titles: string[];
  tier2Titles: string[];
  tier3Titles: string[];
  industryKeywords: string[];
}> {
  console.log("[generatePersonaWithAI] Extracting intent from:", campaignGoal);

  await new Promise((r) => setTimeout(r, 1000));

  const intent = extractCampaignIntent(campaignGoal);
  console.log("[generatePersonaWithAI] Extracted intent:", intent);

  const tier1Set = new Set<string>();
  const tier2Set = new Set<string>();
  const keywordSet = new Set<string>();

  for (const industry of intent.industries) {
    const mapping = INDUSTRY_PERSONA_MAP[industry];
    if (mapping) {
      mapping.tier1.forEach((t) => tier1Set.add(t));
      mapping.tier2.forEach((t) => tier2Set.add(t));
      mapping.keywords.forEach((k) => keywordSet.add(k));
    } else {
      keywordSet.add(industry);
    }
  }

  for (const title of intent.titles) {
    tier1Set.add(title);
  }

  for (const ct of intent.companyTypes) {
    keywordSet.add(ct);
  }

  if (tier1Set.size === 0) {
    const goalLower = intent.cleanedGoal.toLowerCase();
    if (goalLower.includes("finops") || goalLower.includes("cloud") || goalLower.includes("spend")) {
      return {
        tier1Titles: ["Head of FinOps", "VP Cloud Economics", "Director of FinOps", "Cloud Cost Manager"],
        tier2Titles: ["VP Engineering", "Head of Infrastructure", "CTO", "Director of DevOps"],
        tier3Titles: ["CEO", "CFO", "COO", "VP Operations"],
        industryKeywords: ["SaaS", "Cloud Infrastructure", "FinTech", "DevOps", "Enterprise Software"],
      };
    }
    if (goalLower.includes("marketing") || goalLower.includes("seo") || goalLower.includes("growth")) {
      return {
        tier1Titles: ["Head of SEO", "VP Growth", "Marketing Director", "Head of Digital Marketing"],
        tier2Titles: ["Head of GTM", "VP Product Marketing", "Content Director", "CMO"],
        tier3Titles: ["CEO", "Founder", "VP Business Development", "COO"],
        industryKeywords: ["SaaS", "eCommerce", "Digital Agency", "MarTech", "D2C"],
      };
    }
    return {
      tier1Titles: ["Head of Operations", "VP Strategy", "Director of Growth", "Head of Partnerships"],
      tier2Titles: ["CTO", "VP Engineering", "Head of Product", "Director of Innovation"],
      tier3Titles: ["CEO", "Founder", "Managing Director", "COO"],
      industryKeywords: ["Technology", "SaaS", "Enterprise", "B2B Services", "Consulting"],
    };
  }

  return {
    tier1Titles: Array.from(tier1Set).slice(0, 12),
    tier2Titles: Array.from(tier2Set).slice(0, 8),
    tier3Titles: ["CEO", "Founder", "COO", "Managing Director"],
    industryKeywords: Array.from(keywordSet).slice(0, 12),
  };
}
