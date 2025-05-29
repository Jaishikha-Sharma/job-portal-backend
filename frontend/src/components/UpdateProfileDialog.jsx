import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../utils/axiosConfig";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "../redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const isStudent = user?.role === "student";

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: "",
    dob: "",
    address: "",
    pincode: "",
    linkedin: "",
  });

  useEffect(() => {
    if (user && open) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        dob: user.profile?.dob ? user.profile.dob.split("T")[0] : "",
        address: user.profile?.address || "",
        pincode: user.profile?.pincode || "",
        linkedin: user.profile?.linkedin || "",
        file: "",
      });
    }
  }, [user, open]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in input) {
      if (key === "file" && input.file) {
        formData.append("resume", input.file);
      } else {
        formData.append(key, input[key]);
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto rounded-xl"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Update Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="space-y-4 py-2">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
              />
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={input.dob}
                onChange={changeEventHandler}
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={input.address}
                onChange={changeEventHandler}
              />
            </div>

            {/* Pincode */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                value={input.pincode}
                onChange={changeEventHandler}
              />
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={input.linkedin}
                onChange={changeEventHandler}
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
              />
            </div>

            {/* Skills and Resume - Only for Students */}
            {isStudent && (
              <>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={input.skills}
                    onChange={changeEventHandler}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="file">Upload Resume (PDF)</Label>
                  <Input
                    id="file"
                    name="resume"
                    type="file"
                    accept="application/pdf"
                    onChange={fileChangeHandler}
                  />
                  <p className="text-xs text-muted-foreground">
                    Max file size: 2MB
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
