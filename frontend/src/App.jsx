import React from "react";
import Navbar from "./components/shared/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Home from "./components/Home";

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
]);

function App() {
  return (
    <div>
   <RouterProvider router = {appRouter}/>
    </div>
  );
}

export default App;
