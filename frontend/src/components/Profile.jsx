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

const isResume = true;

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage
                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                alt="profile"
              />
            </Avatar>
            <div>
              <h1 className="font-semibold text-lg sm:text-xl">{user?.fullname}</h1>
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
          <Label className="text-md font-bold">Resume</Label>
          <div className="mt-1">
            {isResume && user?.profile?.resume ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={user.profile.resume}
                className="text-blue-500 hover:underline text-sm sm:text-base"
              >
                {user.profile.resumeOriginalName}
              </a>
            ) : (
              <span className="text-sm text-gray-500">NA</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl px-4 sm:px-8 py-5 my-5">
        <h2 className="font-bold text-lg sm:text-xl mb-4">Applied Jobs</h2>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
