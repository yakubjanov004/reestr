import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api, { setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);
const TRUST_TOKEN_KEY = "sms_trust_token";

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

  function storeSession(data) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    if (data.trusted_device_token) {
      localStorage.setItem(TRUST_TOKEN_KEY, data.trusted_device_token);
    }
    setAuthToken(data.access);
    storeUser(data.user);
    return data.user;
  }

  async function login(phoneNumber, password) {
    const trustedToken = localStorage.getItem(TRUST_TOKEN_KEY);
    const response = await api.post("/auth/token/", {
      phone_number: phoneNumber,
      password,
      trusted_device_token: trustedToken || undefined
    });
    if (response.data.requires_sms) {
      return response.data;
    }
    const loggedInUser = storeSession(response.data);
    return { requires_sms: false, user: loggedInUser };
  }

  async function verifySmsLogin(challengeToken, code) {
    const response = await api.post("/auth/token/verify/", {
      challenge_token: challengeToken,
      code
    });
    return storeSession(response.data);
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
      verifySmsLogin,
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
