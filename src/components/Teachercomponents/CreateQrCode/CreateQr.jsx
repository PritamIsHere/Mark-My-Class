import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../CSS/CreateQr.css";

const API_URL = "https://sih-2025-backend.onrender.com";
const orange = "#f97316";

const CreateQr = () => {
  const [department, setDepartment] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [wifiCheckEnabled, setWifiCheckEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [locationLocked, setLocationLocked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    end: false,
    delete: false
  });
  const [actionMessage, setActionMessage] = useState({
    end: "",
    delete: ""
  });

  const qrRef = useRef(null);
  
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
          // Auto-set department from first subject
          setDepartment(res.data.subjects[0].department || "");
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

  // Update department when subject changes
  useEffect(() => {
    if (subjectId) {
      const selectedSubject = subjects.find(s => s._id === subjectId);
      if (selectedSubject) {
        setDepartment(selectedSubject.department || "");
      }
    }
  }, [subjectId, subjects]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setLocationLocked(true); // Lock the location fields
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
    setModalVisible(false);

    try {
      const res = await axios.post(
        `${API_URL}/session/create`,
        {
          className: department, // Use department as className
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
      setModalVisible(true); // Show modal with QR code
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create session. Make sure all fields are correct."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!session?.sessionId) return;
    setActionLoading({...actionLoading, end: true});
    setActionMessage({...actionMessage, end: ""});

    try {
      const res = await axios.post(
        `${API_URL}/session/end`,
        { sessionId: session.sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMessage({...actionMessage, end: res.data.message || "Session ended successfully"});
      // Close modal after success
      setTimeout(() => {
        setModalVisible(false);
        setQrImage("");
        setSession(null);
      }, 2000);
    } catch (err) {
      setActionMessage({
        ...actionMessage, 
        end: err.response?.data?.message || "Failed to end session"
      });
    } finally {
      setActionLoading({...actionLoading, end: false});
    }
  };

  const handleDeleteSession = async () => {
    if (!session?.sessionId) return;
    setActionLoading({...actionLoading, delete: true});
    setActionMessage({...actionMessage, delete: ""});

    try {
      const res = await axios.delete(`${API_URL}/session/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { sessionId: session.sessionId },
      });
      setActionMessage({...actionMessage, delete: res.data.message || "Session deleted successfully"});
      // Close modal after success
      setTimeout(() => {
        setModalVisible(false);
        setQrImage("");
        setSession(null);
      }, 2000);
    } catch (err) {
      setActionMessage({
        ...actionMessage, 
        delete: err.response?.data?.message || "Failed to delete session"
      });
    } finally {
      setActionLoading({...actionLoading, delete: false});
    }
  };

  const shareQrCode = async () => {
    if (!qrImage) return;
    
    try {
      // Convert base64 to blob
      const fetchResponse = await fetch(qrImage);
      const blob = await fetchResponse.blob();
      
      // Create file from blob
      const file = new File([blob], 'session-qr.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'Session QR Code',
          text: 'Scan this QR code to join the session',
          files: [file]
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'session-qr.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  const subjectSelectDisabled = subjects.length === 0;

  return (
    <div className="qr-container">
      <h1 className="qr-title">Create Session QR Code</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="qr-label">Department:</label>
          <input
            className="qr-input"
            type="text"
            value={department}
            readOnly
            placeholder="Department will be auto-filled"
          />
        </div>

        <div className="form-group">
          <label className="qr-label">Subject:</label>
          <select
            className="qr-select"
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
            <div className="qr-error">
              No subjects available. Please ask the admin to assign subjects to your account.
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label className="qr-label">Latitude:</label>
            <input
              className="qr-input"
              type="text"
              value={lat}
              onChange={(e) => !locationLocked && setLat(e.target.value)}
              placeholder="Mandatory"
              readOnly={locationLocked}
            />
          </div>
          <div className="form-group half">
            <label className="qr-label">Longitude:</label>
            <input
              className="qr-input"
              type="text"
              value={lng}
              onChange={(e) => !locationLocked && setLng(e.target.value)}
              placeholder="Mandatory"
              readOnly={locationLocked}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleGetLocation}
          className="location-btn"
          disabled={locationLocked}
        >
          {locationLocked ? "Location Locked" : "Get Current Location"}
        </button>

        <div className="checkbox-container">
          <input
            className="qr-checkbox"
            type="checkbox"
            checked={wifiCheckEnabled}
            onChange={(e) => setWifiCheckEnabled(e.target.checked)}
            id="wifiCheck"
          />
          <label htmlFor="wifiCheck" className="checkbox-label">
            Enable WiFi Check
          </label>
        </div>
        
        <div className="button-container">
          <button
            type="submit"
            className="qr-button generate-btn"
            disabled={loading || subjectSelectDisabled}
          >
            {loading ? "Creating..." : "Generate QR Code"}
          </button>
        </div>
      </form>
      
      {error && <div className="qr-error">{error}</div>}
      
      {/* QR Code Modal */}
      {modalVisible && qrImage && (
        <div className="qr-modal-overlay">
          <div className="qr-modal">
            <button className="close-modal" onClick={() => setModalVisible(false)}>×</button>
            <div className="qr-modal-content">
              <h3>Session QR Code</h3>
              <div className="qr-image-container">
                <img
                  ref={qrRef}
                  src={qrImage}
                  alt="QR Code"
                  className="qr-image"
                />
                <button className="share-btn" onClick={shareQrCode}>
                  <i className="fas fa-share-alt"></i> Share QR
                </button>
              </div>
              
              {session && (
                <div className="session-details">
                  <h4>Session Details</h4>
                  <div className="session-info-grid">
                    <div className="info-item">
                      <span className="info-label">Session ID:</span>
                      <span className="info-value">{session.sessionId}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Department:</span>
                      <span className="info-value">{department}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status:</span>
                      <span className="info-value active">Active</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">WiFi Check:</span>
                      <span className="info-value">{wifiCheckEnabled ? "Enabled" : "Disabled"}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{lat}, {lng}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Created:</span>
                      <span className="info-value">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      className="action-btn end-btn" 
                      onClick={handleEndSession}
                      disabled={actionLoading.end}
                    >
                      {actionLoading.end ? "Ending..." : "End Session"}
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      onClick={handleDeleteSession}
                      disabled={actionLoading.delete}
                    >
                      {actionLoading.delete ? "Deleting..." : "Delete Session"}
                    </button>
                  </div>
                  
                  {actionMessage.end && <div className="action-message">{actionMessage.end}</div>}
                  {actionMessage.delete && <div className="action-message">{actionMessage.delete}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQr;