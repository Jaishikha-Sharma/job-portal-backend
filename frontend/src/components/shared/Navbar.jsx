import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, User2, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { logout } from "../../redux/authSlice.js";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  // Helper to check active path, using startsWith for partial matching
  const isActive = (path) => currentPath === path || currentPath.startsWith(path + "/");

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(logout());
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
        {/* Logo */}
        <h1 className="text-2xl font-extrabold tracking-tight hover:animate-wiggle transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#f83002] to-orange-500 text-transparent bg-clip-text">
          Job<span className="text-black">Portal</span>
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex font-medium items-center gap-4 text-sm sm:text-base">
            {user && user.role === "recruiter" ? (
              <>
                <li
                  className={`hover:text-[#f83002] hover:scale-105 transition-all ${
                    isActive("/admin/companies") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li
                  className={`hover:text-[#f83002] hover:scale-105 transition-all ${
                    isActive("/admin/jobs") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li
                  className={`hover:text-[#f83002] hover:scale-105 transition-all ${
                    isActive("/") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/">Home</Link>
                </li>
                <li
                  className={`hover:text-[#f83002] hover:scale-105 transition-all ${
                    isActive("/jobs") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li
                  className={`hover:text-[#f83002] hover:scale-105 transition-all ${
                    isActive("/browse") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/browse">Browse</Link>
                </li>
                <li
                  className={`hover:text-[#f83002] hover:scale-105 transition-all ${
                    isActive("/saved-jobs") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/saved-jobs">Saved Jobs</Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                className="hover:bg-[#f83002]/10 transition duration-200"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-[#f83002] hover:bg-[#f83002]/90 transition duration-200 text-white"
              >
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
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col text-gray-600 gap-2">
                  {user && user.role === "student" && (
                    <div className="flex w-fit items-center gap-1 cursor-pointer">
                      <User2 />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}
                  <Button
                    onClick={logoutHandler}
                    variant="link"
                    className="justify-start gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-2 pb-4">
          <ul className="flex flex-col font-medium gap-2 text-sm sm:text-base">
            {user && user.role === "recruiter" ? (
              <>
                <li
                  className={`hover:text-[#f83002] transition-all ${
                    isActive("/admin/companies") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li
                  className={`hover:text-[#f83002] transition-all ${
                    isActive("/admin/jobs") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li
                  className={`hover:text-[#f83002] transition-all ${
                    isActive("/") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/">Home</Link>
                </li>
                <li
                  className={`hover:text-[#f83002] transition-all ${
                    isActive("/jobs") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li
                  className={`hover:text-[#f83002] transition-all ${
                    isActive("/browse") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/browse">Browse</Link>
                </li>
                <li
                  className={`hover:text-[#f83002] transition-all ${
                    isActive("/saved-jobs") ? "text-[#f83002] font-semibold" : ""
                  }`}
                >
                  <Link to="/saved-jobs">Saved Jobs</Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="mt-2 flex flex-col gap-2">
              <Button
                asChild
                variant="outline"
                className="hover:bg-[#f83002]/10 transition"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-[#f83002] text-white hover:bg-[#f83002]/90 transition"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 border-t pt-2">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="user" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.fullname}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.profile?.bio}
                  </p>
                </div>
              </div>
              <div className="flex flex-col text-gray-600 gap-2">
                {user && user.role === "student" && (
                  <div className="flex w-fit items-center gap-1 cursor-pointer">
                    <User2 />
                    <Button variant="link">
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  </div>
                )}
                <Button
                  onClick={logoutHandler}
                  variant="link"
                  className="justify-start gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
