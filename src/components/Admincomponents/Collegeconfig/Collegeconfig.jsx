import React, { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../Context/AuthContext";
import toast from "react-hot-toast";

const CollegeConfig = () => {
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.target);
    const body = {
      collegeName: data.get("collegeName"),
      radiusMeters: Number(data.get("radiusMeters")),
    };

    try {
      const res = await axiosInstance.post("/admin/college-config", body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("College configuration saved successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save config");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full bg-gradient-to-br from-orange-100 to-white flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
            <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">
              College Configuration
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* College Name */}
              <div>
                <label className="block text-sm font-semibold text-orange-600">
                  College Name
                </label>
                <input
                  name="collegeName"
                  required
                  className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter college name"
                />
              </div>

              {/* Radius Meters */}
              <div>
                <label className="block text-sm font-semibold text-orange-600">
                  Radius (in meters)
                </label>
                <input
                  name="radiusMeters"
                  type="number"
                  min="1"
                  required
                  className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter radius e.g. 100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-2 rounded-xl shadow-md transition"
              >
                {loading ? "Saving..." : "Save Configuration"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeConfig;
