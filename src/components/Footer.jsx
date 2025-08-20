import React from "react";
import footerlogo from "../assets/images/footerlogo.png"

const Footer = () => {
  return (
    <footer className="bg-[#006666] w-full text-white py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>About Us</li>
              <li>Careers</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Wellness Programs</li>
              <li>Consultations</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Blog</li>
              <li>Guides</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
              <li>Disclaimer</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@example.com</li>
              <li>Phone: +123 456 789</li>
              <li>Address: Lagos, NG</li>
            </ul>
          </div>
        </div>

        <div className="flex mt-5 justify-center items-center">
          <img src={footerlogo} alt="" className="w-20"></img>
        </div>
        {/* Bottom text */}
        <div className="mt-3 text-center text-white text-base">
          © {new Date().getFullYear()} Fifty Firsts Wellness. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
