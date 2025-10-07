import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Forcechange from "../../components/Force-pass-change/Forcechange";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [userId, setUserId] = useState("");
  const { login, showPassModel, setShowPassModel } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
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
        toast.success("Login Successful");
        window.location.assign("/");
      }
    } catch (err) {
      toast.error("Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-orange-300 via-orange-500 to-orange-300">
        {/* Left side text */}
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center text-white px-12 bg-transparent relative overflow-hidden">
          {/* Background pattern */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-md text-center"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-lg">
                <ShieldCheck size={48} className="text-white" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-extrabold leading-tight drop-shadow-lg">
              Welcome Back 👋
            </h1>

            {/* Sub text */}
            <p className="mt-4 text-lg opacity-90">
              Login to continue managing your account <br /> securely &
              efficiently.
            </p>

            {/* Extra engaging tagline */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-orange-100">
              <Sparkles size={18} className="text-yellow-300" />
              <span>Your data is safe with us</span>
            </div>
          </motion.div>
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
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-orange-400"
                    }`}
                    placeholder="Enter your password"
                    disabled={loading}
                  />

                  {/* Toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                className="bg-orange-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link
                to="/"
                className="text-orange-600 font-semibold hover:underline"
              >
                Contact with Admin
              </Link>
            </p>

            <p className="text-center text-sm text-gray-600">
              Back to home page{" "}
              <Link
                to="/"
                className="text-orange-600 font-semibold hover:underline"
              >
                Home
              </Link>
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
