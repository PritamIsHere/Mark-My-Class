import React, { useEffect, useRef, useState } from "react";
import { Bell, Search, User } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../Context/AuthContext";
import MyChart from "../../components/Chart/Chart";
import TeacherLinechart from "../../components/Chart/TeacherLinechart";

// Simple animated counter for mounting transitions
const CountUpNumber = ({ end = 0, duration = 1200 }) => {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    startTimeRef.current = null;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      const current = Math.round(eased * end);
      setValue(current);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return <>{value}</>;
};

const Teacher = () => {
  const { CurrentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const myClassesTarget = CurrentUser?.existuser?.subjects?.length ?? 0;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Content */}

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
        <main className="p-4 sm:p-6 overflow-y-auto h-screen bg-gray-50">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {/* Assigned Classes */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-orange-500 transition">
              <h2 className="text-gray-500">My Classes</h2>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                <CountUpNumber end={myClassesTarget} />
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Classes you are handling
              </p>
            </div>

            {/* Total Students */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-blue-500 transition">
              <h2 className="text-gray-500">My Students</h2>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                <CountUpNumber end={320} />
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Students enrolled under you
              </p>
            </div>

            {/* Attendance Taken */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-green-500 transition">
              <h2 className="text-gray-500">Attendance Today</h2>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                <CountUpNumber end={6} /> / <CountUpNumber end={8} />
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Classes where attendance taken
              </p>
            </div>

            {/* Pending Evaluations */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow hover:shadow-lg border-t-4 border-red-500 transition">
              <h2 className="text-gray-500">Pending Evaluations</h2>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">
                <CountUpNumber end={15} />
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Assignments/tests to grade
              </p>
            </div>
          </div>

          {/* Attendance Chart */}
          <div className="bg-white h-2/3 rounded-xl shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-orange-600">
              Attendance Trend 
            </h3>
            <div className="w-full h-64 sm:h-80">
              <TeacherLinechart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Teacher;
