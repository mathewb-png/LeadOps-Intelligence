import { ClearbitPerson, EnrichedCompany } from "@/types";
import { lookupByDomain, lookupCompanyIntel } from "@/lib/companyIntel";

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
  console.log("[Clearbit] enrichCompany for:", domain);

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

  await new Promise((r) => setTimeout(r, 150));

  const intel = lookupByDomain(domain);
  if (intel) {
    return {
      domain: intel.domain,
      name: extractName(intel.domain),
      industry: intel.industry,
      employeeCount: parseEmployeeCount(intel.employeeRange),
      employeeRange: intel.employeeRange,
      estimatedRevenue: intel.estimatedRevenue,
      techStack: intel.techStack,
      fundingRaised: intel.fundingRaised,
      foundedYear: intel.foundedYear,
      location: intel.location,
      description: intel.description,
      enrichedAt: new Date().toISOString(),
      source: "clearbit",
    };
  }

  return {
    domain,
    name: domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1),
    industry: "Unknown",
    employeeCount: 0,
    employeeRange: "Unknown",
    estimatedRevenue: "Unknown",
    techStack: [],
    fundingRaised: 0,
    foundedYear: 0,
    location: "Unknown",
    description: "",
    enrichedAt: new Date().toISOString(),
    source: "clearbit",
  };
}

export async function enrichCompanyByName(companyName: string): Promise<EnrichedCompany> {
  const intel = lookupCompanyIntel(companyName);
  if (intel) return enrichCompany(intel.domain);
  const domain = companyName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
  return enrichCompany(domain);
}

export async function enrichPerson(email: string): Promise<ClearbitPerson | null> {
  console.log("[Clearbit] enrichPerson for:", email);
  await new Promise((r) => setTimeout(r, 100));
  return null;
}

function extractName(domain: string): string {
  const name = domain.split(".")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function parseEmployeeCount(range: string): number {
  const match = range.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
