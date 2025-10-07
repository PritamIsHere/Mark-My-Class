import React from "react";
import Image from "../../assets/Image";

export default function LandingPage3() {
  return (
    <div className="min-h-screen font-[Montserrat,ui-sans-serif] bg-[radial-gradient(1100px_500px_at_-10%_0%,rgba(255,100,42,0.07),transparent_60%),radial-gradient(800px_500px_at_110%_0%,rgba(32,65,107,0.07),transparent_60%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
      <section className="bg-[linear-gradient(135deg,#18375F_0%,#20416b_100%)] px-4 sm:px-6 md:px-10 pt-10 sm:pt-14 pb-12 sm:pb-20 flex flex-col sm:flex-row justify-center gap-6">
        {[
          {
            icon: (
              <span className="inline-flex items-center justify-center w-[68px] h-[68px] sm:w-[82px] sm:h-[82px] bg-orange-100 text-orange-500 rounded-xl text-4xl sm:text-5xl mb-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                <i className="fas fa-calendar-check"></i>
              </span>
            ),
            title: "Timetable & Attendance",
            desc: (
              <>
                Easily mark attendance and create error-free timetables.
                <br />
                Allocate classrooms and subjects to teachers with ease.
              </>
            ),
          },
          {
            icon: (
              <span className="inline-flex items-center justify-center w-[68px] h-[68px] sm:w-[82px] sm:h-[82px] bg-blue-100 text-blue-500 rounded-xl text-4xl sm:text-5xl mb-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                <i className="fas fa-chart-line"></i>
              </span>
            ),
            title: "Real-time Dashboard",
            desc: (
              <>
                Get instant insights into attendance trends.
                <br />
                Monitor student and teacher attendance live.
              </>
            ),
          },
          {
            icon: (
              <span className="inline-flex items-center justify-center w-[68px] h-[68px] sm:w-[82px] sm:h-[82px] bg-green-100 text-green-500 rounded-xl text-4xl sm:text-5xl mb-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                <i className="fas fa-lock"></i>
              </span>
            ),
            title: "Secure & Private",
            desc: (
              <>
                All data is encrypted and privacy-compliant.
                <br />
                Only authorized users can access sensitive information.
              </>
            ),
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-6 sm:px-7 py-8 sm:py-10 text-center flex-1 mx-0 sm:mx-4 mb-6 sm:mb-0 transition-all duration-200 hover:scale-105 hover:shadow-[0_8px_32px_rgba(32,65,107,0.16)]"
          >
            {item.icon}
            <h3 className="text-[#18375F] font-bold text-[1.08rem] sm:text-[1.15rem] md:text-[1.28rem] mb-3 tracking-wide">
              {item.title}
            </h3>
            <p className="text-[#333] text-[0.97rem] sm:text-[1rem] md:text-[1.08rem] leading-snug opacity-95">
              {item.desc}
            </p>
          </div>
        ))}
      </section>
      <section className="text-center font-extrabold text-[1.3rem] md:text-[1.6rem] my-10 text-[#20416b] tracking-wide">
        Perfect Attendance Management System for your Institution
      </section>

      
      <section className="flex flex-col sm:flex-row justify-center items-stretch gap-7 sm:gap-10 max-w-[1000px] mx-auto mb-12 px-4 sm:px-6">
        {/* Teachers Card */}
        <div className="flex-1 min-w-[220px] max-w-[340px] bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 sm:p-8 text-center mx-auto border border-blue-100 hover:shadow-2xl transition-all duration-200 hover:scale-105">
          <div className="flex items-center justify-center mb-4">
            <img
              src={Image.image4}
              alt="Teacher Icon"
              className="w-[70px] h-[70px] sm:w-[84px] sm:h-[84px] object-cover rounded-xl shadow-md border-2 border-blue-200 bg-white"
            />
          </div>
          <h4 className="font-extrabold text-[#18375F] mb-2 text-[1.13rem] sm:text-[1.22rem] tracking-wide">
            Easy for Teachers
          </h4>
          <p className="text-[#4a5a6a] text-[1rem] sm:text-[1.08rem] mb-4">
            Mark attendance in one tap. No training needed.
          </p>
          <div className="flex flex-col gap-2 text-left text-[#5b6b7b] text-[0.97rem] sm:text-[1.03rem] mx-auto max-w-[90%]">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Quick and simple interface</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Instant notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Works on any device</span>
            </div>
          </div>
        </div>
        {/* Institution Card */}
        <div className="flex-1 min-w-[220px] max-w-[340px] bg-gradient-to-br from-white via-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 sm:p-8 text-center mx-auto border border-orange-100 hover:shadow-2xl transition-all duration-200 hover:scale-105">
          <div className="flex items-center justify-center mb-4">
            <img
              src={Image.image5}
              alt="Institution Icon"
              className="w-[70px] h-[70px] sm:w-[84px] sm:h-[84px] object-cover rounded-xl shadow-md border-2 border-orange-200 bg-white"
            />
          </div>
          <h4 className="font-extrabold text-[#18375F] mb-2 text-[1.13rem] sm:text-[1.22rem] tracking-wide">
            Smart for Institutions
          </h4>
          <p className="text-[#4a5a6a] text-[1rem] sm:text-[1.08rem] mb-4">
            All tools you need, ready to use.
          </p>
          <div className="flex flex-col gap-2 text-left text-[#5b6b7b] text-[0.97rem] sm:text-[1.03rem] mx-auto max-w-[90%]">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
              <span>Live attendance dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
              <span>Automated reports</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
              <span>Secure & private</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
