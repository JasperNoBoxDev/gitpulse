import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Activity } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(token.trim());
    } catch {
      setError("Invalid token. Make sure it has repo and read:org scopes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Activity className="w-8 h-8 text-brand" />
            <h1 className="text-2xl font-bold text-stone-900">GitPulse</h1>
          </div>
          <p className="text-stone-500">
            Connect your GitHub to get started
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-stone-200 p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Personal Access Token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              required
            />
          </div>

          <p className="text-xs text-stone-400">
            Create a{" "}
            <a
              href="https://github.com/settings/tokens/new?scopes=repo,read:org&description=GitPulse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline"
            >
              fine-grained token
            </a>{" "}
            with <code className="bg-stone-100 px-1 rounded">repo</code> and{" "}
            <code className="bg-stone-100 px-1 rounded">read:org</code> scopes.
          </p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full bg-brand text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "Connecting..." : "Connect GitHub"}
          </button>
        </form>

        <p className="text-center text-xs text-stone-400 mt-4">
          Your token is stored locally in your browser. Never sent to any server.
        </p>
      </div>
    </div>
  );
}
