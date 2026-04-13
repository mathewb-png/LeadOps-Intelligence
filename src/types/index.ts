export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  location: string;
  employeeCount: string;
  revenue: string;
  score: number;
  status: LeadStatus;
  source: string;
  lastActivity: string;
  tags: string[];
  notes: string;
}

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export interface SearchFilters {
  query: string;
  industry: string;
  location: string;
  employeeRange: string;
  revenueRange: string;
  status: string;
  minScore: number;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  avgScore: number;
  totalRevenuePipeline: string;
}
