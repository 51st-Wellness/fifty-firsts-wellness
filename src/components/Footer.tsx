import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Phone } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import footerlogo from "../assets/images/footerlogo.png";

const Footer: React.FC = () => {
  const location = useLocation();

  // Use #006666 for home and cookie policy pages, #580F41 for all others including contact
  const isHomeOrCookie =
    location.pathname === "/" || location.pathname === "/cookie-policy";
  const backgroundColor = isHomeOrCookie ? "#006666" : "#580F41";

  return (
    <footer className="text-white w-full" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Company */}
          <div>
            <h3
              className="text-base font-semibold mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3
              className="text-base font-semibold mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/services/personal-wellness"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Personal Wellness
                </Link>
              </li>
              <li>
                <Link
                  to="/services/business-wellness"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Business Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className="text-base font-semibold mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/resources/webinars"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Webinars
                </Link>
              </li>
              <li>
                <Link
                  to="/podcasts"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Podcasts
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-base font-semibold mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-base font-semibold mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@fiftyfirstswellness.co.uk"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  info@fiftyfirstswellness.co.uk
                </a>
              </li>
              <li className="flex items-center justify-between sm:justify-start sm:gap-3 pt-2 w-full">
                <a
                  href="https://www.instagram.com/fiftyfirstswellness?igsh=MTVyODk5emhtZnlyMQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors flex-shrink-0"
                  aria-label="Instagram"
                >
                  <Instagram size={16} className="text-brand-green" />
                </a>
                <a
                  href="https://www.facebook.com/share/1BFKL2XnMg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors flex-shrink-0"
                  aria-label="Facebook"
                >
                  <Facebook size={16} className="text-brand-green" />
                </a>
                <a
                  href="https://www.linkedin.com/company/fifty-firsts-wellness/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors flex-shrink-0"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} className="text-brand-green" />
                </a>
                <a
                  href="https://www.tiktok.com/@fiftyfirstswellness?_t=ZN-90gUvPI1xWV&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors flex-shrink-0"
                  aria-label="TikTok"
                >
                  <FaTiktok size={16} className="text-brand-green" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-6 pt-8 border-t border-white/20">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={footerlogo}
              alt="Fifty Firsts Wellness"
              className="h-16 w-auto"
            />
          </div>

          {/* Copyright */}
          <div className="text-white/80 text-sm text-center">
            © {new Date().getFullYear()}. Fifty Firsts Wellness. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
