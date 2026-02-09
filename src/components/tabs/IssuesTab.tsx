import { useState } from "react";
import { useOpenIssues } from "@/hooks/useGitHub";
import { CircleDot, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

function daysAgo(date: string): number {
  return Math.floor(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
  );
}

interface IssuesTabProps {
  repoNames: string[];
}

export function IssuesTab({ repoNames }: IssuesTabProps) {
  const { data: issues, isLoading } = useOpenIssues(repoNames);
  const [filter, setFilter] = useState<"all" | "unassigned" | "bug" | "stale">("all");

  const filtered = (issues ?? []).filter((issue: any) => {
    if (filter === "unassigned") return (issue.assignees ?? []).length === 0;
    if (filter === "bug")
      return (issue.labels ?? []).some((l: any) =>
        (l.name ?? "").toLowerCase().includes("bug"),
      );
    if (filter === "stale") return daysAgo(issue.created_at) > 30;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["all", "unassigned", "bug", "stale"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer",
              filter === f
                ? "bg-brand text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:border-brand hover:text-brand",
            )}
          >
            {f === "all"
              ? "All"
              : f === "unassigned"
                ? "Unassigned"
                : f === "bug"
                  ? "Bugs"
                  : "Stale (30d+)"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500">Issue</th>
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500">Title</th>
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500">Labels</th>
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500">Assignees</th>
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500 text-right">Age</th>
              <th className="px-4 py-2.5 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                  Loading issues...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                  No issues found
                </td>
              </tr>
            ) : (
              filtered.map((issue) => {
                const age = daysAgo(issue.created_at);
                return (
                  <tr key={issue.id} className="hover:bg-stone-50">
                    <td className="px-4 py-2.5 text-stone-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CircleDot className="w-4 h-4 text-green-600" />
                        #{issue.number}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-stone-800 max-w-md truncate">
                      {issue.title}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 flex-wrap">
                        {(issue.labels ?? []).slice(0, 3).map((l: any) => (
                          <span
                            key={l.name}
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `#${l.color}20`,
                              color: `#${l.color}`,
                            }}
                          >
                            {l.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex -space-x-1">
                        {(issue.assignees ?? []).length === 0 ? (
                          <span className="text-xs text-stone-300">none</span>
                        ) : (
                          (issue.assignees ?? []).map((a: any) => (
                            <img
                              key={a.login}
                              src={a.avatar_url}
                              alt={a.login}
                              title={a.login}
                              className="w-5 h-5 rounded-full border border-white"
                            />
                          ))
                        )}
                      </div>
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 text-right tabular-nums",
                        age > 30 ? "text-amber-600 font-medium" : "text-stone-400",
                      )}
                    >
                      {age}d
                    </td>
                    <td className="px-4 py-2.5">
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-300 hover:text-brand"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
