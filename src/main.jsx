import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import LandingPage1 from "./components/LandingPages/LandingPage1.jsx";
import LandingPage2 from "./components/LandingPages/LandingPage2.jsx";
import LandingPage3 from "./components/LandingPages/LandingPage3.jsx";
import LandingPageFooter from "./components/LandingPages/LandingPageFooter.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <LandingPage1 />
    <LandingPage2 />
    <LandingPage3 />
    <LandingPageFooter /> */}
  </StrictMode>
);
