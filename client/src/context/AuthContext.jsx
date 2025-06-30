import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [curUser, setCurUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await fetch('/api/users/me'); 
        if (response.ok) {
          const user = await response.json();
          setCurUser(user);
        } else {
          setCurUser(null);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setCurUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = (user) => {
    setCurUser(user);
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' }); 
      setCurUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    curUser,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};