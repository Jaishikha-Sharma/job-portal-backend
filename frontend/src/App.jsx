
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
import AdminJob from "./components/admin/AdminJob.jsx";
import PostJob from "../src/components/admin/PostJob.jsx";
import Applicants from "../src/components/admin/Applicants.jsx";
import SavedJobs from "./components/SavedJobs.jsx";
import CompanyDetailsPage from "./components/CompanyDetailsPage.jsx";
import AppliedMenu from "./components/AppliedMenu.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import JobUpdate from "./components/admin/JobUpdate.jsx";

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
    element: <JobDescription />,
  },
  {
    path: "/saved-jobs",
    element: <SavedJobs />,
  },
  {
    path: "/applied-jobss",
    element: <AppliedMenu />,
  },

  // for companies
  {
    path: "/admin/companies",
    element: <Companies />,
  },
  {
    path: "/company/:id",
    element: <CompanyDetailsPage />,
  },
  {
    path: "/admin/companies/create",
    element: <CompanyCreate />,
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  // for admin
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboards",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
  path: "/admin/jobs/edit/:id",
  element: (
    <ProtectedRoute>
      <JobUpdate />
    </ProtectedRoute>
  ),
},

]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
