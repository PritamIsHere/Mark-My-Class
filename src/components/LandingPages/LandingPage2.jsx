import React from "react";
import Image from "../../assets/Image";

export default function LandingPage2() {
  return (
    <div
      style={{
        fontFamily: "Montserrat, sans-serif",
        background: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top banner */}
      <section
        style={{
          background: "#162646",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "36px 58px",
          borderRadius: "0 0 32px 32px",
          margin: "0 auto",
          maxWidth: "1020px",
          boxShadow: "0 4px 24px rgba(22,38,70,0.11)",
        }}
      >
        <div style={{ display: "flex", gap: "56px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.10)",
              borderRadius: "14px",
              padding: "16px 26px",
              boxShadow: "0 2px 8px rgba(22,38,70,0.09)",
            }}
          >
            <span style={{ fontSize: "2.4rem" }}>🏫</span>
            <span style={{ fontWeight: 800, fontSize: "1.22rem" }}>100 +</span>
            <span
              style={{ fontWeight: 600, fontSize: "1.05rem", opacity: 0.92 }}
            >
              School & Colleges
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.10)",
              borderRadius: "14px",
              padding: "16px 26px",
              boxShadow: "0 2px 8px rgba(22,38,70,0.09)",
            }}
          >
            <span style={{ fontSize: "2.4rem" }}>🌍</span>
            <span style={{ fontWeight: 800, fontSize: "1.22rem" }}>2 +</span>
            <span
              style={{ fontWeight: 600, fontSize: "1.05rem", opacity: 0.92 }}
            >
              Countries
            </span>
          </div>
        </div>
        <button
          style={{
            background: "#fff",
            border: "2px solid #FF642A",
            color: "#FF642A",
            fontWeight: 700,
            padding: "14px 44px",
            borderRadius: "28px",
            fontSize: "1.2rem",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(255,100,42,0.14)",
            transition: "background 0.18s, color 0.18s, transform 0.18s",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#FF642A";
            e.target.style.color = "#fff";
            e.target.style.transform = "scale(1.09)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#fff";
            e.target.style.color = "#FF642A";
            e.target.style.transform = "scale(1)";
          }}
        >
          Try It Now
        </button>
      </section>
      {/* Main content */}
      <main
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "44px",
          padding: "68px 7vw",
          maxWidth: "1060px",
          margin: "0 auto",
        }}
      >
        <div style={{ flex: 2 }}>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "2.1rem",
              marginBottom: "34px",
              color: "#162646",
              letterSpacing: "1px",
            }}
          >
            Why Mark-MyClass Attendance Management Software?
          </h2>
          <p
            style={{
              fontWeight: 500,
              fontSize: "1.15rem",
              color: "#444",
              marginBottom: "22px",
              lineHeight: 1.7,
            }}
          >
            Mark-MyClass is a smart and secure attendance management solution
            designed to eliminate proxy and manual errors through Wi-Fi, GPS,
            and location-based tracking.
          </p>
          <p
            style={{
              fontWeight: 500,
              fontSize: "1.15rem",
              color: "#444",
              marginBottom: "22px",
              lineHeight: 1.7,
            }}
          >
            It provides institutions with an easy-to-use, automated system that
            saves time, ensures accuracy, and delivers real-time dashboards for
            administrators. Unlike traditional methods, Mark-MyClass is scalable
            and future-ready, with planned integration of advanced biometric
            technologies like face recognition and fingerprint authentication.
          </p>
          <p
            style={{
              fontWeight: 500,
              fontSize: "1.15rem",
              color: "#444",
              marginBottom: "8px",
              lineHeight: 1.7,
            }}
          >
            It is cost-effective, reduces dependency on hardware devices, and
            ensures complete data privacy through encryption and compliance with
            legal standards. Whether for schools, colleges, or corporate
            organizations, Mark-MyClass offers a seamless, reliable, and
            efficient way to manage attendance.
          </p>
        </div>
        <div style={{ flex: 1, textAlign: "center", marginTop: "18px" }}>
          <img
            src={Image.image2}
            alt="Dashboard illustration"
            style={{
              width: "96%",
              maxWidth: "420px",
              borderRadius: "20px",
              boxShadow: "0 4px 28px rgba(32,65,107,0.13)",
              transition: "transform 0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.06)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          />
        </div>
      </main>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          main {
            flex-direction: column !important;
            gap: 26px !important;
            padding: 38px 3vw !important;
          }
          section {
            flex-direction: column !important;
            gap: 20px !important;
            padding: 20px 12vw !important;
            max-width: 99vw !important;
          }
        }
        @media (max-width: 600px) {
          main {
            padding: 24px 2vw !important;
          }
          section {
            padding: 14px 4vw !important;
          }
          h2 {
            font-size: 1.2rem !important;
          }
          p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
