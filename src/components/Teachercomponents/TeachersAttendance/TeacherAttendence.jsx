import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Sidebar/Sidebar";

const API_URL = "https://sih-2025-backend.onrender.com";
const orange = "#ff642a";

const styles = {
  container: {
    maxWidth: 900,
    margin: "auto",
    padding: "24px 12px",
    background: "#fff",
    border: `3px solid ${orange}`,
    borderRadius: 18,
    boxShadow: "0 8px 24px rgba(251,140,0,0.11)",
    fontFamily: "Inter,Arial,sans-serif",
    overflowX: "auto",
  },
  title: {
    color: orange,
    textAlign: "center",
    marginBottom: 18,
    fontWeight: 700,
    fontSize: "2em",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 16,
    fontSize: "1em",
    minWidth: "400px",
  },
  th: {
    background: orange,
    color: "#fff",
    fontWeight: 700,
    padding: "12px 6px",
    border: `2px solid ${orange}`,
    fontSize: "1em",
    letterSpacing: ".01em",
  },
  td: {
    background: "#fff",
    color: "#333",
    padding: "12px 6px",
    border: `1.5px solid ${orange}`,
    fontSize: "0.97em",
    textAlign: "center",
  },
  error: {
    color: "#e53935",
    textAlign: "center",
    marginTop: 10,
    fontWeight: 600,
  },
  "@media (max-width: 700px)": {
    container: { padding: 8, maxWidth: "99vw" },
    title: { fontSize: "1.3em" },
    th: { fontSize: "0.88em", padding: "8px 3px" },
    td: { fontSize: "0.87em", padding: "8px 3px" },
    table: { fontSize: "0.93em" },
  },
};

function responsiveStyle(obj) {
  return obj;
}

const TeacherAttendence = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const teacherId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/user/teacher/${teacherId}/attendance-stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(res.data.stats || []);
      } catch (err) {
        setError("Failed to fetch attendance stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [teacherId, token]);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div style={responsiveStyle(styles.container)}>
        <div style={responsiveStyle(styles.title)}>
          Teacher Attendance Stats
        </div>
        {loading ? (
          <p style={{ color: orange, textAlign: "center" }}>Loading...</p>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Session ID</th>
                  <th style={styles.th}>Class Name</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Total Marked</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr key={stat.sessionId}>
                    <td style={styles.td}>{stat.sessionId}</td>
                    <td style={styles.td}>{stat.className}</td>
                    <td style={styles.td}>
                      {new Date(stat.createdAt).toLocaleString()}
                    </td>
                    <td style={styles.td}>{stat.totalMarked}</td>
                    <td style={styles.td}>{stat.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendence;
