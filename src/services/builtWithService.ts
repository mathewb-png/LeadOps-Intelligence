import { BuiltWithProfile, BuiltWithTechnology } from "@/types";
import { lookupByDomain, lookupCompanyIntel } from "@/lib/companyIntel";

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
  console.log("[BuiltWith] getTechStack for:", domain);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real BuiltWith API call
  // ═══════════════════════════════════════════════
  //
  //  const response = await fetch(
  //    `https://api.builtwith.com/v21/api.json?KEY=${import.meta.env.VITE_BUILTWITH_API_KEY}&LOOKUP=${domain}`
  //  );
  //  const data = await response.json();
  //  return parseBuildWithResponse(data);

  await new Promise((r) => setTimeout(r, 150));

  const intel = lookupByDomain(domain);
  if (intel) {
    const techs: BuiltWithTechnology[] = intel.techStack.map((name) => ({
      name,
      category: categorizeTech(name),
      subcategory: subcategorizeTech(name),
      firstDetected: `${intel.foundedYear + 1}-01-01`,
      lastDetected: "2026-04-01",
      isPremium: isPremiumTech(name),
    }));

    return {
      domain,
      technologies: techs,
      categories: [...new Set(techs.map((t) => t.category))],
      spend: estimateSpend(intel.employeeRange),
    };
  }

  return {
    domain,
    technologies: [],
    categories: [],
    spend: null,
  };
}

export async function getTechStackByCompany(companyName: string): Promise<BuiltWithProfile> {
  const intel = lookupCompanyIntel(companyName);
  if (intel) return getTechStack(intel.domain);
  const domain = companyName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
  return getTechStack(domain);
}

function categorizeTech(name: string): string {
  const n = name.toLowerCase();
  if (["aws", "gcp", "google cloud", "azure", "bare metal", "aws govcloud"].some((k) => n.includes(k))) return "Cloud Hosting";
  if (["react", "angular", "vue", "next.js", "ember", "svelte", "owl"].some((k) => n.includes(k))) return "JavaScript Framework";
  if (["python", "java", "go", "ruby", "php", "c++", "c#", "kotlin", "swift", "rust", "scala", "haskell", "perl", ".net", "node.js", "typescript"].some((k) => n.includes(k))) return "Programming Language";
  if (["postgresql", "mysql", "mongodb", "cassandra", "cockroachdb", "oracle", "sql server", "clickhouse", "redis", "hbase"].some((k) => n.includes(k))) return "Database";
  if (["kafka", "rabbitmq", "nsq", "mqtt"].some((k) => n.includes(k))) return "Message Queue";
  if (["kubernetes", "docker", "terraform", "ansible", "vagrant", "packer"].some((k) => n.includes(k))) return "DevOps / Infrastructure";
  if (["elasticsearch", "algolia", "kibana"].some((k) => n.includes(k))) return "Search";
  if (["tensorflow", "pytorch", "ml", "cuda", "triton", "jax", "scikit"].some((k) => n.includes(k))) return "Machine Learning";
  if (["stripe", "adyen", "mollie"].some((k) => n.includes(k))) return "Payment";
  if (["cloudflare", "akamai", "cdn", "cloudfront"].some((k) => n.includes(k))) return "CDN / Performance";
  if (["salesforce", "hubspot", "sap", "graphql", "grpc", "rest"].some((k) => n.includes(k))) return "Enterprise / Integration";
  if (["vercel", "heroku", "netlify", "platform.sh"].some((k) => n.includes(k))) return "PaaS";
  if (["shopify", "contentful", "wordpress"].some((k) => n.includes(k))) return "CMS / eCommerce";
  if (["spark", "hadoop", "airflow", "dbt", "presto", "druid", "snowflake", "delta lake", "snowpark", "databricks", "bigquery"].some((k) => n.includes(k))) return "Data Engineering";
  return "Other";
}

function subcategorizeTech(name: string): string {
  const n = name.toLowerCase();
  if (["react", "angular", "vue", "svelte", "ember"].some((k) => n.includes(k))) return "Frontend";
  if (["next.js", "ruby on rails", "django", "express", "laravel", "symfony", "node.js"].some((k) => n.includes(k))) return "Backend / Fullstack";
  if (["aws", "gcp", "azure"].some((k) => n.includes(k))) return "IaaS";
  if (["kubernetes", "docker"].some((k) => n.includes(k))) return "Containerization";
  if (["terraform", "ansible"].some((k) => n.includes(k))) return "Infrastructure as Code";
  return "General";
}

function isPremiumTech(name: string): boolean {
  return ["AWS", "Azure", "GCP", "Google Cloud Platform", "Salesforce", "Snowflake", "Databricks", "SAP"].some(
    (k) => name.toLowerCase().includes(k.toLowerCase())
  );
}

function estimateSpend(employeeRange: string): { monthly: number; currency: string } | null {
  const ranges: Record<string, number> = {
    "10-50": 3000,
    "50-100": 8000,
    "100-200": 15000,
    "200-500": 35000,
    "500-1000": 80000,
    "1000-2000": 150000,
    "2000-5000": 300000,
    "5000-10000": 600000,
    "10000+": 1200000,
  };
  const monthly = ranges[employeeRange];
  return monthly ? { monthly, currency: "USD" } : null;
}
