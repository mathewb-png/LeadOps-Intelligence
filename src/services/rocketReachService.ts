import { RocketReachContact, RocketReachSearchParams } from "@/types";

/**
 * ─── API LANDING ZONE: RocketReach ───
 *
 * Cursor Shortcut:
 *   @rocketReachService "Use the RocketReach API to look up contacts by name and
 *   company, and enrich our leads with email, phone, and LinkedIn profiles."
 *
 * RocketReach API reference:
 *   Lookup:  POST https://api.rocketreach.co/v2/api/lookupProfile
 *   Search:  POST https://api.rocketreach.co/v2/api/search
 *   Headers: { "Api-Key": "{key}", "Content-Type": "application/json" }
 *
 * Pricing: from $39/mo for 80 lookups
 */

export async function lookupContact(
  name: string,
  company: string
): Promise<RocketReachContact | null> {
  console.log("[RocketReach] lookupContact placeholder for:", name, "at", company);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real RocketReach API call
  // ═══════════════════════════════════════════════
  //
  //  const response = await fetch("https://api.rocketreach.co/v2/api/lookupProfile", {
  //    method: "POST",
  //    headers: {
  //      "Api-Key": import.meta.env.VITE_ROCKETREACH_API_KEY,
  //      "Content-Type": "application/json",
  //    },
  //    body: JSON.stringify({ name, current_employer: company }),
  //  });

  await new Promise((r) => setTimeout(r, 500));

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ") || "Unknown";
  const domain = company.toLowerCase().replace(/\s+/g, "") + ".com";

  return {
    id: Math.floor(Math.random() * 100000),
    name,
    firstName,
    lastName,
    title: "Professional",
    company,
    email: `${firstName.toLowerCase()}@${domain}`,
    phones: [{ number: "+1 (555) 000-0000", type: "work" }],
    linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase().replace(/\s/g, "")}`,
    location: "United States",
    industry: "Technology",
  };
}

export async function searchPeople(
  params: RocketReachSearchParams
): Promise<RocketReachContact[]> {
  console.log("[RocketReach] searchPeople placeholder with:", params);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real RocketReach search
  // ═══════════════════════════════════════════════

  await new Promise((r) => setTimeout(r, 600));

  return [];
}
