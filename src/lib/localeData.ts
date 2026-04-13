import { CampaignLocale } from "@/types";

export interface CountryOption {
  name: string;
  code: string;
  languages: { name: string; code: string }[];
  regions?: string[];
  timezone: string;
  flag: string;
}

export const COUNTRIES: CountryOption[] = [
  { name: "United States", code: "US", flag: "🇺🇸", timezone: "America/New_York", languages: [{ name: "English", code: "en" }], regions: ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast"] },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", timezone: "Europe/London", languages: [{ name: "English", code: "en" }], regions: ["England", "Scotland", "Wales", "Northern Ireland"] },
  { name: "Canada", code: "CA", flag: "🇨🇦", timezone: "America/Toronto", languages: [{ name: "English", code: "en" }, { name: "French", code: "fr" }], regions: ["Ontario", "Quebec", "British Columbia", "Alberta"] },
  { name: "Australia", code: "AU", flag: "🇦🇺", timezone: "Australia/Sydney", languages: [{ name: "English", code: "en" }], regions: ["New South Wales", "Victoria", "Queensland", "Western Australia"] },
  { name: "Germany", code: "DE", flag: "🇩🇪", timezone: "Europe/Berlin", languages: [{ name: "German", code: "de" }, { name: "English", code: "en" }] },
  { name: "France", code: "FR", flag: "🇫🇷", timezone: "Europe/Paris", languages: [{ name: "French", code: "fr" }, { name: "English", code: "en" }] },
  { name: "Switzerland", code: "CH", flag: "🇨🇭", timezone: "Europe/Zurich", languages: [{ name: "French", code: "fr" }, { name: "German", code: "de" }, { name: "Italian", code: "it" }, { name: "English", code: "en" }], regions: ["Vaud", "Zurich", "Geneva", "Bern", "Basel", "Ticino"] },
  { name: "Netherlands", code: "NL", flag: "🇳🇱", timezone: "Europe/Amsterdam", languages: [{ name: "Dutch", code: "nl" }, { name: "English", code: "en" }] },
  { name: "Belgium", code: "BE", flag: "🇧🇪", timezone: "Europe/Brussels", languages: [{ name: "French", code: "fr" }, { name: "Dutch", code: "nl" }, { name: "English", code: "en" }] },
  { name: "Spain", code: "ES", flag: "🇪🇸", timezone: "Europe/Madrid", languages: [{ name: "Spanish", code: "es" }, { name: "English", code: "en" }] },
  { name: "Italy", code: "IT", flag: "🇮🇹", timezone: "Europe/Rome", languages: [{ name: "Italian", code: "it" }, { name: "English", code: "en" }] },
  { name: "Portugal", code: "PT", flag: "🇵🇹", timezone: "Europe/Lisbon", languages: [{ name: "Portuguese", code: "pt" }, { name: "English", code: "en" }] },
  { name: "Brazil", code: "BR", flag: "🇧🇷", timezone: "America/Sao_Paulo", languages: [{ name: "Portuguese", code: "pt" }, { name: "English", code: "en" }] },
  { name: "Mexico", code: "MX", flag: "🇲🇽", timezone: "America/Mexico_City", languages: [{ name: "Spanish", code: "es" }, { name: "English", code: "en" }] },
  { name: "India", code: "IN", flag: "🇮🇳", timezone: "Asia/Kolkata", languages: [{ name: "English", code: "en" }, { name: "Hindi", code: "hi" }] },
  { name: "Japan", code: "JP", flag: "🇯🇵", timezone: "Asia/Tokyo", languages: [{ name: "Japanese", code: "ja" }, { name: "English", code: "en" }] },
  { name: "South Korea", code: "KR", flag: "🇰🇷", timezone: "Asia/Seoul", languages: [{ name: "Korean", code: "ko" }, { name: "English", code: "en" }] },
  { name: "Singapore", code: "SG", flag: "🇸🇬", timezone: "Asia/Singapore", languages: [{ name: "English", code: "en" }, { name: "Mandarin", code: "zh" }] },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", timezone: "Asia/Dubai", languages: [{ name: "Arabic", code: "ar" }, { name: "English", code: "en" }] },
  { name: "Israel", code: "IL", flag: "🇮🇱", timezone: "Asia/Jerusalem", languages: [{ name: "Hebrew", code: "he" }, { name: "English", code: "en" }] },
  { name: "Sweden", code: "SE", flag: "🇸🇪", timezone: "Europe/Stockholm", languages: [{ name: "Swedish", code: "sv" }, { name: "English", code: "en" }] },
  { name: "Norway", code: "NO", flag: "🇳🇴", timezone: "Europe/Oslo", languages: [{ name: "Norwegian", code: "no" }, { name: "English", code: "en" }] },
  { name: "Denmark", code: "DK", flag: "🇩🇰", timezone: "Europe/Copenhagen", languages: [{ name: "Danish", code: "da" }, { name: "English", code: "en" }] },
  { name: "Finland", code: "FI", flag: "🇫🇮", timezone: "Europe/Helsinki", languages: [{ name: "Finnish", code: "fi" }, { name: "English", code: "en" }] },
  { name: "Ireland", code: "IE", flag: "🇮🇪", timezone: "Europe/Dublin", languages: [{ name: "English", code: "en" }, { name: "Irish", code: "ga" }] },
  { name: "Poland", code: "PL", flag: "🇵🇱", timezone: "Europe/Warsaw", languages: [{ name: "Polish", code: "pl" }, { name: "English", code: "en" }] },
  { name: "Austria", code: "AT", flag: "🇦🇹", timezone: "Europe/Vienna", languages: [{ name: "German", code: "de" }, { name: "English", code: "en" }] },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", timezone: "Africa/Johannesburg", languages: [{ name: "English", code: "en" }, { name: "Afrikaans", code: "af" }] },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿", timezone: "Pacific/Auckland", languages: [{ name: "English", code: "en" }] },
];

const COUNTRY_KEYWORDS: Record<string, string[]> = {
  US: ["united states", "usa", "u.s.", "america", "american", "california", "new york", "texas", "florida", "boston", "san francisco", "seattle", "chicago", "austin"],
  GB: ["united kingdom", "uk", "u.k.", "britain", "british", "england", "london", "manchester", "birmingham", "scotland", "wales"],
  CA: ["canada", "canadian", "toronto", "vancouver", "montreal", "ottawa", "quebec"],
  AU: ["australia", "australian", "sydney", "melbourne", "brisbane", "perth"],
  DE: ["germany", "german", "deutschland", "berlin", "munich", "hamburg", "frankfurt", "münchen"],
  FR: ["france", "french", "paris", "lyon", "marseille", "française"],
  CH: ["switzerland", "swiss", "suisse", "schweiz", "zurich", "zürich", "geneva", "genève", "bern", "lausanne", "vaud", "bâle", "basel"],
  NL: ["netherlands", "dutch", "holland", "amsterdam", "rotterdam", "den haag"],
  BE: ["belgium", "belgian", "brussels", "bruxelles", "antwerp", "gent"],
  ES: ["spain", "spanish", "españa", "madrid", "barcelona", "valencia"],
  IT: ["italy", "italian", "italia", "milan", "rome", "roma", "milano"],
  PT: ["portugal", "portuguese", "lisbon", "lisboa", "porto"],
  BR: ["brazil", "brazilian", "brasil", "são paulo", "rio de janeiro"],
  MX: ["mexico", "mexican", "méxico", "guadalajara", "monterrey"],
  IN: ["india", "indian", "mumbai", "bangalore", "delhi", "hyderabad", "bengaluru"],
  JP: ["japan", "japanese", "tokyo", "osaka", "yokohama"],
  KR: ["korea", "korean", "seoul", "busan"],
  SG: ["singapore", "singaporean"],
  AE: ["uae", "dubai", "abu dhabi", "emirates"],
  IL: ["israel", "israeli", "tel aviv", "jerusalem"],
  SE: ["sweden", "swedish", "stockholm", "gothenburg"],
  NO: ["norway", "norwegian", "oslo", "bergen"],
  DK: ["denmark", "danish", "copenhagen"],
  FI: ["finland", "finnish", "helsinki"],
  IE: ["ireland", "irish", "dublin"],
  PL: ["poland", "polish", "warsaw", "krakow", "kraków"],
  AT: ["austria", "austrian", "vienna", "wien", "salzburg"],
  ZA: ["south africa", "south african", "johannesburg", "cape town"],
  NZ: ["new zealand", "kiwi", "auckland", "wellington"],
};

const LANGUAGE_KEYWORDS: Record<string, string[]> = {
  en: ["english", "anglophone"],
  fr: ["french", "français", "française", "francophone", "en français"],
  de: ["german", "deutsch", "deutsche", "germanophone"],
  es: ["spanish", "español", "española", "hispanophone"],
  it: ["italian", "italiano", "italiana"],
  pt: ["portuguese", "português", "portuguesa"],
  nl: ["dutch", "nederlands", "nederlandse"],
  ja: ["japanese", "日本語"],
  ko: ["korean", "한국어"],
  zh: ["mandarin", "chinese", "中文"],
  ar: ["arabic", "العربية"],
  sv: ["swedish", "svenska"],
  no: ["norwegian", "norsk"],
  da: ["danish", "dansk"],
  fi: ["finnish", "suomi"],
  pl: ["polish", "polski"],
  he: ["hebrew", "עברית"],
  hi: ["hindi", "हिन्दी"],
};

export function detectLocaleFromText(text: string): Partial<CampaignLocale> {
  const lower = text.toLowerCase();
  const result: Partial<CampaignLocale> = {};

  for (const [code, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        const country = COUNTRIES.find((c) => c.code === code);
        if (country) {
          result.country = country.name;
          result.countryCode = country.code;
          result.timezone = country.timezone;
          if (!result.language && country.languages.length > 0) {
            result.language = country.languages[0].name;
            result.languageCode = country.languages[0].code;
          }
        }
        break;
      }
    }
    if (result.countryCode) break;
  }

  for (const [code, keywords] of Object.entries(LANGUAGE_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        const allLangs = COUNTRIES.flatMap((c) => c.languages);
        const lang = allLangs.find((l) => l.code === code);
        if (lang) {
          result.language = lang.name;
          result.languageCode = lang.code;
        }
        break;
      }
    }
    if (result.languageCode) break;
  }

  return result;
}

export function getDefaultLocale(): CampaignLocale {
  return {
    country: "United States",
    countryCode: "US",
    language: "English",
    languageCode: "en",
    region: undefined,
    timezone: "America/New_York",
  };
}

export function detectLocaleFromLeads(leads: { location: string }[]): Partial<CampaignLocale> {
  const locationCounts = new Map<string, number>();

  for (const lead of leads) {
    if (!lead.location) continue;
    const lower = lead.location.toLowerCase();

    for (const [code, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          locationCounts.set(code, (locationCounts.get(code) || 0) + 1);
          break;
        }
      }
    }
  }

  if (locationCounts.size === 0) return {};

  const topCode = [...locationCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const country = COUNTRIES.find((c) => c.code === topCode);
  if (!country) return {};

  return {
    country: country.name,
    countryCode: country.code,
    language: country.languages[0]?.name,
    languageCode: country.languages[0]?.code,
    timezone: country.timezone,
  };
}
