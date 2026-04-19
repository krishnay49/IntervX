import React from "react";
import { CopyrightIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-6 border-t border-gray-800">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <div className="flex items-center text-sm">
          <CopyrightIcon className="mr-2 h-5 w-5 text-gray-500" />
          <span>{new Date().getFullYear()} IntervX. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;