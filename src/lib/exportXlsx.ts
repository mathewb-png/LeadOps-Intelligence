import * as XLSX from "xlsx";
import { Lead, CampaignLocale } from "@/types";
import {
  tierLabel,
  getScoreReason,
  classifyCompany,
  SCORING_RULES,
  ICP_INDUSTRIES,
  ICP_INCLUDE_TITLES,
  ICP_EXCLUDE_KEYWORDS,
  MANAGEMENT_LEVELS,
  SCORE_ACTION_MAP,
  LOCALIZED_EXCLUDE_KEYWORDS,
} from "./richardScoring";

// ─── Unified Full Report Export ──────────────────────────────────────────────

export function exportFullReport(leads: Lead[], campaignGoal: string, locale?: CampaignLocale) {
  const wb = XLSX.utils.book_new();
  const ts = new Date().toISOString().slice(0, 10);

  // ── Sheet 1: All Enriched Leads ──
  const sorted = [...leads].sort((a, b) => b.richardScore - a.richardScore);
  const leadRows = sorted.map((lead) => ({
    Name: lead.name,
    Company: lead.company,
    "Job Title": lead.jobTitle,
    "Richard Score": lead.richardScore,
    Tier: tierLabel(lead.tier),
    Industry: lead.industry,
    Email: lead.email,
    "Email Status": lead.emailStatus || "—",
    Phone: lead.phone,
    Location: lead.location,
    "Employee Count": lead.employeeCount,
    Revenue: lead.estimatedRevenue || "—",
    Funding: lead.fundingRaised ? `$${(lead.fundingRaised / 1_000_000).toFixed(1)}M` : "—",
    "Last Round": lead.lastFundingType?.replace(/_/g, " ") || "—",
    Investors: lead.investors?.join(", ") || "—",
    "Tech Stack": lead.techStack?.join(", ") || "—",
    LinkedIn: lead.linkedinUrl || "—",
    Source: lead.source,
    "Score Reason": getScoreReason(lead.jobTitle),
  }));
  const wsLeads = XLSX.utils.json_to_sheet(leadRows);
  wsLeads["!cols"] = [
    { wch: 22 }, { wch: 22 }, { wch: 28 }, { wch: 12 }, { wch: 16 },
    { wch: 18 }, { wch: 28 }, { wch: 12 }, { wch: 16 }, { wch: 22 },
    { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 40 },
    { wch: 40 }, { wch: 36 }, { wch: 10 }, { wch: 36 },
  ];
  XLSX.utils.book_append_sheet(wb, wsLeads, "Enriched Leads");

  // ── Sheet 2: Company Classification ──
  const seenCompanies = new Set<string>();
  const classRows: Record<string, string | number>[] = [];
  for (const lead of leads) {
    const key = lead.company.toLowerCase();
    if (seenCompanies.has(key) || !lead.company) continue;
    seenCompanies.add(key);
    const c = classifyCompany(lead, locale?.countryCode);
    classRows.push({
      "Company Name": c.companyName,
      "# Employees": c.employees,
      Industry: c.industry,
      Website: c.website,
      "Company Address": c.address,
      Country: locale?.country || "N/A",
      Category: c.category,
      Reasoning: c.reasoning,
    });
  }
  const wsClass = XLSX.utils.json_to_sheet(classRows);
  wsClass["!cols"] = [
    { wch: 28 }, { wch: 14 }, { wch: 22 }, { wch: 28 },
    { wch: 36 }, { wch: 16 }, { wch: 20 }, { wch: 50 },
  ];
  XLSX.utils.book_append_sheet(wb, wsClass, "Company Analysis");

  // ── Sheet 3: ICP Title Scores ──
  const titleMap = new Map<string, { score: number; reason: string; count: number }>();
  for (const lead of leads) {
    const existing = titleMap.get(lead.jobTitle);
    if (existing) {
      existing.count++;
    } else {
      titleMap.set(lead.jobTitle, {
        score: lead.richardScore,
        reason: getScoreReason(lead.jobTitle),
        count: 1,
      });
    }
  }
  const titleRows = Array.from(titleMap.entries())
    .map(([title, d]) => ({ Title: title, Score: d.score, Reason: d.reason, "# Leads": d.count }))
    .sort((a, b) => b.Score - a.Score);
  const wsTitles = XLSX.utils.json_to_sheet(titleRows);
  wsTitles["!cols"] = [{ wch: 36 }, { wch: 8 }, { wch: 36 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, wsTitles, "ICP Title Scores");

  // ── Sheet 4: Scoring Rules ──
  const seen = new Set<string>();
  const ruleRows = SCORING_RULES.filter((r) => {
    const key = `${r.trigger}-${r.score}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((r) => ({ Trigger: r.trigger, Score: r.score, Reason: r.reason }));
  const wsRules = XLSX.utils.json_to_sheet(ruleRows);
  wsRules["!cols"] = [{ wch: 36 }, { wch: 8 }, { wch: 36 }];
  XLSX.utils.book_append_sheet(wb, wsRules, "Scoring Rules");

  // ── Sheet 5: Score Legend ──
  const legendRows = SCORE_ACTION_MAP.map((r) => ({
    Score: r.range, Meaning: r.meaning, Action: r.action,
  }));
  const wsLegend = XLSX.utils.json_to_sheet(legendRows);
  wsLegend["!cols"] = [{ wch: 8 }, { wch: 50 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, wsLegend, "Score Legend");

  // ── Sheet 6: ICP Keywords ──
  const localizedKw = locale ? (LOCALIZED_EXCLUDE_KEYWORDS[locale.languageCode] || []) : [];
  const kwRows = [
    ...ICP_INCLUDE_TITLES.map((t) => ({ Keyword: t, Type: "Include Title", Language: "English" })),
    ...ICP_INDUSTRIES.map((i) => ({ Keyword: i, Type: "Target Industry", Language: "English" })),
    ...ICP_EXCLUDE_KEYWORDS.map((kw) => ({ Keyword: kw, Type: "Exclude", Language: "English" })),
    ...localizedKw.map((kw) => ({ Keyword: kw, Type: "Exclude", Language: locale?.language || "" })),
  ];
  const wsKw = XLSX.utils.json_to_sheet(kwRows);
  wsKw["!cols"] = [{ wch: 36 }, { wch: 18 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, wsKw, "ICP Keywords");

  // ── Sheet 7: Management Levels ──
  const mgmtRows = MANAGEMENT_LEVELS.map((m) => ({
    Level: m.level, Include: m.include ? "Yes" : "No", Priority: m.priority, Reason: m.reason,
  }));
  const wsMgmt = XLSX.utils.json_to_sheet(mgmtRows);
  wsMgmt["!cols"] = [{ wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsMgmt, "Management Levels");

  // ── Sheet 8: Campaign Summary ──
  const categoryCounts: Record<string, number> = {};
  for (const row of classRows) {
    const cat = row.Category as string;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  const summaryRows = [
    { Field: "Campaign Goal", Value: campaignGoal || "N/A" },
    { Field: "Target Country", Value: locale?.country || "N/A" },
    { Field: "Target Language", Value: locale?.language || "N/A" },
    { Field: "Target Region", Value: locale?.region || "All" },
    { Field: "", Value: "" },
    { Field: "── Lead Summary ──", Value: "" },
    { Field: "Total Leads", Value: String(leads.length) },
    { Field: "Enriched", Value: String(leads.filter((l) => l.enriched).length) },
    { Field: "Valid Emails", Value: String(leads.filter((l) => l.emailStatus === "valid").length) },
    { Field: "With LinkedIn", Value: String(leads.filter((l) => l.linkedinUrl).length) },
    { Field: "With Tech Stack", Value: String(leads.filter((l) => l.techStack && l.techStack.length > 0).length) },
    { Field: "", Value: "" },
    { Field: "── Score Breakdown ──", Value: "" },
    { Field: "Primary (9-10)", Value: String(leads.filter((l) => l.richardScore >= 9).length) },
    { Field: "Stakeholder (7-8)", Value: String(leads.filter((l) => l.richardScore >= 7 && l.richardScore < 9).length) },
    { Field: "Influence (4-6)", Value: String(leads.filter((l) => l.richardScore >= 4 && l.richardScore < 7).length) },
    { Field: "Peripheral (1-3)", Value: String(leads.filter((l) => l.richardScore >= 1 && l.richardScore < 4).length) },
    { Field: "Irrelevant (0)", Value: String(leads.filter((l) => l.richardScore === 0).length) },
    { Field: "", Value: "" },
    { Field: "── Company Classification ──", Value: "" },
    { Field: "Total Companies", Value: String(classRows.length) },
    ...Object.entries(categoryCounts).map(([cat, count]) => ({
      Field: cat, Value: String(count),
    })),
    { Field: "", Value: "" },
    { Field: "── ICP Stats ──", Value: "" },
    { Field: "Unique Titles", Value: String(titleMap.size) },
    { Field: "Scoring Rules", Value: String(ruleRows.length) },
    { Field: "Include Titles", Value: String(ICP_INCLUDE_TITLES.length) },
    { Field: "Exclude Keywords (EN)", Value: String(ICP_EXCLUDE_KEYWORDS.length) },
    { Field: "Exclude Keywords (Localized)", Value: String(localizedKw.length) },
    { Field: "", Value: "" },
    { Field: "Exported At", Value: new Date().toISOString() },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary["!cols"] = [{ wch: 30 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Campaign Summary");

  XLSX.writeFile(wb, `LeadOps-Full-Report-${ts}.xlsx`);
}

// ─── Individual Strategic Sheet Export ────────────────────────────────────────

export function exportStrategicSheet(leads: Lead[], campaignGoal: string) {
  const sorted = [...leads].sort((a, b) => b.richardScore - a.richardScore);

  const rows = sorted.map((lead) => ({
    Name: lead.name,
    Company: lead.company,
    "Job Title": lead.jobTitle,
    "Richard Score": lead.richardScore,
    Tier: tierLabel(lead.tier),
    Industry: lead.industry,
    Email: lead.email,
    Phone: lead.phone,
    Location: lead.location,
    Source: lead.source,
  }));

  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 22 }, { wch: 24 }, { wch: 30 }, { wch: 14 }, { wch: 22 },
    { wch: 18 }, { wch: 28 }, { wch: 16 }, { wch: 20 }, { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Scored Leads");

  const metaRows = [
    { Field: "Campaign Goal", Value: campaignGoal },
    { Field: "Total Leads", Value: String(leads.length) },
    { Field: "Primary (9-10)", Value: String(leads.filter((l) => l.richardScore >= 9).length) },
    { Field: "Stakeholder (7-8)", Value: String(leads.filter((l) => l.richardScore >= 7 && l.richardScore < 9).length) },
    { Field: "Influence (4-6)", Value: String(leads.filter((l) => l.richardScore >= 4 && l.richardScore < 7).length) },
    { Field: "Peripheral (1-3)", Value: String(leads.filter((l) => l.richardScore >= 1 && l.richardScore < 4).length) },
    { Field: "Irrelevant (0)", Value: String(leads.filter((l) => l.richardScore === 0).length) },
    { Field: "Exported At", Value: new Date().toISOString() },
  ];
  const metaWs = XLSX.utils.json_to_sheet(metaRows);
  metaWs["!cols"] = [{ wch: 20 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, metaWs, "Campaign Summary");

  const ts = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `LeadOps-Strategic-Sheet-${ts}.xlsx`);
}

// ─── ICP Targeting Framework Export ─────────────────────────────────────────

export function exportICPFramework(leads: Lead[], campaignGoal: string, locale?: CampaignLocale) {
  const wb = XLSX.utils.book_new();
  const ts = new Date().toISOString().slice(0, 10);

  // Sheet 1: Applied Title Scores
  if (leads.length > 0) {
    const titleMap = new Map<string, { score: number; reason: string; count: number }>();
    for (const lead of leads) {
      const existing = titleMap.get(lead.jobTitle);
      if (existing) {
        existing.count++;
      } else {
        titleMap.set(lead.jobTitle, {
          score: lead.richardScore,
          reason: getScoreReason(lead.jobTitle),
          count: 1,
        });
      }
    }
    const appliedRows = Array.from(titleMap.entries())
      .map(([title, data]) => ({
        Title: title,
        Score: data.score,
        Reason: data.reason,
        "# Leads": data.count,
      }))
      .sort((a, b) => b.Score - a.Score);

    const ws1 = XLSX.utils.json_to_sheet(appliedRows);
    ws1["!cols"] = [{ wch: 36 }, { wch: 8 }, { wch: 36 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws1, "Applied Title Scores");
  }

  // Sheet 2: Full Scoring Rules
  const seen = new Set<string>();
  const ruleRows = SCORING_RULES.filter((r) => {
    const key = `${r.trigger}-${r.score}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((r) => ({
    Trigger: r.trigger,
    Score: r.score,
    Reason: r.reason,
  }));

  const ws2 = XLSX.utils.json_to_sheet(ruleRows);
  ws2["!cols"] = [{ wch: 36 }, { wch: 8 }, { wch: 36 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Scoring Rules");

  // Sheet 3: Score Legend
  const legendRows = SCORE_ACTION_MAP.map((r) => ({
    Score: r.range,
    Meaning: r.meaning,
    Action: r.action,
  }));
  const ws3 = XLSX.utils.json_to_sheet(legendRows);
  ws3["!cols"] = [{ wch: 8 }, { wch: 50 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Score Legend");

  // Sheet 4: Include Keywords
  const includeRows = ICP_INCLUDE_TITLES.map((t) => ({ "Include Title": t }));
  const ws4 = XLSX.utils.json_to_sheet(includeRows);
  ws4["!cols"] = [{ wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws4, "Include Titles");

  // Sheet 5: Target Industries
  const indRows = ICP_INDUSTRIES.map((i) => ({ Industry: i }));
  const ws5 = XLSX.utils.json_to_sheet(indRows);
  ws5["!cols"] = [{ wch: 36 }];
  XLSX.utils.book_append_sheet(wb, ws5, "Target Industries");

  // Sheet 6: Exclude Keywords (English + Localized)
  const localizedKw = locale ? (LOCALIZED_EXCLUDE_KEYWORDS[locale.languageCode] || []) : [];
  const allExcludes = [
    ...ICP_EXCLUDE_KEYWORDS.map((kw) => ({ Keyword: kw, Language: "English" })),
    ...localizedKw.map((kw) => ({ Keyword: kw, Language: locale?.language || "" })),
  ];
  const ws6 = XLSX.utils.json_to_sheet(allExcludes);
  ws6["!cols"] = [{ wch: 30 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws6, "Exclude Keywords");

  // Sheet 7: Management Levels
  const mgmtRows = MANAGEMENT_LEVELS.map((m) => ({
    Level: m.level,
    Include: m.include ? "Yes" : "No",
    Priority: m.priority,
    Reason: m.reason,
  }));
  const ws7 = XLSX.utils.json_to_sheet(mgmtRows);
  ws7["!cols"] = [{ wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws7, "Management Levels");

  // Sheet 8: Campaign Summary
  const metaRows = [
    { Field: "Campaign Goal", Value: campaignGoal || "N/A" },
    { Field: "Target Country", Value: locale?.country || "N/A" },
    { Field: "Target Language", Value: locale?.language || "N/A" },
    { Field: "Target Region", Value: locale?.region || "All" },
    { Field: "Total Leads Analyzed", Value: String(leads.length) },
    { Field: "Unique Titles", Value: String(new Set(leads.map((l) => l.jobTitle)).size) },
    { Field: "Score 10 Count", Value: String(leads.filter((l) => l.richardScore === 10).length) },
    { Field: "Score 8-9 Count", Value: String(leads.filter((l) => l.richardScore >= 8 && l.richardScore < 10).length) },
    { Field: "Score 0 Count", Value: String(leads.filter((l) => l.richardScore === 0).length) },
    { Field: "Localized Exclude Keywords", Value: String(localizedKw.length) },
    { Field: "Exported At", Value: new Date().toISOString() },
  ];
  const ws8 = XLSX.utils.json_to_sheet(metaRows);
  ws8["!cols"] = [{ wch: 24 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, ws8, "Summary");

  XLSX.writeFile(wb, `ICP-Targeting-Framework-${ts}.xlsx`);
}

// ─── Company Classification Export ──────────────────────────────────────────

export function exportCompanyClassification(leads: Lead[], locale?: CampaignLocale) {
  const wb = XLSX.utils.book_new();
  const ts = new Date().toISOString().slice(0, 10);

  const seenCompanies = new Set<string>();
  const rows: Record<string, string | number>[] = [];

  for (const lead of leads) {
    const key = lead.company.toLowerCase();
    if (seenCompanies.has(key) || !lead.company) continue;
    seenCompanies.add(key);

    const c = classifyCompany(lead, locale?.countryCode);
    rows.push({
      "Company Name": c.companyName,
      "# Employees": c.employees,
      Industry: c.industry,
      Website: c.website,
      "Company LinkedIn URL": c.linkedinUrl,
      "Company Address": c.address,
      Country: locale?.country || "N/A",
      Category: c.category,
      Reasoning: c.reasoning,
    });
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 28 },
    { wch: 14 },
    { wch: 22 },
    { wch: 24 },
    { wch: 36 },
    { wch: 36 },
    { wch: 20 },
    { wch: 60 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Company Classification");

  const categoryCounts: Record<string, number> = {};
  for (const row of rows) {
    const cat = row.Category as string;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  const summaryRows = [
    { Field: "Total Companies", Value: String(rows.length) },
    { Field: "Target Country", Value: locale?.country || "N/A" },
    { Field: "Target Language", Value: locale?.language || "N/A" },
    ...Object.entries(categoryCounts).map(([cat, count]) => ({
      Field: cat,
      Value: String(count),
    })),
    { Field: "Exported At", Value: new Date().toISOString() },
  ];
  const ws2 = XLSX.utils.json_to_sheet(summaryRows);
  ws2["!cols"] = [{ wch: 24 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Summary");

  XLSX.writeFile(wb, `Company-Classification-${ts}.xlsx`);
}
