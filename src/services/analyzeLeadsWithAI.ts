import { Lead } from "@/types";
import { computeRichardScore, scoreToTier } from "@/lib/richardScoring";

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

export async function generatePersonaWithAI(
  campaignGoal: string
): Promise<{
  tier1Titles: string[];
  tier2Titles: string[];
  tier3Titles: string[];
  industryKeywords: string[];
}> {
  console.log("[generatePersonaWithAI] Placeholder called for:", campaignGoal);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real LLM call
  // ═══════════════════════════════════════════════

  await new Promise((r) => setTimeout(r, 1000));

  const goalLower = campaignGoal.toLowerCase();

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
