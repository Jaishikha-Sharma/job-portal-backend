import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { COMPANY_API_END_POINT } from "../../utils/constant";
import { setSingleCompany } from "../../redux/companySlice";

const CompanyCreate = () => {
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name cannot be empty!");
      return;
    }

    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the company.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <div className="flex justify-center items-center py-20 px-6 max-w-lg mx-auto">
        <div
          className="w-full bg-white rounded-2xl shadow-md p-10 border border-gray-200
                     transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          <h2 className="text-3xl font-extrabold mb-3 text-gray-800">
            Create Your Company
          </h2>
          <p className="mb-8 text-gray-600">
            Enter the name of your company. You can change this anytime later.
          </p>

          <Label
            htmlFor="companyName"
            className="block mb-2 font-semibold text-gray-700"
          >
            Company Name
          </Label>
          <Input
            id="companyName"
            type="text"
            placeholder="JobHunt, Microsoft, etc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f83002] focus:border-[#f83002] transition mb-8"
          />

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="border-[#f83002] text-[#f83002] hover:bg-[#f83002] hover:text-white rounded-md px-6 py-3 font-semibold transition"
            >
              Cancel
            </Button>
            <Button
              onClick={registerNewCompany}
              className="bg-[#f83002] hover:bg-[#e12700] text-white rounded-md px-6 py-3 font-semibold transition"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
