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
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const SignUp = () => {
  const { loading } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
    dob: "",
    address: "",
    pincode: "",
    linkedin: "",
  });

  const navigate = useNavigate();

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
    formData.append("dob", input.dob);
    formData.append("address", input.address);
    formData.append("pincode", input.pincode);
    formData.append("linkedin", input.linkedin);

    if (input.file) {
      formData.append("resume", input.file);
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-10 transition-all duration-300"
        >
          <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
            Create Your Account
          </h1>

          <div className="space-y-6">
            {/** Each input container */}
            <div>
              <Label
                htmlFor="fullName"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={input.fullName}
                name="fullName"
                onChange={changeEventHandler}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <Label
                htmlFor="email"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Email
              </Label>
              <Input
                id="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                type="email"
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <Label
                htmlFor="phoneNumber"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                type="text"
                placeholder="+1 234 567 890"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Password
              </Label>
              <Input
                id="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <Label className="block mb-2 text-gray-700 font-semibold">
                Role
              </Label>
              <RadioGroup className="flex gap-8">
                <div className="flex items-center space-x-3">
                  <Input
                    type="radio"
                    id="student"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                    required
                  />
                  <Label
                    htmlFor="student"
                    className="cursor-pointer text-gray-700 font-medium"
                  >
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Input
                    type="radio"
                    id="recruiter"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                    required
                  />
                  <Label
                    htmlFor="recruiter"
                    className="cursor-pointer text-gray-700 font-medium"
                  >
                    Recruiter
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label
                htmlFor="dob"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                name="dob"
                value={input.dob}
                onChange={changeEventHandler}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <Label
                htmlFor="address"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Address
              </Label>
              <Input
                id="address"
                type="text"
                name="address"
                placeholder="Your Address"
                value={input.address}
                onChange={changeEventHandler}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <Label
                htmlFor="pincode"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Pincode
              </Label>
              <Input
                id="pincode"
                type="text"
                name="pincode"
                placeholder="Your Area Pincode"
                value={input.pincode}
                onChange={changeEventHandler}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <Label
                htmlFor="linkedin"
                className="block mb-2 text-gray-700 font-semibold"
              >
                LinkedIn Profile
              </Label>
              <Input
                id="linkedin"
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/your-profile"
                value={input.linkedin}
                onChange={changeEventHandler}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <Label
                htmlFor="profile"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Profile Picture
              </Label>
              <Input
                id="profile"
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="w-full text-gray-700"
              />
            </div>
          </div>

          {loading ? (
            <Button className="w-full my-6" disabled>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg shadow-lg transition duration-300"
            >
              Sign Up
            </Button>
          )}

          <div className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
