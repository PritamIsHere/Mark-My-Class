import React, { useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import toast from "react-hot-toast";
import Sidebar from "../../Sidebar/Sidebar";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";

const MarkAttendance = () => {
  const { authToken } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    tempPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tempPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    const body = {
      email: formData.email,
      tempPassword: formData.tempPassword,
    };

    try {
      const res = await axiosInstance.post("/admin/reset-password", body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success(res?.data?.message);

      setSuccessData({
        email: formData.email,
        tempPassword: formData.tempPassword,
      });

      setFormData({
        email: "",
        tempPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to reset password");
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
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-orange-100">
            <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">
              Reset Password
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-orange-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="Enter your email"
                  className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Temp Password */}
              <div className="relative">
                <label className="block text-sm font-semibold text-orange-600">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="tempPassword"
                  value={formData.tempPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="Enter new password"
                  className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-9 text-gray-500 hover:text-orange-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-orange-600">
                  Re-enter New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="Re-enter new password"
                  className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Reset password */}
              <button
                className="bg-orange-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>

        {successData && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
              <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-green-600 mb-2">
                Password Reset Successful
              </h2>
              <p className="text-gray-700 mb-4">
                The new credentials for this user are
              </p>
              <div className="bg-gray-100 rounded-lg p-3 text-left mb-4">
                <p>
                  <span className="font-semibold text-gray-800">Email:</span>{" "}
                  {successData.email}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Temporary Password:
                  </span>{" "}
                  {successData.tempPassword}
                </p>
              </div>
              <button
                onClick={() => setSuccessData(null)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
