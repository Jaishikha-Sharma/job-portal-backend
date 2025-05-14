import React  , {useEffect}from "react";
import Navbar from "../components/shared/Navbar.jsx";
import Herosection from "./Herosection.jsx";
import CategoryCarousel from "./CategoryCarousel.jsx";
import LatestJobs from "./LatestJob.jsx";
import Footer from "./Footer.jsx";
import useGetAllJobs from '../hooks/useGetAllJobs.jsx'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
   useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
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
