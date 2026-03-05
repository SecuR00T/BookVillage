import { createContext, useContext, useMemo, useState } from "react";
import { api } from "@/api/client";

const AuthContext = createContext(null);
const notifyAuthChanged = () => window.dispatchEvent(new Event("bookvillage-auth-changed"));

const isUnauthorizedError = (err) => {
  if (!err) return false;
  if (typeof err?.status === "number" && err.status === 401) return true;
  return err instanceof Error && /unauthorized/i.test(err.message);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem("bookvillage_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const creds = btoa(unescape(encodeURIComponent(`${email}:${password}`)));
    sessionStorage.setItem("bookvillage_creds", creds);

    let me;
    try {
      me = await api.auth.login({ email, password });
    } catch (err) {
      if (isUnauthorizedError(err)) {
        throw new Error("이메일 또는 비밀번호를 다시 확인해 주세요.");
      }
      throw err;
    }

    sessionStorage.setItem("bookvillage_user", JSON.stringify(me));
    setUser(me);
    notifyAuthChanged();
  };

  const register = async (payload) => {
    await api.auth.register(payload);
    await login(payload.email, payload.password);
  };

  const deleteAccount = async (password) => {
    if (!user?.id) {
      throw new Error("로그인이 필요합니다.");
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
