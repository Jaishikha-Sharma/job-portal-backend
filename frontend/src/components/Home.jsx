import React from "react";
import Navbar from "../components/shared/Navbar.jsx";
import Herosection from "./Herosection.jsx";
import CategoryCarousel from "./CategoryCarousel.jsx";
import LatestJobs from "./LatestJob.jsx";
import Footer from "./Footer.jsx";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Herosection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer/>
    </div>
  );
};

export default Home;
