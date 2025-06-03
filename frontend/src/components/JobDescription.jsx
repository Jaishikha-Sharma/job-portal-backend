import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { setSingleJob } from "../redux/jobSlice";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "../utils/constant";
import { toast } from "sonner";
import Navbar from "../components/shared/Navbar";
import { MessageCircle, Linkedin, Copy } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Track answers for each question
  const [answers, setAnswers] = useState({});

  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const applyJobHandler = async () => {
    try {
      const token = localStorage.getItem("token");

      // Convert answers object into array with questions
      const answersArray = singleJob.questions.map((question, index) => ({
        question,
        answer: answers[index] || "", // fallback empty string if no answer
      }));

      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { answers: answersArray },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [
            ...singleJob.applications,
            { applicant: user?._id, answers: answersArray },
          ],
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
        const token = localStorage.getItem("token");
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* Back Button */}
        <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
          ← Back
        </Button>

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

        {/* Questions & Answers Section */}
        {singleJob?.questions && singleJob.questions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Application Questions
            </h2>
            {singleJob.questions.map((question, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  {question}
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={answers[index] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [index]: e.target.value }))
                  }
                  disabled={isApplied}
                />
              </div>
            ))}
          </div>
        )}

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
          <div className="mt-8 sm:col-span-2">
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

          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-sm max-h-72 overflow-auto sm:col-span-2">
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

          {/* Company and Posted By */}
          <div className="sm:col-span-2 mt-6 flex flex-col sm:flex-row justify-between text-gray-700 font-semibold">
            <p>
              <span className="font-bold">Company:</span>{" "}
              {singleJob?.company?.name || (
                <span className="italic text-gray-400">Not specified</span>
              )}
            </p>
            <p className="mt-2 sm:mt-0">
              <span className="font-bold">Posted By:</span>{" "}
              {singleJob?.created_by?.fullname || (
                <span className="italic text-gray-400">Not specified</span>
              )}
            </p>
          </div>
        </div>

        {/* Posted On */}
        <div className="mt-10 text-sm text-gray-500 italic text-right">
          Posted On: {singleJob?.createdAt?.split("T")[0] || "Unknown"}
        </div>

        {/* Share Job Section */}
        <div className="mt-6 flex items-center justify-end gap-4">
          <span className="text-sm font-medium text-gray-600">
            Share this job:
          </span>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle size={24} />
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={24} />
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard!");
            }}
            className="text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Copy link"
          >
            <Copy size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

const Detail = ({ label, value }) => (
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

export default JobDescription;
