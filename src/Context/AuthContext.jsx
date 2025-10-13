import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { extractBearerToken } from "../auth/Auth";
import Cookies from "js-cookie";
import { useReset } from "./ResetContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullLoading, setFullLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [CurrentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [showPassModel, setShowPassModel] = useState(false);

  const { resetAllStates } = useReset();

  const fetchUser = async () => {
    const authToken = Cookies.get("token");
    if (!authToken) {
      setInitialLoad(false);
      return;
    }

    try {
      setFullLoading(true);
      const res = await axiosInstance.get(`/user/current-user`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCurrentUser(res?.data);
      setUserRole(res?.data?.existuser?.role);
      setIsLoggedIn(true);
    } catch (err) {
      Cookies.remove("token");
      setIsLoggedIn(false);
      setCurrentUser(null);
      setUserRole(null);
      setError(err);
    } finally {
      setFullLoading(false);
      setInitialLoad(false);
    }
  };

  // Run on app start
  useEffect(() => {
    fetchUser();
  }, []);

  // Login handler
  const login = async (token) => {
    Cookies.set("token", extractBearerToken(token), {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
    await fetchUser();
  };

  // Logout handler
  const logout = async () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole(null);
    setShowPassModel(false);
    setError("");

    localStorage.clear();
    sessionStorage.clear();

    // reset all app contexts
    resetAllStates();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        authToken: Cookies.get("token"),
        fullLoading,
        initialLoad,
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
