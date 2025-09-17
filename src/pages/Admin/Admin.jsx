import React, { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../Context/AuthContext";
import MyChart from "../../components/Chart/Chart";

const Admin = () => {
  const { CurrentUser } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex flex-wrap items-center justify-between bg-white p-4 shadow border-b border-neutral-300 relative gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1 sm:w-80">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search students, classes..."
                className="bg-transparent focus:outline-none text-sm flex-1"
              />
            </div>

            {/* Mobile User Dropdown */}
            <div className="sm:hidden relative">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  <User size={18} />
                </div>
              </div>

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

          {/* Desktop User Menu */}
          <div className="hidden sm:flex items-center gap-6">
            <button className="relative">
              <Bell size={20} className="text-gray-700" />
            </button>

            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  <User size={18} />
                </div>
                <span className="font-medium text-gray-700 hidden sm:block">
                  {CurrentUser?.existuser?.name}
                </span>
              </div>

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
        <main className="p-4 sm:p-6 overflow-y-auto bg-gray-50">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-orange-500 transition">
              <h2 className="text-gray-500">Total Students</h2>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                1,245
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Active students enrolled
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-orange-500 transition">
              <h2 className="text-gray-500">Total Classes</h2>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                35
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Classes this semester
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-green-500 transition">
              <h2 className="text-gray-500">Today's Attendance</h2>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                92%
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Percentage of students present
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-red-500 transition">
              <h2 className="text-gray-500">Pending Approvals</h2>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">12</p>
              <p className="text-sm text-gray-400 mt-1">
                Leaves awaiting approval
              </p>
            </div>
          </div>

          {/* Attendance Chart */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-orange-600">
              Attendance Trend (Monthly)
            </h3>
            <div className="w-full h-64 sm:h-80">
              <MyChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
