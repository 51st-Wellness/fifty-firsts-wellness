import React, { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import StarRating from "../components/StarRating";
// import podcast from "../assets/images/podcast.png";
import diary from "../assets/images/diary.png";
import skincare from "../assets/images/skincare.png";
import bathtub from "../assets/images/bathtub.png";
import homebg from "../assets/images/homebg.png";
import service1 from "../assets/images/service1.png";
import service2 from "../assets/images/service2.png";
import service3 from "../assets/images/service3.png";
import read1 from "../assets/images/read1.png";
import read2 from "../assets/images/read2.png";
import read3 from "../assets/images/read3.png";
import team1 from "../assets/images/team1.png";
import team2 from "../assets/images/team2.png";
import team3 from "../assets/images/team3.png";
import team4 from "../assets/images/team4.png";
import team5 from "../assets/images/team5.png";
import aboutbg from "../assets/images/aboutbg.png";
import servicebg from "../assets/images/servicebg.png";
import readbg from "../assets/images/readbg.png";
import featuredbg from "../assets/images/featuredbg.png";
import opened from "../assets/images/opened.png";
import mic from "../assets/images/mic.png";
import speaker from "../assets/images/speaker.png";
import explore from "../assets/images/explore.png";
import FAQ from "../assets/images/FAQ.png";
import Footer from "../components/Footer";
import { Article } from "@mui/icons-material";

const Home = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

  return (
    <main className="w-full flex flex-col items-center">
      {/* === HERO SECTION === */}
      <section
        className="min-h-[100vh] w-full bg-cover bg-center flex items-center justify-center text-center sm:text-left px-6 sm:px-10 lg:px-20"
        style={{ backgroundImage: `url(${homebg})` }}
      >
        <div className="max-w-xl">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Restore Your Balance. Reclaim Your Peace.
          </h1>
          <button className="mt-6 bg-[#0FB9A5] rounded-full font-semibold text-sm sm:text-base px-8 py-3 text-white hover:bg-[#0c9b8a] transition">
            Get Started
          </button>
        </div>
      </section>

      {/* === ABOUT US === */}
      <section className="bg-cover bg-center w-full max-w-5xl flex flex-col items-center text-center gap-6 mt-12 px-6 py-14"
        style={{ backgroundImage: `url(${aboutbg})` }}
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#057B8C]">About Us</h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed w-4/6">
          At Fifty First Wellness, we believe wellness should feel good, look good, and fit seamlessly into your everyday life.
          We’re here to make nutrition and self-care approachable, empowering, and even a little bit fun. Our mission is simple:
          to help women feel their best through balanced nutrition, mindful movement, and products that actually work.
          No quick fixes, no confusion—just real support for real women.
        </p>
        <button className="mt-4 bg-[#0FB9A5] rounded-full font-semibold text-sm sm:text-base px-8 py-3 text-white hover:bg-[#0c9b8a] transition">
          Learn More
        </button>

      </section>

      {/* === OUR SERVICES === */}
      <section className="  bg-[#009688] bg-cover bg-center py-16 px-6 lg:px-20 overflow-hidden text-white w-full"
        style={{ backgroundImage: `url(${servicebg})` }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-10 relative">
          {[service1, service2, service3].map((image, i) => (
            <div
              key={i}
              className="bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col"
            >
              <img src={image} alt="" className="w-full h-56 object-cover" />
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Service {i + 1}</h3>
                  <p className="text-sm mb-4">
                    Empowering healthier living through nutrition, wellness, and quality supplements.
                  </p>
                </div>
                <button className="bg-[#009688] text-white px-4 py-2 rounded-full text-sm hover:bg-[#00796B] transition self-start">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* */}

      {/* === FEATURED PRODUCTS AND JOIN OUR WAITLIST === */}
      <article className=" bg-[#580F41] gap-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${featuredbg})` }} >

        {/* === FEATURED PRODUCTS === */}
        <section className="flex flex-col px-6 sm:p-10 text-white">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {[diary, skincare, bathtub, diary].map((img, idx) => (
              <div
                key={idx}
                className="bg-white text-gray-800 rounded-2xl p-5 shadow-md flex flex-col"
              >
                <img src={img} alt="" className="w-full h-auto rounded-lg" />
                <div className="mt-4 flex flex-col gap-1">
                  <h3 className="font-semibold text-lg">Wellness Product</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">$22.50</span>
                    <span className="text-gray-400 line-through text-sm">$32.50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={4.5} />
                    <span className="text-xs text-gray-500">(124 reviews)</span>
                  </div>
                  <button className="bg-[#0FB9A5] mt-3 rounded-full text-white flex gap-2 items-center py-2 px-3 text-sm hover:bg-[#0c9b8a] transition">
                    <CiShoppingCart className="text-lg" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === JOIN OUR WAITLIST === */}
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="relative flex flex-col md:flex-row items-center justify-between w-full max-w-6xl p-10 rounded-2xl overflow-hidden">

            {/* LEFT SIDE */}
            <div className="text-white z-10 pb-64 pl-20 md:mb-0 md:w-1/2">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                Join Our <br />
                <span className="text-5xl md:text-6xl font-extrabold">Waitlist!</span>
              </h1>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative mt-5 bg-white rounded-xl shadow-lg p-6 md:w-1/2 w-full flex flex-col gap-4">
              {/* Envelope Icon */}
              <div className="absolute -top-10  -translate-x-1/2">
                <img className="w-32" src={opened} alt="" />
              </div>

              <label htmlFor="email" className="text-gray-600  mt-12 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="john.doe@example.com"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button className="bg-[#00B8A9] hover:bg-[#009F92] text-white font-semibold py-2 rounded-lg transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>


      </article>

      {/* === READ OUR BLOG === */}
      <section className="h-screen bg-cover bg-center py-10 bg-[#009688] px-6 lg:px-20 w-full text-white text-center"
        style={{ backgroundImage: `url(${readbg})` }}
      >
        <h2 className="text-3xl font-bold mb-12">Read Our Blog</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[read1, read2, read3].map((image, i) => (
            <div
              key={i}
              className="bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              <img src={image} alt="" className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">Blog {i + 1}</h3>
                <p className="text-sm mb-4">
                  Empowering healthier living through nutrition and mindful lifestyle choices.
                </p>
                <button className="bg-[#009688] text-white px-4 py-2 rounded-full text-sm hover:bg-[#00796B] transition">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === MEET OUR TEAM === */}
      <section className="bg-cover bg-center bg-white py-16 px-6 lg:px-20 w-full text-center"
        style={{ backgroundImage: `url(${aboutbg})` }}
      >
        <h2 className="text-3xl font-bold text-[#009688] mb-6">Meet Our Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
          Our dedicated team of experienced wellness professionals is at the heart of what we do.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
          {[team1, team2, team3, team4, team5].map((member, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl overflow-hidden shadow-md w-full max-w-[200px]"
            >
              <img src={member} alt="" className="w-full h-48 object-cover" />
              <div className="bg-[#4A0D57] text-white p-3">
                <h3 className="font-semibold text-sm">Team Member</h3>
                <p className="text-xs">Wellness Expert</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#580F41] w-full flex flex-col justify-center">

        <div className="flex justify-between p-4 ">
          <img className="w-10" src={mic} alt="" />
          <img className="w-10" src={speaker} alt="" />
        </div>

        <h2 className="text-white text-3xl text-center">Explore our podcasts where every voice sparks a shift</h2>
        <div className="text-white text-center text-sm">Explore heartfelt conversations that inspire growth, healing, and inner peace. Join us as we share personal journeys and mindful insights that spark meaningful change.</div>

        <div className="flex flex-col items-center gap-5 py-5">
          <img src={explore} className="w-[600px]" alt="" />
          <button className="bg-[#00B8A9] hover:bg-[#009F92] w-32 text-white font-semibold py-2 rounded-lg transition-all">
            Listen Now
          </button>
        </div>

      </section>

      {/* === FAQ SECTION === */}
      <article className="w-full flex py-20">
        <div className="w-2/5" >
          <img src={FAQ} className="w-80 " alt="" />
        </div>

        <section className="w-3/5">
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              "How long will it take to deliver your first blog post?",
              "Can I join the wellness programs remotely?",
              "Are your meal plans customizable?",
            ].map((q, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex justify-between items-center p-4 text-left text-gray-700 font-medium hover:bg-gray-50"
                >
                  {q}
                  <span className="text-[#009688] text-lg font-bold">
                    {openFAQ === i ? "−" : "+"}
                  </span>
                </button>
                {openFAQ === i && (
                  <div className="px-4 pb-4 text-gray-600 text-sm bg-gray-50">
                    Our first blog posts are typically delivered within a few
                    business days, depending on your preferences and review cycle.
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
};

export default Home;
