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
  Highlighter,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { useMedia } from "../../Context/ResponsiveContext";

const Sidebar = () => {
  const { logout, userRole } = useAuth();
  const isMobileSize = useMedia();
  const navigate = useNavigate();

  const handleLogout = async () => {
    window.location.replace("/login");
    toast.success("Logout successfully");
    await logout();
  };

  const baseClass = "flex items-center gap-3 p-3 rounded-lg transition";
  const normalClass =
    "bg-orange-500 text-white hover:bg-white hover:text-orange-500";
  const activeClass = "bg-white text-orange-500";

  const getLinkClass = ({ isActive }) =>
    `${baseClass} ${isActive ? activeClass : normalClass}`;

  const commonLinks = [
    { to: "/", label: "Home", icon: <Home size={20} /> },
    // { to: "/", label: "Settings", icon: <Settings size={20} /> },
  ];

  const roleLinks = {
    admin: [
      {
        to: "/admin/reset-password",
        label: "Reset",
        icon: <RotateCcwKey size={20} />,
      },
      { to: "/admin/create-user", label: "Create", icon: <Plus size={20} /> },
      {
        to: "/admin/college-config",
        label: "College",
        icon: <University size={20} />,
      },
    ],
    teacher: [
      {
        to: "/teacher/create-qr-code",
        label: "Create",
        icon: <QrCode size={20} />,
      },
      {
        to: "/teacher/attendance",
        label: "Attend",
        icon: <ClipboardList size={20} />,
      },
      {
        to: "/teacher/mark-attendance",
        label: "Mark",
        icon: <Highlighter size={20} />,
      },
    ],
    student: [
      {
        to: "/student/scan-qr-code",
        label: "Scan",
        icon: <QrCode size={20} />,
      },
      {
        to: "/student/leaderboard",
        label: "Rank",
        icon: <BarChart2 size={20} />,
      },
    ],
  };

  return (
    <>
      {isMobileSize ? (
        // Bottom Navigation for Mobile
        <nav className="fixed bottom-0 left-0 right-0 bg-orange-500 text-white flex justify-around items-center py-2 shadow-lg z-50">
          {commonLinks.map((link, i) => (
            <NavLink
              key={i}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-xs transition ${
                  isActive
                    ? "text-orange-400 bg-white rounded-t-lg px-3 py-1"
                    : "text-white"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}

          {roleLinks[userRole]?.map((link, i) => (
            <NavLink
              key={i}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-xs transition ${
                  isActive
                    ? "text-orange-400 bg-white rounded-t-lg px-3 py-1"
                    : "text-white"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}

          {/* Fixed Logout Button */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center text-xs text-white hover:text-orange-200 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      ) : (
        // Sidebar for Desktop
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
                <NavLink to="/teacher/attendance" className={getLinkClass}>
                  <ClipboardList size={18} /> Attendance
                </NavLink>

                <NavLink to="/teacher/mark-attendance" className={getLinkClass}>
                  <Highlighter size={18} /> Mark
                </NavLink>
              </>
            )}

            {userRole === "student" && (
              <>
                <NavLink to="/student/scan-qr-code" className={getLinkClass}>
                  <QrCode size={18} /> Scan QR Code
                </NavLink>
                <NavLink to="/student/leaderboard" className={getLinkClass}>
                  <BarChart2 size={18} /> Leaderboard
                </NavLink>
              </>
            )}

            {/* <NavLink to="/" className={getLinkClass}>
              <Settings size={18} /> Settings
            </NavLink> */}

            <button
              onClick={handleLogout}
              className={`${baseClass} ${normalClass}`}
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
