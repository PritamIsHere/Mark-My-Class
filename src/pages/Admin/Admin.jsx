import React, { useState } from "react";
import {
  Home,
  Users,
  GraduationCap,
  ClipboardList,
  BarChart2,
  Settings,
  Bell,
  Search,
  User,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../Context/AuthContext";

const Admin = () => {
  const { CurrentUser, userRole, fullLoading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white p-4 shadow border-b border-neutral-300 relative">
          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg w-80">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search students, classes..."
              className="bg-transparent focus:outline-none text-sm flex-1"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Notification */}
            <button className="relative">
              <Bell size={20} className="text-gray-700" />
            </button>

            {/* User Profile */}
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  <User size={18} />
                </div>
                <span className="font-medium text-gray-700">
                  {CurrentUser?.existuser?.name}
                </span>
              </div>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-50">
                  <h3 className="text-2xl font-semibold text-orange-600 border-b pb-2">
                    Profile
                  </h3>
                  <div className="mt-3 space-y-2">
                    <p className="text-lg text-gray-700">
                      <span className="font-semibold">Name: </span>
                      {CurrentUser?.existuser?.name}
                    </p>
                    <p className="text-lg text-gray-700">
                      <span className="font-semibold">Email: </span>
                      {CurrentUser?.existuser?.email}
                    </p>
                    <p className="text-lg text-gray-700">
                      <span className="font-semibold">Role: </span>
                      {CurrentUser?.existuser?.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 overflow-y-auto bg-gray-50">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-orange-500 transition">
              <h2 className="text-gray-500">Total Students</h2>
              <p className="text-3xl font-bold text-orange-600">1,245</p>
              <p className="text-sm text-gray-400 mt-1">
                Active students enrolled
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-orange-500 transition">
              <h2 className="text-gray-500">Total Classes</h2>
              <p className="text-3xl font-bold text-orange-600">35</p>
              <p className="text-sm text-gray-400 mt-1">
                Classes this semester
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-green-500 transition">
              <h2 className="text-gray-500">Today's Attendance</h2>
              <p className="text-3xl font-bold text-green-600">92%</p>
              <p className="text-sm text-gray-400 mt-1">
                Percentage of students present
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-red-500 transition">
              <h2 className="text-gray-500">Pending Approvals</h2>
              <p className="text-3xl font-bold text-red-600">12</p>
              <p className="text-sm text-gray-400 mt-1">
                Leaves awaiting approval
              </p>
            </div>
          </div>

          {/* Attendance Table */}
          {/* <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">
              Recent Attendance
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="p-3 font-medium">Student</th>
                  <th className="p-3 font-medium">Class</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">Arya Deb</td>
                  <td className="p-3">Math 101</td>
                  <td className="p-3 text-green-600 font-semibold">Present</td>
                  <td className="p-3">2025-09-15</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">Krishnendu Ghosh</td>
                  <td className="p-3">Physics 201</td>
                  <td className="p-3 text-red-600 font-semibold">Absent</td>
                  <td className="p-3">2025-09-15</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3">Ronit Shakhari</td>
                  <td className="p-3">Chemistry 101</td>
                  <td className="p-3 text-green-600 font-semibold">Present</td>
                  <td className="p-3">2025-09-15</td>
                </tr>
              </tbody>
            </table>
          </div> */}

          {/* Attendance Trend Chart Placeholder */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">
              Attendance Trend (Monthly)
            </h3>
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              [Chart Placeholder]
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
