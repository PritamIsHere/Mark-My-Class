// import { createContext, useContext, useEffect, useState } from "react";
// import axiosInstance from "../api/axiosInstance";
// import { extractBearerToken } from "../auth/Auth";
// import Cookies from "js-cookie";
// import { useReset } from "./RootProvider";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [fullLoading, setFullloading] = useState(true);
//   const authToken = Cookies.get("token");
//   const [CurrentUser, setCurrentUser] = useState(null);
//   const [error, setError] = useState("");
//   const [userRole, setUserRole] = useState(null);

//   const [showPassModel, setShowPassModel] = useState(false);

//   const { resetAllStates } = useReset();

//   const fetchUser = async () => {
//     if (!authToken) return;

//     try {
//       setFullloading(true);
//       const res = await axiosInstance.get(`/user/current-user`, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });
//       setCurrentUser(res?.data);
//       setUserRole(res?.data?.existuser?.role);
//       setIsLoggedIn(true);
//     } catch (error) {
//       localStorage.removeItem("token");
//       setError(error);
//       setIsLoggedIn(false);
//     } finally {
//       setFullloading(false);
//     }
//   };

//   // This runs on initial load
//   useEffect(() => {
//     fetchUser();
//   }, []);

//   // login handler
//   const login = async (token) => {
//     Cookies.set("token", extractBearerToken(token), {
//       expires: 7, // expires in 7 days
//       secure: true, // only sent over HTTPS
//       sameSite: "strict", // prevents CSRF
//     });
//     await fetchUser();
//   };

//   // logout handler
//   const logout = async () => {
//     // setCurrentUser(null);
//     // Cookies.remove("token");
//     // setIsLoggedIn(false);
//     Cookies.remove("token");
//     setIsLoggedIn(false);
//     setCurrentUser(null);
//     setUserRole(null);
//     setShowPassModel(false);
//     setError("");

//     // clear other local data
//     localStorage.clear();
//     sessionStorage.clear();

//     // 🔥 this will reset all contexts, not just Auth
//     resetAllStates();
//   };
//   return (
//     <AuthContext.Provider
//       value={{
//         isLoggedIn,
//         login,
//         logout,
//         authToken,
//         setFullloading,
//         fullLoading,
//         fetchUser,
//         CurrentUser,
//         userRole,
//         showPassModel,
//         setShowPassModel,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { extractBearerToken } from "../auth/Auth";
import Cookies from "js-cookie";
import { useReset } from "./ResetContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullLoading, setFullLoading] = useState(false); // loader for fetch actions
  const [initialLoad, setInitialLoad] = useState(true); // loader for first app load
  const [CurrentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [showPassModel, setShowPassModel] = useState(false);

  const { resetAllStates } = useReset();

  const fetchUser = async () => {
    const authToken = Cookies.get("token");
    if (!authToken) {
      setInitialLoad(false); // no token, stop initial loader
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
      setInitialLoad(false); // first fetch done
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
