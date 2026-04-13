import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Upload,
  Send,
  Bell,
  Loader2,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { Lead, PipelineStatus } from "@/types";

interface PipelineActionBarProps {
  leads: Lead[];
  status: PipelineStatus;
  onEnrich: () => void;
  onVerifyEmails: () => void;
  onSyncCRM: () => void;
  onStartOutreach: () => void;
  onNotifySlack: () => void;
  onScoreWithGroq: () => void;
}

interface ActionButtonProps {
  label: string;
  icon: typeof Sparkles;
  onClick: () => void;
  status: "idle" | "running" | "done";
  doneLabel?: string;
  color: string;
  disabled?: boolean;
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  status,
  doneLabel,
  color,
  disabled,
}: ActionButtonProps) {
  if (status === "done") {
    return (
      <button disabled className="btn-secondary opacity-80">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <span className="text-emerald-700 dark:text-emerald-400">{doneLabel || "Done"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || status === "running"}
      className={`btn-secondary ${color}`}
    >
      {status === "running" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {status === "running" ? "Processing..." : label}
    </button>
  );
}

export default function PipelineActionBar({
  leads,
  status,
  onEnrich,
  onVerifyEmails,
  onSyncCRM,
  onStartOutreach,
  onNotifySlack,
  onScoreWithGroq,
}: PipelineActionBarProps) {
  if (leads.length === 0) return null;

  const qualifiedCount = leads.filter((l) => l.richardScore >= 7).length;
  const enrichedCount = leads.filter((l) => l.enriched).length;
  const verifiedCount = leads.filter((l) => l.emailStatus).length;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Pipeline Actions
        </h3>
        <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{enrichedCount}/{leads.length} enriched</span>
          <span>{verifiedCount}/{leads.length} verified</span>
          <span>{qualifiedCount} qualified (7+)</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ActionButton
          label="Re-Score (Groq)"
          icon={Cpu}
          onClick={onScoreWithGroq}
          status="idle"
          color="hover:border-violet-300 hover:text-violet-700"
        />
        <ActionButton
          label="Enrich All"
          icon={Sparkles}
          onClick={onEnrich}
          status={status.enrichment.status}
          doneLabel={`${status.enrichment.enrichedCount} Enriched`}
          color="hover:border-brand-300 hover:text-brand-700"
        />
        <ActionButton
          label="Verify Emails"
          icon={ShieldCheck}
          onClick={onVerifyEmails}
          status={status.verification.status}
          doneLabel={`${status.verification.validCount}/${status.verification.verifiedCount} Valid`}
          color="hover:border-emerald-300 hover:text-emerald-700"
        />
        <ActionButton
          label="Push to HubSpot"
          icon={Upload}
          onClick={onSyncCRM}
          status={status.crmSync.status}
          doneLabel={`${status.crmSync.syncResult?.synced || 0} Synced`}
          color="hover:border-orange-300 hover:text-orange-700"
          disabled={verifiedCount === 0}
        />
        <ActionButton
          label="Start Outreach"
          icon={Send}
          onClick={onStartOutreach}
          status={status.outreach.status}
          doneLabel={`${status.outreach.campaign?.leadsAdded || 0} Queued`}
          color="hover:border-blue-300 hover:text-blue-700"
          disabled={qualifiedCount === 0}
        />
        <ActionButton
          label="Notify Team"
          icon={Bell}
          onClick={onNotifySlack}
          status={status.slackNotified ? "done" : "idle"}
          doneLabel="Notified"
          color="hover:border-pink-300 hover:text-pink-700"
        />
      </div>
    </div>
  );
}
