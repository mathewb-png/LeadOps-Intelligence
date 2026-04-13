import { ClearbitCompany, ClearbitPerson, EnrichedCompany } from "@/types";

/**
 * ─── API LANDING ZONE: Clearbit (HubSpot Breeze Intelligence) ───
 *
 * Cursor Shortcut:
 *   @clearbitService "Use the Clearbit Enrichment API to auto-fill company revenue,
 *   employee count, tech stack, and funding for each lead's domain."
 *
 * Clearbit API reference:
 *   Company:  GET https://company.clearbit.com/v2/companies/find?domain={domain}
 *   Person:   GET https://person.clearbit.com/v2/people/find?email={email}
 *   Combined: GET https://person.clearbit.com/v2/combined/find?email={email}
 *   Headers:  { "Authorization": "Bearer {api_key}" }
 *
 * Free tier: 1000 API calls/month (HubSpot integration)
 * Paid: custom pricing
 */

export async function enrichCompany(domain: string): Promise<EnrichedCompany> {
  console.log("[Clearbit] enrichCompany placeholder for:", domain);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Clearbit API call
  // ═══════════════════════════════════════════════
  //
  //  const response = await fetch(
  //    `https://company.clearbit.com/v2/companies/find?domain=${domain}`,
  //    { headers: { Authorization: `Bearer ${import.meta.env.VITE_CLEARBIT_API_KEY}` } }
  //  );
  //  const company: ClearbitCompany = await response.json();
  //  return mapClearbitToEnriched(company);

  await new Promise((r) => setTimeout(r, 400));

  const companyName = domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);
  const techOptions = [
    ["React", "AWS", "PostgreSQL", "Node.js"],
    ["Vue.js", "GCP", "MongoDB", "Python"],
    ["Angular", "Azure", "MySQL", "Java"],
    ["Next.js", "Vercel", "Redis", "TypeScript"],
  ];

  return {
    domain,
    name: companyName,
    industry: "Technology",
    employeeCount: 150,
    employeeRange: "50-200",
    estimatedRevenue: "$10M - $25M",
    techStack: techOptions[Math.floor(Math.random() * techOptions.length)],
    fundingRaised: 12_000_000,
    foundedYear: 2018,
    location: "San Francisco, CA",
    description: `${companyName} is a technology company.`,
    enrichedAt: new Date().toISOString(),
    source: "clearbit",
  };
}

export async function enrichPerson(email: string): Promise<ClearbitPerson | null> {
  console.log("[Clearbit] enrichPerson placeholder for:", email);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Clearbit Person API call
  // ═══════════════════════════════════════════════

  await new Promise((r) => setTimeout(r, 300));

  return null;
}
