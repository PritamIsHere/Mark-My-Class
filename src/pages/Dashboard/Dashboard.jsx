import { useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import Admin from "../Admin/Admin";
import Student from "../Student/Student";
import Teacher from "../Teacher/Teacher";
import LoadingScreen from "../../components/Apploading/Loading";

const Dashboard = () => {
  const { CurrentUser, userRole, fullLoading } = useAuth();

  if (fullLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      {userRole === "admin" && <Admin />}
      {userRole === "teacher" && <Teacher />}
      {userRole === "student" && <Student />}
    </>
  );
};

export default Dashboard;
