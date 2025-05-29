import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Calendar, MapPin, Link as LinkIcon } from "lucide-react";
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-2xl my-10 p-8 sm:p-12 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-12">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-orange-500 shadow-lg">
            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
          </Avatar>

          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900">{user?.fullname}</h1>
            <p className="mt-2 text-gray-700 text-lg italic">{user?.profile?.bio || "No bio available"}</p>
          </div>

          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="self-start sm:self-auto px-5 py-2 flex items-center gap-2 text-orange-600 border-orange-600 hover:bg-orange-50 transition"
          >
            <Pen className="w-5 h-5" /> Edit Profile
          </Button>
        </div>

        {/* Contact & Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          <ProfileInfo icon={<Mail className="w-6 h-6 text-orange-500" />} label="Email" value={user?.email} />
          <ProfileInfo icon={<Contact className="w-6 h-6 text-orange-500" />} label="Phone" value={user?.phoneNumber || "NA"} />
          <ProfileInfo icon={<Calendar className="w-6 h-6 text-orange-500" />} label="Date of Birth" value={formatDate(user?.profile?.dob)} />
          <ProfileInfo
            icon={<MapPin className="w-6 h-6 text-orange-500" />}
            label="Address"
            value={`${user?.profile?.address || "NA"}, ${user?.profile?.pincode || "NA"}`}
          />
          <ProfileInfo
            icon={<LinkIcon className="w-6 h-6 text-orange-500" />}
            label="LinkedIn"
            value={
              user?.profile?.linkedin ? (
                <a
                  href={user.profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:underline"
                >
                  View Profile
                </a>
              ) : (
                "NA"
              )
            }
          />
        </div>

        {isStudent && (
          <>
            {/* Skills */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="text-gray-900 font-medium px-3 py-1 rounded-full text-sm shadow-sm"
                      style={{ backgroundColor: "#ffa50020" }}
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No skills added</span>
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="mt-10">
              <Label className="text-lg font-bold mb-2 block">Resume</Label>
              {user?.profile?.resume ? (
                <a
                  target="_blank"
                  href={user?.profile?.resume}
                  className="text-gray-900 hover:underline font-medium text-lg"
                >
                  {user?.profile?.resumeOriginalName || "View Resume"}
                </a>
              ) : (
                <span className="text-gray-500 italic">No resume uploaded</span>
              )}
            </div>
          </>
        )}
      </div>

      {isStudent && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-300 px-6 sm:px-10 py-6 my-10 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Applied Jobs</h2>
          <AppliedJobTable />
        </div>
      )}

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

const ProfileInfo = ({ icon, label, value }) => (
  <div
    className="flex items-center gap-4 rounded-xl p-4 border shadow-sm"
    style={{ backgroundColor: "#ffa50005", borderColor: "#ffa50010" }}
  >
    <div className="p-3 rounded-lg" style={{ backgroundColor: "#ffa50020" }}>
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-orange-700">{label}</h3>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

export default Profile;
