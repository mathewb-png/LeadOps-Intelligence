import { Lead, CampaignLocale } from "@/types";
import { computeRichardScore, scoreToTier } from "@/lib/richardScoring";

/**
 * ─── API LANDING ZONE: Apollo.io Integration ───
 *
 * Cursor Shortcut:
 *   @fetchApolloData "Use the Apollo API documentation to write a POST request
 *   that sends our UI titles and excludes our Supabase permanent_exclusions list."
 *
 * Apollo.io API reference:
 *   POST https://api.apollo.io/v1/mixed_people/search
 *   Headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }
 *   Body: { api_key, person_titles[], person_not_titles[], q_organization_keyword_tags[],
 *           person_locations[], ... }
 *
 * When implementing:
 *   1. Pull active exclusion words from Supabase `permanent_exclusions` table
 *   2. Map them to `person_not_titles` in the Apollo request
 *   3. Use `personaTitles` from the Persona Architect as `person_titles`
 *   4. Use `industryKeywords` as `q_organization_keyword_tags`
 *   5. Use `locale.country` + `locale.region` as `person_locations`
 *   6. Score all returned results with computeRichardScore(title, locale.languageCode)
 */

interface FetchApolloParams {
  personaTitles: string[];
  industryKeywords: string[];
  excludedWords: string[];
  locale?: CampaignLocale;
  location?: string;
  employeeRange?: string;
}

export async function fetchApolloData(params: FetchApolloParams): Promise<Lead[]> {
  console.log("[fetchApolloData] Placeholder called with:", params);

  // ═══════════════════════════════════════════════
  //  TODO: Replace this mock with real Apollo API call
  // ═══════════════════════════════════════════════
  //
  //  const response = await fetch("https://api.apollo.io/v1/mixed_people/search", {
  //    method: "POST",
  //    headers: { "Content-Type": "application/json" },
  //    body: JSON.stringify({
  //      api_key: import.meta.env.VITE_APOLLO_API_KEY,
  //      person_titles: params.personaTitles,
  //      person_not_titles: params.excludedWords,
  //      q_organization_keyword_tags: params.industryKeywords,
  //      person_locations: [params.locale?.country, params.locale?.region].filter(Boolean),
  //      per_page: 50,
  //    }),
  //  });

  await new Promise((r) => setTimeout(r, 1200));

  const countryCode = params.locale?.countryCode || "GLOBAL";
  const languageCode = params.locale?.languageCode || "en";
  const region = params.locale?.region;

  const mockResults = countryCode === "GLOBAL"
    ? generateGlobalMockResults(params)
    : generateMockApolloResults(params, countryCode, region);

  return mockResults.map((raw, i) => {
    const richardScore = computeRichardScore(raw.jobTitle, languageCode);
    return {
      id: `apollo-${Date.now()}-${i}`,
      name: raw.name,
      company: raw.company,
      jobTitle: raw.jobTitle,
      email: raw.email,
      phone: raw.phone || "",
      industry: raw.industry,
      location: raw.location,
      employeeCount: raw.employeeCount || "50-200",
      richardScore,
      tier: scoreToTier(richardScore),
      source: "Apollo",
      fetchedAt: new Date().toISOString(),
      excluded: false,
    };
  });
}

function generateGlobalMockResults(params: FetchApolloParams) {
  const countryCodes = Object.keys(COUNTRY_MOCKS);
  const allResults: ReturnType<typeof generateMockApolloResults> = [];

  for (const cc of countryCodes) {
    const countryResults = generateMockApolloResults(params, cc);
    const slice = countryResults.slice(0, Math.max(3, Math.ceil(countryResults.length / 3)));
    allResults.push(...slice);
  }

  for (let i = allResults.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allResults[i], allResults[j]] = [allResults[j], allResults[i]];
  }

  return allResults.slice(0, 50);
}

// ─── Country-specific mock data ─────────────────────────────────────────────

interface CountryMockData {
  names: string[];
  companies: string[];
  locations: string[];
  phonePrefixes: string[];
  emailDomains: string[];
}

const COUNTRY_MOCKS: Record<string, CountryMockData> = {
  US: {
    names: [
      "Sarah Chen", "Marcus Rivera", "Diana Patel", "James Okoro", "Emily Vasquez",
      "Thomas Brennan", "Rachel Kim", "Alex Thornton", "Priya Sharma", "Michael Torres",
      "Lisa Wang", "Robert Fischer", "Ana Gonzalez", "David Park", "Nicole Adams",
      "Kevin Wright", "Maria Rossi", "Chris Yamamoto", "Fatima Al-Hassan", "John McCarthy",
    ],
    companies: [
      "TechNova", "GreenLeaf Energy", "FinEdge Capital", "MediCore Health", "CloudBridge",
      "RetailMax", "Apex Logistics", "EduVerse", "Quantum Dynamics", "Harbor RE",
      "NovaBio", "SkyNet Telecom", "DataVault", "NeuroLink", "Stratosphere AI",
      "BrightPath", "Cirrus Systems", "Pinnacle Ops", "Evergreen SaaS", "Bolt Commerce",
    ],
    locations: ["San Francisco, CA", "New York, NY", "Austin, TX", "Boston, MA", "Seattle, WA", "Chicago, IL", "Denver, CO", "Los Angeles, CA"],
    phonePrefixes: ["+1 (415)", "+1 (212)", "+1 (512)", "+1 (617)", "+1 (206)", "+1 (312)"],
    emailDomains: [".com", ".io", ".co"],
  },
  GB: {
    names: [
      "Oliver Thompson", "Charlotte Williams", "James Clarke", "Amelia Brown", "George Wilson",
      "Sophie Taylor", "Harry Davies", "Isabella Evans", "Jack Roberts", "Emily Walker",
      "William Harris", "Mia Robinson", "Thomas Lewis", "Ella Clark", "Daniel Wright",
      "Grace Hall", "Matthew Green", "Chloe Baker", "Joseph Adams", "Lucy Nelson",
    ],
    companies: [
      "Revolut", "Monzo", "Wise", "Deliveroo", "Darktrace",
      "BrightPearl", "Zoopla", "Starling Bank", "Snyk", "Checkout.com",
      "Graphcore", "Peak AI", "Paddle", "Thought Machine", "Improbable",
      "Eigen Technologies", "Faculty AI", "Cleo", "TrueLayer", "GoCardless",
    ],
    locations: ["London, England", "Manchester, England", "Edinburgh, Scotland", "Bristol, England", "Cambridge, England", "Birmingham, England", "Leeds, England", "Glasgow, Scotland"],
    phonePrefixes: ["+44 20", "+44 161", "+44 131", "+44 117", "+44 1223"],
    emailDomains: [".co.uk", ".com", ".io"],
  },
  CH: {
    names: [
      "Marc Müller", "Sophie Dubois", "Luca Bernasconi", "Nathalie Favre", "Thomas Keller",
      "Léa Martin", "Stefan Brunner", "Isabelle Rochat", "Daniel Meier", "Caroline Bonvin",
      "Patrick Schmid", "Aurélie Blanc", "Christoph Wyss", "Céline Fontana", "Andreas Baumann",
      "Marie Lecomte", "Reto Zimmermann", "Sandrine Pellegrini", "Beat Gerber", "Valérie Dupont",
    ],
    companies: [
      "Temenos", "Logitech", "On Running", "Scandit", "Acronis",
      "Avaloq", "Numbrs", "Proton Technologies", "MindMaze", "Flyability",
      "SICPA", "Climeworks", "Nexthink", "Sophia Genetics", "WeFox",
      "Bestmile", "Beekeeper", "Frontify", "Arktis Radiation Detectors", "Lunaphore",
    ],
    locations: ["Zurich, ZH", "Geneva, GE", "Lausanne, VD", "Bern, BE", "Basel, BS", "Lugano, TI", "Winterthur, ZH", "St. Gallen, SG"],
    phonePrefixes: ["+41 44", "+41 22", "+41 21", "+41 31", "+41 61"],
    emailDomains: [".ch", ".com", ".io"],
  },
  FR: {
    names: [
      "Pierre Durand", "Marie Lefebvre", "Jean-Baptiste Moreau", "Camille Bernard", "Antoine Petit",
      "Émilie Roux", "Nicolas Garnier", "Claire Fontaine", "François Lambert", "Julie Morel",
      "Guillaume Fournier", "Manon Girard", "Sébastien André", "Chloé Mercier", "Alexandre Blanc",
      "Léa Dupont", "Vincent Leroy", "Sarah Simon", "Mathieu Laurent", "Laura Michel",
    ],
    companies: [
      "BlaBlaCar", "Doctolib", "OVHcloud", "Dassault Systèmes", "Criteo",
      "Datadog", "Algolia", "ContentSquare", "ManoMano", "Mirakl",
      "Alan", "Qonto", "Shift Technology", "Ledger", "Swile",
      "Spendesk", "PayFit", "Sendinblue", "Platform.sh", "Talend",
    ],
    locations: ["Paris, Île-de-France", "Lyon, Auvergne-Rhône-Alpes", "Marseille, Provence-Alpes-Côte d'Azur", "Toulouse, Occitanie", "Nantes, Pays de la Loire", "Bordeaux, Nouvelle-Aquitaine", "Lille, Hauts-de-France", "Strasbourg, Grand Est"],
    phonePrefixes: ["+33 1", "+33 4", "+33 4", "+33 5", "+33 2"],
    emailDomains: [".fr", ".com", ".io"],
  },
  DE: {
    names: [
      "Maximilian Weber", "Anna Schmidt", "Lukas Becker", "Sophie Fischer", "Felix Wagner",
      "Laura Hoffmann", "Jan Schulz", "Marie Bauer", "Tim Koch", "Lena Richter",
      "David Wolf", "Julia Klein", "Tobias Neumann", "Sarah Braun", "Markus Schwarz",
      "Katharina Zimmermann", "Daniel Krüger", "Lisa Hartmann", "Christian Werner", "Nina Lang",
    ],
    companies: [
      "Celonis", "N26", "Personio", "FlixBus", "Trade Republic",
      "DeepL", "Adjust", "Mambu", "Scalable Capital", "Forto",
      "Sennder", "Grover", "Razor Group", "Agile Robots", "Pitch",
      "Contentful", "Ecosia", "Raisin", "Wefox", "SumUp",
    ],
    locations: ["Berlin, Berlin", "Munich, Bavaria", "Hamburg, Hamburg", "Frankfurt, Hesse", "Cologne, North Rhine-Westphalia", "Stuttgart, Baden-Württemberg", "Düsseldorf, NRW", "Leipzig, Saxony"],
    phonePrefixes: ["+49 30", "+49 89", "+49 40", "+49 69", "+49 221"],
    emailDomains: [".de", ".com", ".io"],
  },
  NL: {
    names: [
      "Daan de Vries", "Emma van den Berg", "Liam Jansen", "Sophie Bakker", "Sem Visser",
      "Julia Smit", "Bram de Boer", "Anna Mulder", "Lucas de Groot", "Sara Peters",
      "Tim van Dijk", "Lisa Bos", "Thomas Hendriks", "Eva Dekker", "Max Kok",
      "Fleur van Leeuwen", "Jesse Brouwer", "Noor de Jong", "Rick Vermeer", "Mila Huisman",
    ],
    companies: [
      "Adyen", "Booking.com", "Takeaway.com", "Mollie", "MessageBird",
      "Elastic", "TomTom", "Bynder", "WeTransfer", "Miro",
      "Picnic", "Backbase", "Bunq", "Catawiki", "SendCloud",
      "Bitfury", "Channel Engine", "CM.com", "Revue", "Framer",
    ],
    locations: ["Amsterdam, North Holland", "Rotterdam, South Holland", "The Hague, South Holland", "Utrecht, Utrecht", "Eindhoven, North Brabant", "Groningen, Groningen"],
    phonePrefixes: ["+31 20", "+31 10", "+31 70", "+31 30", "+31 40"],
    emailDomains: [".nl", ".com", ".io"],
  },
  ES: {
    names: [
      "Alejandro García", "María López", "Carlos Martínez", "Lucía Fernández", "Pablo Rodríguez",
      "Elena Sánchez", "Javier Pérez", "Ana Gómez", "Daniel Díaz", "Laura Moreno",
      "Sergio Álvarez", "Marta Romero", "Adrián Ruiz", "Sofía Torres", "Rubén Domínguez",
      "Claudia Vázquez", "Álvaro Castro", "Raquel Gil", "Iván Molina", "Irene Ortega",
    ],
    companies: [
      "Cabify", "Glovo", "Wallapop", "Typeform", "Factorial",
      "Flywire", "Jobandtalent", "Travelperk", "Holaluz", "Paack",
      "Playtomic", "Freshly Cosmetics", "Voicemod", "Carto", "Seedtag",
      "Lingokids", "Clarity AI", "Fintonic", "RedPoints", "Codigames",
    ],
    locations: ["Madrid, Comunidad de Madrid", "Barcelona, Cataluña", "Valencia, Comunitat Valenciana", "Sevilla, Andalucía", "Bilbao, País Vasco", "Málaga, Andalucía"],
    phonePrefixes: ["+34 91", "+34 93", "+34 96", "+34 95", "+34 94"],
    emailDomains: [".es", ".com", ".io"],
  },
  IT: {
    names: [
      "Marco Rossi", "Giulia Bianchi", "Alessandro Ferrari", "Chiara Romano", "Luca Colombo",
      "Francesca Ricci", "Andrea Marino", "Sara Greco", "Matteo Bruno", "Elena Gallo",
      "Federico Conti", "Valentina De Luca", "Lorenzo Mancini", "Arianna Barbieri", "Davide Fontana",
      "Silvia Rinaldi", "Simone Caruso", "Roberta Lombardi", "Nicola Giordano", "Paola Martini",
    ],
    companies: [
      "Bending Spoons", "Scalapay", "Satispay", "Prima Assicurazioni", "Casavo",
      "Yolo Group", "Musixmatch", "Soldo", "Facile.it", "Everli",
      "Credimi", "iGenius", "Young Platform", "Fitprime", "Cortilia",
      "Tannico", "Talent Garden", "Supermercato24", "ShopFully", "MotorK",
    ],
    locations: ["Milano, Lombardia", "Roma, Lazio", "Torino, Piemonte", "Firenze, Toscana", "Bologna, Emilia-Romagna", "Napoli, Campania"],
    phonePrefixes: ["+39 02", "+39 06", "+39 011", "+39 055", "+39 051"],
    emailDomains: [".it", ".com", ".io"],
  },
  CA: {
    names: [
      "Liam O'Brien", "Emma Tremblay", "Noah Gagnon", "Olivia Roy", "Ethan Campbell",
      "Sophie Côté", "Mason Stewart", "Charlotte Bouchard", "Logan Gauthier", "Amelia Fraser",
      "Aiden Lavoie", "Mia Bergeron", "Lucas Pelletier", "Zoe Morin", "Jack Fortin",
      "Lily Girard", "Ryan Bélanger", "Chloe Lachance", "Owen Lefebvre", "Grace Martin",
    ],
    companies: [
      "Shopify", "Hootsuite", "Wealthsimple", "Lightspeed", "Cohere",
      "Clio", "Coveo", "ApplyBoard", "Clearco", "Dutchie",
      "1Password", "Dapper Labs", "Tulip", "Trulioo", "Nuvei",
      "Top Hat", "League", "PointClickCare", "FreshBooks", "Element AI",
    ],
    locations: ["Toronto, Ontario", "Vancouver, British Columbia", "Montreal, Quebec", "Calgary, Alberta", "Ottawa, Ontario", "Waterloo, Ontario"],
    phonePrefixes: ["+1 (416)", "+1 (604)", "+1 (514)", "+1 (403)", "+1 (613)"],
    emailDomains: [".ca", ".com", ".io"],
  },
  AU: {
    names: [
      "Jack Mitchell", "Ruby Anderson", "Cooper Hughes", "Mia Thompson", "Archie Davis",
      "Ella Wilson", "Charlie Taylor", "Zoe Martin", "Oscar Brown", "Lily White",
      "Leo Harris", "Sienna Clark", "Max Robinson", "Willow Lewis", "Henry Walker",
      "Aria Hall", "Ethan Young", "Ivy King", "Noah Allen", "Chloe Wright",
    ],
    companies: [
      "Atlassian", "Canva", "Afterpay", "SafetyCulture", "Culture Amp",
      "Airwallex", "Linktree", "Employment Hero", "Go1", "Buildkite",
      "Eucalyptus", "Dovetail", "Immutable", "Deputy", "Rokt",
      "Xero", "Zip Co", "Brighte", "Judo Bank", "Tyro",
    ],
    locations: ["Sydney, NSW", "Melbourne, VIC", "Brisbane, QLD", "Perth, WA", "Adelaide, SA", "Canberra, ACT"],
    phonePrefixes: ["+61 2", "+61 3", "+61 7", "+61 8", "+61 8"],
    emailDomains: [".com.au", ".com", ".io"],
  },
  BE: {
    names: [
      "Lucas Peeters", "Emma Janssens", "Noah Maes", "Olivia Willems", "Louis Claes",
      "Marie Goossens", "Arthur Wouters", "Julie Jacobs", "Victor Mertens", "Laura De Smedt",
      "Thomas Hermans", "Lotte Peters", "Maxime Lambert", "Chloé Dubois", "Antoine Lejeune",
      "Camille Renard", "Pierre Dupont", "Manon Simon", "Nicolas Leclercq", "Pauline François",
    ],
    companies: [
      "Collibra", "Showpad", "Teamleader", "Odoo", "Silverfin",
      "Ngdata", "TrendMiner", "Guardsquare", "Apideck", "Cake",
      "BeCentral", "Sentiance", "Deliverect", "Cashforce", "Radix",
      "Proxyclick", "Sortlist", "Cumul.io", "Henchman", "Datacamp",
    ],
    locations: ["Brussels, Brussels-Capital", "Antwerp, Flanders", "Ghent, Flanders", "Liège, Wallonia", "Leuven, Flanders", "Bruges, Flanders"],
    phonePrefixes: ["+32 2", "+32 3", "+32 9", "+32 4", "+32 16"],
    emailDomains: [".be", ".com", ".io"],
  },
  IN: {
    names: [
      "Arjun Sharma", "Priya Patel", "Rahul Gupta", "Ananya Singh", "Vikram Reddy",
      "Meera Iyer", "Aditya Kumar", "Sneha Desai", "Rohan Mehta", "Kavya Nair",
      "Siddharth Joshi", "Ritika Agarwal", "Karan Verma", "Divya Rao", "Aman Mishra",
      "Pooja Shah", "Vivek Choudhary", "Neha Kapoor", "Nikhil Saxena", "Tanvi Srinivasan",
    ],
    companies: [
      "Flipkart", "Freshworks", "Zoho", "Razorpay", "CRED",
      "Zerodha", "Swiggy", "Ola", "PhonePe", "Postman",
      "Groww", "Meesho", "Chargebee", "BrowserStack", "Licious",
      "Unacademy", "Druva", "Hasura", "Mindtickle", "CleverTap",
    ],
    locations: ["Bangalore, Karnataka", "Mumbai, Maharashtra", "Delhi NCR, Delhi", "Hyderabad, Telangana", "Pune, Maharashtra", "Chennai, Tamil Nadu"],
    phonePrefixes: ["+91 80", "+91 22", "+91 11", "+91 40", "+91 20"],
    emailDomains: [".in", ".com", ".io"],
  },
  SG: {
    names: [
      "Wei Liang Tan", "Shu Min Lee", "Jun Wei Lim", "Yi Ling Ng", "Kai Wen Chen",
      "Mei Xuan Wong", "Zhi Hao Ong", "Hui Min Goh", "Jia Wei Koh", "Xiu Ting Teo",
      "Yong Han Chua", "Li Ying Sim", "Hao Yu Tay", "Xin Yi Chong", "Ming Hao Yeo",
      "Rachel Tan", "David Wong", "Sarah Lim", "Michael Ng", "Jessica Chen",
    ],
    companies: [
      "Grab", "Sea Group", "Lazada", "Razer", "Nium",
      "Carousell", "Patsnap", "Ninja Van", "ShopBack", "Advance Intelligence",
      "Carro", "Endowus", "StashAway", "Moglix", "FinAccel",
      "Fundnel", "Glints", "Aspire", "Volopay", "TenX",
    ],
    locations: ["Central Region, Singapore", "Jurong East, Singapore", "Tampines, Singapore", "One-North, Singapore", "Marina Bay, Singapore", "Raffles Place, Singapore"],
    phonePrefixes: ["+65 6", "+65 8", "+65 9"],
    emailDomains: [".sg", ".com", ".io"],
  },
  AE: {
    names: [
      "Omar Al-Rashid", "Fatima Hassan", "Ahmed Khalil", "Mariam Al-Maktoum", "Khalid Ibrahim",
      "Noor Ali", "Yusuf Saeed", "Aisha Rahman", "Hassan Mahmoud", "Layla Qasim",
      "Tariq Nasser", "Rania Jaber", "Mohammed Saleh", "Sarah Al-Hosani", "Abdullah Kareem",
      "Huda Mansoor", "Faisal Sharif", "Dina Al-Farsi", "Zayed Rashid", "Amira Hamdan",
    ],
    companies: [
      "Careem", "Kitopi", "Tabby", "Property Finder", "Noon",
      "Anghami", "Sarwa", "Fetchr", "Swvl", "Hala",
      "Bayzat", "MamosPay", "Ziina", "Yalla Group", "Dubizzle",
      "Vezeeta", "Mumzworld", "Beehive", "Areeb Technology", "DarkMatter",
    ],
    locations: ["Dubai, Dubai", "Abu Dhabi, Abu Dhabi", "Sharjah, Sharjah", "Dubai Marina, Dubai", "DIFC, Dubai", "Dubai Internet City, Dubai"],
    phonePrefixes: ["+971 4", "+971 2", "+971 6", "+971 50", "+971 55"],
    emailDomains: [".ae", ".com", ".io"],
  },
  IL: {
    names: [
      "Noam Cohen", "Tamar Levi", "Ido Mizrahi", "Noa Goldberg", "Eitan Shapiro",
      "Shira Peretz", "Yonatan Rosen", "Maya Friedman", "Oren Katz", "Daphna Stern",
      "Amir Ben-David", "Inbal Avraham", "Gil Weiss", "Talia Barak", "Roi Ezra",
      "Yael Segal", "Lior Dayan", "Michal Avidan", "Ohad Navon", "Hila Carmi",
    ],
    companies: [
      "Wix", "Monday.com", "Fiverr", "ironSource", "Gong",
      "Rapyd", "Fundbox", "Via", "Lemonade", "Snyk",
      "AppsFlyer", "WalkMe", "Payoneer", "Taboola", "Outbrain",
      "SimilarWeb", "CyberArk", "Checkpoint", "Lightricks", "Playtika",
    ],
    locations: ["Tel Aviv, Tel Aviv District", "Herzliya, Tel Aviv District", "Ramat Gan, Tel Aviv District", "Jerusalem, Jerusalem District", "Haifa, Haifa District", "Netanya, Central District"],
    phonePrefixes: ["+972 3", "+972 9", "+972 3", "+972 2", "+972 4"],
    emailDomains: [".co.il", ".com", ".io"],
  },
};

const DEFAULT_MOCK: CountryMockData = COUNTRY_MOCKS.US;

function getMockDataForCountry(countryCode: string, region?: string): CountryMockData {
  const data = COUNTRY_MOCKS[countryCode] || DEFAULT_MOCK;

  if (region && data.locations.length > 0) {
    const regionLower = region.toLowerCase();
    const filtered = data.locations.filter((loc) => loc.toLowerCase().includes(regionLower));
    if (filtered.length > 0) {
      return { ...data, locations: filtered };
    }
  }

  return data;
}

function generateMockApolloResults(
  params: FetchApolloParams,
  countryCode: string,
  region?: string
) {
  const mock = getMockDataForCountry(countryCode, region);

  const titles = params.personaTitles.length > 0
    ? [
        ...params.personaTitles,
        "CEO", "Co-Founder", "Managing Director", "Founder",
        "IT Support Specialist", "Finance Analyst", "IT Manager",
        "Sales Development Rep", "HR Coordinator", "Admin Assistant",
      ]
    : [
        "Head of SEO", "VP of Growth", "Marketing Director", "FinOps Manager",
        "Head of GTM", "VP Operations", "Product Lead", "Director of Product",
        "CEO", "Co-Founder", "Managing Director", "Founder",
        "IT Support Specialist", "Finance Analyst", "IT Manager",
        "Sales Development Rep", "HR Coordinator", "Admin Assistant", "Junior Analyst",
        "Head of Cloud Economics",
      ];

  const filteredTitles = params.excludedWords.length > 0
    ? titles.filter((title) => {
        const lower = title.toLowerCase();
        return !params.excludedWords.some((ex) => lower.includes(ex.toLowerCase()));
      })
    : titles;

  const industries = params.industryKeywords.length
    ? params.industryKeywords
    : ["SaaS", "FinTech", "HealthTech", "CleanTech", "eCommerce"];

  return filteredTitles.map((title, i) => {
    const name = mock.names[i % mock.names.length];
    const company = mock.companies[i % mock.companies.length];
    const domain = mock.emailDomains[i % mock.emailDomains.length];
    const companySlug = company.toLowerCase().replace(/[^a-z0-9]/g, "");
    const firstName = name.split(" ")[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return {
      name,
      company,
      jobTitle: title,
      email: `${firstName}@${companySlug}${domain}`,
      phone: `${mock.phonePrefixes[i % mock.phonePrefixes.length]} ${String(1000000 + Math.floor(Math.random() * 9000000)).slice(0, 7)}`,
      industry: industries[i % industries.length],
      location: mock.locations[i % mock.locations.length],
      employeeCount: ["10-50", "50-200", "200-500", "500-1000"][i % 4],
    };
  });
}
