// import React, { useState, useRef, useEffect } from "react";
// import Sidebar from "../../Sidebar/Sidebar";
// import { Html5Qrcode } from "html5-qrcode";
// import { useAuth } from "../../../Context/AuthContext";
// import axiosInstance from "../../../api/axiosInstance";
// import Sounds from "../../../assets/Sounds";
// import NotificationModal from "../../../components/Models/NotificationModal";

// // API call to mark attendance
// async function sendAttendance({ studentId, sessionId, lat, lng, authToken }) {
//   try {
//     const response = await axiosInstance.post(
//       "/attendance/mark",
//       { studentId, sessionId, lat, lng },
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }

// // Parse session ID from QR
// function parseSessionId(raw) {
//   if (!raw) return "";
//   try {
//     const asJson = JSON.parse(raw);
//     const candidates = [asJson.sessionId, asJson.sessionID, asJson.id];
//     for (const candidate of candidates) {
//       if (typeof candidate === "string" && candidate.trim()) {
//         return candidate.trim();
//       }
//     }
//   } catch (_) {}

//   const text = String(raw).trim();

//   try {
//     const url = new URL(text);
//     const fromQuery =
//       url.searchParams.get("sessionId") ||
//       url.searchParams.get("sessionID") ||
//       url.searchParams.get("id");
//     if (fromQuery && fromQuery.trim()) return fromQuery.trim();

//     const parts = url.pathname.split("/").filter(Boolean);
//     if (parts.length > 0) {
//       const last = parts[parts.length - 1];
//       if (last && last.trim()) return last.trim();
//     }
//   } catch (_) {}

//   const objectIdMatch = text.match(/[a-f0-9]{24}/i);
//   if (objectIdMatch) return objectIdMatch[0];
//   return text;
// }

// const ScanQr = () => {
//   const [code, setCode] = useState("");
//   const [scanning, setScanning] = useState(false);
//   const html5QrCodeRef = useRef(null);
//   const qrRegionId = "qr-reader-region";

//   const { CurrentUser, authToken } = useAuth();

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState("info");
//   const [modalMessage, setModalMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const studentId =
//     CurrentUser?.existuser?._id ||
//     CurrentUser?.studentId ||
//     CurrentUser?._id ||
//     "";

//   // Play success sound safely
//   const playSuccessSound = () => {
//     const audio = new Audio(Sounds.Success);
//     audio.play().catch(() => {}); // prevent autoplay errors
//   };

//   // Safe cleanup on unmount
//   useEffect(() => {
//     return () => {
//       stopCameraScan();
//     };
//   }, []);

//   // Get current location
//   const getLocation = () => {
//     return new Promise((resolve, reject) => {
//       if (!("geolocation" in navigator)) {
//         reject("Geolocation is not supported by your browser.");
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           resolve({
//             latitude: pos.coords.latitude,
//             longitude: pos.coords.longitude,
//           });
//         },
//         () => {
//           reject("Unable to retrieve your location. Please allow access.");
//         }
//       );
//     });
//   };

//   // Show modal helper
//   const showModal = (type, message) => {
//     setModalType(type);
//     setModalMessage(message);
//     setModalOpen(true);
//   };

//   // Handle QR code
//   const handleQrFound = async (sessionIdFromQr) => {
//     const usedSessionId = parseSessionId(sessionIdFromQr);

//     if (!studentId)
//       return showModal("error", "Student ID not found. Please log in again.");
//     if (!usedSessionId) return showModal("error", "Invalid QR code.");
//     if (!authToken)
//       return showModal(
//         "error",
//         "Authentication token missing. Please log in again."
//       );

//     // Get location
//     let currentLocation;
//     try {
//       setLoading(true);
//       currentLocation = await getLocation();
//     } catch (errMsg) {
//       setLoading(false);
//       return showModal("error", errMsg);
//     }

//     try {
//       const payload = {
//         studentId,
//         sessionId: usedSessionId,
//         lat: currentLocation.latitude,
//         lng: currentLocation.longitude,
//       };

//       const result = await sendAttendance({ ...payload, authToken });
//       showModal(
//         "success",
//         result?.message || "Attendance marked successfully!"
//       );
//       playSuccessSound();
//       stopCameraScan();
//     } catch (err) {
//       const data = err?.response?.data;
//       const serverMsg =
//         typeof data === "string"
//           ? data
//           : data?.error ?? data?.message ?? err?.message ?? "Request failed";
//       showModal("error", serverMsg);
//     } finally {
//       setLoading(false); // stop loading
//     }
//   };

//   // Start scanning
//   const startCameraScan = async () => {
//     setScanning(true);

//     try {
//       const cameras = await Html5Qrcode.getCameras();
//       if (!cameras || cameras.length === 0) {
//         showModal("error", "No camera found on this device.");
//         setScanning(false);
//         return;
//       }

//       let cameraId = cameras[0].id;
//       const backCamera = cameras.find(
//         (cam) => cam.label && /back|environment/i.test(cam.label)
//       );
//       if (backCamera) cameraId = backCamera.id;

//       if (!html5QrCodeRef.current) {
//         html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
//       } else {
//         await html5QrCodeRef.current.clear(); // clean previous instance
//       }

//       await html5QrCodeRef.current.start(
//         { deviceId: { exact: cameraId } },
//         { fps: 10, qrbox: { width: 250, height: 250 } },
//         async (decodedText) => {
//           await handleQrFound(decodedText);
//         }
//       );
//     } catch (err) {
//       showModal("error", "Unable to access camera: " + (err?.message || err));
//       setScanning(false);
//     }
//   };

//   // Stop scanning safely
//   const stopCameraScan = async () => {
//     if (!html5QrCodeRef.current) return;

//     try {
//       const isScanning = html5QrCodeRef.current.getState() === 2; // 2 = SCANNING
//       if (isScanning) {
//         await html5QrCodeRef.current.stop();
//       }
//       await html5QrCodeRef.current.clear();
//     } catch (err) {
//       console.error("Error stopping camera scan:", err);
//     } finally {
//       html5QrCodeRef.current = null;
//       setScanning(false);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">
//         <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center text-orange-600">
//           Scan QR Code
//         </h2>

//         <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center">
//           {/* QR Scanner */}
//           <div className="relative w-full h-[300px] sm:h-[400px] md:h-[70vh] bg-gray-200 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
//             <div id={qrRegionId} className="w-full h-full" />
//             {!scanning && (
//               <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center bg-gray-100/80 z-10 text-sm">
//                 Camera preview will appear here
//               </div>
//             )}
//           </div>

//           {/* Start/Stop Button */}
//           <div className="flex gap-2 w-full mt-2">
//             {!scanning ? (
//               <button
//                 className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full"
//                 onClick={startCameraScan}
//               >
//                 Start Camera Scan
//               </button>
//             ) : (
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition w-full"
//                 onClick={stopCameraScan}
//               >
//                 Stop Scan
//               </button>
//             )}
//           </div>

//           {/* Manual Input */}
//           <div className="mt-6 w-full">
//             <label
//               className="block text-gray-700 mb-2 text-sm"
//               htmlFor="manual-qr"
//             >
//               Or enter QR code manually:
//             </label>
//             <input
//               id="manual-qr"
//               type="text"
//               className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-sm sm:text-base outline-orange-400"
//               placeholder="Enter QR code"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//             />
//             <button
//               className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={async () => await handleQrFound(code)}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Processing...
//                 </>
//               ) : (
//                 "Submit"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Notification Modal */}
//       <NotificationModal
//         open={modalOpen}
//         type={modalType}
//         message={modalMessage}
//         onClose={() => setModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default ScanQr;

// import React, { useState, useRef, useEffect } from "react";
// import Sidebar from "../../Sidebar/Sidebar";
// import { Html5Qrcode } from "html5-qrcode";
// import { useAuth } from "../../../Context/AuthContext";
// import axiosInstance from "../../../api/axiosInstance";
// import Sounds from "../../../assets/Sounds";
// import NotificationModal from "../../../components/Models/NotificationModal";

// // API call to mark attendance
// async function sendAttendance({
//   studentId,
//   sessionId,
//   lat,
//   lng,
//   liveImage,
//   authToken,
// }) {
//   try {
//     const response = await axiosInstance.post(
//       "/attendance/mark",
//       { studentId, sessionId, lat, lng, liveImage },
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }

// // Parse session ID from QR
// function parseSessionId(raw) {
//   if (!raw) return "";
//   try {
//     const asJson = JSON.parse(raw);
//     const candidates = [asJson.sessionId, asJson.sessionID, asJson.id];
//     for (const candidate of candidates) {
//       if (typeof candidate === "string" && candidate.trim()) {
//         return candidate.trim();
//       }
//     }
//   } catch (_) {}

//   const text = String(raw).trim();

//   try {
//     const url = new URL(text);
//     const fromQuery =
//       url.searchParams.get("sessionId") ||
//       url.searchParams.get("sessionID") ||
//       url.searchParams.get("id");
//     if (fromQuery && fromQuery.trim()) return fromQuery.trim();

//     const parts = url.pathname.split("/").filter(Boolean);
//     if (parts.length > 0) {
//       const last = parts[parts.length - 1];
//       if (last && last.trim()) return last.trim();
//     }
//   } catch (_) {}

//   const objectIdMatch = text.match(/[a-f0-9]{24}/i);
//   if (objectIdMatch) return objectIdMatch[0];
//   return text;
// }

// const ScanQr = () => {
//   const [code, setCode] = useState("");
//   const [scanning, setScanning] = useState(false);
//   const [cameraOpen, setCameraOpen] = useState(false);
//   const html5QrCodeRef = useRef(null);
//   const qrRegionId = "qr-reader-region";

//   const { CurrentUser, authToken } = useAuth();

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState("info");
//   const [modalMessage, setModalMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const studentId =
//     CurrentUser?.existuser?._id ||
//     CurrentUser?.studentId ||
//     CurrentUser?._id ||
//     "";

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [sessionIdForCapture, setSessionIdForCapture] = useState("");

//   // Play success sound safely
//   const playSuccessSound = () => {
//     const audio = new Audio(Sounds.Success);
//     audio.play().catch(() => {});
//   };

//   useEffect(() => {
//     return () => {
//       stopCameraScan();
//     };
//   }, []);

//   const getLocation = () => {
//     return new Promise((resolve, reject) => {
//       if (!("geolocation" in navigator)) {
//         reject("Geolocation is not supported by your browser.");
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           resolve({
//             latitude: pos.coords.latitude,
//             longitude: pos.coords.longitude,
//           });
//         },
//         () => {
//           reject("Unable to retrieve your location. Please allow access.");
//         }
//       );
//     });
//   };

//   const showModal = (type, message) => {
//     setModalType(type);
//     setModalMessage(message);
//     setModalOpen(true);
//   };

//   const handleQrFound = async (sessionIdFromQr) => {
//     const usedSessionId = parseSessionId(sessionIdFromQr);
//     if (!studentId)
//       return showModal("error", "Student ID not found. Please log in again.");
//     if (!usedSessionId) return showModal("error", "Invalid QR code.");
//     if (!authToken)
//       return showModal(
//         "error",
//         "Authentication token missing. Please log in again."
//       );

//     // Open camera for live capture
//     setSessionIdForCapture(usedSessionId);
//     openFrontCamera();
//   };

//   // Camera for live capture
//   const openFrontCamera = async () => {
//     // Stop QR scanner first
//     await stopCameraScan();

//     setCameraOpen(true);
//     setCapturedImage(null);

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user" },
//       });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } catch (err) {
//       showModal(
//         "error",
//         "Unable to access front camera: " + (err?.message || err)
//       );
//       setCameraOpen(false);
//     }
//   };

//   // const captureImage = () => {
//   //   if (!videoRef.current || !canvasRef.current) return;
//   //   const video = videoRef.current;
//   //   const canvas = canvasRef.current;
//   //   canvas.width = video.videoWidth;
//   //   canvas.height = video.videoHeight;
//   //   const ctx = canvas.getContext("2d");
//   //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//   //   const imgData = canvas.toDataURL("image/jpeg");
//   //   setCapturedImage(imgData);
//   // };

//   const captureImage = () => {
//     if (!videoRef.current || !canvasRef.current) return;
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext("2d");

//     // Flip horizontally back for actual face
//     ctx.translate(canvas.width, 0);
//     ctx.scale(-1, 1);
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform

//     const imgData = canvas.toDataURL("image/jpeg");
//     setCapturedImage(imgData);
//   };

//   const submitWithImage = async () => {
//     if (!capturedImage)
//       return showModal("error", "Please capture image first.");
//     setLoading(true);

//     let currentLocation;
//     try {
//       currentLocation = await getLocation();
//     } catch (errMsg) {
//       setLoading(false);
//       return showModal("error", errMsg);
//     }

//     try {
//       const payload = {
//         studentId,
//         sessionId: sessionIdForCapture,
//         lat: currentLocation.latitude,
//         lng: currentLocation.longitude,
//         liveImage: capturedImage,
//       };
//       const result = await sendAttendance({ ...payload, authToken });
//       showModal(
//         "success",
//         result?.message || "Attendance marked successfully!"
//       );
//       playSuccessSound();
//     } catch (err) {
//       const data = err?.response?.data;
//       const serverMsg =
//         typeof data === "string"
//           ? data
//           : data?.error ?? data?.message ?? err?.message ?? "Request failed";
//       showModal("error", serverMsg);
//     } finally {
//       stopFrontCamera();
//       setLoading(false);
//     }
//   };

//   const stopFrontCamera = () => {
//     setCameraOpen(false);
//     setCapturedImage(null);
//     if (videoRef.current?.srcObject) {
//       const tracks = videoRef.current.srcObject.getTracks();
//       tracks.forEach((t) => t.stop());
//     }
//     videoRef.current.srcObject = null;
//   };

//   // Start scanning
//   const startCameraScan = async () => {
//     setScanning(true);

//     try {
//       const cameras = await Html5Qrcode.getCameras();
//       if (!cameras || cameras.length === 0) {
//         showModal("error", "No camera found on this device.");
//         setScanning(false);
//         return;
//       }

//       let cameraId = cameras[0].id;
//       const backCamera = cameras.find(
//         (cam) => cam.label && /back|environment/i.test(cam.label)
//       );
//       if (backCamera) cameraId = backCamera.id;

//       if (!html5QrCodeRef.current) {
//         html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
//       } else {
//         await html5QrCodeRef.current.clear();
//       }

//       await html5QrCodeRef.current.start(
//         { deviceId: { exact: cameraId } },
//         { fps: 10, qrbox: { width: 250, height: 250 } },
//         async (decodedText) => {
//           await handleQrFound(decodedText);
//         }
//       );
//     } catch (err) {
//       showModal("error", "Unable to access camera: " + (err?.message || err));
//       setScanning(false);
//     }
//   };

//   const stopCameraScan = async () => {
//     if (!html5QrCodeRef.current) return;

//     try {
//       const isScanning = html5QrCodeRef.current.getState() === 2;
//       if (isScanning) {
//         await html5QrCodeRef.current.stop();
//       }
//       await html5QrCodeRef.current.clear();
//     } catch (err) {
//       console.error("Error stopping camera scan:", err);
//     } finally {
//       html5QrCodeRef.current = null;
//       setScanning(false);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">
//         <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center text-orange-600">
//           Scan QR Code
//         </h2>

//         <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center">
//           <div className="relative w-full h-[300px] sm:h-[400px] md:h-[70vh] bg-gray-200 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
//             <div id={qrRegionId} className="w-full h-full" />
//             {!scanning && (
//               <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center bg-gray-100/80 z-10 text-sm">
//                 Camera preview will appear here
//               </div>
//             )}
//           </div>

//           <div className="flex gap-2 w-full mt-2">
//             {!scanning ? (
//               <button
//                 className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full"
//                 onClick={startCameraScan}
//               >
//                 Start Camera Scan
//               </button>
//             ) : (
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition w-full"
//                 onClick={stopCameraScan}
//               >
//                 Stop Scan
//               </button>
//             )}
//           </div>

//           <div className="mt-6 w-full">
//             <label
//               className="block text-gray-700 mb-2 text-sm"
//               htmlFor="manual-qr"
//             >
//               Or enter QR code manually:
//             </label>
//             <input
//               id="manual-qr"
//               type="text"
//               className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-sm sm:text-base outline-orange-400"
//               placeholder="Enter QR code"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//             />
//             <button
//               className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={async () => await handleQrFound(code)}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Processing...
//                 </>
//               ) : (
//                 "Submit"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Front Camera Modal */}
//       {/* Front Camera Modal */}
//       {cameraOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2">
//           <div className="relative w-full max-w-lg bg-white rounded-xl p-4 flex flex-col items-center">
//             {/* Video stream */}
//             {!capturedImage && (
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 className="w-full h-auto rounded-lg object-cover"
//                 style={{ maxHeight: "70vh", transform: "scaleX(-1)" }} // mirror for user
//               />
//             )}

//             {/* Hidden canvas */}
//             <canvas ref={canvasRef} className="hidden" />

//             {!capturedImage ? (
//               // Capture button
//               <button
//                 onClick={captureImage}
//                 className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full sm:w-1/2"
//               >
//                 Capture Image
//               </button>
//             ) : (
//               <div className="w-full relative flex flex-col items-center">
//                 {/* Captured Image */}
//                 <img
//                   src={capturedImage}
//                   alt="Captured"
//                   className="w-full rounded-lg object-cover max-h-[70vh]"
//                 />
//                 {/* Cross button to discard */}
//                 <button
//                   onClick={() => setCapturedImage(null)}
//                   className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
//                 >
//                   ×
//                 </button>
//                 {/* Submit button */}
//                 <button
//                   onClick={submitWithImage}
//                   className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full sm:w-1/2"
//                   disabled={loading}
//                 >
//                   {loading ? "Submitting..." : "Submit Attendance"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <NotificationModal
//         open={modalOpen}
//         type={modalType}
//         message={modalMessage}
//         onClose={() => setModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default ScanQr;

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import { Html5Qrcode } from "html5-qrcode";
import { useAuth } from "../../../Context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import Sounds from "../../../assets/Sounds";
import NotificationModal from "../../../components/Models/NotificationModal";

async function sendAttendance({
  studentId,
  sessionId,
  lat,
  lng,
  liveImage,
  authToken,
}) {
  try {
    const response = await axiosInstance.post(
      "/attendance/mark",
      { studentId, sessionId, lat, lng, liveImage },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

function parseSessionId(raw) {
  if (!raw) return "";
  try {
    const asJson = JSON.parse(raw);
    const candidates = [asJson.sessionId, asJson.sessionID, asJson.id];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim())
        return candidate.trim();
    }
  } catch (_) {}

  const text = String(raw).trim();
  try {
    const url = new URL(text);
    const fromQuery =
      url.searchParams.get("sessionId") ||
      url.searchParams.get("sessionID") ||
      url.searchParams.get("id");
    if (fromQuery && fromQuery.trim()) return fromQuery.trim();
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length > 0) {
      const last = parts[parts.length - 1];
      if (last && last.trim()) return last.trim();
    }
  } catch (_) {}

  const objectIdMatch = text.match(/[a-f0-9]{24}/i);
  if (objectIdMatch) return objectIdMatch[0];
  return text;
}

const ScanQr = () => {
  const [code, setCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const html5QrCodeRef = useRef(null);
  const qrRegionId = "qr-reader-region";

  const { CurrentUser, authToken } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const studentId =
    CurrentUser?.existuser?._id ||
    CurrentUser?.studentId ||
    CurrentUser?._id ||
    "";

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [sessionIdForCapture, setSessionIdForCapture] = useState("");

  const playSuccessSound = () => {
    const audio = new Audio(Sounds.Success);
    audio.play().catch(() => {});
  };

  useEffect(() => {
    return () => stopCameraScan();
  }, []);

  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!("geolocation" in navigator))
        return reject("Geolocation not supported.");
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () => reject("Unable to retrieve location. Allow location access.")
      );
    });

  const showModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleQrFound = async (sessionIdFromQr) => {
    const usedSessionId = parseSessionId(sessionIdFromQr);
    if (!studentId)
      return showModal("error", "Student ID not found. Log in again.");
    if (!usedSessionId) return showModal("error", "Invalid QR code.");
    if (!authToken)
      return showModal("error", "Auth token missing. Log in again.");

    setSessionIdForCapture(usedSessionId);
    openFrontCamera();
  };

  const openFrontCamera = async () => {
    // Stop QR scanner first
    await stopCameraScan();

    setCameraOpen(true);
    setCapturedImage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      showModal(
        "error",
        "Unable to access front camera: " + (err?.message || err)
      );
      setCameraOpen(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    // Flip horizontally to show actual face
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const imgData = canvas.toDataURL("image/jpeg");
    setCapturedImage(imgData);
  };

  const submitWithImage = async () => {
    // Prevent sending empty or invalid image
    if (!capturedImage || !capturedImage.startsWith("data:image")) {
      return showModal(
        "error",
        "Please capture a valid image before submitting."
      );
    }

    setLoading(true);

    let currentLocation;
    try {
      currentLocation = await getLocation();
    } catch (errMsg) {
      setLoading(false);
      return showModal("error", errMsg);
    }

    try {
      const payload = {
        studentId,
        sessionId: sessionIdForCapture,
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
        liveImage: capturedImage,
      };

      const result = await sendAttendance({ ...payload, authToken });

      showModal(
        "success",
        result?.message || "Attendance marked successfully!"
      );
      playSuccessSound();
    } catch (err) {
      const data = err?.response?.data;
      const serverMsg =
        typeof data === "string"
          ? data
          : data?.error ?? data?.message ?? err?.message ?? "Request failed";
      showModal("error", serverMsg);
    } finally {
      stopFrontCamera(); // Stop camera after submission
      setLoading(false);
    }
  };

  // const stopFrontCamera = () => {
  //   setCameraOpen(false);
  //   setCapturedImage(null);
  //   if (videoRef.current?.srcObject) {
  //     const tracks = videoRef.current.srcObject.getTracks();
  //     tracks.forEach((t) => t.stop());
  //   }
  //   if (videoRef.current) videoRef.current.srcObject = null;
  // };

  const stopFrontCamera = () => {
    setCameraOpen(false);
    setCapturedImage(null);

    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }

    if (videoRef.current) videoRef.current.srcObject = null;

    // Stop QR scanner if running (optional safety)
    stopCameraScan();
  };

  const startCameraScan = async () => {
    // Stop front camera first
    stopFrontCamera();

    setScanning(true);
    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras?.length)
        return (
          showModal("error", "No camera found on this device."),
          setScanning(false)
        );

      let cameraId = cameras[0].id;
      const backCamera = cameras.find(
        (cam) => cam.label && /back|environment/i.test(cam.label)
      );
      if (backCamera) cameraId = backCamera.id;

      if (!html5QrCodeRef.current)
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
      else await html5QrCodeRef.current.clear();

      await html5QrCodeRef.current.start(
        { deviceId: { exact: cameraId } },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => await handleQrFound(decodedText)
      );
    } catch (err) {
      showModal("error", "Unable to access camera: " + (err?.message || err));
      setScanning(false);
    }
  };

  const stopCameraScan = async () => {
    if (!html5QrCodeRef.current) return;
    try {
      const isScanning = html5QrCodeRef.current.getState() === 2;
      if (isScanning) await html5QrCodeRef.current.stop();
      await html5QrCodeRef.current.clear();
    } catch (err) {
      console.error("Error stopping camera scan:", err);
    } finally {
      html5QrCodeRef.current = null;
      setScanning(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center text-orange-600">
          Scan QR Code
        </h2>

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[70vh] bg-gray-200 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
            <div id={qrRegionId} className="w-full h-full" />
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center bg-gray-100/80 z-10 text-sm">
                Camera preview will appear here
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full mt-2">
            {!scanning ? (
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full"
                onClick={startCameraScan}
              >
                Start Camera Scan
              </button>
            ) : (
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition w-full"
                onClick={stopCameraScan}
              >
                Stop Scan
              </button>
            )}
          </div>

          <div className="mt-6 w-full">
            <label
              className="block text-gray-700 mb-2 text-sm"
              htmlFor="manual-qr"
            >
              Or enter QR code manually:
            </label>
            <input
              id="manual-qr"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-sm sm:text-base outline-orange-400"
              placeholder="Enter QR code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={async () => await handleQrFound(code)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>

      {cameraOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2"
          onClick={(e) => {
            // Close modal if clicked outside
            if (e.target === e.currentTarget) stopFrontCamera();
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-xl p-4 flex flex-col items-center">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto rounded-lg object-cover"
                style={{ maxHeight: "70vh", transform: "scaleX(-1)" }}
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full rounded-lg object-cover max-h-[70vh]"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />

            {!capturedImage ? (
              <button
                onClick={captureImage}
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full sm:w-1/2"
              >
                Capture Image
              </button>
            ) : (
              <div className="w-full relative flex flex-col items-center mt-4">
                {/* Cross button to discard captured image */}
                <button
                  onClick={() => setCapturedImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>

                {/* Submit button disabled until a valid image exists */}
                <button
                  onClick={submitWithImage}
                  className={`mt-4 px-4 py-2 rounded-lg transition w-full sm:w-1/2 ${
                    capturedImage && capturedImage.startsWith("data:image")
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={
                    !capturedImage ||
                    !capturedImage.startsWith("data:image") ||
                    loading
                  }
                >
                  {loading ? "Submitting..." : "Submit Attendance"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <NotificationModal
        open={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ScanQr;
