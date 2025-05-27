import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "../../hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("resume", input.file);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // get token from storage
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // send token here
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: null,
    });
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Company Setup</h1>
          </div>
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="name"
                  className="mb-0.5 block font-medium text-gray-700"
                >
                  Company Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="e.g. Google Inc."
                  className="mb-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="website"
                  className="mb-0.5 block font-medium text-gray-700"
                >
                  Website
                </Label>
                <Input
                  id="website"
                  type="text"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  placeholder="e.g. https://google.com"
                  className="mb-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="location"
                  className="mb-0.5 block font-medium text-gray-700"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="e.g. Mountain View, CA"
                  className="mb-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="file"
                  className="mb-0.5 block font-medium text-gray-700"
                >
                  Logo
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="mb-2"
                />
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="description"
                  className="mb-0.5 block font-medium text-gray-700"
                >
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="e.g. A tech giant"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#f83002] focus:border-[#f83002] transition mb-2"
                />
              </div>
            </div>

            {loading ? (
              <Button className="w-full mt-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full mt-4 bg-[#f83002] hover:bg-[#e12700] text-white rounded-md px-6 py-3 font-semibold transition"
              >
                Update
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
