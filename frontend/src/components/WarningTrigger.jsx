import React, { useState, useEffect } from "react";

const WarningTrigger = () => {
  const [visible, setVisible] = useState(true);

  // Auto hide after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed top-4 left-1/2 transform -translate-x-1/2
        bg-yellow-50 border border-yellow-400
        text-yellow-900
        text-sm sm:text-base
        px-4 py-3 sm:px-6 sm:py-4
        rounded-lg shadow-lg
        max-w-[90vw] sm:max-w-md
        flex items-center justify-center space-x-3
        cursor-pointer
        transition-all duration-300 ease-in-out
        hover:bg-yellow-100 hover:shadow-xl
        z-50
        break-words
      "
      onClick={() => setVisible(false)}
      title="Click to dismiss"
      role="alert"
      aria-live="assertive"
    >
      <span className="leading-tight flex items-start space-x-2">
        <span aria-hidden="true" className="text-2xl mt-0.5">
          ⚠️
        </span>
        <span className="break-words">
          Job seekers &amp; Recruiters — beware of fake companies and job scams! Always verify the source before sharing personal/contact details. Stay alert, stay safe.
        </span>
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
        aria-label="Dismiss warning"
        className="
          ml-auto
          text-yellow-900
          hover:text-yellow-700
          focus:outline-none
          font-bold
          text-xl sm:text-2xl
          transition-colors duration-200
          px-3 py-1 sm:px-4 sm:py-2
          rounded
          focus:ring-2 focus:ring-yellow-400
          select-none
          min-w-[36px] min-h-[36px]
          flex items-center justify-center
        "
      >
        ✕
      </button>
    </div>
  );
};

export default WarningTrigger;
