import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Forcechange from "../../components/Force-pass-change/Forcechange";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [userId, setUserId] = useState("");
  const { login, showPassModel, setShowPassModel } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await axiosInstance.post("/auth/login", data);
      if (response?.data?.forcePasswordChange) {
        const uid = response?.data?.userId;
        setUserId(uid);
        setShowPassModel(true);
      } else {
        await login(response?.data?.token);
        window.location.reload();
        toast.success("Login Successful");
        navigate("/");
      }
    } catch (err) {
      toast.error("Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
        {/* Left side text */}
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center text-white px-12">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight">
              Welcome Back 👋
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Login to continue managing your account securely.
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
            <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
              Login to Your Account
            </h2>

            {/* Server error */}
            {serverError && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    //   minLength: {
                    //     value: 6,
                    //     message: "Password must be at least 6 characters",
                    //   },
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400"
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-xl py-3 text-lg shadow-md transition transform hover:scale-[1.02]"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <a
                href="/"
                className="text-orange-600 font-semibold hover:underline"
              >
                Contact with Admin
              </a>
            </p>
          </div>
        </div>
      </div>
      {showPassModel && (
        <Forcechange userId={userId} onClose={() => setShowPassModel(false)} />
      )}
    </>
  );
}
