import React from "react";
import Image from "../../assets/Image";
import { Link } from "react-router-dom";

export default function LandingPage1() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden font-[Montserrat,ui-sans-serif] bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(255,100,42,0.13),transparent_60%),radial-gradient(900px_500px_at_110%_10%,rgba(32,65,107,0.13),transparent_60%),linear-gradient(180deg,#f8fbff_0%,#eaf1ff_100%)]">
      {/* Futuristic glowing shapes */}
      <div className="pointer-events-none absolute z-0 inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-1 bg-gradient-to-r from-orange-400/60 via-blue-400/40 to-green-400/60 blur-lg opacity-60 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-blue-400/10 rounded-full blur-2xl opacity-60" />
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-green-400/10 rounded-full blur-2xl opacity-50" />
      </div>
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-14 pt-6 pb-4 bg-white/80 backdrop-blur-xl border border-[rgba(22,38,70,0.08)] shadow-[0_6px_32px_rgba(32,65,107,0.13)] rounded-b-2xl">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black bg-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,100,42,0.10)]">
            Mark My Class
          </h2>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6 md:gap-10">
          {["About Us", "Features", "Contact"].map((item) => (
            <span
              key={item}
              className="text-[#162646] text-base md:text-[1.15rem] font-medium cursor-pointer pb-1 border-b-2 border-transparent hover:text-orange-500 hover:border-orange-500 transition-all duration-200 hover:-translate-y-0.5"
            >
              {item}
            </span>
          ))}
        </nav>
        {/* Mobile Nav */}
        <div className="sm:hidden">
          <details className="relative">
            <summary className="list-none cursor-pointer flex items-center gap-2 text-[#162646] font-medium text-lg px-3 py-2 rounded-lg hover:bg-orange-50 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="sr-only">Open menu</span>
            </summary>
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50 flex flex-col">
              {["About Us", "Features", "Contact"].map((item) => (
                <span
                  key={item}
                  className="px-5 py-3 text-[#162646] text-base font-medium cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition"
                >
                  {item}
                </span>
              ))}
            </div>
          </details>
        </div>
      </header>
      <main className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 md:gap-14 px-4 sm:px-8 md:px-[7vw] py-10 md:py-16 flex-1">
        <div className="flex-1 w-full max-w-xl">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-tr from-[#18375F] via-[#20416b] to-orange-500 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-[0_2px_12px_rgba(32,65,107,0.10)]">
            Smart Attendance Management <span className="block sm:inline">for Schools & Colleges</span>
          </h1>
          <p className="text-[1.08rem] sm:text-lg text-[#2a3550] leading-relaxed mb-7 max-w-[60ch]">
            <span className="font-semibold text-orange-500">Mark My Class</span> makes attendance <span className="font-semibold text-blue-500">secure</span>, <span className="font-semibold text-green-500">accurate</span> and <span className="font-semibold text-orange-500">effortless</span> for institutions.
            <span className="block text-gray-500 text-base mt-2">
              Location & WiFi based marking, real-time dashboards, and future-ready with biometric features.
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-7">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-white font-bold text-[1.05rem] md:text-[1.15rem] shadow-[0_10px_32px_rgba(255,100,42,0.22),0_2px_8px_rgba(32,65,107,0.10)] bg-gradient-to-tr from-orange-500 via-orange-400 to-blue-400 hover:from-[#e1581d] hover:to-[#3b82f6] hover:shadow-[0_8px_32px_rgba(255,100,42,0.18)] hover:-translate-y-1 transition-all duration-200 uppercase tracking-wider"
            >
              Get Started
            </Link>
            <button className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-[1.05rem] md:text-[1.15rem] border-2 border-orange-500 text-orange-500 bg-white shadow-sm hover:shadow-md hover:bg-orange-500 hover:text-white hover:-translate-y-1 transition-all duration-200 uppercase tracking-wider">
              Learn More
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center justify-center px-7 py-3 rounded-full text-white font-bold text-[1.05rem] shadow-[0_4px_16px_rgba(255,100,42,0.18)] bg-gradient-to-tr from-blue-500 via-orange-400 to-orange-500 hover:from-[#20416b] hover:to-[#ff7a38] hover:shadow-[0_8px_32px_rgba(32,65,107,0.13)] hover:-translate-y-1 transition-all duration-200">
              Admin
            </button>
            <button className="inline-flex items-center justify-center px-7 py-3 rounded-full font-bold text-[1.05rem] border-2 border-blue-400 text-blue-500 bg-white shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-white hover:-translate-y-1 transition-all duration-200">
              Teacher / Student
            </button>
          </div>
          {/* Futuristic stats bar */}
          
        </div>
        <div className="flex-1 w-full flex flex-col items-center justify-center relative">
          {/* Futuristic floating image with glow */}
          <div className="relative w-full flex justify-center">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[80%] h-24 bg-gradient-to-tr from-orange-400/30 via-blue-400/20 to-green-400/20 blur-2xl rounded-full opacity-60 z-0" />
            <img
              src={Image.image1}
              alt="Smart attendance illustration"
              className="relative z-10 w-[90%] max-w-[480px] sm:max-w-[540px] rounded-2xl shadow-[0_10px_36px_rgba(32,65,107,0.12),0_2px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 animate-[float_6s_ease-in-out_infinite] mx-auto"
            />
          </div>
         
        </div>
      </main>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0);}
          50% { transform: translateY(-12px);}
          100% { transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
