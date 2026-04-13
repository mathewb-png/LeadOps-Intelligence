import { useEffect, useState } from "react";
import { Lightbulb, ArrowRight, Globe, Languages, MapPin, ChevronDown, Sparkles } from "lucide-react";
import { CampaignLocale } from "@/types";
import { COUNTRIES, detectLocaleFromText, getDefaultLocale } from "@/lib/localeData";

interface IntentIntakeProps {
  value: string;
  onChange: (v: string) => void;
  locale: CampaignLocale;
  onLocaleChange: (locale: CampaignLocale) => void;
  onSubmit: () => void;
  loading: boolean;
}

const EXAMPLES = [
  "Selling FinOps tools to stop cloud spend surprises",
  "Offering SEO automation to marketing leaders at SaaS companies in Switzerland",
  "B2B lead gen platform for growth-stage startups in France (French language)",
  "AI-powered marketing tools for German-speaking companies in DACH region",
];

export default function IntentIntake({ value, onChange, locale, onLocaleChange, onSubmit, loading }: IntentIntakeProps) {
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    if (!value.trim()) return;

    const detected = detectLocaleFromText(value);
    if (detected.countryCode || detected.languageCode) {
      onLocaleChange({
        ...locale,
        ...(detected.country && { country: detected.country }),
        ...(detected.countryCode && { countryCode: detected.countryCode }),
        ...(detected.language && { language: detected.language }),
        ...(detected.languageCode && { languageCode: detected.languageCode }),
        ...(detected.timezone && { timezone: detected.timezone }),
      });
      setAutoDetected(true);
      const timer = setTimeout(() => setAutoDetected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const selectedCountry = COUNTRIES.find((c) => c.code === locale.countryCode);
  const availableLanguages = selectedCountry?.languages || [{ name: "English", code: "en" }];
  const availableRegions = selectedCountry?.regions || [];

  const handleCountryChange = (code: string) => {
    const country = COUNTRIES.find((c) => c.code === code);
    if (!country) return;
    onLocaleChange({
      ...locale,
      country: country.name,
      countryCode: country.code,
      language: country.languages[0].name,
      languageCode: country.languages[0].code,
      timezone: country.timezone,
      region: undefined,
    });
  };

  const handleLanguageChange = (code: string) => {
    const lang = availableLanguages.find((l) => l.code === code);
    if (!lang) return;
    onLocaleChange({ ...locale, language: lang.name, languageCode: lang.code });
  };

  const handleRegionChange = (region: string) => {
    onLocaleChange({ ...locale, region: region || undefined });
  };

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
              Describe what you're selling, who needs it, and where
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <textarea
          rows={4}
          className="input resize-none text-base"
          placeholder="e.g., Selling FinOps tools to stop cloud spend surprises at mid-market SaaS companies in Switzerland..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {/* Locale Selectors */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-brand-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Target Market
            </span>
            {autoDetected && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 animate-pulse">
                <Sparkles className="h-3 w-3" />
                Auto-detected from your text
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Country */}
            <div>
              <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                <MapPin className="h-3 w-3" /> Country
              </label>
              <div className="relative">
                <select
                  className="input text-sm pr-8"
                  value={locale.countryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                <Languages className="h-3 w-3" /> Language
              </label>
              <div className="relative">
                <select
                  className="input text-sm pr-8"
                  value={locale.languageCode}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  {availableLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Region (if applicable) */}
            <div>
              <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                <Globe className="h-3 w-3" /> Region
              </label>
              <div className="relative">
                <select
                  className="input text-sm pr-8"
                  value={locale.region || ""}
                  onChange={(e) => handleRegionChange(e.target.value)}
                >
                  <option value="">All Regions</option>
                  {availableRegions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active locale badge */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-brand-50 dark:bg-brand-950 px-2 py-0.5 text-[10px] font-medium text-brand-700 dark:text-brand-300">
              {selectedCountry?.flag} {locale.country}
            </span>
            <span className="rounded-md bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:text-indigo-300">
              {locale.language}
            </span>
            {locale.region && (
              <span className="rounded-md bg-violet-50 dark:bg-violet-950 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-300">
                {locale.region}
              </span>
            )}
          </div>
        </div>

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
              Launching Campaign...
            </>
          ) : (
            <>
              Launch Campaign <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
