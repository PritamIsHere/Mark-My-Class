import {
  Home,
  ClipboardList,
  BarChart2,
  Settings,
  Plus,
  RotateCcwKey,
  University,
  QrCode,
  LogOut,
  BookText,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { logout, userRole } = useAuth();
  const handleLogout = () => {
    logout();
    toast.success("Logout successfully");
    navigate("/login");
    window.location.reload();
  };

  const baseClass = "flex items-center gap-3 p-3 rounded-lg transition";
  const normalClass =
    "bg-orange-500 text-white hover:bg-white hover:text-orange-500";
  const activeClass = "bg-white text-orange-500";

  const getLinkClass = ({ isActive }) =>
    `${baseClass} ${isActive ? activeClass : normalClass}`;

  return (
    <aside className="w-64 bg-orange-500 text-white flex flex-col font-semibold">
      <div className="p-6 text-2xl font-bold text-white border-b border-gray-200 items-center flex gap-2">
        <BookText size={35} />
        <span>{userRole}</span>
      </div>

      <nav className="flex flex-col gap-2 p-4 text-mid">
        <NavLink to="/" className={getLinkClass}>
          <Home size={18} /> Dashboard
        </NavLink>

        {userRole === "admin" && (
          <>
            <NavLink to="/admin/create-user" className={getLinkClass}>
              <Plus size={18} /> Create user
            </NavLink>
            <NavLink to="/admin/reset-password" className={getLinkClass}>
              <RotateCcwKey size={18} /> Reset Password
            </NavLink>
            <NavLink to="/admin/college-config" className={getLinkClass}>
              <University size={18} /> College Configuration
            </NavLink>
          </>
        )}

        {userRole === "teacher" && (
          <>
            <NavLink to="/teacher/create-qr-code" className={getLinkClass}>
              <QrCode size={18} /> Create QR Code
            </NavLink>
            <NavLink to="/teacher/end-qr-session" className={getLinkClass}>
              <QrCode size={18} /> End QR Session
            </NavLink>
            <NavLink to="/teacher/delete-qr-session" className={getLinkClass}>
              <QrCode size={18} /> Delete QR Session
            </NavLink>
            <NavLink to="/teacher/attendance" className={getLinkClass}>
              <ClipboardList size={18} /> Attendance
            </NavLink>
          </>
        )}

        {userRole === "student" && (
          <>
            <NavLink to="/student/scan-qr-code" className={getLinkClass}>
              <QrCode size={18} /> Scan QR Code
            </NavLink>
            <NavLink to="/student/attendance" className={getLinkClass}>
              <ClipboardList size={18} /> Attendance
            </NavLink>
            <NavLink to="/student/leaderboard" className={getLinkClass}>
              <BarChart2 size={18} /> Leaderboard
            </NavLink>
          </>
        )}

        <NavLink to="/" className={getLinkClass}>
          <Settings size={18} /> Settings
        </NavLink>

        <NavLink className={getLinkClass} onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
