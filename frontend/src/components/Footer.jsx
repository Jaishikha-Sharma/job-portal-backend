import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f9f9f9] text-gray-700 px-4 sm:px-6 lg:px-16 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Company Info */}
        <div>
          <h2 className="text-lg font-bold text-[#6a38c2] mb-1">JobHunt</h2>
          <p className="text-sm text-gray-600">
            Your trusted partner in finding the perfect job that suits you best.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-sm font-semibold mb-1">Company</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="hover:text-[#6a38c2] transition">
                Jobs
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-[#6a38c2] transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#6a38c2] transition">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold mb-1">Support</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="hover:text-[#6a38c2] transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#6a38c2] transition">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-sm font-semibold mb-1">Follow Us</h3>
          <div className="flex items-center gap-3 mt-1">
            <a href="#">
              <Facebook className="w-5 h-5 text-gray-500 hover:text-[#6a38c2] transition" />
            </a>
            <a href="#">
              <Instagram className="w-5 h-5 text-gray-500 hover:text-[#6a38c2] transition" />
            </a>
            <a href="#">
              <Twitter className="w-5 h-5 text-gray-500 hover:text-[#6a38c2] transition" />
            </a>
            <a href="#">
              <Linkedin className="w-5 h-5 text-gray-500 hover:text-[#6a38c2] transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-6 border-t pt-4 text-xs text-center text-gray-500">
        © {new Date().getFullYear()} JobHunt. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
