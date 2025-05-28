import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#ede9fe] text-gray-700 px-6 sm:px-12 lg:px-16 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Company Info & Social Icons aligned left */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#6a38c2] mb-2">Job Portal</h2>
            <p className="text-gray-600 text-sm max-w-md">
              Your trusted partner in finding the perfect job that suits you best.
            </p>
          </div>

          <div className="flex space-x-6 text-gray-500 mt-4 sm:mt-0">
            <a href="#" aria-label="Facebook" className="hover:text-[#3b5998]">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[#e4405f]">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-[#1da1f2]">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-[#0077b5]">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Bottom copyright with border top */}
        <div className="mt-6 pt-4 border-t border-gray-300 text-left text-gray-500 text-xs">
          © {new Date().getFullYear()} Job Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
