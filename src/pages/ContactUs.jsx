import React, { useState } from "react";
import { Mail, Instagram, Linkedin, Phone } from "lucide-react";
import Footer from "../components/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white py-16 px-4 sm:px-6 md:px-20 flex flex-col md:flex-row justify-between gap-12 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-black leading-snug">
            Get in touch <br /> with us
          </h2>
          <p className="text-gray-600 max-w-md">
            We’re here to help! Whether you have a question about our services,
            need assistance with your account, or want to provide feedback, our
            team is ready to assist you.
          </p>

          {/* Business Hours */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <section className="flex flex-col sm:flex-row sm:gap-8 gap-6">
              <div className="flex flex-col">
                <div className="text-[#475464] text-base font-medium">Mon - Fri:</div>
                <div className="text-[#667085] text-base">9:00am - 8:00pm</div>
              </div>
              <div className="flex flex-col">
                <div className="text-[#475464] text-base font-medium">Saturday:</div>
                <div className="text-[#667085] text-base">9:00am - 6:00pm</div>
              </div>
              <div className="flex flex-col">
                <div className="text-[#475464] text-base font-medium">Sunday:</div>
                <div className="text-[#667085] text-base">9:00am - 5:00pm</div>
              </div>
            </section>
          </div>

          {/* Contact Icons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 text-gray-700 mt-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" /> Email
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5" /> Instagram
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5" /> LinkedIn
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" /> +441 2323 122
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="md:w-1/2 bg-gray-50 p-6 sm:p-8 rounded-xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Message */}
            <textarea
              name="message"
              placeholder="How can we help you? Enter your message..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Button */}
            <button
              type="submit"
              className="w-fit px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
