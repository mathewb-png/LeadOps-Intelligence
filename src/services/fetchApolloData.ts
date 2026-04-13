import { Lead } from "@/types";
import { computeRichardScore, scoreToTier } from "@/lib/richardScoring";

/**
 * ─── API LANDING ZONE: Apollo.io Integration ───
 *
 * Cursor Shortcut:
 *   @fetchApolloData "Use the Apollo API documentation to write a POST request
 *   that sends our UI titles and excludes our Supabase permanent_exclusions list."
 *
 * Apollo.io API reference:
 *   POST https://api.apollo.io/v1/mixed_people/search
 *   Headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }
 *   Body: { api_key, person_titles[], person_not_titles[], q_organization_keyword_tags[], ... }
 *
 * When implementing:
 *   1. Pull active exclusion words from Supabase `permanent_exclusions` table
 *   2. Map them to `person_not_titles` in the Apollo request
 *   3. Use `personaTitles` from the Persona Architect as `person_titles`
 *   4. Use `industryKeywords` as `q_organization_keyword_tags`
 *   5. Score all returned results with computeRichardScore()
 */

interface FetchApolloParams {
  personaTitles: string[];
  industryKeywords: string[];
  excludedWords: string[];
  location?: string;
  employeeRange?: string;
}

export async function fetchApolloData(params: FetchApolloParams): Promise<Lead[]> {
  console.log("[fetchApolloData] Placeholder called with:", params);

  // ═══════════════════════════════════════════════
  //  TODO: Replace this mock with real Apollo API call
  // ═══════════════════════════════════════════════
  //
  //  const exclusions = await supabase
  //    .from("permanent_exclusions")
  //    .select("word")
  //    .eq("active", true);
  //
  //  const response = await fetch("https://api.apollo.io/v1/mixed_people/search", {
  //    method: "POST",
  //    headers: { "Content-Type": "application/json" },
  //    body: JSON.stringify({
  //      api_key: import.meta.env.VITE_APOLLO_API_KEY,
  //      person_titles: params.personaTitles,
  //      person_not_titles: [...params.excludedWords, ...exclusions],
  //      q_organization_keyword_tags: params.industryKeywords,
  //      per_page: 50,
  //    }),
  //  });

  await new Promise((r) => setTimeout(r, 1200));

  const mockResults = generateMockApolloResults(params);

  return mockResults.map((raw, i) => {
    const richardScore = computeRichardScore(raw.jobTitle);
    return {
      id: `apollo-${Date.now()}-${i}`,
      name: raw.name,
      company: raw.company,
      jobTitle: raw.jobTitle,
      email: raw.email,
      phone: raw.phone || "",
      industry: raw.industry,
      location: raw.location,
      employeeCount: raw.employeeCount || "50-200",
      richardScore,
      tier: scoreToTier(richardScore),
      source: "Apollo",
      fetchedAt: new Date().toISOString(),
      excluded: false,
    };
  });
}

function generateMockApolloResults(params: FetchApolloParams) {
  const names = [
    "Sarah Chen", "Marcus Rivera", "Diana Patel", "James Okoro", "Emily Vasquez",
    "Thomas Brennan", "Rachel Kim", "Alex Thornton", "Priya Sharma", "Michael Torres",
    "Lisa Wang", "Robert Fischer", "Ana Gonzalez", "David Park", "Nicole Adams",
    "Kevin Wright", "Maria Rossi", "Chris Yamamoto", "Fatima Al-Hassan", "John McCarthy",
  ];
  const companies = [
    "TechNova", "GreenLeaf Energy", "FinEdge Capital", "MediCore Health", "CloudBridge",
    "RetailMax", "Apex Logistics", "EduVerse", "Quantum Dynamics", "Harbor RE",
    "NovaBio", "SkyNet Telecom", "DataVault", "NeuroLink", "Stratosphere AI",
    "BrightPath", "Cirrus Systems", "Pinnacle Ops", "Evergreen SaaS", "Bolt Commerce",
  ];
  const titles = [
    "Head of SEO", "VP of Growth", "Marketing Director", "FinOps Manager",
    "Head of GTM", "VP Operations", "Product Lead", "Director of Product",
    "CEO", "Co-Founder", "Managing Director", "Founder",
    "IT Support Specialist", "Finance Analyst", "IT Manager",
    "Sales Development Rep", "HR Coordinator", "Admin Assistant", "Junior Analyst",
    "Head of Cloud Economics",
  ];
  const industries = params.industryKeywords.length
    ? params.industryKeywords
    : ["SaaS", "FinTech", "HealthTech", "CleanTech", "eCommerce"];
  const locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Boston, MA", "Seattle, WA", "Chicago, IL", "London, UK", "Toronto, CA"];

  return titles.map((title, i) => ({
    name: names[i % names.length],
    company: companies[i % companies.length],
    jobTitle: title,
    email: `${names[i % names.length].split(" ")[0].toLowerCase()}@${companies[i % companies.length].toLowerCase().replace(/\s/g, "")}.com`,
    phone: `+1 (${400 + i}) 555-0${100 + i}`,
    industry: industries[i % industries.length],
    location: locations[i % locations.length],
    employeeCount: ["10-50", "50-200", "200-500", "500-1000"][i % 4],
  }));
}
