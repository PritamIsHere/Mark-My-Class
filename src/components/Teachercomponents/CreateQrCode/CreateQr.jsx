// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "../CSS/CreateQr.css";
// import Sidebar from "../../Sidebar/Sidebar";

// const API_URL = "https://sih-2025-backend.onrender.com";
// const orange = "#f97316";

// const CreateQr = () => {
// const [department, setDepartment] = useState("");
// const [subjectId, setSubjectId] = useState("");
// const [subjects, setSubjects] = useState([]);
// const [lat, setLat] = useState("");
// const [lng, setLng] = useState("");
// const [wifiCheckEnabled, setWifiCheckEnabled] = useState(false);
// const [loading, setLoading] = useState(false);
// const [qrImage, setQrImage] = useState("");
// const [session, setSession] = useState(null);
// const [error, setError] = useState("");
// const [locationLocked, setLocationLocked] = useState(false);
// const [modalVisible, setModalVisible] = useState(false);
// const [actionLoading, setActionLoading] = useState({
//   end: false,
//   delete: false,
// });
// const [actionMessage, setActionMessage] = useState({
//   end: "",
//   delete: "",
// });

// const qrRef = useRef(null);

// const teacherId = localStorage.getItem("userId");
// const token = localStorage.getItem("token");

// useEffect(() => {
//   const fetchSubjects = async () => {
//     try {
//       if (!teacherId) return;
//       const res = await axios.get(
//         `${API_URL}/user/teacher/${teacherId}/subjects`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       // console.log("API returned subjects:", res.data.subjects);
//       setSubjects(res.data.subjects || []);

//       // Auto-select first subject using _id
//       if (res.data.subjects && res.data.subjects.length > 0) {
//         setSubjectId(res.data.subjects[0]._id);
//         // Auto-set department from first subject
//         setDepartment(res.data.subjects[0].department || "");
//       } else {
//         setError(
//           "No subjects assigned. Please contact admin or add subjects for this teacher."
//         );
//       }
//     } catch (err) {
//       setError("Failed to fetch subjects. Please try again.");
//     }
//   };
//   fetchSubjects();
// }, [teacherId, token]);

// // Update department when subject changes
// useEffect(() => {
//   if (subjectId) {
//     const selectedSubject = subjects.find((s) => s._id === subjectId);
//     if (selectedSubject) {
//       setDepartment(selectedSubject.department || "");
//     }
//   }
// }, [subjectId, subjects]);

// const handleGetLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLat(position.coords.latitude);
//         setLng(position.coords.longitude);
//         setLocationLocked(true); // Lock the location fields
//       },
//       () => {
//         setError("Failed to get location.");
//       }
//     );
//   } else {
//     setError("Geolocation is not supported by this browser.");
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");
//   setQrImage("");
//   setSession(null);
//   setModalVisible(false);

//   try {
//     const res = await axios.post(
//       `${API_URL}/session/create`,
//       {
//         className: department, // Use department as className
//         subjectId,
//         lat,
//         lng,
//         wifiCheckEnabled,
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     setQrImage(res.data.qrImage);
//     setSession(res.data.session);
//     setModalVisible(true); // Show modal with QR code
//   } catch (err) {
//     setError(
//       err.response?.data?.message ||
//         "Failed to create session. Make sure all fields are correct."
//     );
//   } finally {
//     setLoading(false);
//   }
// };

// const handleEndSession = async () => {
//   if (!session?.sessionId) return;
//   setActionLoading({ ...actionLoading, end: true });
//   setActionMessage({ ...actionMessage, end: "" });

//   try {
//     const res = await axios.post(
//       `${API_URL}/session/end`,
//       { sessionId: session.sessionId },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setActionMessage({
//       ...actionMessage,
//       end: res.data.message || "Session ended successfully",
//     });
//     // Close modal after success
//     setTimeout(() => {
//       setModalVisible(false);
//       setQrImage("");
//       setSession(null);
//     }, 2000);
//   } catch (err) {
//     setActionMessage({
//       ...actionMessage,
//       end: err.response?.data?.message || "Failed to end session",
//     });
//   } finally {
//     setActionLoading({ ...actionLoading, end: false });
//   }
// };

// const handleDeleteSession = async () => {
//   if (!session?.sessionId) return;
//   setActionLoading({ ...actionLoading, delete: true });
//   setActionMessage({ ...actionMessage, delete: "" });

//   try {
//     const res = await axios.delete(`${API_URL}/session/delete`, {
//       headers: { Authorization: `Bearer ${token}` },
//       data: { sessionId: session.sessionId },
//     });
//     setActionMessage({
//       ...actionMessage,
//       delete: res.data.message || "Session deleted successfully",
//     });
//     // Close modal after success
//     setTimeout(() => {
//       setModalVisible(false);
//       setQrImage("");
//       setSession(null);
//     }, 2000);
//   } catch (err) {
//     setActionMessage({
//       ...actionMessage,
//       delete: err.response?.data?.message || "Failed to delete session",
//     });
//   } finally {
//     setActionLoading({ ...actionLoading, delete: false });
//   }
// };

// const shareQrCode = async () => {
//   if (!qrImage) return;

//   try {
//     // Convert base64 to blob
//     const fetchResponse = await fetch(qrImage);
//     const blob = await fetchResponse.blob();

//     // Create file from blob
//     const file = new File([blob], "session-qr.png", { type: "image/png" });

//     if (navigator.share) {
//       await navigator.share({
//         title: "Session QR Code",
//         text: "Scan this QR code to join the session",
//         files: [file],
//       });
//     } else {
//       // Fallback for browsers that don't support Web Share API
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "session-qr.png";
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     }
//   } catch (error) {
//     console.error("Error sharing QR code:", error);
//   }
// };

// const subjectSelectDisabled = subjects.length === 0;

// return (
// <div className="flex h-screen bg-white">
//   <Sidebar />
//   <div className="qr-container">
//     <h1 className="qr-title">Create Session QR Code</h1>
//     <form onSubmit={handleSubmit}>
//       {/* ✅ New Class Name field */}
//       <div className="form-group">
//         <label className="qr-label">Class Name:</label>
//         <input
//           className="qr-input"
//           type="text"
//           value={className}
//           onChange={(e) => setClassName(e.target.value)}
//           placeholder="Enter class name (e.g., BCA 2nd Year)"
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label className="qr-label">Department:</label>
//         <input
//           className="qr-input"
//           type="text"
//           value={department}
//           readOnly
//           placeholder="Department will be auto-filled"
//         />
//       </div>

//       <div className="form-group">
//         <label className="qr-label">Subject:</label>
//         <select
//           className="qr-select"
//           value={subjectId}
//           onChange={(e) => setSubjectId(e.target.value)}
//           required
//           disabled={subjectSelectDisabled}
//         >
//           <option value="">Select Subject</option>
//           {subjects.map((subj) => (
//             <option key={subj._id} value={subj._id}>
//               {subj.subjectName}
//             </option>
//           ))}
//         </select>
//         {subjectSelectDisabled && (
//           <div className="qr-error">
//             No subjects available. Please ask the admin to assign subjects.
//           </div>
//         )}
//       </div>

//       <div className="form-row">
//         <div className="form-group half">
//           <label className="qr-label">Latitude:</label>
//           <input
//             className="qr-input"
//             type="text"
//             value={lat}
//             onChange={(e) => !locationLocked && setLat(e.target.value)}
//             placeholder="Mandatory"
//             readOnly={locationLocked}
//           />
//         </div>
//         <div className="form-group half">
//           <label className="qr-label">Longitude:</label>
//           <input
//             className="qr-input"
//             type="text"
//             value={lng}
//             onChange={(e) => !locationLocked && setLng(e.target.value)}
//             placeholder="Mandatory"
//             readOnly={locationLocked}
//           />
//         </div>
//       </div>
//       <button
//         type="button"
//         onClick={handleGetLocation}
//         className="location-btn"
//         disabled={locationLocked}
//       >
//         {locationLocked ? "Location Locked" : "Get Current Location"}
//       </button>

//       <div className="checkbox-container">
//         <input
//           className="qr-checkbox"
//           type="checkbox"
//           checked={wifiCheckEnabled}
//           onChange={(e) => setWifiCheckEnabled(e.target.checked)}
//           id="wifiCheck"
//         />
//         <label htmlFor="wifiCheck" className="checkbox-label">
//           Enable WiFi Check
//         </label>
//       </div>

//       <div className="button-container">
//         <button
//           type="submit"
//           className="qr-button generate-btn"
//           disabled={loading || subjectSelectDisabled}
//         >
//           {loading ? "Creating..." : "Generate QR Code"}
//         </button>
//       </div>
//     </form>

//     {error && <div className="qr-error">{error}</div>}

//     {/* QR Code Modal */}
//     {modalVisible && qrImage && (
//       <div className="qr-modal-overlay">
//         <div className="qr-modal">
//           <button
//             className="close-modal"
//             onClick={() => setModalVisible(false)}
//           >
//             ×
//           </button>
//           <div className="qr-modal-content">
//             <h3>Session QR Code</h3>
//             <div className="qr-image-container">
//               <img
//                 ref={qrRef}
//                 src={qrImage}
//                 alt="QR Code"
//                 className="qr-image"
//               />
//               <button className="share-btn" onClick={shareQrCode}>
//                 <i className="fas fa-share-alt"></i> Share QR
//               </button>
//             </div>

//             {session && (
//               <div className="session-details">
//                 <h4>Session Details</h4>
//                 <div className="session-info-grid">
//                   <div className="info-item">
//                     <span className="info-label">Session ID:</span>
//                     <span className="info-value">{session.sessionId}</span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">Department:</span>
//                     <span className="info-value">{department}</span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">Status:</span>
//                     <span className="info-value active">Active</span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">WiFi Check:</span>
//                     <span className="info-value">
//                       {wifiCheckEnabled ? "Enabled" : "Disabled"}
//                     </span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">Location:</span>
//                     <span className="info-value">
//                       {lat}, {lng}
//                     </span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">Created:</span>
//                     <span className="info-value">
//                       {new Date().toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="action-buttons">
//                   <button
//                     className="action-btn end-btn"
//                     onClick={handleEndSession}
//                     disabled={actionLoading.end}
//                   >
//                     {actionLoading.end ? "Ending..." : "End Session"}
//                   </button>
//                   <button
//                     className="action-btn delete-btn"
//                     onClick={handleDeleteSession}
//                     disabled={actionLoading.delete}
//                   >
//                     {actionLoading.delete
//                       ? "Deleting..."
//                       : "Delete Session"}
//                   </button>
//                 </div>

//                 {actionMessage.end && (
//                   <div className="action-message">{actionMessage.end}</div>
//                 )}
//                 {actionMessage.delete && (
//                   <div className="action-message">
//                     {actionMessage.delete}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// </div>
//   );
// };

// export default CreateQr;

import { useState, useEffect, useRef } from "react";
import "../CSS/CreateQr.css";
import Sidebar from "../../Sidebar/Sidebar";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../Context/AuthContext";

import { Check, ClipboardCopy, Share2, X } from "lucide-react";
import toast from "react-hot-toast";

const CreateQr = () => {
  const [department, setDepartment] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [className, setClassName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [wifiCheckEnabled, setWifiCheckEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [locationLocked, setLocationLocked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [copying, setCopying] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    end: false,
    delete: false,
  });
  const [actionMessage, setActionMessage] = useState({
    end: "",
    delete: "",
  });

  useEffect(() => {
    actionMessage.delete = "";
    actionMessage.end = "";
  }, [actionMessage, setActionMessage]);

  const { authToken, CurrentUser } = useAuth();
  const qrRef = useRef(null);
  const teacherId = CurrentUser?.existuser?._id;

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (!teacherId) return;
        const res = await axiosInstance.get(
          `/user/teacher/${teacherId}/subjects`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setSubjects(res.data.subjects || []);

        if (res.data.subjects && res.data.subjects.length > 0) {
          setSubjectId(res.data.subjects[0]._id);
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
  }, [teacherId, authToken]);

  // Update Input filed selected subject's
  useEffect(() => {
    if (subjectId) {
      const selectedSubject = subjects.find((s) => s._id === subjectId);
      if (selectedSubject) {
        setDepartment(selectedSubject.department || "");
        setClassName(selectedSubject.subjectName || ""); // auto-fill class name
      }
    }
  }, [subjectId, subjects]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setLocationLocked(true);
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
      const res = await axiosInstance.post(
        `/session/create`,
        {
          className,
          subjectId,
          lat,
          lng,
          wifiCheckEnabled,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setQrImage(res.data.qrImage);
      setSession(res.data.session);
      setModalVisible(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create session. Make sure all fields are correct."
      );
    } finally {
      setLoading(false);
    }
  };

  //  End session
  const handleEndSession = async () => {
    if (!session?.sessionId) return;
    setActionLoading((prev) => ({ ...prev, end: true }));
    setActionMessage((prev) => ({ ...prev, end: "" }));

    try {
      const res = await axiosInstance.post(
        `/session/end`,
        { sessionId: session.sessionId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setActionMessage((prev) => ({
        ...prev,
        end: res.data.message || "Session ended successfully",
      }));
      setTimeout(() => {
        setModalVisible(false);
        setQrImage("");
        setSession(null);
      }, 500);
    } catch (err) {
      setActionMessage((prev) => ({
        ...prev,
        end: err.response?.data?.message || "Failed to end session",
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, end: false }));
    }
  };

  // Delete session
  const handleDeleteSession = async () => {
    if (!session?.sessionId) return;
    setActionLoading((prev) => ({ ...prev, delete: true }));
    setActionMessage((prev) => ({ ...prev, delete: "" }));

    try {
      const res = await axiosInstance.delete(`/session/delete`, {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { sessionId: session.sessionId },
      });
      setActionMessage((prev) => ({
        ...prev,
        delete: res.data.message || "Session deleted successfully",
      }));
      setTimeout(() => {
        setModalVisible(false);
        setQrImage("");
        setSession(null);
      }, 500);
    } catch (err) {
      setActionMessage((prev) => ({
        ...prev,
        delete: err.response?.data?.message || "Failed to delete session",
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  // Share QR
  const shareQrCode = async () => {
    if (!qrImage) return;

    try {
      const fetchResponse = await fetch(qrImage);
      const blob = await fetchResponse.blob();

      const file = new File([blob], "session-qr.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          title: "Session QR Code",
          text: "Scan this QR code to join the session",
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "session-qr.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  const handelCopyQr = async () => {
    if (!qrImage) return;

    try {
      setCopying(true);
      const response = await fetch(qrImage);
      const blob = await response.blob();
      const data = [new ClipboardItem({ [blob.type]: blob })];
      await navigator.clipboard.write(data);
      toast.success("Image copied to clipboard!");
    } catch (error) {
      toast.error("Copy failed — your browser may not support image copying.");
    } finally {
      setCopying(false);
    }
  };

  const subjectSelectDisabled = subjects.length === 0;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          Create Session QR Code
        </h1>

        {/* Form Card */}
        <div className="bg-white border border-orange-200 p-6 rounded-2xl shadow-lg max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Class Name (readonly) */}
            <div>
              <label className="block text-orange-500 font-medium mb-1">
                Class Name
              </label>
              <input
                type="text"
                value={className}
                readOnly
                placeholder="Class name will auto-fill from selected subject"
                className="w-full border border-orange-300 rounded-lg px-3 py-2 bg-orange-50 text-gray-600 cursor-auto outline-none"
              />
            </div>

            {/* Department (readonly) */}
            <div>
              <label className="block text-orange-500 font-medium mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                readOnly
                placeholder="Department will be auto-filled"
                className="w-full border border-orange-300 rounded-lg px-3 py-2 bg-orange-50 text-gray-600 cursor-auto outline-none"
              />
            </div>

            {/* Subject Select */}
            <div>
              <label className="block text-orange-500 font-medium mb-1">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
                disabled={subjectSelectDisabled || loading}
                className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none disabled:bg-orange-50"
              >
                <option value="">Select Subject</option>
                {subjects.map((subj) => (
                  <option key={subj._id} value={subj._id}>
                    {subj.subjectName}
                  </option>
                ))}
              </select>
              {subjectSelectDisabled && (
                <p className="text-red-500 text-sm mt-1">
                  No subjects available. Please ask the admin to assign
                  subjects.
                </p>
              )}
            </div>

            {/* Location Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-orange-500 font-medium mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  value={lat}
                  required
                  onChange={(e) => !locationLocked && setLat(e.target.value)}
                  placeholder="Mandatory"
                  readOnly={locationLocked}
                  className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-orange-500 font-medium mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  value={lng}
                  required
                  onChange={(e) => !locationLocked && setLng(e.target.value)}
                  placeholder="Mandatory"
                  readOnly={locationLocked}
                  className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Get Location Button */}
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLocked}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                locationLocked
                  ? "bg-orange-500/95 text-white cursor-default"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {locationLocked ? "Location Locked" : "Get Current Location"}
            </button>

            {/* WiFi Check */}
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => !loading && setWifiCheckEnabled(!wifiCheckEnabled)}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center rounded border transition-colors
          ${
            wifiCheckEnabled
              ? "bg-orange-500 border-orange-500 text-white"
              : "border-gray-400 text-transparent"
          }`}
              >
                {wifiCheckEnabled && <Check size={16} />}
              </div>
              <span
                className={`${
                  wifiCheckEnabled ? "text-orange-500" : "text-gray-500"
                }`}
              >
                Enable WiFi Check
              </span>
            </div>

            {/* Generate Button */}
            <button
              className="bg-orange-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Generate QR Code"
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </div>

        {/* QR Modal */}
        {modalVisible && qrImage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative border-t-4 border-orange-500">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-orange-600"
                onClick={() => setModalVisible(false)}
              >
                <X />
              </button>

              <h3 className="text-xl font-semibold mb-4 text-orange-600">
                Session QR Code
              </h3>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-4">
                <img
                  ref={qrRef}
                  src={qrImage}
                  alt="QR Code"
                  className="w-48 h-48 border border-orange-300 rounded-lg shadow-md"
                />

                <div className="flex items-center gap-3 justify-center">
                  <button
                    onClick={shareQrCode}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share QR</span>
                  </button>
                  <button
                    onClick={handelCopyQr}
                    title="Copy QR Code"
                    className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <ClipboardCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Session Details */}
              {session && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-gray-800">
                    Session Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Session ID:
                      </span>{" "}
                      {session.sessionId}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Class:</span>{" "}
                      {className}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Department:
                      </span>{" "}
                      {department}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>{" "}
                      <span className="text-green-600">Active</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        WiFi Check:
                      </span>{" "}
                      {wifiCheckEnabled ? "Enabled" : "Disabled"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Location:
                      </span>{" "}
                      {lat}, {lng}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Created:
                      </span>{" "}
                      {new Date().toLocaleString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={handleEndSession}
                      disabled={actionLoading.end || actionLoading.delete}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600/80 transition disabled:opacity-80 flex justify-between items-center gap-2"
                    >
                      {actionLoading.end ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Ending...
                        </>
                      ) : (
                        "End Session"
                      )}
                    </button>
                    <button
                      onClick={handleDeleteSession}
                      disabled={actionLoading.delete || actionLoading.end}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition disabled:opacity-70 flex justify-between items-center gap-2"
                    >
                      {actionLoading.delete ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete Session"
                      )}
                    </button>
                  </div>

                  {actionMessage.end && (
                    <p className="text-green-600 mt-2">{actionMessage.end}</p>
                  )}
                  {actionMessage.delete && (
                    <p className="text-red-600 mt-2">{actionMessage.delete}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQr;
