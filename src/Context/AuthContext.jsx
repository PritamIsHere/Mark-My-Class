import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { extractBearerToken } from "../auth/Auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullLoading, setFullloading] = useState(true);
  const authToken = localStorage.getItem("token");
  const [CurrentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [showPassModel, setShowPassModel] = useState(false);

  const fetchUser = async () => {
    if (!authToken) return;

    try {
      setFullloading(true);
      const res = await axiosInstance.get(`/user/current-user`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCurrentUser(res?.data);
      setUserRole(res?.data?.existuser?.role);
      // Store userId in localStorage for later use
      localStorage.setItem("userId", res?.data?.existuser?._id || "");
      setIsLoggedIn(true);
    } catch (error) {
      localStorage.removeItem("token");
      setError(error);
      setIsLoggedIn(false);
    } finally {
      setFullloading(false);
    }
  };

  // This runs on initial load
  useEffect(() => {
    fetchUser();
  }, []);

  // login handler
  const login = async (token) => {
    localStorage.setItem("token", extractBearerToken(token));
    await fetchUser();
  };

  // logout handler
  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        authToken,
        setFullloading,
        fullLoading,
        fetchUser,
        CurrentUser,
        userRole,
        showPassModel,
        setShowPassModel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
