import React from "react";
import { Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f4f0fa] text-gray-700 px-6 sm:px-12 lg:px-20 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Company Info & Social Icons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#6c63ff] mb-2">
              Job Portal
            </h2>
            <span className="inline-block bg-[#6a38c2] text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide mb-3">
              Step Up Student
            </span>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed">
              Your trusted partner in finding the perfect job that suits you best.
            </p>
          </div>

          <div className="flex space-x-5 text-gray-500">
            <a
              href="https://instagram.com/stepupstudent"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-[#e4405f] transition"
            >
              <Instagram size={22} />
            </a>
            <a
              href="http://linkedin.com/company/step-up-student"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-[#0077b5] transition"
            >
              <Linkedin size={22} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-gray-300 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Job Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
