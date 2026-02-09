import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  GitPullRequest,
  CircleDot,
  BarChart3,
  Settings,
} from "lucide-react";
import type { TabId } from "@/lib/types";

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "prs", label: "Pull Requests", icon: GitPullRequest },
  { id: "issues", label: "Issues", icon: CircleDot },
  { id: "activity", label: "Activity", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="bg-white border-b border-stone-200 px-4 sm:px-8 flex gap-0 overflow-x-auto">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer",
            activeTab === id
              ? "border-brand text-brand"
              : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300",
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
