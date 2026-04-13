import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  Target,
  TrendingUp,
  Gauge,
  DollarSign,
  ArrowRight,
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
  LineChart,
  Line,
} from "recharts";
import { mockLeads } from "@/data/mockLeads";
import StatCard from "@/components/StatCard";
import LeadCard from "@/components/LeadCard";
import StatusBadge from "@/components/StatusBadge";
import { LeadStatus } from "@/types";

const statusCounts = mockLeads.reduce(
  (acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);

const pieData = Object.entries(statusCounts).map(([name, value]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  value,
}));

const PIE_COLORS = ["#6366f1", "#f59e0b", "#8b5cf6", "#3b82f6", "#ef4444", "#10b981", "#ec4899"];

const scoreDistribution = [
  { range: "0-20", count: mockLeads.filter((l) => l.score <= 20).length },
  { range: "21-40", count: mockLeads.filter((l) => l.score > 20 && l.score <= 40).length },
  { range: "41-60", count: mockLeads.filter((l) => l.score > 40 && l.score <= 60).length },
  { range: "61-80", count: mockLeads.filter((l) => l.score > 60 && l.score <= 80).length },
  { range: "81-100", count: mockLeads.filter((l) => l.score > 80).length },
];

const weeklyTrend = [
  { week: "W1", leads: 8 },
  { week: "W2", leads: 12 },
  { week: "W3", leads: 15 },
  { week: "W4", leads: 11 },
  { week: "W5", leads: 18 },
  { week: "W6", leads: 22 },
  { week: "W7", leads: 19 },
  { week: "W8", leads: 25 },
];

export default function Dashboard() {
  const totalLeads = mockLeads.length;
  const newLeads = mockLeads.filter((l) => l.status === "new").length;
  const qualifiedLeads = mockLeads.filter((l) => l.status === "qualified").length;
  const wonLeads = mockLeads.filter((l) => l.status === "won").length;
  const avgScore = Math.round(mockLeads.reduce((a, l) => a + l.score, 0) / totalLeads);
  const conversionRate = Math.round((wonLeads / totalLeads) * 100);

  const topLeads = [...mockLeads].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your lead intelligence overview at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Leads"
          value={totalLeads}
          change="+12% from last month"
          changeType="positive"
          icon={Users}
          iconColor="text-brand-600"
          iconBg="bg-brand-50"
        />
        <StatCard
          label="New Leads"
          value={newLeads}
          change="+3 this week"
          changeType="positive"
          icon={UserPlus}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Qualified"
          value={qualifiedLeads}
          icon={Target}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          label="Conversion"
          value={`${conversionRate}%`}
          change="+2.1% vs last quarter"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Avg Score"
          value={avgScore}
          icon={Gauge}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Pipeline"
          value="$2.4M"
          change="+$340K this month"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900">Lead Acquisition Trend</h2>
          <p className="mt-1 text-xs text-gray-500">Weekly new leads over the past 8 weeks</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366f1", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900">Score Distribution</h2>
          <p className="mt-1 text-xs text-gray-500">Lead quality score breakdown</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900">Pipeline by Status</h2>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Top Leads</h2>
              <p className="mt-1 text-xs text-gray-500">Highest scoring opportunities</p>
            </div>
            <Link
              to="/leads"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {topLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {mockLeads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-600">
                  {lead.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {lead.companyName}
                  </p>
                  <p className="text-xs text-gray-500">{lead.contactName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={lead.status as LeadStatus} />
                <span className="text-xs text-gray-400 whitespace-nowrap">{lead.lastActivity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
