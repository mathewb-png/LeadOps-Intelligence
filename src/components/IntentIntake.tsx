import { Lightbulb, ArrowRight } from "lucide-react";

interface IntentIntakeProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const EXAMPLES = [
  "Selling FinOps tools to stop cloud spend surprises",
  "Offering SEO automation to marketing leaders at SaaS companies",
  "B2B lead gen platform for growth-stage startups in eCommerce",
];

export default function IntentIntake({ value, onChange, onSubmit, loading }: IntentIntakeProps) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Campaign Goal & Offering</h2>
            <p className="text-sm text-brand-100">
              Describe what you're selling and who needs it
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <textarea
          rows={4}
          className="input resize-none text-base"
          placeholder="e.g., Selling FinOps tools to stop cloud spend surprises at mid-market SaaS companies..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 self-center">
            Try:
          </span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => onChange(ex)}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-all"
            >
              {ex}
            </button>
          ))}
        </div>

        <button
          onClick={onSubmit}
          disabled={!value.trim() || loading}
          className="btn-primary w-full sm:w-auto"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating Persona...
            </>
          ) : (
            <>
              Generate Persona <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
