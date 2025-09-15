import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AuthRedirect = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  return null;
};

export default AuthRedirect;
