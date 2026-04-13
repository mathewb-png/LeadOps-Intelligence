import { CrunchbaseCompany, CrunchbaseFundingRound } from "@/types";
import { lookupCompanyIntel } from "@/lib/companyIntel";

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
  console.log("[Crunchbase] getCompanyDetails for:", companyName);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Crunchbase API call
  // ═══════════════════════════════════════════════
  //
  //  const permalink = companyName.toLowerCase().replace(/\s+/g, "-");
  //  const response = await fetch(
  //    `https://api.crunchbase.com/api/v4/entities/organizations/${permalink}?user_key=${import.meta.env.VITE_CRUNCHBASE_API_KEY}`
  //  );

  await new Promise((r) => setTimeout(r, 200));

  const intel = lookupCompanyIntel(companyName);
  if (intel) {
    return {
      uuid: `cb-${companyName.toLowerCase().replace(/\s+/g, "-")}`,
      name: companyName,
      shortDescription: intel.description,
      foundedOn: `${intel.foundedYear}-01-01`,
      numEmployeesEnum: employeeRangeToEnum(intel.employeeRange),
      revenueRange: intel.estimatedRevenue,
      categories: [intel.industry],
      headquartersLocation: intel.location,
      totalFundingUsd: intel.fundingRaised,
      lastFundingType: intel.lastFundingType,
      lastFundingDate: intel.lastFundingDate,
      ipoStatus: intel.lastFundingType === "ipo" || intel.lastFundingType === "spac_ipo" ? "public" : "private",
      fundingRounds: buildFundingRounds(intel.fundingRaised, intel.lastFundingType, intel.lastFundingDate, intel.investors),
      investors: intel.investors,
      website: `https://${intel.domain}`,
    };
  }

  return null;
}

export async function getCompanyFunding(
  companyName: string
): Promise<CrunchbaseFundingRound[]> {
  const details = await getCompanyDetails(companyName);
  return details?.fundingRounds ?? [];
}

function employeeRangeToEnum(range: string): string {
  const map: Record<string, string> = {
    "10-50": "c_0011_0050",
    "50-100": "c_0051_0100",
    "100-200": "c_0101_0250",
    "200-500": "c_0251_0500",
    "500-1000": "c_0501_1000",
    "1000-2000": "c_1001_5000",
    "2000-5000": "c_1001_5000",
    "5000-10000": "c_5001_10000",
    "10000+": "c_10001_plus",
  };
  return map[range] || "unknown";
}

function buildFundingRounds(
  total: number,
  lastType: string,
  lastDate: string,
  investors: string[]
): CrunchbaseFundingRound[] {
  if (total === 0 || lastType === "bootstrapped" || lastType === "private") return [];

  const rounds: CrunchbaseFundingRound[] = [];

  if (total > 50_000_000 && lastType !== "seed") {
    rounds.push({
      type: "seed",
      seriesName: "Seed",
      moneyRaised: Math.min(total * 0.05, 5_000_000),
      currency: "USD",
      announcedDate: yearsBefore(lastDate, 4),
      leadInvestors: investors.slice(-2),
    });
  }

  if (total > 200_000_000 && !["seed", "series_a"].includes(lastType)) {
    rounds.push({
      type: "series_a",
      seriesName: "Series A",
      moneyRaised: Math.min(total * 0.1, 30_000_000),
      currency: "USD",
      announcedDate: yearsBefore(lastDate, 3),
      leadInvestors: investors.slice(0, 2),
    });
  }

  if (total > 500_000_000 && !["seed", "series_a", "series_b"].includes(lastType)) {
    rounds.push({
      type: "series_b",
      seriesName: "Series B",
      moneyRaised: Math.min(total * 0.15, 100_000_000),
      currency: "USD",
      announcedDate: yearsBefore(lastDate, 2),
      leadInvestors: investors.slice(0, 3),
    });
  }

  rounds.push({
    type: lastType,
    seriesName: lastType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    moneyRaised: total - rounds.reduce((s, r) => s + r.moneyRaised, 0),
    currency: "USD",
    announcedDate: lastDate,
    leadInvestors: investors.slice(0, 3),
  });

  return rounds;
}

function yearsBefore(dateStr: string, years: number): string {
  try {
    const d = new Date(dateStr);
    d.setFullYear(d.getFullYear() - years);
    return d.toISOString().slice(0, 10);
  } catch {
    return dateStr;
  }
}
