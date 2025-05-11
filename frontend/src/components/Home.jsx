import React from 'react'
import Navbar from "../components/shared/Navbar.jsx";
import Herosection from './Herosection.jsx';
import CategoryCarousel from "./CategoryCarousel.jsx"

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Herosection/>
      <CategoryCarousel/>
      {/* <LatestJob/>
      <Footer/> */}
    </div>
  )
}

export default Home
