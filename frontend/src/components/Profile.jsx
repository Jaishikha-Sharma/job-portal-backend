import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const isStudent = user?.role === "student";

  if (isStudent) {
    useGetAppliedJobs();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
            </Avatar>

            <div>
              <h1 className="font-semibold text-lg sm:text-xl">
                {user?.fullname}
              </h1>
              <p className="text-sm text-gray-600">{user?.profile?.bio}</p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="self-end sm:self-auto"
            variant="outline"
          >
            <Pen className="w-4 h-4 mr-1" /> Edit
          </Button>
        </div>

        <div className="my-5 space-y-2">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5" />
            <span className="text-sm sm:text-base">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Contact className="w-5 h-5" />
            <span className="text-sm sm:text-base">{user?.phoneNumber}</span>
          </div>
        </div>

        {isStudent && (
          <>
            <div className="my-5">
              <h2 className="font-semibold text-md sm:text-lg mb-2">Skills</h2>
              <div className="flex flex-wrap items-center gap-2">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((item, index) => (
                    <Badge key={index} className="text-xs sm:text-sm px-2 py-1">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">NA</span>
                )}
              </div>
            </div>

            <div className="my-5">
              <div className="mt-1">
                <Label className="text-md font-bold">Resume</Label>
                {user?.profile?.resume ? (
                  <a
                    target="_blank"
                    href={user?.profile?.resume}
                    className="text-blue-500 w-full hover:underline cursor-pointer"
                  >
                    {user?.profile?.resumeOriginalName || "View Resume"}
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">NA</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {isStudent && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl px-4 sm:px-8 py-5 my-5">
          <h2 className="font-bold text-lg sm:text-xl mb-4">Applied Jobs</h2>
          <AppliedJobTable />
        </div>
      )}

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
