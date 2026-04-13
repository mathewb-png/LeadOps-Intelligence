import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  badge,
  children,
  actions,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span className="text-brand-600 dark:text-brand-400 shrink-0">{icon}</span>
        <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {title}
        </span>
        {badge !== undefined && (
          <span className="rounded-full bg-brand-50 dark:bg-brand-950 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:text-brand-300">
            {badge}
          </span>
        )}
        {actions && (
          <span onClick={(e) => e.stopPropagation()} className="shrink-0">
            {actions}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}
