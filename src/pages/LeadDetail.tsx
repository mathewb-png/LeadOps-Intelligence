import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Tag,
  Zap,
} from "lucide-react";
import { mockLeads } from "@/data/mockLeads";
import LeadScoreBadge from "@/components/LeadScoreBadge";
import StatusBadge from "@/components/StatusBadge";

export default function LeadDetail() {
  const { id } = useParams();
  const lead = mockLeads.find((l) => l.id === id);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-lg font-semibold text-gray-900">Lead not found</p>
        <Link to="/leads" className="btn-primary mt-4">
          <ArrowLeft className="h-4 w-4" /> Back to leads
        </Link>
      </div>
    );
  }

  const scoreLabel =
    lead.score >= 80 ? "Hot Lead" : lead.score >= 60 ? "Warm Lead" : "Cold Lead";
  const scoreColor =
    lead.score >= 80
      ? "text-emerald-600"
      : lead.score >= 60
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="space-y-6">
      <Link
        to="/leads"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all leads
      </Link>

      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white backdrop-blur">
                {lead.companyName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{lead.companyName}</h1>
                <p className="mt-0.5 text-brand-100">
                  {lead.contactName} &middot; {lead.contactTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={lead.status} />
              <LeadScoreBadge score={lead.score} size="lg" />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoRow icon={Mail} label="Email" value={lead.email} />
                  <InfoRow icon={Phone} label="Phone" value={lead.phone} />
                  <InfoRow icon={Globe} label="Website" value={lead.website} />
                  <InfoRow icon={MapPin} label="Location" value={lead.location} />
                </div>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-4">Company Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoRow icon={Building2} label="Industry" value={lead.industry} />
                  <InfoRow icon={Users} label="Employees" value={lead.employeeCount} />
                  <InfoRow icon={DollarSign} label="Revenue" value={lead.revenue} />
                  <InfoRow icon={Zap} label="Source" value={lead.source} />
                </div>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Notes</h2>
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed">
                  <FileText className="mb-2 h-4 w-4 text-gray-400" />
                  {lead.notes}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="card p-5 text-center">
                <p className="text-sm font-medium text-gray-500">Lead Score</p>
                <div className="mt-3 flex justify-center">
                  <LeadScoreBadge score={lead.score} size="lg" />
                </div>
                <p className={`mt-2 text-sm font-semibold ${scoreColor}`}>{scoreLabel}</p>
                <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      lead.score >= 80
                        ? "bg-emerald-500"
                        : lead.score >= 60
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${lead.score}%` }}
                  />
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Last Activity
                </div>
                <p className="mt-2 text-sm text-gray-600">{lead.lastActivity}</p>
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <Tag className="h-4 w-4 text-gray-400" />
                  Tags
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lead.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-0.5 text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );
}
