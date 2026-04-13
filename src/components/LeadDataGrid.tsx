import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Linkedin,
  Globe,
  Building2,
  DollarSign,
  Calendar,
  Users,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { Lead, EmailValidationStatus } from "@/types";
import RichardScoreBadge from "./RichardScoreBadge";
import TierBadge from "./TierBadge";
import { exportStrategicSheet } from "@/lib/exportXlsx";

interface LeadDataGridProps {
  leads: Lead[];
  campaignGoal: string;
}

type SortKey = "richardScore" | "name" | "company" | "jobTitle" | "tier" | "emailStatus";
type SortDir = "asc" | "desc";

function EmailStatusIcon({ status }: { status?: EmailValidationStatus }) {
  if (!status) return <span className="text-gray-300 dark:text-gray-600">—</span>;
  switch (status) {
    case "valid":
      return <span title="Valid"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></span>;
    case "invalid":
      return <span title="Invalid"><XCircle className="h-4 w-4 text-red-500" /></span>;
    case "catch-all":
      return <span title="Catch-all"><AlertTriangle className="h-4 w-4 text-amber-500" /></span>;
    case "spamtrap":
    case "abuse":
    case "do_not_mail":
      return <span title={status}><XCircle className="h-4 w-4 text-red-600" /></span>;
    default:
      return <span title="Unknown"><HelpCircle className="h-4 w-4 text-gray-400" /></span>;
  }
}

function formatFunding(amount?: number): string {
  if (!amount) return "—";
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export default function LeadDataGrid({ leads, campaignGoal }: LeadDataGridProps) {
  const [sortKey, setSortKey] = useState<SortKey>("richardScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "richardScore") return (a.richardScore - b.richardScore) * dir;
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [leads, sortKey, sortDir]);

  const enrichedCount = leads.filter((l) => l.enriched).length;
  const validEmails = leads.filter((l) => l.emailStatus === "valid").length;
  const withLinkedin = leads.filter((l) => l.linkedinUrl).length;
  const withTech = leads.filter((l) => l.techStack && l.techStack.length > 0).length;

  const SortIcon = ({ field }: { field: SortKey }) => (
    <ArrowUpDown
      className={`ml-1 inline h-3 w-3 ${sortKey === field ? "text-brand-600" : "text-gray-400"}`}
    />
  );

  const thClass =
    "cursor-pointer whitespace-nowrap px-3 py-3 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-xs";

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Lead Results
          </h2>
          <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-gray-500 dark:text-gray-400">
            <span>{leads.length} leads</span>
            <span className="text-emerald-600">{enrichedCount} enriched</span>
            <span className="text-blue-600">{validEmails} valid emails</span>
            <span className="text-violet-600">{withTech} with tech stack</span>
            <span className="text-pink-600">{withLinkedin} with LinkedIn</span>
          </div>
        </div>
        <button
          onClick={() => exportStrategicSheet(leads, campaignGoal)}
          className="btn-primary"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Download Strategic Sheet
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className={thClass} onClick={() => toggleSort("name")}>
                Name <SortIcon field="name" />
              </th>
              <th className={thClass} onClick={() => toggleSort("company")}>
                Company <SortIcon field="company" />
              </th>
              <th className={thClass} onClick={() => toggleSort("jobTitle")}>
                Job Title <SortIcon field="jobTitle" />
              </th>
              <th className={`${thClass} text-center`} onClick={() => toggleSort("richardScore")}>
                Score <SortIcon field="richardScore" />
              </th>
              <th className={thClass} onClick={() => toggleSort("tier")}>
                Tier <SortIcon field="tier" />
              </th>
              <th className="whitespace-nowrap px-3 py-3 text-center font-medium text-gray-500 dark:text-gray-400 text-xs">
                Email
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs">
                Location
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs">
                Revenue
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs">
                Funding
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs">
                Tech Stack
              </th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sorted.map((lead) => (
              <>
                <tr
                  key={lead.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <td className="whitespace-nowrap px-3 py-3 font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-1.5">
                      {lead.name}
                      {lead.enriched && (
                        <span title="Enriched"><Sparkles className="h-3.5 w-3.5 text-brand-500" /></span>
                      )}
                      {lead.linkedinUrl && (
                        <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                          <Linkedin className="h-3 w-3 text-blue-600 hover:text-blue-700" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-600 dark:text-gray-300 max-w-[140px] truncate">
                    {lead.company}
                  </td>
                  <td className="px-3 py-3 text-gray-600 dark:text-gray-300 max-w-[160px] truncate">
                    {lead.jobTitle}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <RichardScoreBadge score={lead.richardScore} />
                  </td>
                  <td className="px-3 py-3">
                    <TierBadge tier={lead.tier} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <EmailStatusIcon status={lead.emailStatus} />
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400 max-w-[120px] truncate">
                    {lead.location || "—"}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {lead.estimatedRevenue || "—"}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {formatFunding(lead.fundingRaised)}
                  </td>
                  <td className="px-3 py-3">
                    {lead.techStack && lead.techStack.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {lead.techStack.slice(0, 2).map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400"
                          >
                            {tech}
                          </span>
                        ))}
                        {lead.techStack.length > 2 && (
                          <span className="text-[10px] text-gray-400">
                            +{lead.techStack.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === lead.id ? null : lead.id)
                      }
                      className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {expandedId === lead.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedId === lead.id && (
                  <tr
                    key={`${lead.id}-detail`}
                    className="bg-gray-50/50 dark:bg-gray-800/20"
                  >
                    <td colSpan={11} className="px-6 py-4">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                        {/* Contact Details */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide flex items-center gap-1">
                            <Users className="h-3 w-3" /> Contact
                          </h4>
                          <div>
                            <span className="text-[10px] font-medium text-gray-400">Email</span>
                            <p className="text-gray-700 dark:text-gray-300 text-xs flex items-center gap-1">
                              {lead.email}
                              {lead.emailConfidence && (
                                <span className="text-[9px] text-gray-400">({lead.emailConfidence}%)</span>
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-gray-400">Phone</span>
                            <p className="text-gray-700 dark:text-gray-300 text-xs">{lead.phone || "—"}</p>
                          </div>
                          {lead.linkedinUrl && (
                            <div>
                              <span className="text-[10px] font-medium text-gray-400">LinkedIn</span>
                              <a
                                href={lead.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-brand-600 hover:text-brand-700 text-xs"
                              >
                                <Linkedin className="h-3 w-3" /> View Profile
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Company Details */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> Company
                          </h4>
                          <div>
                            <span className="text-[10px] font-medium text-gray-400">Industry</span>
                            <p className="text-gray-700 dark:text-gray-300 text-xs">{lead.industry}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-gray-400">Employees</span>
                            <p className="text-gray-700 dark:text-gray-300 text-xs">{lead.employeeCount}</p>
                          </div>
                          {lead.companyFoundedYear && (
                            <div>
                              <span className="text-[10px] font-medium text-gray-400">Founded</span>
                              <p className="text-gray-700 dark:text-gray-300 text-xs">{lead.companyFoundedYear}</p>
                            </div>
                          )}
                          {lead.companyDescription && (
                            <div>
                              <span className="text-[10px] font-medium text-gray-400">About</span>
                              <p className="text-gray-600 dark:text-gray-400 text-[11px] line-clamp-2">{lead.companyDescription}</p>
                            </div>
                          )}
                        </div>

                        {/* Funding & Revenue */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> Financials
                          </h4>
                          <div>
                            <span className="text-[10px] font-medium text-gray-400">Revenue</span>
                            <p className="text-gray-700 dark:text-gray-300 text-xs">{lead.estimatedRevenue || "—"}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-gray-400">Funding</span>
                            <p className="text-gray-700 dark:text-gray-300 text-xs">{formatFunding(lead.fundingRaised)}</p>
                          </div>
                          {lead.lastFundingType && (
                            <div className="flex gap-3">
                              <div>
                                <span className="text-[10px] font-medium text-gray-400">Last Round</span>
                                <p className="text-gray-700 dark:text-gray-300 text-xs capitalize">
                                  {lead.lastFundingType.replace(/_/g, " ")}
                                </p>
                              </div>
                              {lead.lastFundingDate && (
                                <div>
                                  <span className="text-[10px] font-medium text-gray-400">Date</span>
                                  <p className="text-gray-700 dark:text-gray-300 text-xs">{lead.lastFundingDate}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {lead.investors && lead.investors.length > 0 && (
                            <div>
                              <span className="text-[10px] font-medium text-gray-400">Investors</span>
                              <div className="mt-0.5 flex flex-wrap gap-1">
                                {lead.investors.map((inv) => (
                                  <span
                                    key={inv}
                                    className="rounded bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                                  >
                                    {inv}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tech Stack & Sources */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide flex items-center gap-1">
                            <Cpu className="h-3 w-3" /> Tech & Sources
                          </h4>
                          {lead.techStack && lead.techStack.length > 0 && (
                            <div>
                              <span className="text-[10px] font-medium text-gray-400">
                                Tech Stack ({lead.techStack.length})
                              </span>
                              <div className="mt-0.5 flex flex-wrap gap-1">
                                {lead.techStack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="rounded-md bg-brand-50 dark:bg-brand-950 px-1.5 py-0.5 text-[10px] font-medium text-brand-700 dark:text-brand-300"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-3">
                            <div>
                              <span className="text-[10px] font-medium text-gray-400">Source</span>
                              <p className="text-gray-700 dark:text-gray-300 text-xs flex items-center gap-1">
                                <Globe className="h-3 w-3" /> {lead.source}
                              </p>
                            </div>
                            {lead.companyDomain && (
                              <div>
                                <span className="text-[10px] font-medium text-gray-400">Domain</span>
                                <p className="text-gray-700 dark:text-gray-300 text-xs">{lead.companyDomain}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 pt-1">
                            {lead.emailStatus && (
                              <span className="flex items-center gap-1 text-[10px]">
                                <ShieldCheck className="h-3 w-3 text-cyan-500" />
                                ZeroBounce: {lead.emailStatus}
                              </span>
                            )}
                            {lead.enriched && (
                              <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                                <CheckCircle2 className="h-3 w-3" />
                                Enriched
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
