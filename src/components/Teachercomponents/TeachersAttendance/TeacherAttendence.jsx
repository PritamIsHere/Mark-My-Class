// import React, { useEffect, useState } from "react";
// import Sidebar from "../../Sidebar/Sidebar";
// import axiosInstance from "../../../api/axiosInstance";
// import { useAuth } from "../../../Context/AuthContext";

// const orange = "#ff642a";

// const styles = {
//   container: {
//     maxWidth: 900,
//     margin: "auto",
//     padding: "24px 12px",
//     background: "#fff",
//     border: `3px solid ${orange}`,
//     borderRadius: 18,
//     boxShadow: "0 8px 24px rgba(251,140,0,0.11)",
//     fontFamily: "Inter,Arial,sans-serif",
//     overflowX: "auto",
//   },
//   title: {
//     color: orange,
//     textAlign: "center",
//     marginBottom: 18,
//     fontWeight: 700,
//     fontSize: "2em",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     marginBottom: 16,
//     fontSize: "1em",
//     minWidth: "400px",
//   },
//   th: {
//     background: orange,
//     color: "#fff",
//     fontWeight: 700,
//     padding: "12px 6px",
//     border: `2px solid ${orange}`,
//     fontSize: "1em",
//     letterSpacing: ".01em",
//   },
//   td: {
//     background: "#fff",
//     color: "#333",
//     padding: "12px 6px",
//     border: `1.5px solid ${orange}`,
//     fontSize: "0.97em",
//     textAlign: "center",
//   },
//   error: {
//     color: "#e53935",
//     textAlign: "center",
//     marginTop: 10,
//     fontWeight: 600,
//   },
//   "@media (max-width: 700px)": {
//     container: { padding: 8, maxWidth: "99vw" },
//     title: { fontSize: "1.3em" },
//     th: { fontSize: "0.88em", padding: "8px 3px" },
//     td: { fontSize: "0.87em", padding: "8px 3px" },
//     table: { fontSize: "0.93em" },
//   },
// };

// function responsiveStyle(obj) {
//   return obj;
// }

// const TeacherAttendence = () => {
//   const [stats, setStats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { authToken, CurrentUser } = useAuth();
//   const teacherId = CurrentUser?.existuser?._id;

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await axiosInstance.get(
//           `/user/teacher/${teacherId}/attendance-stats`,
//           {
//             headers: { Authorization: `Bearer ${authToken}` },
//           }
//         );
//         setStats(res.data.stats || []);
//       } catch (err) {
//         setError("Failed to fetch attendance stats.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [teacherId, authToken]);

//   return (
//     <div className="flex h-screen bg-white">
//       <Sidebar />
//       <div style={responsiveStyle(styles.container)}>
//         <div style={responsiveStyle(styles.title)}>
//           Teacher Attendance Stats
//         </div>
//         {loading ? (
//           <p style={{ color: orange, textAlign: "center" }}>Loading...</p>
//         ) : error ? (
//           <div style={styles.error}>{error}</div>
//         ) : (
//           <div style={{ overflowX: "auto" }}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>Session ID</th>
//                   <th style={styles.th}>Class Name</th>
//                   <th style={styles.th}>Created At</th>
//                   <th style={styles.th}>Total Marked</th>
//                   <th style={styles.th}>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {stats.map((stat) => (
//                   <tr key={stat.sessionId}>
//                     <td style={styles.td}>{stat.sessionId}</td>
//                     <td style={styles.td}>{stat.className}</td>
//                     <td style={styles.td}>
//                       {new Date(stat.createdAt).toLocaleString()}
//                     </td>
//                     <td style={styles.td}>{stat.totalMarked}</td>
//                     <td style={styles.td}>{stat.status}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherAttendence;

import { useEffect, useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";

const TeacherAttendance = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken, CurrentUser } = useAuth();
  const teacherId = CurrentUser?.existuser?._id;

  const [error, setError] = useState("");

  // Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    type: "danger",
  });

  // --- API Actions ---
  const endSession = async (sessionId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/session/end`,
        { sessionId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success(res.data.message || "Session ended!");
      setStats((prev) =>
        prev.map((s) =>
          s.sessionId === sessionId ? { ...s, status: "inactive" } : s
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end session.");
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.delete(`/session/delete`, {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { sessionId },
      });
      toast.success(res.data.message || "Session deleted!");
      setStats((prev) => prev.filter((s) => s.sessionId !== sessionId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete session.");
    } finally {
      setLoading(false);
    }
  };

  // --- confirm handler ---
  const handleConfirm = () => {
    if (confirmAction) confirmAction();
    setConfirmOpen(false);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(
          `/user/teacher/${teacherId}/attendance-stats`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setStats(res.data.stats || []);
      } catch {
        setError("Failed to fetch attendance stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [teacherId, authToken]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          📊 Teacher Attendance Stats
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <p className="text-red-600 text-center font-semibold">{error}</p>
        ) : stats.length === 0 ? (
          <p className="text-gray-600 text-center">No attendance data found.</p>
        ) : (
          <div className="overflow-x-auto">
            {/* Table for md+ screens */}
            <table className="hidden md:table min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Session ID</th>
                  <th className="py-3 px-4 text-left">Class Name</th>
                  <th className="py-3 px-4 text-left">Created At</th>
                  <th className="py-3 px-4 text-center">Total Marked</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr
                    key={stat.sessionId}
                    className="border-b hover:bg-orange-50 transition-colors"
                  >
                    <td className="py-3 px-4">{stat.sessionId}</td>
                    <td className="py-3 px-4">{stat.className}</td>
                    <td className="py-3 px-4">
                      {new Date(stat.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {stat.totalMarked}
                    </td>
                    <td
                      className={`py-3 px-4 text-center font-bold ${
                        stat.status === "active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.status}
                    </td>
                    <td className="py-3 px-4 text-center flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setConfirmOpen(true);
                          setConfirmConfig({
                            title: "End Class",
                            message:
                              "Are you sure you want to end this session?",
                            type: "warning",
                          });
                          setConfirmAction(
                            () => () => endSession(stat.sessionId)
                          );
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md font-semibold transition"
                      >
                        End
                      </button>
                      <button
                        onClick={() => {
                          setConfirmOpen(true);
                          setConfirmConfig({
                            title: "Delete Class",
                            message:
                              "Are you sure you want to delete this session? This cannot be undone.",
                            type: "danger",
                          });
                          setConfirmAction(
                            () => () => deleteSession(stat.sessionId)
                          );
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-semibold transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* For Samll Screen device */}
            <div className="md:hidden space-y-4">
              {stats.map((stat) => (
                <div
                  key={stat.sessionId}
                  className="bg-white shadow rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">{stat.className}</h2>
                    <span
                      className={`text-sm font-bold ${
                        stat.status === "active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(stat.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Total Marked:</span>{" "}
                    {stat.totalMarked}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Session id:</span>{" "}
                    {stat.sessionId}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setConfirmOpen(true);
                        setConfirmConfig({
                          title: "End Class",
                          message: "Are you sure you want to end this session?",
                          type: "warning",
                        });
                        setConfirmAction(
                          () => () => endSession(stat.sessionId)
                        );
                      }}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md font-semibold transition"
                    >
                      End
                    </button>
                    <button
                      onClick={() => {
                        setConfirmOpen(true);
                        setConfirmConfig({
                          title: "Delete Class",
                          message:
                            "Are you sure you want to delete this session? This cannot be undone.",
                          type: "danger",
                        });
                        setConfirmAction(
                          () => () => deleteSession(stat.sessionId)
                        );
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default TeacherAttendance;
