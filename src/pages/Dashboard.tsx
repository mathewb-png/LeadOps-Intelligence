import { Link } from "react-router-dom";
import {
  Users,
  Target,
  TrendingUp,
  Gauge,
  DollarSign,
  ArrowRight,
  Zap,
  Rocket,
  Brain,
  Database,
  Filter,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "@/components/StatCard";

const tierBreakdown = [
  { name: "Primary", value: 4, color: "#10b981" },
  { name: "Stakeholder", value: 4, color: "#3b82f6" },
  { name: "Influence", value: 4, color: "#f59e0b" },
  { name: "Peripheral", value: 3, color: "#f97316" },
  { name: "Irrelevant", value: 4, color: "#ef4444" },
];

const weeklyScores = [
  { week: "Week 1", avgScore: 5.2 },
  { week: "Week 2", avgScore: 6.1 },
  { week: "Week 3", avgScore: 6.8 },
  { week: "Week 4", avgScore: 7.3 },
  { week: "Week 5", avgScore: 7.9 },
  { week: "Week 6", avgScore: 8.2 },
];

const STEPS = [
  {
    icon: Brain,
    title: "1. Define Campaign",
    desc: "Describe your offering and ideal customer in the Campaign Workspace.",
  },
  {
    icon: Users,
    title: "2. Generate Persona",
    desc: "AI produces 3 tiers of job titles and industry keywords for targeting.",
  },
  {
    icon: Database,
    title: "3. Fetch & Score Leads",
    desc: "Pull leads from Apollo.io and auto-score them using the Richard Scale (0-10).",
  },
  {
    icon: Filter,
    title: "4. Refine & Exclude",
    desc: "Review noise words, add exclusions, and re-fetch for cleaner results each cycle.",
  },
  {
    icon: FileSpreadsheet,
    title: "5. Export Strategic Sheet",
    desc: "Download a tiered XLSX report ready for client delivery.",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            LeadOps Intelligence
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Automate the path from business problem to scored lead list.
          </p>
        </div>
        <Link to="/workspace" className="btn-primary">
          <Rocket className="h-4 w-4" /> Start Campaign
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Scored Leads"
          value="—"
          change="Run a campaign to begin"
          icon={Users}
          iconColor="text-brand-600"
          iconBg="bg-brand-50 dark:bg-brand-950"
        />
        <StatCard
          label="Primary Leads"
          value="—"
          icon={Target}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          label="Batch Value"
          value="—"
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950"
        />
        <StatCard
          label="Avg Richard Score"
          value="—"
          icon={Gauge}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            How It Works
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            The LeadOps workflow in 5 steps
          </p>
        </div>
        <div className="grid gap-px bg-gray-100 dark:bg-gray-800 sm:grid-cols-5">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center bg-white dark:bg-gray-900 p-5 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950">
                <step.icon className="h-5 w-5 text-brand-600" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {step.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Score Improvement Over Time
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Average Richard Score per batch as exclusions are refined
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="avgScore" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Tier Distribution (Example)
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Lead quality breakdown from a sample batch
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {tierBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {tierBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Richard-Style Scoring Reference
        </h2>
        <div className="grid gap-3 sm:grid-cols-5">
          {[
            { range: "9–10", label: "Primary", desc: "Heads of SEO, Growth, Marketing, FinOps", color: "bg-emerald-500" },
            { range: "7–8", label: "Stakeholder", desc: "GTM, Operations, Product leaders", color: "bg-blue-500" },
            { range: "4–6", label: "Influence", desc: "Founders/CEOs at mid-sized firms", color: "bg-amber-500" },
            { range: "1–3", label: "Peripheral", desc: "IT or Finance support roles", color: "bg-orange-500" },
            { range: "0", label: "Irrelevant", desc: "Sales, HR, Admin, Junior roles", color: "bg-red-500" },
          ].map((tier) => (
            <div key={tier.label} className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 text-center">
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${tier.color} text-white text-sm font-bold`}>
                {tier.range}
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{tier.label}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
