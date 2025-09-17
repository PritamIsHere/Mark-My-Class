import React, { useEffect, useState } from "react";
import Image from "../../assets/Image";

export default function LandingPageFooter() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer
      style={{
        width: "100%",
        background: "#fff",
        boxShadow: "0 -2px 10px rgba(32,65,107,0.07)",
        borderRadius: "24px 24px 0 0",
        padding: isMobile ? "24px 0 24px" : "36px 0 32px",
        marginTop: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: isMobile ? "0 20px" : "0 48px",
          gap: isMobile ? "24px" : "36px",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        {/* Left Image */}
        <div>
          <img
            src={Image.image10}
            alt="Profile"
            style={{
              width: isMobile ? "90px" : "120px",
              height: isMobile ? "110px" : "140px",
              objectFit: "cover",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(255,100,42,0.11)",
              margin: isMobile ? "0 auto" : "0",
            }}
          />
        </div>

        {/* Middle Content */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              color: "#444",
              fontWeight: 700,
              fontSize: isMobile ? "1.2rem" : "1.45rem",
              marginBottom: "18px",
              letterSpacing: "0.3px",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            Follow us on social media
          </h3>

          {/* Social Icons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: isMobile ? "center" : "flex-start",
              marginBottom: "22px",
            }}
          >
            {[Image.image7, Image.image9, Image.image8].map((src, idx) => (
              <a
                key={idx}
                href={
                  [
                    "https://facebook.com",
                    "https://instagram.com",
                    "https://x.com",
                  ][idx]
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={src}
                  alt={["Facebook", "Instagram", "X"][idx]}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "#f4f4f4",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    transition: "transform 0.22s, box-shadow 0.22s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "scale(1.15)";
                    e.target.style.boxShadow =
                      idx === 0
                        ? "0 4px 16px rgba(66,103,178,0.15)"
                        : idx === 1
                        ? "0 4px 16px rgba(225,48,108,0.13)"
                        : "0 4px 16px rgba(0,0,0,0.13)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                  }}
                />
              </a>
            ))}
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: isMobile ? "center" : "flex-start",
              marginTop: "10px",
            }}
          >
            {["Help", "Contact us", "Support", "Services", "FAQ"].map(
              (label, idx) => (
                <button
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "2px solid #FF642A",
                    color: "#FF642A",
                    fontWeight: 600,
                    padding: isMobile ? "8px 20px" : "10px 26px",
                    borderRadius: "20px",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(255,100,42,0.09)",
                    transition:
                      "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#FF642A";
                    e.target.style.color = "#fff";
                    e.target.style.transform = "translateY(-2px) scale(1.07)";
                    e.target.style.boxShadow =
                      "0 4px 16px rgba(255,100,42,0.13)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#fff";
                    e.target.style.color = "#FF642A";
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow =
                      "0 2px 8px rgba(255,100,42,0.09)";
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Right Image */}
        <div>
          <img
            src={Image.image6}
            alt="Ministry of Education"
            style={{
              width: isMobile ? "160px" : "200px",
              marginBottom: "16px",
              transition: "transform 0.3s",
              margin: isMobile ? "0 auto" : "0",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.06)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          />
        </div>
      </div>
    </footer>
  );
}
