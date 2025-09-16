import React from "react";
import Image from "../../assets/Image";

const cardBase = {
  background: "#fff",
  borderRadius: "24px",
  boxShadow: "0px 4px 24px rgba(0,0,0,0.08)",
  padding: "40px 28px",
  textAlign: "center",
  flex: "1",
  margin: "0 16px",
  transition: "transform 0.26s, box-shadow 0.26s",
};

export default function LandingPage3() {
  return (
    <div
      style={{
        fontFamily: "Montserrat, sans-serif",
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <section
        style={{
          background: "linear-gradient(90deg, #18375F 50%, #20416b 100%)",
          padding: "56px 24px 80px",
          display: "flex",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {[Image.image3, Image.image3, Image.image3].map((img, i) => (
          <div
            key={i}
            style={cardBase}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0px 8px 32px rgba(32,65,107,0.16)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = cardBase.boxShadow;
            }}
          >
            <img
              src={img}
              alt="Attendance Icon"
              style={{
                width: "82px",
                height: "82px",
                objectFit: "cover",
                margin: "0 auto 14px",
                borderRadius: "16px",
                transition: "transform 0.22s ease-in-out, box-shadow 0.22s",
                display: "block",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.13)";
                e.target.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              }}
            />

            <h3
              style={{
                color: "#18375F",
                fontWeight: 700,
                fontSize: "1.28rem",
                marginBottom: "12px",
                letterSpacing: "0.5px",
              }}
            >
              Timetable & Attendance
            </h3>
            <p
              style={{
                color: "#333",
                fontSize: "1.08rem",
                marginBottom: 0,
                opacity: 0.96,
                lineHeight: 1.45,
              }}
            >
              Easily mark attendance and create error-free timetables.
              <br />
              Allocate classrooms and subjects to teachers with ease.
            </p>
          </div>
        ))}
      </section>
      <section
        style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "1.5rem",
          margin: "38px 0 24px",
          color: "#20416b",
          letterSpacing: "0.7px",
        }}
      >
        Perfect Attendance Management System for your Institution
      </section>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "48px",
          margin: "0 auto 36px",
          maxWidth: "900px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            width: "220px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0px 2px 12px rgba(32,65,107,0.05)",
            padding: "20px 14px",
            transition: "box-shadow 0.26s, transform 0.26s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.06)";
            e.currentTarget.style.boxShadow =
              "0px 8px 28px rgba(32,65,107,0.10)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0px 2px 12px rgba(32,65,107,0.05)";
          }}
        >
          <img
            src={Image.image4} // or image5
            alt="Teacher Icon" // or "Institution Icon"
            style={{
              width: "82px",
              height: "82px",
              objectFit: "cover",
              margin: "0 auto 16px",
              borderRadius: "12px",
              transition: "transform 0.22s ease-in-out, box-shadow 0.22s",
              display: "block",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.13)";
              e.target.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.12)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)";
            }}
          />

          <h4
            style={{
              fontWeight: 700,
              color: "#18375F",
              marginBottom: "8px",
              fontSize: "1.12rem",
              letterSpacing: "0.5px",
            }}
          >
            Simple & Easy for Teachers
          </h4>
          <p
            style={{
              color: "#888",
              fontSize: "1rem",
              opacity: 0.96,
            }}
          >
            Designed for teachers and parents. No expertise required.
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            width: "220px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0px 2px 12px rgba(32,65,107,0.05)",
            padding: "20px 14px",
            transition: "box-shadow 0.26s, transform 0.26s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.06)";
            e.currentTarget.style.boxShadow =
              "0px 8px 28px rgba(32,65,107,0.10)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0px 2px 12px rgba(32,65,107,0.05)";
          }}
        >
          <img
            src={Image.image5}
            alt="Institution Icon"
            style={{
              width: "82px",
              height: "82px",
              objectFit: "cover",
              margin: "0 auto 16px",
              borderRadius: "12px",
              transition: "transform 0.22s ease-in-out, box-shadow 0.22s",
              display: "block",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.13)";
              e.target.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.12)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)";
            }}
          />
          <h4
            style={{
              fontWeight: 700,
              color: "#18375F",
              marginBottom: "8px",
              fontSize: "1.12rem",
              letterSpacing: "0.5px",
            }}
          >
            Powerful features for your Institution
          </h4>
          <p
            style={{
              color: "#888",
              fontSize: "1rem",
              opacity: 0.96,
            }}
          >
            Everything you need to run your institution. No customization
            needed.
          </p>
        </div>
      </section>
      <style>{`
  @media (max-width: 1000px) {
    section {
      flex-direction: column !important;
      gap: 20px !important;
      padding: 20px 12vw !important;
      max-width: 99vw !important;
    }
    img {
      max-width: 180px !important;
      width: 100% !important;
      height: auto !important;
      margin: 0 auto 12px !important;
    }
    .cardBase {
      width: 100% !important;
    }
  }
  @media (max-width: 600px) {
    section {
      padding: 14px 4vw !important;
    }
    h3, h4 {
      font-size: 1rem !important;
    }
    p {
      font-size: 0.95rem !important;
      line-height: 1.5 !important;
    }
  }
`}</style>
    </div>
  );
}
