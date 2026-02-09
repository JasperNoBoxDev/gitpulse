import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useRepos, useOpenPRs, useOpenIssues } from "@/hooks/useGitHub";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { PRsTab } from "@/components/tabs/PRsTab";
import { IssuesTab } from "@/components/tabs/IssuesTab";
import { ActivityTab } from "@/components/tabs/ActivityTab";
import { SettingsTab } from "@/components/tabs/SettingsTab";
import type { TabId } from "@/lib/types";

export function DashboardPage() {
  const { selectedOrg } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const { data: repos } = useRepos();
  const repoNames = useMemo(
    () => repos?.map((r) => r.name) ?? [],
    [repos],
  );

  const { data: prs, isLoading: prsLoading } = useOpenPRs(repoNames);
  const { data: issues, isLoading: issuesLoading } = useOpenIssues(repoNames);

  if (!selectedOrg) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <OverviewTab
            repos={repos as never[] ?? []}
            prs={prs as never[] ?? []}
            issues={issues as never[] ?? []}
            prsLoading={prsLoading}
            issuesLoading={issuesLoading}
          />
        )}
        {activeTab === "prs" && (
          <PRsTab repoNames={repoNames} />
        )}
        {activeTab === "issues" && (
          <IssuesTab repoNames={repoNames} />
        )}
        {activeTab === "activity" && (
          <ActivityTab repoNames={repoNames} />
        )}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
