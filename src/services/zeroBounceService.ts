import { EmailVerification, EmailBatchResult, EmailValidationStatus } from "@/types";

/**
 * ─── API LANDING ZONE: ZeroBounce ───
 *
 * Cursor Shortcut:
 *   @zeroBounceService "Validate all lead emails in batch using ZeroBounce
 *   and update the verification status column in the data grid."
 *
 * ZeroBounce API reference:
 *   Single: GET https://api.zerobounce.net/v2/validate?api_key={key}&email={email}
 *   Batch:  POST https://bulkapi.zerobounce.net/v2/sendfile
 *   Credits: GET https://api.zerobounce.net/v2/getcredits?api_key={key}
 *
 * Free tier: 100 validations/month
 * Paid: from $0.008/email
 */

export async function validateEmail(email: string): Promise<EmailVerification> {
  console.log("[ZeroBounce] validateEmail placeholder for:", email);

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real ZeroBounce API call
  // ═══════════════════════════════════════════════
  //
  //  const response = await fetch(
  //    `https://api.zerobounce.net/v2/validate?api_key=${import.meta.env.VITE_ZEROBOUNCE_API_KEY}&email=${email}`
  //  );
  //  const data = await response.json();

  await new Promise((r) => setTimeout(r, 200));

  const statuses: EmailValidationStatus[] = ["valid", "valid", "valid", "catch-all", "invalid", "unknown"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    email,
    status,
    subStatus: status === "valid" ? "" : "mailbox_not_found",
    freeEmail: email.includes("gmail") || email.includes("yahoo"),
    didYouMean: null,
    account: email.split("@")[0],
    domain: email.split("@")[1],
    processedAt: new Date().toISOString(),
  };
}

export async function validateBatch(emails: string[]): Promise<EmailBatchResult> {
  console.log("[ZeroBounce] validateBatch placeholder for", emails.length, "emails");

  // ═══════════════════════════════════════════════
  //  TODO: Replace with real ZeroBounce batch API
  // ═══════════════════════════════════════════════

  await new Promise((r) => setTimeout(r, emails.length * 50));

  const results: EmailVerification[] = [];
  for (const email of emails) {
    results.push(await validateEmail(email));
  }

  const validCount = results.filter((r) => r.status === "valid").length;
  const invalidCount = results.filter((r) => r.status === "invalid").length;
  const catchAllCount = results.filter((r) => r.status === "catch-all").length;
  const unknownCount = results.filter((r) => !["valid", "invalid", "catch-all"].includes(r.status)).length;

  return {
    batchId: `batch-${Date.now()}`,
    totalEmails: emails.length,
    validCount,
    invalidCount,
    catchAllCount,
    unknownCount,
    results,
    completedAt: new Date().toISOString(),
  };
}
