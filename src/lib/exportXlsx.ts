import * as XLSX from "xlsx";
import { Lead } from "@/types";
import { tierLabel } from "./richardScoring";

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

  const colWidths = [
    { wch: 22 }, // Name
    { wch: 24 }, // Company
    { wch: 30 }, // Job Title
    { wch: 14 }, // Richard Score
    { wch: 22 }, // Tier
    { wch: 18 }, // Industry
    { wch: 28 }, // Email
    { wch: 16 }, // Phone
    { wch: 20 }, // Location
    { wch: 14 }, // Source
  ];
  ws["!cols"] = colWidths;

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
