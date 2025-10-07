import { useState } from "react";
import toast from "react-hot-toast";
import { Highlighter, CheckCircle2 } from "lucide-react";
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
      const res = await axiosInstance.post("/attendance/teacher/mark", body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      toast.success("Attendance marked successfully!");
      setSuccessData(res?.data);
      // setFormData({ studentEmail: "", sessionId: "" });
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Attendance already marked for this student");
      } else if (error.response?.status === 403) {
        toast.error("Invalid teacher");
      } else if (error.response?.status === 404) {
        toast.error("Session not found");
      } else {
        toast.error("Student not found");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
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

              {/* Mark Button */}
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
      {/* Success Modal */}
      {successData && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Attendance Marked Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Attendance has been marked successfully for{" "}
              <b>{successData.student}</b>
            </p>

            <div className="bg-gray-100 rounded-lg p-4 text-left mb-4">
              <p>
                <span className="font-semibold text-gray-800">Student:</span>{" "}
                {successData.student}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                {formData.studentEmail}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Session ID:</span>{" "}
                {successData.sessionId}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Teacher:</span>{" "}
                {successData.teacher}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Time:</span>{" "}
                {new Date(successData.time).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => setSuccessData(null)}
              className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
