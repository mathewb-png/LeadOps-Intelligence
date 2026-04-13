import { LeadStatus } from "@/types";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "badge-blue" },
  contacted: { label: "Contacted", className: "badge-amber" },
  qualified: { label: "Qualified", className: "badge-purple" },
  proposal: { label: "Proposal", className: "badge-blue" },
  negotiation: { label: "Negotiation", className: "badge-amber" },
  won: { label: "Won", className: "badge-green" },
  lost: { label: "Lost", className: "badge-red" },
};

interface StatusBadgeProps {
  status: LeadStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <span className={config.className}>{config.label}</span>;
}
