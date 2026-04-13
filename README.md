# LeadOps Intelligence & Persona Refiner

A lead generation and analysis platform that automates the transition from "Business Problem" to "Scored Lead List" with a 10-step pipeline and 12 API integrations.

## Architecture

```
src/
├── components/
│   ├── Navbar.tsx               Navigation + dark mode toggle
│   ├── IntentIntake.tsx         Campaign Goal text area
│   ├── PersonaArchitect.tsx     AI persona generation (3 tiers + keywords)
│   ├── LeadDataGrid.tsx         Sortable table: Score, Tier, Email Status, Tech Stack
│   ├── FeedbackSidebar.tsx      Batch Value, Exclusions, Pipeline Progress
│   ├── PipelineActionBar.tsx    Enrich, Verify, CRM, Outreach, Slack buttons
│   ├── RichardScoreBadge.tsx
│   ├── TierBadge.tsx
│   ├── StatCard.tsx
│   └── EmptyState.tsx
├── pages/
│   ├── Dashboard.tsx            Overview, 10-step pipeline, API grid, scoring ref
│   └── CampaignWorkspace.tsx    Full workflow page with all pipeline actions
├── lib/
│   ├── richardScoring.ts        Richard-Style 0-10 scoring engine
│   └── exportXlsx.ts            Strategic XLSX export (2 tabs)
├── services/                    ← API Landing Zones
│   ├── supabase.ts              Supabase client + table schemas
│   ├── fetchApolloData.ts       Apollo.io — lead sourcing
│   ├── hunterService.ts         Hunter.io — email finder by domain
│   ├── rocketReachService.ts    RocketReach — contact lookup
│   ├── clearbitService.ts       Clearbit — company enrichment
│   ├── crunchbaseService.ts     Crunchbase — funding & investor data
│   ├── builtWithService.ts      BuiltWith — tech stack detection
│   ├── zeroBounceService.ts     ZeroBounce — email validation
│   ├── groqService.ts           Groq — fast LLM scoring (~200ms)
│   ├── analyzeLeadsWithAI.ts    OpenAI GPT-4o — structured scoring
│   ├── hubspotService.ts        HubSpot — CRM sync
│   ├── instantlyService.ts      Instantly.ai — cold email outreach
│   ├── slackService.ts          Slack — webhook notifications
│   └── updateExclusionLogic.ts  Supabase exclusion sync
└── types/
    └── index.ts                 Full TypeScript interfaces for all APIs
```

## 10-Step Pipeline

| Step | Action | API |
|------|--------|-----|
| 1 | Define Campaign Goal | — |
| 2 | Generate Persona | OpenAI / Groq |
| 3 | Fetch Leads | Apollo.io, Hunter.io, RocketReach |
| 4 | Enrich Companies | Clearbit, Crunchbase, BuiltWith |
| 5 | Score Leads | Richard Engine + GPT-4o / Groq |
| 6 | Verify Emails | ZeroBounce |
| 7 | Refine & Exclude | Local + Supabase |
| 8 | Sync to CRM | HubSpot |
| 9 | Start Outreach | Instantly.ai |
| 10 | Notify Team | Slack Webhooks |

## Richard-Style Scoring (0-10)

| Score | Tier | Who |
|-------|------|-----|
| 9-10 | Primary | Heads of SEO, Growth, Marketing, FinOps |
| 7-8 | Stakeholder | GTM, Operations, Product leaders |
| 4-6 | Influence | Founders/CEOs at mid-sized firms |
| 1-3 | Peripheral | IT or Finance support roles |
| 0 | Irrelevant | Sales, HR, Admin, Junior roles |

## Cursor Shortcuts

Use these in Cursor to finish connecting each API:

### Lead Sourcing
> `@fetchApolloData` "Use the Apollo API docs to write a POST request that sends our UI titles and excludes our Supabase permanent_exclusions list."

> `@hunterService` "Use the Hunter.io API to find emails for each company domain in our leads list. Use domain-search for bulk and email-verifier for validation."

> `@rocketReachService` "Use the RocketReach API to look up contacts by name and company, and enrich our leads with email, phone, and LinkedIn profiles."

### Company Enrichment
> `@clearbitService` "Use the Clearbit Enrichment API to auto-fill company revenue, employee count, tech stack, and funding for each lead's domain."

> `@crunchbaseService` "Use the Crunchbase API to pull funding data, investor info, and company stage for each lead's company."

> `@builtWithService` "Use the BuiltWith API to detect the tech stack for each lead's company domain."

### Email Verification
> `@zeroBounceService` "Validate all lead emails in batch using ZeroBounce and update the verification status column."

### AI Scoring
> `@analyzeLeadsWithAI` "Connect this to OpenAI GPT-4o. Use 'Structured Outputs' to return a JSON array of scores based on the 0-10 Richard-Style logic."

> `@groqService` "Connect to Groq API for ultra-fast lead scoring using Llama 3. Use structured JSON output."

### CRM & Outreach
> `@hubspotService` "Push all leads with Richard Score >= 7 to HubSpot as contacts with custom properties for richard_score and lead_tier."

> `@instantlyService` "Use the Instantly.ai API to auto-enqueue Primary (9-10) leads into a cold email campaign."

### Notifications
> `@slackService` "Use the Slack Incoming Webhook to post a batch summary when lead scoring completes."

### Database
> `@updateExclusionLogic` "Create a trigger that whenever a lead is scored 0-2, the words in that title are analyzed for frequency and added to suggested exclusions."

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```env
# Database
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Lead Sourcing
VITE_APOLLO_API_KEY=
VITE_HUNTER_API_KEY=
VITE_ROCKETREACH_API_KEY=

# Enrichment
VITE_CLEARBIT_API_KEY=
VITE_CRUNCHBASE_API_KEY=
VITE_BUILTWITH_API_KEY=

# Email Verification
VITE_ZEROBOUNCE_API_KEY=

# AI Scoring
VITE_OPENAI_API_KEY=
VITE_GROQ_API_KEY=

# CRM
VITE_HUBSPOT_ACCESS_TOKEN=

# Outreach
VITE_INSTANTLY_API_KEY=

# Notifications
VITE_SLACK_WEBHOOK_URL=
```

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (dark mode)
- Recharts (analytics)
- SheetJS/xlsx (strategic export)
- Supabase (database)
- Lucide Icons

## License

MIT
