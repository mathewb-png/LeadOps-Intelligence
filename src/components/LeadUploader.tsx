import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Lead, UploadedFileResult, ColumnMapping } from "@/types";
import { computeRichardScore, scoreToTier } from "@/lib/richardScoring";

interface LeadUploaderProps {
  onLeadsImported: (leads: Lead[]) => void;
  languageCode?: string;
}

const KNOWN_HEADERS: Record<string, keyof ColumnMapping> = {
  name: "name",
  "full name": "name",
  "contact name": "name",
  "first name": "name",
  email: "email",
  "email address": "email",
  "e-mail": "email",
  company: "company",
  "company name": "company",
  organization: "company",
  title: "jobTitle",
  "job title": "jobTitle",
  "job role": "jobTitle",
  position: "jobTitle",
  role: "jobTitle",
  phone: "phone",
  "phone number": "phone",
  telephone: "phone",
  mobile: "phone",
  industry: "industry",
  sector: "industry",
  location: "location",
  city: "location",
  address: "location",
  region: "location",
};

function autoMapColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  for (const header of headers) {
    const normalized = header.toLowerCase().trim();
    if (KNOWN_HEADERS[normalized]) {
      mapping[KNOWN_HEADERS[normalized]] = header;
    }
  }
  return mapping;
}

function parseRowToLead(
  row: Record<string, unknown>,
  mapping: ColumnMapping,
  index: number,
  languageCode?: string
): Lead | null {
  const get = (field: keyof ColumnMapping) => {
    const col = mapping[field];
    if (!col) return "";
    const val = row[col];
    return val != null ? String(val).trim() : "";
  };

  const name = get("name");
  const email = get("email");
  const company = get("company");

  if (!name && !email) return null;

  const jobTitle = get("jobTitle");
  const richardScore = jobTitle ? computeRichardScore(jobTitle, languageCode) : 4;

  return {
    id: `upload-${Date.now()}-${index}`,
    name: name || email.split("@")[0],
    company: company || "",
    jobTitle,
    email,
    phone: get("phone"),
    industry: get("industry"),
    location: get("location"),
    employeeCount: "",
    richardScore,
    tier: scoreToTier(richardScore),
    source: "Upload",
    fetchedAt: new Date().toISOString(),
    excluded: false,
  };
}

export default function LeadUploader({ onLeadsImported, languageCode }: LeadUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<UploadedFileResult | null>(null);
  const [previewLeads, setPreviewLeads] = useState<Lead[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);
  const [showMapper, setShowMapper] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setProcessing(true);
    setResult(null);
    setPreviewLeads([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      if (rows.length === 0) {
        setResult({
          fileName: file.name,
          totalRows: 0,
          parsedLeads: 0,
          skippedRows: 0,
          errors: ["File is empty or has no data rows."],
          columnMapping: {},
        });
        return;
      }

      const detectedHeaders = Object.keys(rows[0]);
      setHeaders(detectedHeaders);
      setRawRows(rows);

      const autoMapping = autoMapColumns(detectedHeaders);
      setMapping(autoMapping);

      const hasEmail = !!autoMapping.email;
      const hasName = !!autoMapping.name;

      if (!hasEmail && !hasName) {
        setShowMapper(true);
        setResult({
          fileName: file.name,
          totalRows: rows.length,
          parsedLeads: 0,
          skippedRows: rows.length,
          errors: ["Could not auto-detect Name or Email columns. Please map them manually."],
          columnMapping: {},
        });
        return;
      }

      const leads: Lead[] = [];
      const errors: string[] = [];
      let skipped = 0;

      for (let i = 0; i < rows.length; i++) {
        const lead = parseRowToLead(rows[i], autoMapping, i, languageCode);
        if (lead) {
          leads.push(lead);
        } else {
          skipped++;
          if (skipped <= 3) errors.push(`Row ${i + 2}: Missing name and email`);
        }
      }

      setPreviewLeads(leads);
      setResult({
        fileName: file.name,
        totalRows: rows.length,
        parsedLeads: leads.length,
        skippedRows: skipped,
        errors,
        columnMapping: autoMapping as Record<string, string>,
      });
    } catch (err) {
      setResult({
        fileName: file.name,
        totalRows: 0,
        parsedLeads: 0,
        skippedRows: 0,
        errors: [`Failed to parse file: ${err instanceof Error ? err.message : "Unknown error"}`],
        columnMapping: {},
      });
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleRemap = useCallback(() => {
    const leads: Lead[] = [];
    let skipped = 0;
    for (let i = 0; i < rawRows.length; i++) {
      const lead = parseRowToLead(rawRows[i], mapping, i, languageCode);
      if (lead) leads.push(lead);
      else skipped++;
    }
    setPreviewLeads(leads);
    setResult((prev) =>
      prev
        ? { ...prev, parsedLeads: leads.length, skippedRows: skipped, errors: [] }
        : null
    );
    setShowMapper(false);
  }, [rawRows, mapping]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleImport = () => {
    if (previewLeads.length > 0) {
      onLeadsImported(previewLeads);
      setResult(null);
      setPreviewLeads([]);
      setRawRows([]);
      setHeaders([]);
    }
  };

  const handleClear = () => {
    setResult(null);
    setPreviewLeads([]);
    setRawRows([]);
    setHeaders([]);
    setShowMapper(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const LEAD_FIELDS: { key: keyof ColumnMapping; label: string; required?: boolean }[] = [
    { key: "name", label: "Name", required: true },
    { key: "email", label: "Email", required: true },
    { key: "company", label: "Company" },
    { key: "jobTitle", label: "Job Title" },
    { key: "phone", label: "Phone" },
    { key: "industry", label: "Industry" },
    { key: "location", label: "Location" },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Import Leads
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Upload an Excel (.xlsx) or CSV file with your lead list
          </p>
        </div>
      </div>

      <div className="p-6">
        {!result ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
              dragOver
                ? "border-brand-500 bg-brand-50 dark:bg-brand-950"
                : "border-gray-300 dark:border-gray-700 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileSelect}
            />
            {processing ? (
              <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              {processing ? "Processing file..." : "Drop your file here or click to browse"}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Supports .xlsx, .xls, .csv
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {result.fileName}
                </span>
              </div>
              <button
                onClick={handleClear}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {result.totalRows}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Rows</p>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950 p-3">
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {result.parsedLeads}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Leads Parsed</p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3">
                <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {result.skippedRows}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Skipped</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Issues
                </div>
                <ul className="mt-1 space-y-0.5 text-xs text-red-600 dark:text-red-400">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {showMapper && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Map your columns
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {LEAD_FIELDS.map((field) => (
                    <div key={field.key} className="flex items-center gap-2">
                      <label className="w-20 text-xs font-medium text-gray-600 dark:text-gray-400 shrink-0">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative flex-1">
                        <select
                          className="input text-xs pr-7"
                          value={mapping[field.key] || ""}
                          onChange={(e) =>
                            setMapping((m) => ({ ...m, [field.key]: e.target.value || undefined }))
                          }
                        >
                          <option value="">— skip —</option>
                          {headers.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleRemap} className="btn-primary text-xs">
                  Apply Mapping
                </button>
              </div>
            )}

            {!showMapper && previewLeads.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Name</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Email</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Company</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Title</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {previewLeads.slice(0, 5).map((lead) => (
                      <tr key={lead.id}>
                        <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{lead.name}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{lead.email}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{lead.company}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{lead.jobTitle}</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-900 dark:text-gray-100">{lead.richardScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewLeads.length > 5 && (
                  <p className="px-3 py-2 text-[11px] text-gray-400 border-t border-gray-100 dark:border-gray-800">
                    ...and {previewLeads.length - 5} more rows
                  </p>
                )}
              </div>
            )}

            {!showMapper && previewLeads.length > 0 && (
              <div className="flex gap-2">
                <button onClick={handleImport} className="btn-primary flex-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Import {previewLeads.length} Leads into Campaign
                </button>
                <button
                  onClick={() => setShowMapper(true)}
                  className="btn-secondary text-xs"
                >
                  Remap Columns
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
