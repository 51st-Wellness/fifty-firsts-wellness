import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import footerlogo from "../assets/images/footerlogo.png";

const Footer: React.FC = () => {
  return (
    <footer className="text-white w-full" style={{ backgroundColor: '#006666' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-base font-semibold mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About Us
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

          {/* Services */}
          <div>
            <h3 className="text-base font-semibold mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/services/personal-wellness"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Direct-to-Customer
                </Link>
              </li>
              <li>
                <Link
                  to="/services/business-wellness"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Direct-to-Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-base font-semibold mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/resources/webinars"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Webinars & Training
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
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base font-semibold mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Return Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:support@fiftyfirstswellness.com"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Support@fiftyfirstswellness.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+44123232122"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  +441 2323 122
                </a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} className="text-brand-green" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} className="text-brand-green" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} className="text-brand-green" />
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
            © {new Date().getFullYear()}. Fifty Firsts Wellness. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
