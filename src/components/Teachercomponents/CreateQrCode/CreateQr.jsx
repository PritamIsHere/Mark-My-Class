import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://sih-2025-backend.onrender.com";
const orange = "#fb8c00";

const styles = {
  container: {
    maxWidth: 480,
    margin: "auto",
    padding: "24px 16px",
    background: "#fff",
    border: `3px solid ${orange}`,
    borderRadius: "18px",
    boxShadow: "0 8px 24px rgba(251,140,0,0.13)",
    fontFamily: "Inter,Arial,sans-serif",
  },
  title: {
    color: orange,
    textAlign: "center",
    marginBottom: 22,
    fontWeight: 700,
    fontSize: "2em",
    letterSpacing: ".02em",
  },
  label: {
    display: "block",
    color: orange,
    marginBottom: 4,
    fontWeight: 600,
    fontSize: "1em",
    marginTop: 10,
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: 18,
    border: `2px solid ${orange}`,
    borderRadius: 8,
    fontSize: "1em",
    background: "#fff",
    outline: "none",
    transition: "border 0.2s",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginBottom: 18,
    border: `2px solid ${orange}`,
    borderRadius: 8,
    fontSize: "1em",
    background: "#fff",
    outline: "none",
  },
  checkbox: {
    accentColor: orange,
    marginRight: 8,
  },
  button: {
    width: "100%",
    padding: "13px",
    background: orange,
    border: `2px solid ${orange}`,
    borderRadius: 9,
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.1em",
    letterSpacing: ".01em",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(251,140,0,0.08)",
    marginTop: 12,
    marginBottom: 8,
    transition: "background 0.18s",
  },
  locationBtn: {
    padding: "7px 15px",
    background: orange,
    border: "none",
    borderRadius: 7,
    color: "#fff",
    fontWeight: 600,
    marginLeft: 10,
    cursor: "pointer",
  },
  error: {
    color: "#e53935",
    textAlign: "center",
    marginTop: 10,
    fontWeight: 600,
  },
  qrSection: {
    marginTop: 30,
    textAlign: "center",
  },
  qrImage: {
    width: "210px",
    height: "210px",
    display: "block",
    margin: "18px auto",
    border: `3px solid ${orange}`,
    borderRadius: 14,
    background: "#fff",
  },
  sessionInfo: {
    background: "#fff3e0",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    fontSize: "0.95em",
    textAlign: "left",
    overflowX: "auto",
    border: `1.5px solid ${orange}`,
    boxShadow: "0 2px 8px rgba(251,140,0,0.09)",
  },
  "@media (max-width: 600px)": {
    container: { padding: 8, maxWidth: "99vw" },
    title: { fontSize: "1.3em" },
    qrImage: { width: "140px", height: "140px" },
    sessionInfo: { fontSize: "0.85em" },
  },
};

function responsiveStyle(obj) {
  return obj;
}

const CreateQr = () => {
  const [className, setClassName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [wifiCheckEnabled, setWifiCheckEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  const teacherId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (!teacherId) return;
        const res = await axios.get(
          `${API_URL}/user/teacher/${teacherId}/subjects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API returned subjects:", res.data.subjects); // Debug log
        setSubjects(res.data.subjects || []);

        // Auto-select first subject using _id
        if (res.data.subjects && res.data.subjects.length > 0) {
          setSubjectId(res.data.subjects[0]._id);
        } else {
          setError(
            "No subjects assigned. Please contact admin or add subjects for this teacher."
          );
        }
      } catch (err) {
        setError("Failed to fetch subjects. Please try again.");
      }
    };
    fetchSubjects();
  }, [teacherId, token]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          setError("Failed to get location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQrImage("");
    setSession(null);

    try {
      const res = await axios.post(
        `${API_URL}/session/create`,
        {
          className,
          subjectId,
          lat,
          lng,
          wifiCheckEnabled,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQrImage(res.data.qrImage);
      setSession(res.data.session);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create session. Make sure all fields are correct."
      );
    } finally {
      setLoading(false);
    }
  };

  const subjectSelectDisabled = subjects.length === 0;

  return (
    <div style={responsiveStyle(styles.container)}>
      <div style={responsiveStyle(styles.title)}>Create Session QR Code</div>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Class Name:</label>
        <input
          style={styles.input}
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
          placeholder="e.g. B.Sc CS 2nd Year"
        />

        <label style={styles.label}>Subject:</label>
        <select
          style={styles.select}
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          required
          disabled={subjectSelectDisabled}
        >
          <option value="">Select Subject</option>
          {/* Use _id and subjectName from backend */}
          {subjects.map((subj) => (
            <option key={subj._id} value={subj._id}>
              {subj.subjectName}
            </option>
          ))}
        </select>
        {subjectSelectDisabled && (
          <div style={styles.error}>
            No subjects available. Please ask the admin to assign subjects to your account.
          </div>
        )}

        <label style={styles.label}>Latitude:</label>
        <input
          style={styles.input}
          type="text"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Mandatory"
        />

        <label style={styles.label}>Longitude:</label>
        <input
          style={styles.input}
          type="text"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Mandatory"
        />
        <button
          type="button"
          onClick={handleGetLocation}
          style={styles.locationBtn}
        >
          Get Current Location
        </button>

        <div style={{ margin: "14px 0" }}>
          <input
            style={styles.checkbox}
            type="checkbox"
            checked={wifiCheckEnabled}
            onChange={(e) => setWifiCheckEnabled(e.target.checked)}
            id="wifiCheck"
          />
          <label htmlFor="wifiCheck" style={{ color: orange, fontWeight: 500 }}>
            Enable WiFi Check
          </label>
        </div>
        <button
          type="submit"
          style={styles.button}
          disabled={loading || subjectSelectDisabled}
        >
          {loading ? "Creating..." : "Generate QR Code"}
        </button>
      </form>
      {error && <div style={styles.error}>{error}</div>}
      {qrImage && (
        <div style={styles.qrSection}>
          <h3 style={{ color: orange }}>Session QR Code:</h3>
          <img
            src={qrImage}
            alt="QR Code"
            style={responsiveStyle(styles.qrImage)}
          />
          <div style={styles.sessionInfo}>
            <strong>Session Info:</strong>
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQr;