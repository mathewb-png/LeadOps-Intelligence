import { Lead, HubSpotContact, HubSpotDeal, CRMSyncResult } from "@/types";

/**
 * ─── API LANDING ZONE: HubSpot CRM ───
 *
 * Cursor Shortcut:
 *   @hubspotService "Push all leads with Richard Score >= 7 to HubSpot as contacts
 *   with custom properties for richard_score and lead_tier."
 *
 * HubSpot API reference:
 *   Create Contact:  POST https://api.hubapi.com/crm/v3/objects/contacts
 *   Batch Create:    POST https://api.hubapi.com/crm/v3/objects/contacts/batch/create
 *   Create Deal:     POST https://api.hubapi.com/crm/v3/objects/deals
 *   Headers: { "Authorization": "Bearer {access_token}", "Content-Type": "application/json" }
 *
 * Required custom properties (create in HubSpot Settings > Properties):
 *   - richard_score (number)
 *   - lead_tier (dropdown: primary, stakeholder, influence, peripheral, irrelevant)
 *   - lead_source_platform (text): "LeadOps Intelligence"
 *
 * Free CRM: unlimited contacts, limited features
 * Starter: from $20/mo
 */

export async function syncLeadToCRM(lead: Lead): Promise<HubSpotContact> {
  console.log("[HubSpot] syncLeadToCRM placeholder for:", lead.name);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real HubSpot API call
  // ═══════════════════════════════════════════════
  //
  //  const [firstName, ...rest] = lead.name.split(" ");
  //  const lastName = rest.join(" ");
  //  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
  //    method: "POST",
  //    headers: {
  //      "Authorization": `Bearer ${import.meta.env.VITE_HUBSPOT_ACCESS_TOKEN}`,
  //      "Content-Type": "application/json",
  //    },
  //    body: JSON.stringify({
  //      properties: {
  //        email: lead.email,
  //        firstname: firstName,
  //        lastname: lastName,
  //        company: lead.company,
  //        jobtitle: lead.jobTitle,
  //        richard_score: lead.richardScore,
  //        lead_tier: lead.tier,
  //        lead_source_platform: "LeadOps Intelligence",
  //      },
  //    }),
  //  });

  await new Promise((r) => setTimeout(r, 300));

  const [firstName, ...rest] = lead.name.split(" ");
  return {
    id: `hs-${Date.now()}`,
    email: lead.email,
    firstName,
    lastName: rest.join(" "),
    company: lead.company,
    jobTitle: lead.jobTitle,
    richardScore: lead.richardScore,
    tier: lead.tier,
    lifecycleStage: lead.richardScore >= 9 ? "opportunity" : "lead",
  };
}

export async function syncBatchToCRM(leads: Lead[]): Promise<CRMSyncResult> {
  console.log("[HubSpot] syncBatchToCRM placeholder for", leads.length, "leads");

  await new Promise((r) => setTimeout(r, leads.length * 100));

  return {
    synced: leads.length,
    created: leads.length,
    updated: 0,
    failed: 0,
    errors: [],
    syncedAt: new Date().toISOString(),
  };
}

export async function createDeal(
  contactId: string,
  dealName: string,
  amount: number
): Promise<HubSpotDeal> {
  console.log("[HubSpot] createDeal placeholder:", dealName);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real HubSpot Deals API call
  // ═══════════════════════════════════════════════

  await new Promise((r) => setTimeout(r, 200));

  return {
    id: `deal-${Date.now()}`,
    dealName,
    pipeline: "default",
    stage: "appointmentscheduled",
    amount,
    associatedContactId: contactId,
  };
}
