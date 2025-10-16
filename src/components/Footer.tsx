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

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0C6964] text-white w-full">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">Company</h3>
            <ul className="space-y-3">
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
            <h3 className="text-lg font-semibold mb-6 font-heading">Services</h3>
            <ul className="space-y-3">
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
            <h3 className="text-lg font-semibold mb-6 font-heading">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/resources/podcasts" className="text-white/80 hover:text-white transition-colors">Podcasts</Link></li>
              <li><Link to="/resources/webinars" className="text-white/80 hover:text-white transition-colors">Webinars & Training</Link></li>
              <li><Link to="/ai-wellness" className="text-white/80 hover:text-white transition-colors">AI Wellness</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Terms & Condition</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">Contact</h3>
            <ul className="space-y-4 text-white/80">
              <li>support@fiftyfirstswellness</li>
              <li>+441 2323 122</li>
              <li className="flex items-center gap-4 text-white">
                <Facebook size={18} />
                <Instagram size={18} />
                <Linkedin size={18} />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-10 pt-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <img src={footerlogo} alt="Fifty Firsts Wellness" className="h-12 w-12" />
          </div>
          <div className="text-white/80 text-sm">
            © {new Date().getFullYear()}. Fifty Firsts Wellness. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
