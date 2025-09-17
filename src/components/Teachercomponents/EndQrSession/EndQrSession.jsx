import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://sih-2025-backend.onrender.com";
const orange = "#fb8c00";

const styles = {
  container: {
    maxWidth: 400,
    margin: "auto",
    padding: "20px 10px",
    background: "#fff",
    border: `3px solid ${orange}`,
    borderRadius: "17px",
    boxShadow: "0 6px 18px rgba(251,140,0,0.13)",
    fontFamily: "Inter,Arial,sans-serif",
  },
  title: {
    color: orange,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: 700,
    fontSize: "1.7em",
    letterSpacing: ".01em",
  },
  label: {
    display: "block",
    color: orange,
    marginBottom: 4,
    fontWeight: 600,
    marginTop: 8,
    fontSize: "1em",
  },
  input: {
    width: "100%",
    padding: "11px",
    marginBottom: 16,
    border: `2px solid ${orange}`,
    borderRadius: 8,
    fontSize: "1em",
    background: "#fff",
    outline: "none",
    transition: "border 0.2s",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: orange,
    border: `2px solid ${orange}`,
    borderRadius: 8,
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.08em",
    letterSpacing: ".01em",
    cursor: "pointer",
    boxShadow: "0 2px 7px rgba(251,140,0,0.10)",
    marginTop: 10,
    marginBottom: 8,
    transition: "background 0.18s",
  },
  error: {
    color: "#e53935",
    textAlign: "center",
    marginTop: 10,
    fontWeight: 600,
  },
  message: {
    color: orange,
    textAlign: "center",
    marginTop: 12,
    fontWeight: 700,
    background: "#fff3e0",
    borderRadius: 8,
    padding: "10px 8px",
    border: `1.5px solid ${orange}`,
  },
  sessionInfo: {
    background: "#fff3e0",
    borderRadius: 8,
    padding: "9px 7px",
    marginTop: 9,
    fontSize: "0.93em",
    textAlign: "left",
    overflowX: "auto",
    border: `1.5px solid ${orange}`,
    boxShadow: "0 2px 8px rgba(251,140,0,0.07)",
  },
  "@media (max-width: 500px)": {
    container: { padding: 6, maxWidth: "98vw" },
    title: { fontSize: "1.15em" },
    input: { fontSize: "0.95em" },
    button: { fontSize: "0.99em" },
    sessionInfo: { fontSize: "0.84em" },
  },
};

function responsiveStyle(obj) {
  return obj;
}

const EndQrSession = () => {
  const [sessionId, setSessionId] = useState("");
  const [message, setMessage] = useState("");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleEndSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setSession(null);

    try {
      const res = await axios.post(
        `${API_URL}/session/end`,
        { sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setSession(res.data.session);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to end session. Check the session ID."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={responsiveStyle(styles.container)}>
      <div style={responsiveStyle(styles.title)}>End QR Session</div>
      <form onSubmit={handleEndSession}>
        <label style={styles.label}>Session ID:</label>
        <input
          style={styles.input}
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          required
          placeholder="Enter Session ID"
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Ending..." : "End Session"}
        </button>
      </form>
      {error && <div style={styles.error}>{error}</div>}
      {message && (
        <div style={styles.message}>
          {message}
          {session && (
            <div style={styles.sessionInfo}>
              <strong>Session Info:</strong>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EndQrSession;