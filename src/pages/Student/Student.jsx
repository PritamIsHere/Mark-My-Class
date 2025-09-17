import { useAuth } from "../../Context/AuthContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import LoadingScreen from "../../components/Apploading/Loading";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Search, User, Bell } from "lucide-react";

const Student = () => {
  const { userRole, fullLoading, authToken, CurrentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState([]);
  const [subjectDetailsLoading, setSubjectDetailsLoading] = useState(false);
  const [subjectDetailsError, setSubjectDetailsError] = useState(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      if (!authToken || !CurrentUser) return;
      setApiLoading(true);
      setApiError(null);
      try {
        const studentId = CurrentUser?.existuser?._id;
        if (!studentId) throw new Error("Missing student id");

        const attendanceRes = await axiosInstance.get(
          `/user/student/${studentId}/attendance-summary`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setAttendanceData(attendanceRes.data?.summary || []);
      } catch (err) {
        setApiError(
          err?.response?.data?.message || err?.message || "Unknown error"
        );
      } finally {
        setApiLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, [authToken, CurrentUser]);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      if (!selectedSubject || !authToken || !CurrentUser) {
        setSubjectDetails([]);
        setSubjectDetailsError(null);
        setSubjectDetailsLoading(false);
        return;
      }
      setSubjectDetailsLoading(true);
      setSubjectDetailsError(null);
      try {
        const studentId = CurrentUser?.existuser?._id;
        const subjectName = selectedSubject.subjectName;
        if (!studentId || !subjectName)
          throw new Error("Missing student id or subject name");

        const res = await axiosInstance.get(
          `/user/student/${studentId}/attendance/${encodeURIComponent(
            subjectName
          )}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const details =
          res.data.details || res.data.attendance || res.data.records || [];
        setSubjectDetails(details);
      } catch (err) {
        setSubjectDetails([]);
        setSubjectDetailsError(
          err?.response?.data?.message || err?.message || "Unknown error"
        );
      } finally {
        setSubjectDetailsLoading(false);
      }
    };

    if (selectedSubject) fetchSubjectDetails();
  }, [selectedSubject, authToken, CurrentUser]);

  if (fullLoading || apiLoading) return <LoadingScreen />;

  const SubjectModal = ({ subject, onClose, details, loading, error }) => {
    if (!subject) return null;

    const getStatusColor = (status) => {
      if (!status) return "bg-gray-100 text-gray-700";
      const normalized = status.toLowerCase();
      if (normalized === "present") return "bg-green-100 text-green-700";
      if (normalized === "absent") return "bg-red-100 text-red-700";
      if (normalized === "leave" || normalized === "on leave")
        return "bg-yellow-100 text-yellow-700";
      return "bg-gray-100 text-gray-700";
    };

    const getOnlyDate = (dateStr) => {
      if (!dateStr) return "";
      const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
      return match ? match[0] : dateStr.split(" ")[0];
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-orange-600 text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
          <h4 className="text-lg sm:text-xl font-bold mb-4 text-orange-600 text-center">
            {subject.subjectName} Attendance Details
          </h4>
          <div className="overflow-y-auto max-h-72 sm:max-h-80">
            {loading ? (
              <div className="text-center py-6 text-orange-600 font-semibold">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-600 font-semibold">
                {error}
              </div>
            ) : (
              <table className="min-w-full text-sm bg-white border border-gray-200 rounded">
                <thead>
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-left font-bold text-orange-600 uppercase border-b">
                      Date
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left font-bold text-orange-600 uppercase border-b">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {details.length > 0 ? (
                    details.map((entry, idx) => (
                      <tr
                        key={entry.date + idx}
                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-3 sm:px-4 py-2 border-b text-gray-900">
                          {getOnlyDate(entry.date)}
                        </td>
                        <td className="px-3 sm:px-4 py-2 border-b">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                              entry.status
                            )}`}
                          >
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-3 sm:px-4 py-4 text-center text-gray-500"
                      >
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 overflow-y-auto">
        <header className="w-full bg-white p-4 shadow border-b border-neutral-300 relative flex flex-wrap items-center justify-between gap-4">
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

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-orange-600 tracking-tight text-center">
          Welcome to your Dashboard 👋
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">
          Glad to see you again! Here's a quick overview of your attendance and
          recent activity.
        </p>

        {/* Attendance Summary */}
        <div className="w-full max-w-3xl bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-orange-600">
            Attendance Summary
          </h3>
          {apiError ? (
            <div className="text-red-600 text-center py-4">{apiError}</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full text-xs sm:text-sm bg-white">
                  <thead>
                    <tr>
                      <th className="px-3 sm:px-6 py-3 bg-orange-50 text-left font-bold text-orange-600 uppercase">
                        Subject
                      </th>
                      <th className="px-3 sm:px-6 py-3 bg-orange-50 text-left font-bold text-orange-600 uppercase">
                        Total
                      </th>
                      <th className="px-3 sm:px-6 py-3 bg-orange-50 text-left font-bold text-orange-600 uppercase">
                        Presents
                      </th>
                      <th className="px-3 sm:px-6 py-3 bg-orange-50 text-left font-bold text-orange-600 uppercase">
                        Attendance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendanceData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-6 text-gray-500"
                        >
                          No attendance data found.
                        </td>
                      </tr>
                    ) : (
                      attendanceData.map((row, idx) => {
                        const subjectName =
                          row.subjectName || row.subject || "Unknown";
                        const totalClasses =
                          row.totalClasses ?? row.totalLectures ?? 0;
                        const presents =
                          row.totalPresents ?? row.presents ?? row.present ?? 0;
                        const percentage =
                          row.percentage !== undefined
                            ? row.percentage
                            : totalClasses
                            ? ((presents / totalClasses) * 100).toFixed(2)
                            : "0.00";

                        return (
                          <tr
                            key={subjectName}
                            className={`cursor-pointer transition hover:bg-orange-500/20 ${
                              idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                            onClick={() =>
                              setSelectedSubject({
                                subjectName,
                                totalClasses,
                                presents,
                                percentage,
                              })
                            }
                          >
                            <td className="px-3 sm:px-6 py-4 text-gray-900 font-medium">
                              {subjectName}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-gray-700">
                              {totalClasses}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-gray-700">
                              {presents}
                            </td>
                            <td className="px-3 sm:px-6 py-4 font-semibold">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                                  parseFloat(percentage) >= 75
                                    ? "bg-green-100 text-green-700"
                                    : parseFloat(percentage) >= 50
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {percentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedSubject && (
          <SubjectModal
            subject={selectedSubject}
            details={subjectDetails}
            loading={subjectDetailsLoading}
            error={subjectDetailsError}
            onClose={() => setSelectedSubject(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Student;
