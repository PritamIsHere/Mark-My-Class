import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import { Html5Qrcode } from "html5-qrcode";
import { useAuth } from "../../../Context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
async function sendAttendance({ studentId, sessionId, lat, lng, authToken }) {
  try {
    const response = await axiosInstance.post(
      "/attendance/mark",
      {
        studentId,
        sessionId,
        lat,
        lng,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    // Re-throw original axios error so caller can access response.status and response.data
    throw error;
  }
}

// Try to extract a session id from various QR formats
function parseSessionId(raw) {
  if (!raw) return "";

  // 1) If it's JSON with a sessionId field
  try {
    const asJson = JSON.parse(raw);
    const candidates = [asJson.sessionId, asJson.sessionID, asJson.id];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  } catch (_) {}

  const text = String(raw).trim();

  // 2) If it's a URL, try last path segment or a query param named sessionId
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

  // 3) Otherwise return the raw text (prefer ObjectId-like token if present)
  const objectIdMatch = text.match(/[a-f0-9]{24}/i);
  if (objectIdMatch) return objectIdMatch[0];
  return text;
}

const ScanQr = () => {
  const [code, setCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const html5QrCodeRef = useRef(null);
  const qrRegionId = "qr-reader-region";

  // Take all essential data from useAuth
  const { CurrentUser, authToken } = useAuth();

  // Extract studentId from CurrentUser
  // Use CurrentUser.existuser._id as the primary source for studentId
  const studentId =
    CurrentUser?.existuser?._id ||
    CurrentUser?.studentId ||
    CurrentUser?._id ||
    "";

  // Helper to get location, returns a Promise
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject("Geolocation is not supported by your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          reject("Unable to retrieve your location." + err);
        }
      );
    });
  };

  // Get user's location when the component mounts
  useEffect(() => {
    setIsGettingLocation(true);
    getLocation()
      .then((loc) => {
        setLocation(loc);
        setLocationError("");
      })
      .catch((errMsg) => {
        setLocationError(errMsg);
        setLocation({ latitude: null, longitude: null });
        // Removed console.error
      })
      .finally(() => setIsGettingLocation(false));
  }, []);

  // Clean up the QR scanner when the component unmounts
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
      }
    };
  }, []);

  // Function to handle QR found and send data to backend
  // sessionId comes from QR (we parse common formats)
  const handleQrFound = async (sessionIdFromQr) => {
    const usedSessionId = parseSessionId(sessionIdFromQr);

    // Removed console.log for student id and QR code data

    if (!studentId) {
      setError("Student ID not found. Please log in again.");
      setScanResult("");
      // Removed console.error
      return;
    }
    if (!usedSessionId) {
      setScanResult("");
      // Removed console.error
      return;
    }

    setIsGettingLocation(true);
    let currentLocation = location;
    try {
      currentLocation = await getLocation();
      setLocation(currentLocation);
      setLocationError("");
    } catch (errMsg) {
      setLocationError(errMsg);
      setError("Location not available. Please allow location access.");
      setScanResult("");
      setIsGettingLocation(false);
      return;
    }
    setIsGettingLocation(false);

    if (
      !currentLocation ||
      currentLocation.latitude == null ||
      currentLocation.longitude == null
    ) {
      setError("Location not available. Please allow location access.");
      setScanResult("");
      return;
    }
    if (!authToken) {
      setError("Authentication token missing. Please log in again.");
      setScanResult("");
      return;
    }

    try {
      // Use axios to send attendance data
      const payload = {
        studentId,
        sessionId: usedSessionId,
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
      };

      const result = await sendAttendance({ ...payload, authToken });
      setScanResult(result?.message || "Attendance marked successfully!");
      setError("");
    } catch (err) {
      // Show only the `error` value from server when available
      const data = err?.response?.data;
      const serverMsg =
        typeof data === "string"
          ? data
          : data?.error ?? data?.message ?? err?.message ?? "Request failed";

      if (serverMsg) setError(serverMsg);
      setScanResult("");
    }
  };

  // Start scanning with the camera
  const startCameraScan = async () => {
    setError("");
    setScanResult("");
    setScanning(true);

    if (!Html5Qrcode.getCameras) {
      setError("Camera access is not supported on this device/browser.");
      setScanning(false);
      return;
    }

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setError("No camera found on this device.");
        setScanning(false);
        return;
      }

      // Try to select the main (back) camera on mobile devices
      let cameraId = cameras[0].id;
      // Prefer a camera with 'back' or 'environment' in its label, if available
      const backCamera = cameras.find(
        (cam) => cam.label && /back|environment/i.test(cam.label)
      );
      if (backCamera) {
        cameraId = backCamera.id;
      }

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
      }

      await html5QrCodeRef.current.start(
        { deviceId: { exact: cameraId } }, // Use deviceId for better compatibility
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            return { width: viewfinderWidth, height: viewfinderHeight };
          },
          // Explicitly request environment facing mode if possible
          facingMode: { exact: "environment" },
        },
        async (decodedText) => {
          setScanResult(decodedText);
          setCode(decodedText);
          await handleQrFound(decodedText);
          stopCameraScan();
        },
        () => {
          // Optionally handle scan errors here
        }
      );
    } catch (err) {
      setError("Unable to access camera: " + (err?.message || err));
      setScanning(false);
    }
  };

  // Stop scanning with the camera
  const stopCameraScan = async () => {
    setScanning(false);
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center text-orange-600">
          Scan QR Code
        </h2>

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center">
          {/* QR Scanner */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[70vh] bg-gray-200 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
            <div id={qrRegionId} className="w-full h-full" />
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center bg-gray-100/80 z-10 text-sm">
                Camera preview will appear here
              </div>
            )}
          </div>

          {/* Success/Error */}
          {scanResult && (
            <div className="mb-2 text-green-600 font-semibold text-center text-sm sm:text-base">
              {scanResult}
            </div>
          )}
          {error && (
            <div className="mb-2 text-red-600 font-semibold text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Start/Stop Button */}
          <div className="flex gap-2 w-full mt-2">
            {!scanning ? (
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full"
                onClick={startCameraScan}
                disabled={isGettingLocation}
              >
                {isGettingLocation
                  ? "Getting Location..."
                  : "Start Camera Scan"}
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

          {/* Manual Input */}
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
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-sm sm:text-base"
              placeholder="Enter QR code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isGettingLocation}
            />
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full"
              onClick={async () => await handleQrFound(code)}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? "Getting Location..." : "Submit"}
            </button>
          </div>

          {locationError && (
            <div className="mt-2 text-red-500 text-center text-sm">
              {locationError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanQr;
