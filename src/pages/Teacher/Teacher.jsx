import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../Context/AuthContext";

const Teacher = () => {
  const { CurrentUser, userRole, fullLoading } = useAuth();
  return (
    <div className="flex h-screen bg-white">
      <Sidebar role={userRole} />
    </div>
  );
};

export default Teacher;
