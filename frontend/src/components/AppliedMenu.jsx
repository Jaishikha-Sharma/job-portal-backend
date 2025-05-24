import React from "react";
import { useSelector } from "react-redux";
import AppliedJobTable from "./AppliedJobTable";
import Navbar from "./shared/Navbar";

const AppliedMenu = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Your Applied Jobs</h1>
        {user ? (
          <AppliedJobTable />
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Please <a href="/login" className="text-[#f83002] underline">login</a> to view your applied jobs.
          </p>
        )}
      </div>
    </>
  );
};

export default AppliedMenu;
