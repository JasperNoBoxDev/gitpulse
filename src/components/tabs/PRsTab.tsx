import { useState } from "react";
import { useOpenPRs } from "@/hooks/useGitHub";
import { GitPullRequest, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

function daysAgo(date: string): number {
  return Math.floor(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
  );
}

interface PRsTabProps {
  repoNames: string[];
}

export function PRsTab({ repoNames }: PRsTabProps) {
  const { data: prs, isLoading } = useOpenPRs(repoNames);
  const [filter, setFilter] = useState<"all" | "review" | "draft" | "stale">("all");

  const filtered = (prs ?? []).filter((pr: any) => {
    if (filter === "review") return (pr.requested_reviewers ?? []).length > 0;
    if (filter === "draft") return pr.draft;
    if (filter === "stale") return daysAgo(pr.created_at) > 14;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "review", "draft", "stale"] as const).map((f) => (
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
            {f === "all" ? "All" : f === "review" ? "Needs Review" : f === "draft" ? "Drafts" : "Stale (14d+)"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500">PR</th>
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500">Title</th>
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500">Author</th>
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500">Branch</th>
              <th className="px-4 py-2.5 text-xs font-medium text-stone-500 text-right">Age</th>
              <th className="px-4 py-2.5 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                  Loading pull requests...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                  No pull requests found
                </td>
              </tr>
            ) : (
              filtered.map((pr) => {
                const age = daysAgo(pr.created_at);
                return (
                  <tr key={pr.id} className="hover:bg-stone-50">
                    <td className="px-4 py-2.5 text-stone-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <GitPullRequest
                          className={cn(
                            "w-4 h-4",
                            pr.draft ? "text-stone-400" : "text-green-600",
                          )}
                        />
                        {pr.head.repo?.name}#{pr.number}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-stone-800 max-w-md truncate">
                      {pr.title}
                      {pr.draft && (
                        <span className="ml-2 text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full">
                          draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-stone-500">{pr.user?.login}</td>
                    <td className="px-4 py-2.5">
                      <code className="text-xs bg-stone-50 px-1.5 py-0.5 rounded text-stone-600">
                        {pr.head.ref}
                      </code>
                      <span className="text-stone-300 mx-1">&rarr;</span>
                      <code className="text-xs bg-stone-50 px-1.5 py-0.5 rounded text-stone-600">
                        {pr.base.ref}
                      </code>
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5 text-right tabular-nums",
                        age > 14 ? "text-amber-600 font-medium" : "text-stone-400",
                      )}
                    >
                      {age}d
                    </td>
                    <td className="px-4 py-2.5">
                      <a
                        href={pr.html_url}
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
