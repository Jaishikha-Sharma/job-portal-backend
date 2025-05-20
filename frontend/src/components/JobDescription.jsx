import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setSingleJob } from "../redux/jobSlice";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "../utils/constant";
import { toast } from "sonner";
import Navbar from "../components/shared/Navbar"

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
 <>
   <Navbar/>
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {singleJob?.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              {singleJob?.position} Position{singleJob?.position > 1 && "s"}
            </Badge>
            <Badge className="bg-red-100 text-red-700">
              {singleJob?.jobType}
            </Badge>
            <Badge className="bg-purple-100 text-purple-700">
              ₹ {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg text-white font-semibold ${
            isApplied
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 mb-6" />

      {/* Job Details */}
      <div className="space-y-6 text-sm sm:text-base text-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold">Role</p>
            <p className="text-gray-700">{singleJob?.title}</p>
          </div>
          <div>
            <p className="font-semibold">Location</p>
            <p className="text-gray-700">{singleJob?.location}</p>
          </div>
          <div>
            <p className="font-semibold">Experience Required</p>
            <p className="text-gray-700">{singleJob?.experience} years</p>
          </div>
          <div>
            <p className="font-semibold">Salary</p>
            <p className="text-gray-700">₹ {singleJob?.salary} LPA</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Job Description</p>
            <p className="text-gray-700 whitespace-pre-line">
              {singleJob?.description}
            </p>
          </div>
        </div>
        <div>
            <p className="font-semibold">Posted On</p>
            <p className="text-gray-700">
              {singleJob?.createdAt?.split("T")[0]}
            </p>
          </div>
      </div>
    </div>
 </>
  );
};

export default JobDescription;
