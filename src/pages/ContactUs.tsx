import React, { useState } from "react";
import {
  Mail,
  Instagram,
  Linkedin,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      <div className="py-16 px-4">
        {/* Header */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Get in touch
              <br />
              with us
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl">
              We're here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you.
            </p>

            {/* Business Hours */}
            <div className="mt-8 max-w-xl bg-gray-100 p-8 rounded-2xl">
              <h3 className="font-semibold mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>Business Hours</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Mon - Fri</div>
                  <div className="text-sm text-gray-900">9:00am - 8:00pm</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Saturday</div>
                  <div className="text-sm text-gray-900">9:00am - 6:00pm</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Sunday</div>
                  <div className="text-sm text-gray-900">9:00am - 5:00pm</div>
                </div>
              </div>
            </div>

            {/* Quick contacts */}
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
              <a href="mailto:info@fiftyfirstswellness.co.uk" className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-sm">Email</span>
              </a>
              <a href="https://www.linkedin.com/company/fifty-firsts-wellness/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-sm">LinkedIn</span>
              </a>
              <a href="https://www.instagram.com/fiftyfirstswellness?igsh=MTVyODk5emhtZnlyMQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-sm">Instagram</span>
              </a>
              <a href="https://www.tiktok.com/@fiftyfirstswellness?_t=ZN-90gUvPI1xWV&_r=1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                  <FaTiktok className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-sm">TikTok</span>
              </a>
              <a href="https://www.facebook.com/share/1BFKL2XnMg/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-sm">Facebook</span>
              </a>
              <a href="sms:+4475159441555" className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-sm">Text Us</span>
              </a>
            </div>
          </div>

          {/* Right Section (Form) */}
          <div className="bg-gray-100 p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Send us a Message
            </h2>

            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600">
                  Thank you for contacting us. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E7777] focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E7777] focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E7777] focus:border-transparent transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How can we help you?
                  </label>
                  <textarea
                    name="message"
                    placeholder="Enter your message..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E7777] focus:border-transparent transition-colors resize-none"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="bg-[#4444B3] text-white py-4 px-6 rounded-full font-semibold hover:opacity-90 transition-colors flex items-center gap-2"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Send Message
                  <Send size={20} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
