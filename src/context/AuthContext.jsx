import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchCurrentAdmin, loginAdmin } from "../lib/api";

const AuthContext = createContext(null);
const AUTH_TOKEN_KEY = "red-dot-auth-token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function restoreSession() {
      const savedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
      if (!savedToken) {
        if (!isCancelled) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetchCurrentAdmin(savedToken);
        if (!isCancelled) {
          setToken(savedToken);
          setUser(response.user);
        }
      } catch {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isCancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      isLoading,
      token,
      user,
      async login(credentials) {
        const response = await loginAdmin(credentials);
        window.localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      },
      logout() {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        setToken("");
        setUser(null);
      },
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
