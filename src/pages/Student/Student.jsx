import React from "react";
import { useAuth } from "../../Context/AuthContext";
import Sidebar from "../../components/Sidebar/Sidebar";

const Student = () => {
  const { CurrentUser, userRole, fullLoading } = useAuth();

  return (
    <div className="flex h-screen bg-white">
      <Sidebar role={userRole} />
    </div>
  );
};

export default Student;
