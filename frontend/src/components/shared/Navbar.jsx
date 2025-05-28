import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, User2, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "../../utils/axiosConfig.js";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { logout } from "../../redux/authSlice.js";
import { clearCompanies } from "../../redux/companySlice";
import { clearJobs, clearAdminJobs } from "../../redux/jobSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const isActive = (path) =>
    currentPath === path || currentPath.startsWith(path + "/");

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`);
      if (res.data.success) {
        dispatch(logout());
        dispatch(clearCompanies());
        dispatch(clearJobs());
        dispatch(clearAdminJobs());
        localStorage.clear();
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="px-4 sticky top-0 z-50 bg-white shadow-md transition-all">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <Link to="/">
          <h1 className="text-2xl font-extrabold tracking-tight hover:animate-wiggle transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#f83002] to-orange-500 text-transparent bg-clip-text">
            Job<span className="text-black">Portal</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex font-medium items-center gap-4 text-sm sm:text-base">
            {user && user.role === "recruiter" ? (
              <>
                <li className={`${isActive("/dashboards") ? "text-[#f83002] font-semibold" : ""} hover:text-[#f83002] hover:scale-105 transition-all`}>
                  <Link to="/dashboards">Dashboard</Link>
                </li>
                <li className={`${isActive("/admin/companies") ? "text-[#f83002] font-semibold" : ""} hover:text-[#f83002] hover:scale-105 transition-all`}>
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li className={`${isActive("/admin/jobs") ? "text-[#f83002] font-semibold" : ""} hover:text-[#f83002] hover:scale-105 transition-all`}>
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li className={`${isActive("/") ? "text-[#f83002] font-semibold" : ""} hover:text-[#f83002] hover:scale-105 transition-all`}>
                  <Link to="/">Home</Link>
                </li>
                <li className={`${isActive("/jobs") ? "text-[#f83002] font-semibold" : ""} hover:text-[#f83002] hover:scale-105 transition-all`}>
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li className={`${isActive("/browse") ? "text-[#f83002] font-semibold" : ""} hover:text-[#f83002] hover:scale-105 transition-all`}>
                  <Link to="/browse">Browse</Link>
                </li>
                <li className={`${isActive("/saved-jobs") ? "text-[#f83002] font-semibold" : ""} hover:text-[#f83002] hover:scale-105 transition-all`}>
                  <Link to="/saved-jobs">Saved Jobs</Link>
                </li>
                <li className={`${isActive("/applied-jobss") ? "text-[#f83002] font-semibold" : ""} hover:text-[#f83002] hover:scale-105 transition-all`}>
                  <Link to="/applied-jobss">Applied Jobs</Link>
                </li>
                {user?.role === "admin" && (
                  <li className={`${isActive("/admin/dashboard") ? "text-[#f83002] font-semibold" : ""} hover:text-[#f83002] hover:scale-105 transition-all`}>
                    <Link to="/admin/dashboard">Dashboard</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex gap-2">
              <Button asChild variant="outline" className="hover:bg-[#f83002]/10 transition duration-200">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-[#f83002] hover:bg-[#f83002]/90 transition duration-200 text-white">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer hover:scale-110 transition-all">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="user" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={user?.profile?.profilePhoto} alt="user" />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>
                  </div>
                </div>
                <div className="flex flex-col text-gray-600 gap-2">
                  <div className="flex w-fit items-center gap-1 cursor-pointer">
                    <User2 />
                    <Button variant="link">
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  </div>
                  <Button onClick={logoutHandler} variant="link" className="justify-start gap-2">
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 py-6 border-t bg-gradient-to-b from-white via-orange-50 to-white rounded-b-xl shadow-lg animate-in fade-in slide-in-from-top-4 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-[#f83002] to-orange-500 text-transparent bg-clip-text">
              Job<span className="text-black">Portal</span>
            </h2>
          </div>

          <ul className="flex flex-col font-medium text-base space-y-3 text-gray-800">
            {(user?.role === "recruiter"
              ? [
                  { to: "/dashboards", label: "Dashboard" },
                  { to: "/admin/companies", label: "Companies" },
                  { to: "/admin/jobs", label: "Jobs" },
                ]
              : [
                  { to: "/", label: "Home" },
                  { to: "/jobs", label: "Jobs" },
                  { to: "/browse", label: "Browse" },
                  { to: "/saved-jobs", label: "Saved Jobs" },
                  { to: "/applied-jobss", label: "Applied Jobs" },
                  ...(user?.role === "admin"
                    ? [{ to: "/admin/dashboard", label: "Dashboard" }]
                    : []),
                ]
            ).map(({ to, label }) => (
              <li key={to} className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(to) ? "bg-[#f83002]/10 text-[#f83002] font-semibold" : "hover:bg-orange-100"
              }`}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>

          {!user ? (
            <div className="flex flex-col gap-3">
              <Button asChild variant="outline" className="w-full hover:bg-[#f83002]/10">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="w-full bg-[#f83002] text-white hover:bg-[#f83002]/90">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="user" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{user?.fullname}</p>
                  <p className="text-xs text-muted-foreground">{user?.profile?.bio}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User2 className="w-4 h-4" />
                <Button variant="link" className="p-0">
                  <Link to="/profile">View Profile</Link>
                </Button>
              </div>
              <Button onClick={logoutHandler} variant="link" className="flex items-center gap-2 p-0 text-left text-red-600 hover:text-red-700">
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
