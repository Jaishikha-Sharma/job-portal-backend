import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig.js";  
import { setSingleJob } from "../redux/jobSlice";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "../utils/constant";
import { toast } from "sonner";
import Navbar from "../components/shared/Navbar";

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
      toast.error(error.response?.data?.message || "Something went wrong");
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

  // Helper: Show field or subtle "Not specified"
  const displayField = (value) =>
    value && value !== "N/A" ? (
      <span>{value}</span>
    ) : (
      <span className="italic text-gray-400">Not specified</span>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {singleJob?.title}
            </h1>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-indigo-100 text-indigo-800 font-semibold">
                {singleJob?.position} Position
                {singleJob?.position > 1 ? "s" : ""}
              </Badge>
              <Badge className="bg-pink-100 text-pink-700 font-semibold">
                {singleJob?.jobType}
              </Badge>
              <Badge className="bg-green-100 text-green-700 font-semibold">
                ₹ {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>

          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg text-white font-semibold px-6 py-3 transition-colors duration-300 ${
              isApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 mb-8" />

        {/* Job Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-gray-800 text-base">
          <Detail label="Role" value={singleJob?.title} />
          <Detail label="Salary" value={`₹ ${singleJob?.salary} LPA`} />
          <Detail label="Location" value={singleJob?.location} />
          <Detail label="Experience Level" value={singleJob?.experienceLevel} />
          <Detail label="Job Type" value={singleJob?.jobType} />

          <Detail label="Qualification" value={singleJob?.qualification} />
          <Detail
            label="Gender Preference"
            value={singleJob?.genderPreference}
          />
          <Detail
            label="Languages Known"
            value={
              singleJob?.languagesKnown?.length > 0
                ? singleJob.languagesKnown.join(", ")
                : null
            }
          />
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            {singleJob?.requirements && singleJob.requirements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {singleJob.requirements.map((req, index) => (
                  <span
                    key={index}
                    className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm select-none"
                  >
                    {req}
                  </span>
                ))}
              </div>
            ) : (
              <p className="italic text-gray-400">No requirements specified.</p>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-sm max-h-72 overflow-auto">
            {singleJob?.description ? (
              <p className="text-gray-800 whitespace-pre-line leading-7 font-sans tracking-wide">
                {singleJob.description}
              </p>
            ) : (
              <p className="italic text-gray-400 text-center py-10 select-none">
                No description provided.
              </p>
            )}
          </div>
        </div>

        {/* Posted On */}
        <div className="mt-10 text-sm text-gray-500 italic text-right">
          Posted On: {singleJob?.createdAt?.split("T")[0] || "Unknown"}
        </div>
      </div>
    </>
  );
};

const Detail = ({ label, value }) => {
  return (
    <div>
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="mt-1 text-gray-600">
        {value && value !== "N/A" ? (
          value
        ) : (
          <span className="italic text-gray-400">Not specified</span>
        )}
      </p>
    </div>
  );
};

export default JobDescription;
