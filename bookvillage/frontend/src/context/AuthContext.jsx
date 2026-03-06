import { createContext, useContext, useMemo, useState } from "react";
import { api } from "@/api/client";

const AuthContext = createContext(null);
const notifyAuthChanged = () => window.dispatchEvent(new Event("bookvillage-auth-changed"));

const isUnauthorizedError = (err) => {
  if (!err) return false;
  if (typeof err?.status === "number" && err.status === 401) return true;
  return err instanceof Error && /unauthorized/i.test(err.message);
};

const toBasicCreds = (identifier, password) => {
  const raw = `${identifier ?? ""}:${password ?? ""}`;
  try {
    const bytes = new TextEncoder().encode(raw);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary);
  } catch (_err) {
    return btoa(unescape(encodeURIComponent(raw)));
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem("bookvillage_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (identifier, password) => {
    const normalizedIdentifier = String(identifier || "").trim();
    if (!normalizedIdentifier || !password) {
      throw new Error("Please enter your ID (or email) and password.");
    }

    let me;
    try {
      me = await api.auth.login({ username: normalizedIdentifier, password });
    } catch (err) {
      sessionStorage.removeItem("bookvillage_creds");
      sessionStorage.removeItem("bookvillage_user");
      if (isUnauthorizedError(err)) {
        throw new Error("Please check your ID/email or password.");
      }
      throw err;
    }

    const creds = toBasicCreds(normalizedIdentifier, password);
    sessionStorage.setItem("bookvillage_creds", creds);
    sessionStorage.setItem("bookvillage_user", JSON.stringify(me));
    setUser(me);
    notifyAuthChanged();
  };

  const register = async (payload) => {
    await api.auth.register(payload);
    await login(payload.username || payload.email, payload.password);
  };

  const deleteAccount = async (password) => {
    if (!user?.id) {
      throw new Error("Login is required.");
    }
    await api.users.deleteMe(user.id, password);
    sessionStorage.removeItem("bookvillage_creds");
    sessionStorage.removeItem("bookvillage_user");
    setUser(null);
    notifyAuthChanged();
  };

  const logout = () => {
    api.auth.logout().catch(() => undefined);
    sessionStorage.removeItem("bookvillage_creds");
    sessionStorage.removeItem("bookvillage_user");
    setUser(null);
    notifyAuthChanged();
  };

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      deleteAccount,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
