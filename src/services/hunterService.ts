import { HunterDomainSearch, HunterVerification } from "@/types";

/**
 * ─── API LANDING ZONE: Hunter.io ───
 *
 * Cursor Shortcut:
 *   @hunterService "Use the Hunter.io API to find emails for each company domain
 *   in our leads list. Use domain-search for bulk and email-verifier for validation."
 *
 * Hunter.io API reference:
 *   Domain Search: GET https://api.hunter.io/v2/domain-search?domain={domain}&api_key={key}
 *   Email Finder:  GET https://api.hunter.io/v2/email-finder?domain={domain}&first_name={fn}&last_name={ln}&api_key={key}
 *   Email Verifier: GET https://api.hunter.io/v2/email-verifier?email={email}&api_key={key}
 *
 * Free tier: 25 searches/month, 50 verifications/month
 * Paid: from $49/mo for 500 searches
 */

export async function findEmailsByDomain(domain: string): Promise<HunterDomainSearch> {
  console.log("[Hunter.io] findEmailsByDomain placeholder for:", domain);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Hunter.io API call
  // ═══════════════════════════════════════════════
  //
  //  const response = await fetch(
  //    `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${import.meta.env.VITE_HUNTER_API_KEY}`,
  //  );
  //  const data = await response.json();
  //  return {
  //    domain: data.data.domain,
  //    organization: data.data.organization,
  //    emails: data.data.emails.map(e => ({ ... })),
  //    totalResults: data.meta.results,
  //  };

  await new Promise((r) => setTimeout(r, 400));

  return {
    domain,
    organization: domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1),
    emails: [
      {
        email: `contact@${domain}`,
        firstName: "Contact",
        lastName: "Team",
        position: "General",
        department: "general",
        confidence: 85,
        type: "generic",
        sources: [{ domain, uri: `https://${domain}` }],
      },
    ],
    totalResults: 1,
  };
}

export async function findEmail(
  domain: string,
  firstName: string,
  lastName: string
): Promise<{ email: string; confidence: number } | null> {
  console.log("[Hunter.io] findEmail placeholder for:", firstName, lastName, "@", domain);

  await new Promise((r) => setTimeout(r, 300));

  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  return { email, confidence: 78 };
}

export async function verifyEmail(email: string): Promise<HunterVerification> {
  console.log("[Hunter.io] verifyEmail placeholder for:", email);

  await new Promise((r) => setTimeout(r, 200));

  return {
    email,
    status: "valid",
    score: 91,
    regexp: true,
    gibberish: false,
    disposable: false,
    webmail: false,
    mxRecords: true,
    smtpServer: true,
    smtpCheck: true,
  };
}
