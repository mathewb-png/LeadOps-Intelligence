import { useState, useMemo } from "react";
import {
  Mail,
  Eye,
  Edit3,
  Copy,
  Check,
  Plus,
  Trash2,
  Variable,
  Save,
} from "lucide-react";
import { EmailTemplate, Lead } from "@/types";

interface EmailTemplateEditorProps {
  leads: Lead[];
  campaignGoal: string;
  onSendOutreach?: (template: EmailTemplate) => void;
}

const VARIABLES = [
  { token: "{{firstName}}", desc: "Contact first name" },
  { token: "{{lastName}}", desc: "Contact last name" },
  { token: "{{fullName}}", desc: "Full name" },
  { token: "{{company}}", desc: "Company name" },
  { token: "{{jobTitle}}", desc: "Job title" },
  { token: "{{industry}}", desc: "Industry" },
  { token: "{{richardScore}}", desc: "Richard Score (0-10)" },
  { token: "{{tier}}", desc: "Lead tier" },
  { token: "{{campaignGoal}}", desc: "Campaign goal" },
];

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "default-1",
    name: "Introduction",
    subject: "Quick question about {{company}}'s strategy",
    body: `Hi {{firstName}},

I came across {{company}} and was impressed by what your team is doing in the {{industry}} space.

I'm reaching out because we help companies like {{company}} solve a specific challenge: {{campaignGoal}}.

Given your role as {{jobTitle}}, I thought this might be relevant. Would you be open to a quick 15-minute chat this week?

Best regards`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "default-2",
    name: "Value Proposition",
    subject: "How {{company}} can save 40% on this",
    body: `Hi {{firstName}},

I noticed {{company}} is in the {{industry}} sector — we've been helping similar companies tackle a common pain point.

Specifically, we focus on: {{campaignGoal}}.

Our clients typically see a 30-40% improvement within the first quarter. I'd love to share how we could do the same for {{company}}.

Would next Tuesday or Wednesday work for a brief call?

Cheers`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function interpolate(text: string, lead: Lead, campaignGoal: string): string {
  const [firstName, ...rest] = (lead.name || "").split(" ");
  return text
    .replace(/\{\{firstName\}\}/g, firstName || "there")
    .replace(/\{\{lastName\}\}/g, rest.join(" ") || "")
    .replace(/\{\{fullName\}\}/g, lead.name || "there")
    .replace(/\{\{company\}\}/g, lead.company || "your company")
    .replace(/\{\{jobTitle\}\}/g, lead.jobTitle || "your role")
    .replace(/\{\{industry\}\}/g, lead.industry || "your industry")
    .replace(/\{\{richardScore\}\}/g, String(lead.richardScore))
    .replace(/\{\{tier\}\}/g, lead.tier || "")
    .replace(/\{\{campaignGoal\}\}/g, campaignGoal || "");
}

export default function EmailTemplateEditor({
  leads,
  campaignGoal,
  onSendOutreach,
}: EmailTemplateEditorProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    const stored = localStorage.getItem("leadops-email-templates");
    return stored ? JSON.parse(stored) : DEFAULT_TEMPLATES;
  });
  const [activeId, setActiveId] = useState(templates[0]?.id || "");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [previewLeadIndex, setPreviewLeadIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = templates.find((t) => t.id === activeId) || templates[0];
  const previewLead = leads[previewLeadIndex] || leads[0];

  const previewSubject = useMemo(
    () => (active && previewLead ? interpolate(active.subject, previewLead, campaignGoal) : active?.subject || ""),
    [active, previewLead, campaignGoal]
  );

  const previewBody = useMemo(
    () => (active && previewLead ? interpolate(active.body, previewLead, campaignGoal) : active?.body || ""),
    [active, previewLead, campaignGoal]
  );

  const saveTemplates = (updated: EmailTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem("leadops-email-templates", JSON.stringify(updated));
  };

  const updateActive = (field: "name" | "subject" | "body", value: string) => {
    const updated = templates.map((t) =>
      t.id === activeId ? { ...t, [field]: value, updatedAt: new Date().toISOString() } : t
    );
    saveTemplates(updated);
  };

  const addTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: `tmpl-${Date.now()}`,
      name: `Template ${templates.length + 1}`,
      subject: "Subject for {{firstName}} at {{company}}",
      body: "Hi {{firstName}},\n\nWrite your email here...\n\nBest regards",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...templates, newTemplate];
    saveTemplates(updated);
    setActiveId(newTemplate.id);
  };

  const deleteTemplate = (id: string) => {
    if (templates.length <= 1) return;
    const updated = templates.filter((t) => t.id !== id);
    saveTemplates(updated);
    if (activeId === id) setActiveId(updated[0].id);
  };

  const insertVariable = (token: string) => {
    updateActive("body", (active?.body || "") + token);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${previewSubject}\n\n${previewBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!active) return null;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Email Template
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Write your outreach email with dynamic variables
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("edit")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "edit"
                ? "bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Edit3 className="mr-1 inline h-3 w-3" /> Edit
          </button>
          <button
            onClick={() => setMode("preview")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "preview"
                ? "bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Eye className="mr-1 inline h-3 w-3" /> Preview
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Template Tabs */}
        <div className="w-44 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 space-y-1">
          {templates.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium cursor-pointer transition-colors ${
                t.id === activeId
                  ? "bg-white dark:bg-gray-900 text-brand-700 dark:text-brand-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900"
              }`}
              onClick={() => setActiveId(t.id)}
            >
              <span className="truncate">{t.name}</span>
              {templates.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTemplate(t.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTemplate}
            className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 transition-colors"
          >
            <Plus className="h-3 w-3" /> New Template
          </button>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 p-5 space-y-4">
          {mode === "edit" ? (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Template Name
                </label>
                <input
                  className="input mt-1 text-sm"
                  value={active.name}
                  onChange={(e) => updateActive("name", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Subject Line
                </label>
                <input
                  className="input mt-1 text-sm"
                  value={active.subject}
                  onChange={(e) => updateActive("subject", e.target.value)}
                  placeholder="Subject for {{firstName}} at {{company}}"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Email Body
                  </label>
                  <div className="flex items-center gap-1">
                    <Variable className="h-3 w-3 text-gray-400" />
                    <span className="text-[10px] text-gray-400">Click to insert:</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {VARIABLES.map((v) => (
                    <button
                      key={v.token}
                      onClick={() => insertVariable(v.token)}
                      className="rounded-md bg-brand-50 dark:bg-brand-950 px-2 py-0.5 text-[10px] font-mono font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
                      title={v.desc}
                    >
                      {v.token}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={10}
                  className="input font-mono text-sm leading-relaxed resize-none"
                  value={active.body}
                  onChange={(e) => updateActive("body", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              {leads.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Preview as:
                  </span>
                  <select
                    className="input text-xs w-auto"
                    value={previewLeadIndex}
                    onChange={(e) => setPreviewLeadIndex(Number(e.target.value))}
                  >
                    {leads.slice(0, 20).map((lead, i) => (
                      <option key={lead.id} value={i}>
                        {lead.name} ({lead.company})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Subject</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                    {previewSubject}
                  </p>
                  {previewLead && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      To: {previewLead.email}
                    </p>
                  )}
                </div>
                <div className="p-4">
                  <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {previewBody}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn-secondary text-xs">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy Email"}
                </button>
                {onSendOutreach && (
                  <button
                    onClick={() => onSendOutreach(active)}
                    className="btn-primary text-xs"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Send to {leads.filter((l) => l.richardScore >= 7).length} Qualified Leads
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
