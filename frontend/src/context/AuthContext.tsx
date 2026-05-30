import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { api } from "../api/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "analyst" | "viewer";
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem("security_token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("security_user");
    return raw ? JSON.parse(raw) : null;
  });

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("security_token", data.token);
    localStorage.setItem("security_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("security_token");
    localStorage.removeItem("security_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}

