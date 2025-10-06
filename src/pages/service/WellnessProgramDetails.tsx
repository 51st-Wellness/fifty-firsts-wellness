import React, { useState } from "react";
import pray from "../../assets/images/pray.png";
import martin1 from "../../assets/images/martin1.png";
import martin2 from "../../assets/images/martin2.png";
import martin3 from "../../assets/images/martin3.png";
import martin4 from "../../assets/images/martin4.png";
import comment from "../../assets/images/comment.png";
import profilepic from "../../assets/images/profilepic.png";

const WellnessProgramDetails: React.FC = () => {
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
    console.log("Form submitted:", formData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Hero Section */}
        <article className="w-full flex flex-col lg:flex-row gap-8 h-fit pt-20">
          <section className="w-full lg:w-1/2 flex flex-col gap-3 justify-between">
            <div className="text-3xl sm:text-4xl font-medium">
              Easiest 14-day Meditation Journey to Unlock New Levels
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-medium">
                About Program
              </div>
              <div className="text-sm sm:text-base">
                In an age where many professionals spend more waking hours at
                work than anywhere else, prioritizing wellness in the workplace
                is more important than ever. But wellness isn’t just about yoga
                mats and fresh fruit—it’s about cultivating a culture where
                people feel supported, valued, and balanced.
              </div>
            </div>
          </section>

          <section className="w-full lg:w-1/2">
            <img src={pray} alt="" className="w-full h-auto rounded-lg" />
          </section>
        </article>

        {/* About Program */}
        <div className="text-xl sm:text-2xl font-medium mt-8">
          About Program
        </div>
        <div className="text-sm sm:text-base">
          In an age where many professionals spend more waking hours at work
          than anywhere else, prioritizing wellness in the workplace is more
          important than ever. But wellness isn’t just about yoga mats and fresh
          fruit—it’s about cultivating a culture where people feel supported,
          valued, and balanced.
        </div>
        <div className="text-sm sm:text-base mt-4">
          In an age where many professionals spend more waking hours at work
          than anywhere else, prioritizing wellness in the workplace is more
          important than ever. But wellness isn’t just about yoga mats and fresh
          fruit—it’s about cultivating a culture where people feel supported,
          valued, and balanced.
        </div>

        {/* Meet the Experts */}
        <section>
          <div className="text-xl sm:text-2xl font-medium mt-8 mb-4">
            Meet The Experts
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[martin4, martin2, martin3, martin1].map((img, idx) => (
              <div key={idx} className="text-center">
                <img src={img} alt="" className="rounded-lg w-full" />
                <div className="font-medium text-base mt-2">Martin Kev</div>
                <div className="text-[#667085] text-sm">
                  Wellness Consultant
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Book Button */}
        <button className="flex rounded-full text-white justify-center mt-6 px-6 py-2 text-center bg-[#4444B3] text-sm sm:text-base hover:bg-[#343494] transition w-full sm:w-auto">
          Book For Programme
        </button>

        {/* Testimonials */}
        <article className="w-full text-center font-medium text-xl sm:text-2xl lg:text-4xl mt-10">
          Words of praise from others about our presence
        </article>

        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full p-4">
          {[...Array(9)].map((_, idx) => (
            <section
              key={idx}
              className="p-4 border rounded-xl shadow-sm flex flex-col gap-2"
            >
              <img src={comment} alt="" className="w-10 h-10" />
              <div className="text-sm sm:text-base">
                We’re here to help! Whether you have a question about our
                services, need assistance with your account, or want to provide
                feedback, our team is ready to assist you.
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={profilepic}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col text-sm">
                  <div>Gabrielle Williams</div>
                  <div className="text-xs text-gray-500">
                    CEO, Mandilla Inc.
                  </div>
                </div>
              </div>
            </section>
          ))}
        </article>

        {/* Contact Form */}
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 mt-10 gap-6">
          {/* Left Text */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-semibold leading-snug">
              Got any questions? <br />
              <span className="font-normal">contact us now</span>
            </h2>
          </div>

          {/* Contact Form */}
          <div className="w-full md:w-2/3 bg-gray-50 p-6 rounded-xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Message */}
              <textarea
                name="message"
                rows={5}
                placeholder="How can we help you? Enter your message..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>

              {/* Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Send Message <span>➔</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WellnessProgramDetails;
