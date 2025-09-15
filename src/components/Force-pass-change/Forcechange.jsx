import { useState } from "react";

import { useAuth } from "../../Context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function Forcechange({ userId, onClose }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axiosInstance.post("/auth/force-change-password", {
        userId,
        newPassword: formData.newPassword,
      });
      toast.success(`Password updated`);
      onClose();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-orange-600 hover:text-orange-800 text-xl font-bold"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-orange-600 text-center mb-4">
          Change Password
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Re-enter New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-orange-600 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
