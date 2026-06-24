import { createContext, useContext, useState, useCallback } from "react";
import { api, saveSession, clearSession, getStoredUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.post("/auth/login", { email, password });
      saveSession(data.access_token, data.user);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.post("/auth/register", payload);

      // Registration should only create the account.
      // The user must log in manually after signup.
      clearSession();
      setUser(null);

      return data.user || data;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setError("");
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.get("/auth/me");
      saveSession(localStorage.getItem("inoneToken"), data);
      setUser(data);
      return data;
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
