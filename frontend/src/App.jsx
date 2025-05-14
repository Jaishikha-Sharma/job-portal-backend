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

  // for admin
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
]);

function App() {
  return (
    <div>
   <RouterProvider router = {appRouter}/>
    </div>
  );
}

export default App;
