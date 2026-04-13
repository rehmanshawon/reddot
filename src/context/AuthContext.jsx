import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedContent } from "../data/seedContent";

const AuthContext = createContext(null);
const AUTH_KEY = "red-dot-auth";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(saved === "true");
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login: ({ email, password }) => {
        const valid =
          email === seedContent.admin.email && password === seedContent.admin.password;
        if (valid) {
          window.localStorage.setItem(AUTH_KEY, "true");
          setIsAuthenticated(true);
        }
        return valid;
      },
      logout: () => {
        window.localStorage.removeItem(AUTH_KEY);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
