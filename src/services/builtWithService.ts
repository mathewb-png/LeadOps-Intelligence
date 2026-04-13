import { BuiltWithProfile, BuiltWithTechnology } from "@/types";

/**
 * ─── API LANDING ZONE: BuiltWith ───
 *
 * Cursor Shortcut:
 *   @builtWithService "Use the BuiltWith API to detect the tech stack for each
 *   lead's company domain. Flag leads using AWS/GCP/Azure when selling FinOps tools."
 *
 * BuiltWith API reference:
 *   Free:  GET https://api.builtwith.com/free1/api.json?KEY={key}&LOOKUP={domain}
 *   Full:  GET https://api.builtwith.com/v21/api.json?KEY={key}&LOOKUP={domain}
 *
 * Free tier: limited results
 * Paid: from $295/mo
 */

export async function getTechStack(domain: string): Promise<BuiltWithProfile> {
  console.log("[BuiltWith] getTechStack placeholder for:", domain);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real BuiltWith API call
  // ═══════════════════════════════════════════════
  //
  //  const response = await fetch(
  //    `https://api.builtwith.com/v21/api.json?KEY=${import.meta.env.VITE_BUILTWITH_API_KEY}&LOOKUP=${domain}`
  //  );
  //  const data = await response.json();
  //  return parseBuildWithResponse(data);

  await new Promise((r) => setTimeout(r, 350));

  const techSets: BuiltWithTechnology[][] = [
    [
      { name: "Amazon Web Services", category: "Cloud Hosting", subcategory: "IaaS", firstDetected: "2020-01-01", lastDetected: "2026-04-01", isPremium: true },
      { name: "React", category: "JavaScript Framework", subcategory: "Frontend", firstDetected: "2021-03-01", lastDetected: "2026-04-01", isPremium: false },
      { name: "Cloudflare", category: "CDN", subcategory: "Performance", firstDetected: "2020-06-01", lastDetected: "2026-04-01", isPremium: false },
      { name: "Stripe", category: "Payment", subcategory: "Processing", firstDetected: "2021-01-01", lastDetected: "2026-04-01", isPremium: true },
    ],
    [
      { name: "Google Cloud Platform", category: "Cloud Hosting", subcategory: "IaaS", firstDetected: "2019-06-01", lastDetected: "2026-04-01", isPremium: true },
      { name: "Next.js", category: "JavaScript Framework", subcategory: "Fullstack", firstDetected: "2022-01-01", lastDetected: "2026-04-01", isPremium: false },
      { name: "Vercel", category: "Cloud Hosting", subcategory: "PaaS", firstDetected: "2022-01-01", lastDetected: "2026-04-01", isPremium: false },
    ],
    [
      { name: "Microsoft Azure", category: "Cloud Hosting", subcategory: "IaaS", firstDetected: "2020-08-01", lastDetected: "2026-04-01", isPremium: true },
      { name: "Angular", category: "JavaScript Framework", subcategory: "Frontend", firstDetected: "2019-01-01", lastDetected: "2026-04-01", isPremium: false },
      { name: "Salesforce", category: "CRM", subcategory: "Sales", firstDetected: "2020-01-01", lastDetected: "2026-04-01", isPremium: true },
    ],
  ];

  const techs = techSets[Math.floor(Math.random() * techSets.length)];

  return {
    domain,
    technologies: techs,
    categories: [...new Set(techs.map((t) => t.category))],
    spend: { monthly: 5000 + Math.floor(Math.random() * 15000), currency: "USD" },
  };
}
