import { useAuth } from "@/lib/auth";
import { LoginPage } from "@/pages/LoginPage";
import { OrgPickerPage } from "@/pages/OrgPickerPage";
import { DashboardPage } from "@/pages/DashboardPage";

export function App() {
  const { user, isLoading, selectedOrg } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;
  if (!selectedOrg) return <OrgPickerPage />;
  return <DashboardPage />;
}
