# LeadOps Intelligence & Persona Refiner

A lead generation and analysis platform that automates the transition from "Business Problem" to "Scored Lead List" using the Richard-Style scoring system.

## Architecture

```
src/
├── components/          UI components
│   ├── Navbar.tsx           Navigation + dark mode toggle
│   ├── IntentIntake.tsx     Campaign Goal text area
│   ├── PersonaArchitect.tsx AI persona generation (3 tiers + keywords)
│   ├── LeadDataGrid.tsx     Sortable table w/ Richard Score & Tier
│   ├── FeedbackSidebar.tsx  Exclusions panel + Batch Value
│   ├── RichardScoreBadge.tsx
│   ├── TierBadge.tsx
│   ├── StatCard.tsx
│   └── EmptyState.tsx
├── pages/
│   ├── Dashboard.tsx        Overview, workflow guide, scoring reference
│   └── CampaignWorkspace.tsx Main workflow page
├── lib/
│   ├── richardScoring.ts    Richard-Style 0-10 scoring engine
│   └── exportXlsx.ts        Strategic XLSX export
├── services/            ← API Landing Zones for Cursor
│   ├── supabase.ts          Supabase client + table schemas
│   ├── fetchApolloData.ts   Apollo.io API placeholder
│   ├── analyzeLeadsWithAI.ts OpenAI/Gemini scoring placeholder
│   └── updateExclusionLogic.ts Exclusion sync placeholder
└── types/
    └── index.ts             TypeScript interfaces
```

## Richard-Style Scoring (0-10)

| Score | Tier        | Who                                        |
|-------|-------------|--------------------------------------------|
| 9-10  | Primary     | Heads of SEO, Growth, Marketing, FinOps    |
| 7-8   | Stakeholder | GTM, Operations, Product leaders           |
| 4-6   | Influence   | Founders/CEOs at mid-sized firms           |
| 1-3   | Peripheral  | IT or Finance support roles                |
| 0     | Irrelevant  | Sales, HR, Admin, Junior roles             |

## Cursor Shortcuts

After cloning, use these commands in Cursor to finish the build:

**Apollo API:**
> `@fetchApolloData` "Use the Apollo API docs to write a POST request that sends our UI titles and excludes our Supabase permanent_exclusions list."

**AI Scoring:**
> `@analyzeLeadsWithAI` "Connect this to OpenAI GPT-4o. Use 'Structured Outputs' to return a JSON array of scores based on the 0-10 Richard-Style logic."

**Exclusion Trigger:**
> `@updateExclusionLogic` "Create a trigger that whenever a lead is scored 0-2, the words in that title are analyzed for frequency and added to suggested exclusions."

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APOLLO_API_KEY=your-apollo-key
VITE_OPENAI_API_KEY=your-openai-key
```

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (dark mode support)
- Recharts (analytics)
- SheetJS/xlsx (strategic export)
- Supabase (database — placeholder config)
- Lucide Icons

## License

MIT
