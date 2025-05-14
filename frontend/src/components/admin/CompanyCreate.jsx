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
  const [companyName, setCompanyName] = useState(""); // ✅ This was missing
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
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
      console.log(error);
      toast.error("Something went wrong while creating the company.");
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <div className="max-w-4xl mx-auto">
          <div className="my-10">
            <h1 className="font-bold text-2xl">Your Company Name</h1>
            <p className="text-gray-500">
              What would you like to give your company name? You can change this
              later.
            </p>
          </div>

          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            type="text"
            className="my-2"
            placeholder="JobHunt, Microsoft etc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <div className="flex items-center gap-2 my-10">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
            >
              Cancel
            </Button>
            <Button onClick={registerNewCompany}>Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
