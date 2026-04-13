import { Lead, CampaignLocale } from "@/types";
import { computeRichardScore, scoreToTier } from "@/lib/richardScoring";
import { enrichCompany } from "./clearbitService";
import { getTechStack } from "./builtWithService";
import { findEmail } from "./hunterService";
import { lookupContact } from "./rocketReachService";
import { getCompanyDetails } from "./crunchbaseService";
import { validateEmail } from "./zeroBounceService";

export interface EnrichmentProgress {
  stage: string;
  current: number;
  total: number;
  completedStages: string[];
  errors: string[];
}

type ProgressCallback = (progress: EnrichmentProgress) => void;

/**
 * Runs all enrichment APIs on a batch of leads in sequence:
 *   1. Clearbit  — company revenue, employee count, description
 *   2. BuiltWith — tech stack detection
 *   3. Crunchbase — funding rounds, investors
 *   4. Hunter.io — email discovery (fill missing emails)
 *   5. RocketReach — LinkedIn URL, alternate contacts
 *   6. ZeroBounce — email validation
 *   7. Re-score   — recompute Richard Score with enriched data
 */
export async function runFullEnrichment(
  leads: Lead[],
  locale: CampaignLocale,
  onProgress: ProgressCallback
): Promise<Lead[]> {
  const total = leads.length;
  const completedStages: string[] = [];
  const errors: string[] = [];
  let enriched = [...leads];

  const report = (stage: string, current: number) =>
    onProgress({ stage, current, total, completedStages: [...completedStages], errors: [...errors] });

  // ── Stage 1: Clearbit Company Enrichment ──
  report("Clearbit — Company data", 0);
  enriched = await Promise.all(
    enriched.map(async (lead, i) => {
      try {
        const domain = getDomain(lead);
        const company = await enrichCompany(domain);
        report("Clearbit — Company data", i + 1);
        return {
          ...lead,
          estimatedRevenue: company.estimatedRevenue || lead.estimatedRevenue,
          employeeCount: company.employeeRange || lead.employeeCount,
          companyDescription: company.description,
          companyFoundedYear: company.foundedYear,
          companyDomain: company.domain,
          companyLocation: company.location || lead.companyLocation,
          enriched: true,
        };
      } catch {
        return lead;
      }
    })
  );
  completedStages.push("Clearbit");

  // ── Stage 2: BuiltWith Tech Stack ──
  report("BuiltWith — Tech stack", 0);
  enriched = await Promise.all(
    enriched.map(async (lead, i) => {
      try {
        const domain = getDomain(lead);
        const tech = await getTechStack(domain);
        report("BuiltWith — Tech stack", i + 1);
        return {
          ...lead,
          techStack: tech.technologies.map((t) => t.name).slice(0, 10),
        };
      } catch {
        return lead;
      }
    })
  );
  completedStages.push("BuiltWith");

  // ── Stage 3: Crunchbase Funding ──
  report("Crunchbase — Funding data", 0);
  const seenDomains = new Map<string, { funding: number; investors: string[]; lastType: string; lastDate: string }>();
  for (let i = 0; i < enriched.length; i++) {
    const lead = enriched[i];
    try {
      const domain = getDomain(lead);
      if (!seenDomains.has(domain)) {
        const details = await getCompanyDetails(lead.company);
        if (details) {
          seenDomains.set(domain, {
            funding: details.totalFundingUsd,
            investors: details.investors.slice(0, 5),
            lastType: details.lastFundingType,
            lastDate: details.lastFundingDate,
          });
        }
      }
      const data = seenDomains.get(domain);
      if (data) {
        enriched[i] = {
          ...lead,
          fundingRaised: data.funding || lead.fundingRaised,
          investors: data.investors,
          lastFundingType: data.lastType,
          lastFundingDate: data.lastDate,
        };
      }
    } catch { /* skip */ }
    report("Crunchbase — Funding data", i + 1);
  }
  completedStages.push("Crunchbase");

  // ── Stage 4: Hunter.io Email Discovery ──
  report("Hunter.io — Email discovery", 0);
  for (let i = 0; i < enriched.length; i++) {
    const lead = enriched[i];
    try {
      const domain = getDomain(lead);
      const [firstName] = lead.name.split(" ");
      const lastName = lead.name.split(" ").slice(1).join(" ");
      const found = await findEmail(domain, firstName, lastName);
      if (found) {
        enriched[i] = {
          ...lead,
          email: found.email || lead.email,
          emailConfidence: found.confidence,
        };
      }
    } catch { /* skip */ }
    report("Hunter.io — Email discovery", i + 1);
  }
  completedStages.push("Hunter.io");

  // ── Stage 5: RocketReach Contact Enrichment ──
  report("RocketReach — Contact data", 0);
  for (let i = 0; i < enriched.length; i++) {
    const lead = enriched[i];
    try {
      const contact = await lookupContact(lead.name, lead.company);
      if (contact) {
        enriched[i] = {
          ...lead,
          linkedinUrl: contact.linkedinUrl || lead.linkedinUrl,
          phone: contact.phones?.[0]?.number || lead.phone,
        };
      }
    } catch { /* skip */ }
    report("RocketReach — Contact data", i + 1);
  }
  completedStages.push("RocketReach");

  // ── Stage 6: ZeroBounce Email Validation ──
  report("ZeroBounce — Email validation", 0);
  for (let i = 0; i < enriched.length; i++) {
    const lead = enriched[i];
    try {
      if (lead.email) {
        const result = await validateEmail(lead.email);
        enriched[i] = { ...lead, emailStatus: result.status };
      }
    } catch { /* skip */ }
    report("ZeroBounce — Email validation", i + 1);
  }
  completedStages.push("ZeroBounce");

  // ── Stage 7: Re-Score ──
  report("Scoring — Richard Score", 0);
  enriched = enriched.map((lead, i) => {
    const score = computeRichardScore(lead.jobTitle, locale.languageCode);
    report("Scoring — Richard Score", i + 1);
    return { ...lead, richardScore: score, tier: scoreToTier(score), enriched: true };
  });
  completedStages.push("Scoring");

  onProgress({ stage: "Complete", current: total, total, completedStages: [...completedStages], errors: [...errors] });
  return enriched;
}

function getDomain(lead: Lead): string {
  if (lead.email && lead.email.includes("@")) {
    return lead.email.split("@")[1];
  }
  return `${lead.company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
}
