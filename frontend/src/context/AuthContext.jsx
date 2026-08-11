import { useState } from "react";
import { jwtDecode } from "jwt-decode";

import AuthContext from "./auth-context";

function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("access_token");
  });

  const user = getUserFromToken(token);
  const isAuthenticated = Boolean(token && user);

  const login = (accessToken) => {
    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;