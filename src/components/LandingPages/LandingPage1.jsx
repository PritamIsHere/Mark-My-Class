import React from "react";
import Image from "../../assets/Image";
export default function LandingPage1() {
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
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 56px 24px",
          background: "#fff",
          boxShadow: "0 4px 18px rgba(32,65,107,0.06)",
          borderRadius: "0 0 24px 24px",
        }}
      >
        <h2
          style={{
            color: "#FF642A",
            fontWeight: 900,
            fontSize: "2.2rem",
            letterSpacing: "2px",
          }}
        >
          Mark My Class
        </h2>
        <nav style={{ display: "flex", alignItems: "center", gap: "42px" }}>
          {["About Us", "Features", "Contact"].map((item) => (
            <span
              key={item}
              style={{
                color: "#162646",
                fontWeight: 500,
                fontSize: "1.15rem",
                cursor: "pointer",
                transition: "color 0.18s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#FF642A")}
              onMouseOut={(e) => (e.target.style.color = "#162646")}
            >
              {item}
            </span>
          ))}
        </nav>
      </header>
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px 7vw",
          gap: "54px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "2.8rem",
              fontWeight: 800,
              color: "#20416b",
              marginBottom: "30px",
              lineHeight: 1.1,
            }}
          >
            Smart attendance management for schools & colleges
          </h1>
          <p
            style={{
              fontSize: "1.18rem",
              color: "#444",
              marginBottom: "30px",
              lineHeight: 1.5,
            }}
          >
            Mark My Class makes attendance secure, accurate and effortless for
            institutions.
            <span
              style={{
                display: "block",
                color: "#888",
                fontSize: "1.02rem",
                marginTop: "10px",
              }}
            >
              Location and WiFi based marking, real-time dashboards, and
              future-ready with biometric features.
            </span>
          </p>
          <div style={{ display: "flex", gap: "18px", marginBottom: "30px" }}>
            <button
              style={{
                background: "#FF642A",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.15rem",
                border: "none",
                borderRadius: "32px",
                padding: "16px 46px",
                boxShadow: "0 4px 12px rgba(255,100,42,0.11)",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#e1581d";
                e.target.style.transform = "scale(1.07)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#FF642A";
                e.target.style.transform = "scale(1)";
              }}
            >
              Register Now
            </button>
            <button
              style={{
                background: "#fff",
                border: "2px solid #FF642A",
                color: "#FF642A",
                fontWeight: 700,
                fontSize: "1.15rem",
                borderRadius: "32px",
                padding: "16px 46px",
                boxShadow: "0 2px 8px rgba(255,100,42,0.07)",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s, transform 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#FF642A";
                e.target.style.color = "#fff";
                e.target.style.transform = "scale(1.07)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#fff";
                e.target.style.color = "#FF642A";
                e.target.style.transform = "scale(1)";
              }}
            >
              Learn More
            </button>
          </div>
          <div style={{ display: "flex", gap: "18px" }}>
            <button
              style={{
                background: "#FF642A",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.08rem",
                border: "none",
                borderRadius: "28px",
                padding: "14px 38px",
                boxShadow: "0 2px 8px rgba(255,100,42,0.12)",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#e1581d";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#FF642A";
                e.target.style.transform = "scale(1)";
              }}
            >
              Admin
            </button>
            <button
              style={{
                background: "#fff",
                border: "2px solid #FF642A",
                color: "#FF642A",
                fontWeight: 700,
                fontSize: "1.08rem",
                borderRadius: "28px",
                padding: "14px 38px",
                boxShadow: "0 2px 8px rgba(255,100,42,0.09)",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s, transform 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#FF642A";
                e.target.style.color = "#fff";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#fff";
                e.target.style.color = "#FF642A";
                e.target.style.transform = "scale(1)";
              }}
            >
              Teacher / Student
            </button>
          </div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <img
            src={Image.image1}
            alt="Smart attendance illustration"
            style={{
              width: "95%",
              maxWidth: "540px",
              borderRadius: "22px",
              boxShadow: "0 4px 32px rgba(32,65,107,0.09)",
              transition: "transform 0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.07)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          />
        </div>
      </main>
      <style>{`
        @media (max-width: 1000px) {
          main {
            flex-direction: column !important;
            gap: 30px !important;
            padding: 36px 3vw !important;
          }
          .responsive-img {
            max-width: 360px !important;
            width: 99% !important;
          }
        }
        @media (max-width: 600px) {
          header {
            flex-direction: column !important;
            padding: 18px 4vw 12px !important;
            gap: 12px !important;
          }
          main {
            padding: 18px 2vw !important;
          }
          h1 {
            font-size: 1.45rem !important;
          }
          p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}