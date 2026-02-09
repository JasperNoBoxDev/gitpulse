import { useAuth } from "@/lib/auth";
import { Activity, LogOut, ArrowLeftRight } from "lucide-react";

export function Header() {
  const { user, selectedOrg, setSelectedOrg, logout } = useAuth();

  return (
    <header className="bg-white border-b border-stone-200 px-4 sm:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-brand" />
        <h1 className="text-base font-semibold text-brand">GitPulse</h1>
        <span className="text-xs text-stone-400">
          {selectedOrg}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedOrg(null)}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-brand px-2 py-1.5 rounded-md hover:bg-stone-50 transition-colors cursor-pointer"
          title="Switch organisation"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Switch
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-stone-700 hidden sm:inline">
              {user.login}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          className="text-stone-400 hover:text-red-500 p-1.5 rounded-md hover:bg-stone-50 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
