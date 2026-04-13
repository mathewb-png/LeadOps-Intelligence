import { Lead, InstantlyCampaign, InstantlyLeadPayload, OutreachCampaign } from "@/types";

/**
 * ─── API LANDING ZONE: Instantly.ai ───
 *
 * Cursor Shortcut:
 *   @instantlyService "Use the Instantly.ai API to auto-enqueue Primary (9-10) leads
 *   into a cold email campaign after scoring."
 *
 * Instantly.ai API reference:
 *   List Campaigns: GET  https://api.instantly.ai/api/v1/campaign/list?api_key={key}
 *   Add Lead:       POST https://api.instantly.ai/api/v1/lead/add
 *   Create Campaign: POST https://api.instantly.ai/api/v1/campaign/create
 *   Headers: { "Content-Type": "application/json" }
 *
 * Pricing: from $30/mo (Growth) for unlimited email accounts
 */

export async function listCampaigns(): Promise<InstantlyCampaign[]> {
  console.log("[Instantly] listCampaigns placeholder");

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Instantly.ai API call
  // ═══════════════════════════════════════════════

  await new Promise((r) => setTimeout(r, 300));

  return [
    {
      id: "camp-demo-1",
      name: "LeadOps Primary Outreach",
      status: "active",
      accountId: "acc-1",
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function addLeadToCampaign(
  campaignId: string,
  lead: Lead
): Promise<{ success: boolean; leadEmail: string }> {
  console.log("[Instantly] addLeadToCampaign placeholder:", lead.email, "->", campaignId);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Instantly.ai API call
  // ═══════════════════════════════════════════════
  //
  //  const [firstName, ...rest] = lead.name.split(" ");
  //  const response = await fetch("https://api.instantly.ai/api/v1/lead/add", {
  //    method: "POST",
  //    headers: { "Content-Type": "application/json" },
  //    body: JSON.stringify({
  //      api_key: import.meta.env.VITE_INSTANTLY_API_KEY,
  //      campaign_id: campaignId,
  //      skip_if_in_workspace: true,
  //      leads: [{
  //        email: lead.email,
  //        first_name: firstName,
  //        last_name: rest.join(" "),
  //        company_name: lead.company,
  //        custom_variables: {
  //          richard_score: String(lead.richardScore),
  //          tier: lead.tier,
  //          job_title: lead.jobTitle,
  //        },
  //      }],
  //    }),
  //  });

  await new Promise((r) => setTimeout(r, 150));

  return { success: true, leadEmail: lead.email };
}

export async function addBatchToCampaign(
  campaignId: string,
  leads: Lead[]
): Promise<OutreachCampaign> {
  console.log("[Instantly] addBatchToCampaign placeholder:", leads.length, "leads ->", campaignId);

  await new Promise((r) => setTimeout(r, leads.length * 50));

  const qualified = leads.filter((l) => l.richardScore >= 7);
  const skipped = leads.length - qualified.length;

  return {
    campaignId,
    campaignName: "LeadOps Primary Outreach",
    leadsAdded: qualified.length,
    leadsSkipped: skipped,
    status: "completed",
    startedAt: new Date().toISOString(),
  };
}

export async function createCampaign(name: string): Promise<InstantlyCampaign> {
  console.log("[Instantly] createCampaign placeholder:", name);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Instantly.ai create campaign
  // ═══════════════════════════════════════════════

  await new Promise((r) => setTimeout(r, 400));

  return {
    id: `camp-${Date.now()}`,
    name,
    status: "draft",
    accountId: "acc-1",
    createdAt: new Date().toISOString(),
  };
}
