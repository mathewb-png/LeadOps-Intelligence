import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { Lead } from "@/types";
import LeadScoreBadge from "./LeadScoreBadge";
import StatusBadge from "./StatusBadge";

interface LeadCardProps {
  lead: Lead;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}

export default function LeadCard({ lead, saved, onToggleSave }: LeadCardProps) {
  return (
    <div className="card group relative overflow-hidden transition-all hover:shadow-md hover:border-brand-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 font-bold text-sm">
              {lead.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/leads/${lead.id}`}
                  className="text-base font-semibold text-gray-900 hover:text-brand-600 transition-colors truncate"
                >
                  {lead.companyName}
                </Link>
                <StatusBadge status={lead.status} />
              </div>
              <p className="mt-0.5 text-sm text-gray-600">
                {lead.contactName} &middot; {lead.contactTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <LeadScoreBadge score={lead.score} />
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(lead.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-600 transition-colors"
              >
                <Bookmark
                  className={`h-4 w-4 ${saved ? "fill-brand-600 text-brand-600" : ""}`}
                />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lead.industry}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lead.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lead.employeeCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lead.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lead.website}</span>
          </div>
        </div>

        {lead.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lead.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-400">
            {lead.source} &middot; {lead.lastActivity}
          </span>
          <Link
            to={`/leads/${lead.id}`}
            className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            View details <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
