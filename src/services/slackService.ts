import { Lead, SlackNotification, BatchValueBreakdown } from "@/types";
import { computeBatchValue } from "@/lib/richardScoring";

/**
 * ─── API LANDING ZONE: Slack Webhooks ───
 *
 * Cursor Shortcut:
 *   @slackService "Use the Slack Incoming Webhook to post a batch summary when
 *   lead scoring completes. Include lead count, avg score, and top leads."
 *
 * Slack Webhook setup:
 *   1. Go to https://api.slack.com/apps → Create New App → From Scratch
 *   2. Enable "Incoming Webhooks" → Add New Webhook to Workspace
 *   3. Copy the webhook URL → set as VITE_SLACK_WEBHOOK_URL
 *
 * Webhook format:
 *   POST {webhook_url}
 *   Body: { "text": "...", "blocks": [...] }
 *
 * Free: unlimited messages
 */

export async function sendBatchSummary(
  leads: Lead[],
  channel?: string
): Promise<SlackNotification> {
  console.log("[Slack] sendBatchSummary placeholder for", leads.length, "leads");

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Slack Webhook call
  // ═══════════════════════════════════════════════
  //
  //  const batchValue = computeBatchValue(leads);
  //  const topLeads = [...leads].sort((a, b) => b.richardScore - a.richardScore).slice(0, 5);
  //  const avgScore = leads.length > 0
  //    ? (leads.reduce((s, l) => s + l.richardScore, 0) / leads.length).toFixed(1)
  //    : "0";
  //
  //  const blocks = [
  //    { type: "header", text: { type: "plain_text", text: "LeadOps Batch Complete" } },
  //    { type: "section", text: { type: "mrkdwn", text:
  //        `*${leads.length}* leads scored | Avg Score: *${avgScore}* | Batch Value: *${batchValue.total} pts*` } },
  //    { type: "section", text: { type: "mrkdwn", text:
  //        `*Top Leads:*\n${topLeads.map(l => `• ${l.name} @ ${l.company} — Score: ${l.richardScore}`).join("\n")}` } },
  //  ];
  //
  //  await fetch(import.meta.env.VITE_SLACK_WEBHOOK_URL, {
  //    method: "POST",
  //    headers: { "Content-Type": "application/json" },
  //    body: JSON.stringify({ blocks }),
  //  });

  await new Promise((r) => setTimeout(r, 200));

  const batch = computeBatchValue(leads);
  const topLeads = [...leads]
    .sort((a, b) => b.richardScore - a.richardScore)
    .slice(0, 5)
    .map((l) => ({ name: l.name, company: l.company, score: l.richardScore }));
  const avgScore = leads.length > 0
    ? leads.reduce((s, l) => s + l.richardScore, 0) / leads.length
    : 0;

  return {
    channel: channel || "#leadops-alerts",
    message: `LeadOps batch complete: ${leads.length} leads scored, avg ${avgScore.toFixed(1)}, batch value ${batch.total} pts`,
    batchSummary: {
      totalLeads: leads.length,
      primaryCount: leads.filter((l) => l.richardScore >= 9).length,
      avgScore: Math.round(avgScore * 10) / 10,
      batchValue: batch.total,
      topLeads,
    },
    sentAt: new Date().toISOString(),
  };
}

export async function sendHighScoreAlert(
  lead: Lead,
  channel?: string
): Promise<{ sent: boolean }> {
  console.log("[Slack] sendHighScoreAlert placeholder for:", lead.name, "score:", lead.richardScore);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real Slack Webhook call
  // ═══════════════════════════════════════════════

  await new Promise((r) => setTimeout(r, 100));

  return { sent: true };
}
