import { CrunchbaseCompany, CrunchbaseFundingRound } from "@/types";

/**
 * ─── API LANDING ZONE: Crunchbase ───
 *
 * Cursor Shortcut:
 *   @crunchbaseService "Use the Crunchbase API to pull funding data, investor info,
 *   and company stage for each lead's company. Use this to refine Influence-tier scoring."
 *
 * Crunchbase API reference:
 *   Search:  POST https://api.crunchbase.com/api/v4/searches/organizations
 *   Entity:  GET  https://api.crunchbase.com/api/v4/entities/organizations/{permalink}
 *   Headers: { "X-cb-user-key": "{api_key}" }
 *
 * Pricing: from $29/mo (Basic) for 200 API calls/month
 */

export async function getCompanyDetails(companyName: string): Promise<CrunchbaseCompany | null> {
  console.log("[Crunchbase] getCompanyDetails placeholder for:", companyName);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Crunchbase API call
  // ═══════════════════════════════════════════════
  //
  //  const permalink = companyName.toLowerCase().replace(/\s+/g, "-");
  //  const response = await fetch(
  //    `https://api.crunchbase.com/api/v4/entities/organizations/${permalink}?user_key=${import.meta.env.VITE_CRUNCHBASE_API_KEY}`
  //  );

  await new Promise((r) => setTimeout(r, 500));

  return {
    uuid: `cb-${Date.now()}`,
    name: companyName,
    shortDescription: `${companyName} builds enterprise software solutions.`,
    foundedOn: "2018-03-15",
    numEmployeesEnum: "c_0051_0100",
    revenueRange: "r_01000000_10000000",
    categories: ["Software", "Enterprise"],
    headquartersLocation: "San Francisco, California, United States",
    totalFundingUsd: 15_000_000,
    lastFundingType: "series_a",
    lastFundingDate: "2024-06-01",
    ipoStatus: "private",
    fundingRounds: [
      {
        type: "seed",
        seriesName: "Seed",
        moneyRaised: 3_000_000,
        currency: "USD",
        announcedDate: "2019-01-15",
        leadInvestors: ["Sequoia Capital"],
      },
      {
        type: "series_a",
        seriesName: "Series A",
        moneyRaised: 12_000_000,
        currency: "USD",
        announcedDate: "2024-06-01",
        leadInvestors: ["Andreessen Horowitz"],
      },
    ],
    investors: ["Sequoia Capital", "Andreessen Horowitz", "Y Combinator"],
    website: `https://${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
  };
}

export async function getCompanyFunding(
  companyName: string
): Promise<CrunchbaseFundingRound[]> {
  console.log("[Crunchbase] getCompanyFunding placeholder for:", companyName);

  const details = await getCompanyDetails(companyName);
  return details?.fundingRounds ?? [];
}
