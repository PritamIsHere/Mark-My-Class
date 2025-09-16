import React from "react";
import Image from "../../assets/Image";
// import image6 from "../assets/image6.png";
// import image7 from "../assets/image7.png";
// import image8 from "../assets/image8.png";
// import image9 from "../assets/image9.png";
// import modi from "../assets/modi.png";

export default function LandingPageFooter() {
  return (
    <footer
      style={{
        width: "100%",
        background: "#fff",
        boxShadow: "0 -2px 10px rgba(32,65,107,0.07)",
        borderRadius: "24px 24px 0 0",
        padding: "36px 0 32px",
        marginTop: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 48px",
          gap: "36px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={Image.image10}
            alt="Profile"
            style={{
              width: "120px",
              height: "140px",
              objectFit: "cover",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(255,100,42,0.11)",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              color: "#444",
              fontWeight: 700,
              fontSize: "1.45rem",
              marginBottom: "18px",
              letterSpacing: "0.3px",
            }}
          >
            Follow us on social media
          </h3>
          <div style={{ display: "flex", gap: "16px", marginBottom: "22px" }}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={Image.image7}
                alt="Facebook"
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
                  e.target.style.boxShadow = "0 4px 16px rgba(66,103,178,0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                }}
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={Image.image9}
                alt="Instagram"
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
                  e.target.style.boxShadow = "0 4px 16px rgba(225,48,108,0.13)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                }}
              />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <img
                src={Image.image8}
                alt="X"
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
                  e.target.style.boxShadow = "0 4px 16px rgba(0,0,0,0.13)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                }}
              />
            </a>
          </div>
          <div
            style={{
              display: "flex",
              gap: "18px",
              marginTop: "10px",
              flexWrap: "wrap",
              justifyContent: "flex-start",
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
                    padding: "10px 26px",
                    borderRadius: "20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(255,100,42,0.09)",
                    marginBottom: "10px",
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
        <div style={{ textAlign: "center" }}>
          <img
            src={Image.image6}
            alt="Ministry of Education"
            style={{
              width: "200px",
              marginBottom: "16px",
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
      </div>
    </footer>
  );
}
