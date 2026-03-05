import { createContext, useContext, useMemo, useState } from "react";
import { api } from "@/api/client";

const AuthContext = createContext(null);
const notifyAuthChanged = () => window.dispatchEvent(new Event("ohyes24-auth-changed"));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem("ohyes24_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const creds = btoa(unescape(encodeURIComponent(`${email}:${password}`)));
    sessionStorage.setItem("ohyes24_creds", creds);
    const me = await api.auth.login({ email, password });
    sessionStorage.setItem("ohyes24_user", JSON.stringify(me));
    setUser(me);
    notifyAuthChanged();
  };

  const register = async (payload) => {
    await api.auth.register(payload);
    await login(payload.email, payload.password);
  };

  const deleteAccount = async (password) => {
    if (!user?.id) {
      throw new Error("Not authenticated");
    }
    await api.users.deleteMe(user.id, password);
    sessionStorage.removeItem("ohyes24_creds");
    sessionStorage.removeItem("ohyes24_user");
    setUser(null);
    notifyAuthChanged();
  };

  const logout = () => {
    api.auth.logout().catch(() => undefined);
    sessionStorage.removeItem("ohyes24_creds");
    sessionStorage.removeItem("ohyes24_user");
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
