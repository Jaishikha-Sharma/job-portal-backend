import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { Loader, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const SignUp = () => {
  const { loading } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
       dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success || res.data.sucess) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        console.log("Unexpected response:", res.data);
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally{
       dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8 transition-all duration-300"
        >
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Create Your Account
          </h1>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                value={input.fullName}
                name="fullName"
                onChange={changeEventHandler}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                type="email"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                type="text"
                placeholder="+1 234 567 890"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                type="password"
                placeholder="••••••••"
              />
            </div>

            <div>
              <Label>Role</Label>
              <RadioGroup className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                  />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                  />
                  <Label htmlFor="recruiter">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="profile">Profile Picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
            </div>
          </div>

          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-3 h-4 w-4 animate-spin" /> please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-8 py-3 text-white bg-indigo-500 hover:bg-indigo-600 font-medium rounded-lg shadow-md transition duration-300"
            >
              Sign Up
            </Button>
          )}

          <div className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
