import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api, { setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    api
      .get("/users/me/")
      .then((response) => {
        storeUser(response.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function storeUser(nextUser) {
    setUser(nextUser);
    localStorage.setItem("user", JSON.stringify(nextUser));
  }

  async function login(username, password) {
    const response = await api.post("/auth/token/", { username, password });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    setAuthToken(response.data.access);
    storeUser(response.data.user);
    return response.data.user;
  }

  async function refreshUser() {
    const response = await api.get("/users/me/");
    storeUser(response.data);
    return response.data;
  }

  function updateUser(nextUser) {
    storeUser(nextUser);
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      refreshUser,
      updateUser,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
