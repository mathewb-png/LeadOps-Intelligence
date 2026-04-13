import { Lead, GroqScoreResult } from "@/types";
import { computeRichardScore, scoreToTier } from "@/lib/richardScoring";

/**
 * ─── API LANDING ZONE: Groq (Fast LLM Inference) ───
 *
 * Cursor Shortcut:
 *   @groqService "Connect to Groq API for ultra-fast lead scoring using Llama 3.
 *   Use structured JSON output to return Richard-Style scores for each lead."
 *
 * Groq API reference:
 *   POST https://api.groq.com/openai/v1/chat/completions
 *   Headers: { "Authorization": "Bearer {key}", "Content-Type": "application/json" }
 *   Models: "llama-3.3-70b-versatile", "mixtral-8x7b-32768", "llama-3.1-8b-instant"
 *
 * Key advantage: ~200ms inference vs ~2-3s for GPT-4o
 * Free tier: 6,000 tokens/min on most models
 * Paid: usage-based, very affordable
 */

export async function scoreLeadsWithGroq(leads: Lead[]): Promise<Lead[]> {
  console.log("[Groq] scoreLeadsWithGroq placeholder for", leads.length, "leads");

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Groq API call
  // ═══════════════════════════════════════════════
  //
  //  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  //    method: "POST",
  //    headers: {
  //      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
  //      "Content-Type": "application/json",
  //    },
  //    body: JSON.stringify({
  //      model: "llama-3.3-70b-versatile",
  //      messages: [
  //        {
  //          role: "system",
  //          content: `Score each lead 0-10 using Richard-Style logic:
  //            9-10 Primary: Heads of SEO, Growth, Marketing, FinOps
  //            7-8 Stakeholder: GTM, Operations, Product leaders
  //            4-6 Influence: Founders/CEOs at mid-sized firms
  //            1-3 Peripheral: IT or Finance support roles
  //            0 Irrelevant: Sales, HR, Admin, Junior roles
  //            Return JSON: { "scores": [{ "leadId": "...", "richardScore": N, "reasoning": "..." }] }`,
  //        },
  //        {
  //          role: "user",
  //          content: JSON.stringify(leads.map(l => ({
  //            id: l.id, jobTitle: l.jobTitle, company: l.company,
  //          }))),
  //        },
  //      ],
  //      response_format: { type: "json_object" },
  //      temperature: 0.1,
  //    }),
  //  });

  const start = performance.now();
  await new Promise((r) => setTimeout(r, 200));
  const latencyMs = Math.round(performance.now() - start);

  return leads.map((lead) => {
    const richardScore = computeRichardScore(lead.jobTitle);
    return { ...lead, richardScore, tier: scoreToTier(richardScore) };
  });
}

export async function scoreLeadWithGroq(lead: Lead): Promise<GroqScoreResult> {
  console.log("[Groq] scoreLeadWithGroq placeholder for:", lead.jobTitle);

  const start = performance.now();
  await new Promise((r) => setTimeout(r, 100));

  return {
    leadId: lead.id,
    richardScore: computeRichardScore(lead.jobTitle),
    reasoning: `Scored based on title "${lead.jobTitle}" using Richard-Style rubric (placeholder).`,
    model: "llama-3.3-70b-versatile",
    latencyMs: Math.round(performance.now() - start),
  };
}
