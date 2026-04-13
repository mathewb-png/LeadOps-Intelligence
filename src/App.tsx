import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeMode } from "@/types";
import Navbar from "@/components/Navbar";
import Dashboard from "@/pages/Dashboard";
import CampaignWorkspace from "@/pages/CampaignWorkspace";

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("leadops-theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("leadops-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workspace" element={<CampaignWorkspace />} />
        </Routes>
      </main>
    </div>
  );
}
