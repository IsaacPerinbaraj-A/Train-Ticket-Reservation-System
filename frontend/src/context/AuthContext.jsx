import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("train_token") || sessionStorage.getItem("train_token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cachedUser = localStorage.getItem("train_user") || sessionStorage.getItem("train_user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
  }, []);

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/login", payload);
      const storage = payload.rememberMe ? localStorage : sessionStorage;
      const otherStorage = payload.rememberMe ? sessionStorage : localStorage;

      storage.setItem("train_token", response.data.token);
      storage.setItem("train_user", JSON.stringify(response.data.user));
      otherStorage.removeItem("train_token");
      otherStorage.removeItem("train_user");

      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      // Ignore server logout errors so local cleanup still happens.
    }

    localStorage.removeItem("train_token");
    localStorage.removeItem("train_user");
    sessionStorage.removeItem("train_token");
    sessionStorage.removeItem("train_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      authenticated: Boolean(user && token),
      setUser,
      login,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
