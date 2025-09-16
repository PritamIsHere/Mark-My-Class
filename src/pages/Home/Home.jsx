import React from "react";
import LandingPage1 from "../../components/LandingPages/LandingPage1";
import LandingPage2 from "../../components/LandingPages/LandingPage2";
import LandingPage3 from "../../components/LandingPages/LandingPage3";
import LandingPageFooter from "../../components/LandingPages/LandingPageFooter";

const Home = () => {
  return (
    <>
      <LandingPage1 />
      <LandingPage2 />
      <LandingPage3 />
      <LandingPageFooter />
    </>
  );
};

export default Home;
