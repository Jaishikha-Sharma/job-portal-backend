import React from "react";
import Navbar from "./components/shared/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile.jsx";
import JobDescription from "./components/JobDescription.jsx";
import Companies from "./components/admin/Companies.jsx";
import CompanyCreate from "./components/admin/CompanyCreate.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import CompanySetup from "./components/admin/CompanySetup.jsx";
import AdminJob from "../../frontend/src/components/admin/AdminJob.jsx";
import PostJob from "../src/components/admin/PostJob.jsx";
import Applicants from "../src/components/admin/Applicants.jsx"



const appRouter = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
   {
    path: "/",
    element: <Home />,
  },
    {
    path: "/jobs",
    element: <Jobs />,
  },
    {
    path: "/browse",
    element: <Browse />,
  },
      {
    path: "/profile",
    element: <Profile />,
  },
    {
    path: "/description/:id",
    element: <JobDescription/>,
  },

  // for companies
    {
    path: "/admin/companies",
    element: <Companies/>,
  },
   {
    path: "/admin/companies/create",
    element: <CompanyCreate/>,
  },
    {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  // for admin
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },

  
]);

function App() {
  return (
    <div>
   <RouterProvider router = {appRouter}/>
    </div>
  );
}

export default App;
