import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import footerlogo from "../assets/images/footerlogo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={footerlogo}
                alt="Fifty Firsts Wellness"
                className="h-12 w-12"
              />
              <span className="text-xl font-bold font-heading">
                Fifty Firsts Wellness
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed font-primary">
              Empowering individuals and organizations to achieve optimal
              wellness through personalized programs, expert guidance, and
              innovative solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-brand-green transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-green transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-green transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-green transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services/personal-wellness"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  Personal Wellness
                </Link>
              </li>
              <li>
                <Link
                  to="/services/business-wellness"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  Business Wellness
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/podcasts"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  Podcasts
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/webinars"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  Webinars
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-wellness"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  AI Wellness
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-brand-green" />
                <span className="text-gray-400">
                  info@fiftyfirstswellness.com
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-brand-green" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-brand-green" />
                <span className="text-gray-400">
                  123 Wellness Street, Health City, HC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Fifty Firsts Wellness. All rights
              reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-brand-green text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-green text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-green text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
