import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../../utils/axiosConfig.js";  
import { USER_API_END_POINT } from "../../utils/constant.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice.js";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  // New state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);

        // Redirect based on user role
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (res.data.user.role === "recruiter") {
          navigate("/");
        } else {
          navigate("/");
        }
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8 transition-all duration-300"
        >
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Log In
          </h1>

          <div className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                type="email"
                placeholder="john@example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </Label>
              <RadioGroup className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor="student"
                    className="cursor-pointer text-gray-700"
                  >
                    Candidate
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor="recruiter"
                    className="cursor-pointer text-gray-700"
                  >
                    Recruiter
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={input.role === "admin"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor="admin"
                    className="cursor-pointer text-gray-700"
                  >
                    Admin
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-3 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-8 py-3 text-white bg-indigo-500 hover:bg-indigo-600 font-medium rounded-lg shadow-md transition duration-300"
            >
              Log In
            </Button>
          )}

          <span className="block mt-4 text-center text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
