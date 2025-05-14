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

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  //apply now
  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true); // Update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
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
    <div className="max-w-7xl mx-auto my-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl mb-3">{singleJob?.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="ghost"
              className="text-blue-600 font-semibold text-xs sm:text-sm"
            >
              {singleJob?.postion} Positions
            </Badge>
            <Badge
              variant="ghost"
              className="text-red-600 font-semibold text-xs sm:text-sm"
            >
              {singleJob?.jobType}
            </Badge>
            <Badge
              variant="ghost"
              className="text-purple-600 font-semibold text-xs sm:text-sm"
            >
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      {/* Section Divider */}
      <h2 className="text-lg font-semibold border-b pb-2 border-gray-300 mb-4">
        Job Description
      </h2>

      {/* Job Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
        <div>
          <p className="font-semibold">
            Role:
            <span className="ml-2 font-normal text-gray-800">
              {singleJob?.title}
            </span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Location:
            <span className="ml-2 font-normal text-gray-800">
              {singleJob?.location}
            </span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Description:
            <span className="ml-2 font-normal text-gray-800">
              {singleJob?.description}
            </span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Experience:
            <span className="ml-2 font-normal text-gray-800">
              {singleJob?.experience} years
            </span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Salary:
            <span className="ml-2 font-normal text-gray-800">
              {singleJob?.salary} LPA
            </span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Total Applicants:
            <span className="ml-2 font-normal text-gray-800">
              {singleJob?.applications?.length}
            </span>
          </p>
        </div>
        <div>
          <p className="font-semibold">
            Posted Date:
            <span className="ml-2 font-normal text-gray-800">
              {singleJob?.createdAt.split("T")[0]}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
