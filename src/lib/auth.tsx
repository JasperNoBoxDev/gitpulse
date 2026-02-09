import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { fetchUser, resetOctokit } from "@/lib/github";

interface User {
  login: string;
  avatar_url: string;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  selectedOrg: string | null;
  setSelectedOrg: (org: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(
    localStorage.getItem("gp_org"),
  );

  useEffect(() => {
    const token = localStorage.getItem("gp_token");
    if (token) {
      fetchUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("gp_token");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("gp_token", token);
    resetOctokit();
    const userData = await fetchUser();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("gp_token");
    localStorage.removeItem("gp_org");
    resetOctokit();
    setUser(null);
    setSelectedOrg(null);
  };

  const handleSetOrg = (org: string | null) => {
    setSelectedOrg(org);
    if (org) localStorage.setItem("gp_org", org);
    else localStorage.removeItem("gp_org");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        selectedOrg,
        setSelectedOrg: handleSetOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
