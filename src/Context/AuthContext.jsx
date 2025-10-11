import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { extractBearerToken } from "../auth/Auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullLoading, setFullloading] = useState(true);
  const authToken = Cookies.get("token");
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
    Cookies.set("token", extractBearerToken(token), {
      expires: 7, // expires in 7 days
      secure: true, // only sent over HTTPS
      sameSite: "strict", // prevents CSRF
    });
    await fetchUser();
  };

  // logout handler
  const logout = async () => {
    setCurrentUser(null);
    Cookies.remove("token");
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
