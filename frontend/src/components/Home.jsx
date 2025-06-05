import React, { useEffect, useMemo } from "react";
import Navbar from "../components/shared/Navbar.jsx";
import Herosection from "./Herosection.jsx";
import CategoryCarousel from "./CategoryCarousel.jsx";
import LatestJobs from "./LatestJob.jsx";
import Footer from "./Footer.jsx";
import useGetAllJobs from "../hooks/useGetAllJobs.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FloatingFeedback from "./FloatingFeedback.jsx";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const jobs = useSelector((store) => store.job.allJobs || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  const categories = useMemo(() => {
    const cats = jobs.map((job) => job.title);
    return [...new Set(cats)];
  }, [jobs]);

  const handleCategoryClick = (category) => {
    navigate(`/jobs?category=${encodeURIComponent(category)}`);
  };

  return (
    <div>
      <Navbar />
      <Herosection />
      <CategoryCarousel
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />
      <LatestJobs />
      <Footer />
      <FloatingFeedback/>
    </div>
  );
};

export default Home;
