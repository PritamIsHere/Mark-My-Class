import React from "react";
import Image from "../../assets/Image";

export default function LandingPage2() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden font-[Montserrat,ui-sans-serif] bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(255,100,42,0.10),transparent_60%),radial-gradient(900px_500px_at_110%_10%,rgba(32,65,107,0.10),transparent_60%),linear-gradient(180deg,#f8fbff_0%,#eaf1ff_100%)]">
      {/* Futuristic glowing shapes */}
      <div className="pointer-events-none absolute z-0 inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-1 bg-gradient-to-r from-orange-400/60 via-blue-400/40 to-green-400/60 blur-lg opacity-60 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-blue-400/10 rounded-full blur-2xl opacity-60" />
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-green-400/10 rounded-full blur-2xl opacity-50" />
      </div>

      {/* Futuristic Stats Bar */}
      <section className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 px-4 sm:px-8 md:px-12 py-7 sm:py-10 md:py-12 rounded-3xl border border-white/20 shadow-[0_16px_48px_rgba(32,65,107,0.18)] bg-[linear-gradient(120deg,#162646_0%,#1e355b_60%,#20416b_100%)] max-w-[1200px] w-[97%] sm:w-[92%] md:w-[88%] mx-auto mt-8 md:mt-12 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row text-white items-center gap-6 sm:gap-12 w-full md:w-auto">
          <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-br from-white/10 via-blue-400/10 to-blue-400/20 backdrop-blur-md shadow-[0_2px_16px_rgba(59,130,246,0.10)] min-w-[120px] border border-blue-400/10 hover:scale-105 transition-transform duration-200">
            <span className="text-4xl sm:text-5xl drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">🏫</span>
            <span className="font-extrabold text-[1.15rem] sm:text-[1.25rem] tracking-wider">100 +</span>
            <span className="font-semibold text-[1rem] sm:text-[1.08rem] opacity-90 text-center">Schools & Colleges</span>
          </div>
          <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-br from-white/10 via-orange-400/10 to-orange-400/20 backdrop-blur-md shadow-[0_2px_16px_rgba(255,100,42,0.10)] min-w-[120px] border border-orange-400/10 hover:scale-105 transition-transform duration-200">
            <span className="text-4xl sm:text-5xl drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">🌍</span>
            <span className="font-extrabold text-[1.15rem] sm:text-[1.25rem] tracking-wider">2 +</span>
            <span className="font-semibold text-[1rem] sm:text-[1.08rem] opacity-90 text-center">Countries</span>
          </div>
        </div>
        <button className="mt-7 md:mt-0 px-8 sm:px-12 py-3.5 rounded-full text-white font-extrabold text-[1.08rem] sm:text-[1.18rem] shadow-[0_16px_32px_rgba(255,100,42,0.22),0_2px_8px_rgba(32,65,107,0.10)] bg-gradient-to-tr from-orange-500 via-orange-400 to-blue-400 hover:from-[#e1581d] hover:to-[#3b82f6] hover:shadow-[0_8px_32px_rgba(255,100,42,0.18)] hover:-translate-y-1 transition-all duration-200 w-full md:w-auto uppercase tracking-wider border-2 border-orange-400/40">
          Try It Now
        </button>
      </section>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col md:flex-row items-start gap-12 px-4 sm:px-8 md:px-14 py-14 sm:py-20 max-w-[1200px] mx-auto w-full">
        <div className="flex-[2]">
          <h2 className="font-black text-[2rem] sm:text-[2.3rem] md:text-[2.6rem] text-transparent bg-clip-text bg-gradient-to-tr from-[#18375F] via-[#20416b] to-orange-500 tracking-wide mb-7 drop-shadow-[0_2px_12px_rgba(32,65,107,0.10)]">
            Why Mark-MyClass Attendance Management Software?
          </h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-3">
              <span className="mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-orange-400 via-blue-400 to-green-400 shadow-[0_0_8px_2px_rgba(255,100,42,0.18)] animate-pulse"></span>
              <span className="text-[#2a3550] text-[1.08rem] sm:text-[1.15rem] leading-8 max-w-[65ch]">
                <span className="font-semibold text-orange-500">Smart & Secure:</span> Eliminate proxy and manual errors with Wi-Fi, GPS, and location-based tracking.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-blue-400 via-orange-400 to-green-400 shadow-[0_0_8px_2px_rgba(32,65,107,0.13)] animate-pulse"></span>
              <span className="text-[#2a3550] text-[1.08rem] sm:text-[1.15rem] leading-8">
                <span className="font-semibold text-blue-500">Automated & Real-Time:</span> Save time, ensure accuracy, and access live dashboards for administrators.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-green-400 via-blue-400 to-orange-400 shadow-[0_0_8px_2px_rgba(16,185,129,0.13)] animate-pulse"></span>
              <span className="text-[#2a3550] text-[1.08rem] sm:text-[1.15rem] leading-8">
                <span className="font-semibold text-green-500">Future-Ready:</span> Scalable with planned biometric integrations (face recognition, fingerprint).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-orange-400 via-green-400 to-blue-400 shadow-[0_0_8px_2px_rgba(255,100,42,0.13)] animate-pulse"></span>
              <span className="text-[#2a3550] text-[1.08rem] sm:text-[1.15rem] leading-8">
                <span className="font-semibold text-orange-500">Cost-Effective & Private:</span> Reduces hardware dependency and ensures encrypted, compliant data privacy.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-blue-400 via-orange-400 to-green-400 shadow-[0_0_8px_2px_rgba(32,65,107,0.13)] animate-pulse"></span>
              <span className="text-[#2a3550] text-[1.08rem] sm:text-[1.15rem] leading-8">
                <span className="font-semibold text-blue-500">Universal:</span> Perfect for schools, colleges, and organizations—seamless, reliable, and efficient.
              </span>
            </li>
          </ul>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center mt-8 md:mt-0">
          <div className="relative w-full flex justify-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-blue-400/10 rounded-full blur-2xl opacity-60 z-0" />
            <img
              src={Image.image2}
              alt="Dashboard illustration"
              className="relative z-10 w-[96%] max-w-[420px] rounded-2xl shadow-[0_12px_40px_rgba(32,65,107,0.18),0_2px_12px_rgba(255,100,42,0.08)] border-2 border-white/60 transition-transform duration-300 mx-auto hover:scale-105 hover:shadow-[0_16px_48px_rgba(255,100,42,0.18)]"
            />
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tr from-blue-400/20 to-green-400/10 rounded-full blur-xl opacity-50 z-0" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-tr from-orange-400 via-blue-400 to-green-400 text-white text-xs font-bold shadow-[0_2px_8px_rgba(255,100,42,0.13)] uppercase tracking-widest animate-pulse">
              Futuristic
            </span>
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-tr from-blue-400 via-orange-400 to-green-400 text-white text-xs font-bold shadow-[0_2px_8px_rgba(32,65,107,0.13)] uppercase tracking-widest animate-pulse">
              Secure
            </span>
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-tr from-green-400 via-blue-400 to-orange-400 text-white text-xs font-bold shadow-[0_2px_8px_rgba(16,185,129,0.13)] uppercase tracking-widest animate-pulse">
              Real-Time
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
