import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Login Function
  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Logout Function
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        setToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};