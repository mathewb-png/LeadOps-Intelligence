import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Dashboard from "@/pages/Dashboard";
import SearchLeads from "@/pages/SearchLeads";
import AllLeads from "@/pages/AllLeads";
import LeadDetail from "@/pages/LeadDetail";
import SavedLeads from "@/pages/SavedLeads";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<SearchLeads />} />
          <Route path="/leads" element={<AllLeads />} />
          <Route path="/leads/:id" element={<LeadDetail />} />
          <Route path="/saved" element={<SavedLeads />} />
        </Routes>
      </main>
    </div>
  );
}
