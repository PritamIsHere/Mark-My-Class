import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
// Protected Route Component
export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// Public Route Restriction (e.g., /login, /register)
export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" /> : children;
};

export const AdminRoute = ({ children }) => {
  const { CurrentUser } = useAuth();
  const userRole = CurrentUser?.existuser?.role;

  if (!CurrentUser) {
    // not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "admin") {
    // logged in but not admin → go to dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export const TeacherRoute = ({ children }) => {
  const { CurrentUser } = useAuth();
  const userRole = CurrentUser?.existuser?.role;

  if (!CurrentUser) {
    // not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "teacher") {
    // logged in but not admin → go to dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export const StudentRoute = ({ children }) => {
  const { CurrentUser } = useAuth();
  const userRole = CurrentUser?.existuser?.role;

  if (!CurrentUser) {
    // not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "student") {
    // logged in but not admin → go to dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export function extractBearerToken(authHeader) {
  if (typeof authHeader !== "string") {
    throw new Error("Authorization header must be a string");
  }

  const parts = authHeader.trim().split(/\s+/);

  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    throw new Error(
      "Invalid Authorization header format. Expected: Bearer <token>"
    );
  }

  return parts[1];
}
