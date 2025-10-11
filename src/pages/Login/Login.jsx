import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import Forcechange from "../../components/Force-pass-change/Forcechange";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [userId, setUserId] = useState("");
  const { login, showPassModel, setShowPassModel } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

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
        window.location.replace("/");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Incorrect email or password. Please try again.");
      } else if (err.response?.status === 403) {
        toast.error("Your account is not authorized. Contact admin.");
      } else {
        toast.error("Login failed, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Orange glassmorphism background shapes
  const glassShapes = [
    "absolute -top-24 left-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/60 via-orange-300/40 to-orange-400/30 rounded-3xl blur-2xl z-0",
    "absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tr from-orange-400/30 via-orange-200/40 to-orange-100/30 rounded-full blur-2xl z-0",
    "absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-white/30 via-orange-200/30 to-orange-400/30 rounded-full blur-2xl z-0",
    "absolute top-10 right-1/3 w-24 h-24 bg-gradient-to-br from-orange-400 via-orange-200 to-orange-100 opacity-20 rounded-full blur-2xl z-0",
    "absolute left-10 bottom-1/3 w-32 h-32 bg-orange-200/40 rotate-12 skew-y-12 rounded-2xl blur-xl z-0",
  ];

  return (
    <>
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-[#fff7ed] via-[#fdba74] to-[#e04f00] overflow-hidden">
        {/* Glassmorphism orange shapes */}
        {glassShapes.map((cls, i) => (
          <div key={i} className={cls} />
        ))}

        {/* Left: Welcome panel */}
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, type: "spring" }}
            className="max-w-md text-center"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0.7, rotate: -20 }}
                animate={{ scale: 1.1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="p-6 bg-gradient-to-br from-orange-200/40 via-orange-400/40 to-orange-500/40 rounded-3xl shadow-2xl border-2 border-white/20 flex items-center justify-center"
                style={{
                  boxShadow:
                    "0 0 40px 0 rgba(251,146,60,0.10), 0 8px 32px 0 rgba(234,88,12,0.08)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <ShieldCheck
                  size={64}
                  className="text-orange-600 drop-shadow-xl"
                />
              </motion.div>
            </div>
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="text-5xl font-extrabold leading-tight drop-shadow-lg tracking-tight text-orange-900"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-6 text-lg opacity-90 font-medium text-orange-900"
            >
              Log in to your dashboard.
              <br />
              <span className="text-orange-700">Secure. Fast. Easy.</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 flex items-center justify-center gap-2 text-base text-orange-100"
            >
              <span className="text-orange-400 animate-bounce">🧡</span>
              <span>
                <span className="font-bold text-white text-shadow-amber-900">
                  Modern & Interactive
                </span>
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, type: "spring" }}
            className="relative bg-white/95 shadow-[0_20px_60px_-15px_rgba(251,146,60,0.10)] rounded-3xl w-full max-w-md p-8 sm:p-12 border-2 border-orange-200/40 border-dashed"
          >
            <div className="flex flex-col items-center mb-7 relative z-10">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 p-3 rounded-full mb-2 shadow-lg"
              >
                <ShieldCheck size={36} className="text-orange-500" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-center text-orange-700 mb-1 tracking-tight">
                Login to Your Account
              </h2>
              <p className="text-orange-500 text-center text-sm">
                Enter your credentials to access the dashboard
              </p>
            </div>

            {/* Server error */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg border border-red-200 shadow-md"
                >
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 relative z-10"
            >
              {/* Email */}
              <div className="group">
                <label className="block text-sm font-semibold text-orange-700 mb-1 tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 bg-white/80 transition shadow-sm text-orange-900 font-medium tracking-wide ${
                      errors.email
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-orange-400"
                    }`}
                    placeholder="Enter your email"
                    disabled={loading}
                    autoComplete="username"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="inline-block"
                    >
                      <path d="M2.5 6.5l7.5 5 7.5-5" />
                      <rect x="2.5" y="4.5" width="15" height="11" rx="2.5" />
                    </svg>
                  </span>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-sm font-semibold text-orange-700 mb-1 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    onKeyUp={(e) =>
                      setCapsLockOn(
                        e.getModifierState && e.getModifierState("CapsLock")
                      )
                    }
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 bg-white/80 transition shadow-sm text-orange-900 font-medium tracking-wide ${
                      errors.password
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-orange-400"
                    }`}
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  {/* Toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-3 flex items-center text-orange-400 hover:text-orange-600 transition"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                {/* Caps Lock warning */}
                <AnimatePresence>
                  {capsLockOn && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-yellow-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <span className="animate-pulse">⚠️ Caps Lock is ON</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Password strength meter removed */}
              </div>

              {/* Login Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.04, backgroundColor: "#fb923c" }}
                className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 font-semibold text-white px-4 py-2 rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-400 transition w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <span className="animate-pulse" /> Login
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-7">
              <div className="flex-grow border-t border-orange-200" />
              <span className="mx-3 text-orange-400 text-xs">or</span>
              <div className="flex-grow border-t border-orange-200" />
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2">
              <p className="text-center text-sm text-orange-700">
                Don't have an account?{" "}
                <Link
                  to="/"
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Contact Admin
                </Link>
              </p>
              <p className="text-center text-sm text-orange-700">
                Back to home page{" "}
                <Link
                  to="/"
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Home
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Password Change Modal */}
      {showPassModel && (
        <Forcechange userId={userId} onClose={() => setShowPassModel(false)} />
      )}

      {/* Custom animations and enhanced visuals */}
      <style>
        {`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-10deg);}
            20% { transform: rotate(14deg);}
            40% { transform: rotate(-8deg);}
            60% { transform: rotate(14deg);}
            80% { transform: rotate(-4deg);}
          }
          .animate-wiggle {
            display: inline-block;
            animation: wiggle 1.2s infinite;
            transform-origin: 70% 70%;
          }
        `}
      </style>
    </>
  );
}
