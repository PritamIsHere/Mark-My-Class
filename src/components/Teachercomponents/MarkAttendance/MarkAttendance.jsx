import { useState } from "react";
import toast from "react-hot-toast";
import { Highlighter } from "lucide-react";
import Sidebar from "../../Sidebar/Sidebar";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../Context/AuthContext";

const MarkAttendance = () => {
  const { authToken, CurrentUser } = useAuth();
  const teacherId = CurrentUser?.existuser?._id;

  const [formData, setFormData] = useState({
    studentEmail: "",
    sessionId: "",
  });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      teacherId,
      studentEmail: formData.studentEmail,
      sessionId: formData.sessionId,
    };

    try {
      const res = await axiosInstance.post("/user/teacher/mark", body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success(res?.data?.message || "Attendance marked successfully!");

      setSuccessData({
        studentEmail: formData.studentEmail,
        sessionId: formData.sessionId,
      });

      setFormData({ studentEmail: "", sessionId: "" });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to mark attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        <h1 className="flex items-center text-3xl font-bold text-orange-500 text-left mb-8 gap-3">
          <Highlighter size={30} /> Mark Attendance
        </h1>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="bg-white border border-orange-200 rounded-2xl shadow-2xs max-w-xl w-full">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-xl border border-orange-100 rounded-2xl p-8 space-y-6 w-full"
            >
              {/* Student Email */}
              <div>
                <label className="block text-sm font-semibold text-orange-600 mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="Enter student email"
                  className="w-full border border-orange-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                />
              </div>

              {/* Session ID */}
              <div>
                <label className="block text-sm font-semibold text-orange-600 mb-1">
                  Session ID
                </label>
                <input
                  type="text"
                  name="sessionId"
                  value={formData.sessionId}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="Enter session ID"
                  className="w-full border border-orange-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 transition text-white font-semibold px-6 py-3 rounded-lg w-full flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Marking Attendance...
                  </>
                ) : (
                  "Mark Attendance"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
