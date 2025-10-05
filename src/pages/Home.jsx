import React, { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import StarRating from "../components/StarRating";
// import family from "../assets/images/family.png";
// import serenity from "../assets/images/serenity.png";
// import yoga from "../assets/images/yoga.png";
// import screenshot from "../assets/images/screenshot.png";
import podcast from "../assets/images/podcast.png";
// import comment from "../assets/images/comment.png";
// import profilepic from "../assets/images/profilepic.png";
import diary from "../assets/images/diary.png";
import skincare from "../assets/images/skincare.png";
import bathtub from "../assets/images/bathtub.png";
//  import selflove from "../assets/images/selflove.png";
//  import jump from "../assets/images/jump.png";
//  import stretch from "../assets/images/stretch.png";
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
import Footer from "../components/Footer";

const Home = () => {

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <main className="w-full flex flex-col items-center bg-[#057B8C]/20">

      <div
        className="h-screen w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${homebg})` }}
      >
        <div className="flex flex-col justify-center ml-20 w-2/4">
          <h1 className="text-white text-5xl font-bold">
            Restore Your Balance. Reclaim Your Peace.
          </h1>

          <button className="w-fit mt-4 bg-[#0FB9A5] rounded-full font-semibold text-sm sm:text-base px-6 py-2 text-white">
            Get Started
          </button>
        </div>
      </div>

      <div className="w-full md:w-3/4 flex flex-col items-center gap-8 mt-10 px-4 py-10">
        <div className="text-5xl font-medium text-[#057B8C]">About Us</div>
        <div>At Fifty First Wellness, we believe wellness should feel good, look good, and fit seamlessly into your everyday life. We’re here to make nutrition and self-care approachable, empowering, and even a little bit fun. Our mission is simple: to help women feel their best through balanced nutrition, mindful movement, and products that actually work. No quick fixes, no confusion—just real support for real women. Whether you’re starting your wellness journey or levelling up your routine, Fifty is your partner in feeling strong, confident, and unstoppable!</div>
        <button className="w-fit mt-4 bg-[#0FB9A5] rounded-full font-semibold text-sm sm:text-base px-6 py-2 text-white">
          Learn More
        </button>
      </div>

      <div className="bg-[#4A0D57] text-white">

        {/* OUR SERVICES */}
        <section className="bg-[#009688] relative py-16 px-6 lg:px-20 overflow-hidden">
          {/* decorative yellow shape */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F9C300] rounded-full -translate-y-20 translate-x-20 opacity-80"></div>
          {/* decorative shapes */}
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F9C300] rounded-full translate-y-24 -translate-x-20 opacity-80"></div>

          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Our Services
          </h2>
          <div className="relative flex-col grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-10">
            {[
              {
                title: "Wellness Programmes for Healthy Lifestyles",
                text: "This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle.",
                image: service1,
              },
              {
                title: "Personalized Sustainable Meal Plans",
                text: "This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle.",
                image: service2,
              },
              {
                title: "Products and The Food Supplements",
                text: "This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle.",
                image: service3,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm mb-4">{item.text}</p>
                  <button className="bg-[#009688] text-white px-4 py-2 rounded-full text-sm hover:bg-[#00796B] transition">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* FEATURED PRODUCTS */}
        <article className="flex flex-col p-6 w-full bg-[#580F41]">
          <div className="text-2xl sm:text-3xl font-medium mb-6 text-center py-8">Featured Products</div>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-10">
            {[diary, skincare, bathtub, diary].map((img, idx) => (
              <article key={idx} className="flex border rounded-3xl p-4 flex-col bg-white text-black">
                <img src={img} alt="" className="w-full h-auto rounded-lg" />
                <div className="text-lg sm:text-xl mt-2">Wellness Product Name</div>
                <div className="flex justify-between mt-2">
                  <div className="text-lg sm:text-2xl font-medium">$22.50</div>
                  <div className="flex gap-3 items-center">
                    <div className="line-through text-sm sm:text-base">$32.50</div>
                    <div className="text-xs sm:text-sm font-medium text-[#229EFF] bg-[#E9F5FF] py-1 px-2 rounded">-14%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={4.5} />
                  <span className="text-xs sm:text-sm text-gray-500">(124 reviews)</span>
                </div>
                <button className="bg-[#0FB9A5] w-fit rounded-full text-white flex gap-2 items-center py-2 px-2 mt-4 text-sm sm:text-base">
                  <CiShoppingCart className="text-lg sm:text-xl" />
                  Add to Cart
                </button>
              </article>
            ))}
          </section>
        </article>

        {/* JOIN OUR WAITLIST */}
        <section className="relative py-20 px-6 lg:px-20 text-center overflow-hidden bg-[#580F41]">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Join Our Waitlist!</h2>
            <div className="bg-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between max-w-2xl mx-auto shadow-lg">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md text-gray-800 focus:outline-none mb-3 sm:mb-0 sm:mr-3"
              />
              <button className="bg-[#009688] text-white px-6 py-2 rounded-md hover:bg-[#00796B] transition">
                Subscribe
              </button>
            </div>
          </div>
        </section>



        {/* READ OUR BLOG */}
        <section className="bg-[#009688] relative py-16 px-6 lg:px-20 overflow-hidden">
          {/* decorative yellow shape */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0FB9A5] rounded-full -translate-y-20 translate-x-20 opacity-80"></div>
          {/* decorative shapes */}
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0FB9A5] rounded-full translate-y-24 -translate-x-20 opacity-80"></div>

          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Read Our Blog
          </h2>
          <div className="relative flex-col grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-10">
            {[
              {
                title: "5 Ways to Look Younger Than Ever",
                text: "This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle.",
                image: read1,
              },
              {
                title: "10 Whole Foods for a Healthy Gut",
                text: "This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle.",
                image: read2,
              },
              {
                title: "Smoothie Recipes for Better Sleep",
                text: "This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle.",
                image: read3,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm mb-4">{item.text}</p>
                  <button className="bg-[#009688] text-white px-4 py-2 rounded-full text-sm hover:bg-[#00796B] transition">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="font-sans">
          {/* === MEET OUR TEAM === */}
          <section className="bg-white py-16 px-6 lg:px-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#F9C300] rounded-full translate-x-1/2 -translate-y-1/2 opacity-80"></div>

            <h2 className="text-3xl font-bold text-center text-[#009688] mb-6">
              Meet Our Team
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Our dedicated team of experienced wellness professionals is at the
              heart of what we do. With deep knowledge of health and passion for
              helping clients achieve their best selves.
            </p>

            <div className="flex justify-center gap-6 relative z-10">
              {[
                {
                  name: "John Smith",
                  role: "Company CEO",
                  image: team1,
                },
                {
                  name: "David Johnson",
                  role: "Co-Founder",
                  image: team2,
                },
                {
                  name: "Mary Johnson",
                  role: "Marketing Manager",
                  image: team3,
                },
                {
                  name: "Patricia Davis",
                  role: "Nutrition Specialist",
                  image: team4,
                },
                {
                  name: "Patricia Davis",
                  role: "Nutrition Specialist",
                  image: team5,
                },

              ].map((member, i) => (
                <div
                  key={i}
                  className="w-56 bg-white border rounded-2xl overflow-hidden shadow-lg"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="text-center p-4 bg-[#4A0D57] text-white">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button className="w-10 h-10 border-2 border-[#009688] text-[#009688] rounded-full flex items-center justify-center hover:bg-[#009688] hover:text-white transition">
                Prev
              </button>
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-[#009688] rounded-full"></span>
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              </div>
              <button className="w-10 h-10 border-2 border-[#009688] text-[#009688] rounded-full flex items-center justify-center hover:bg-[#009688] hover:text-white transition">
                Next
              </button>
            </div>
          </section>

          {/* === PODCAST SECTION === */}
          <img src={podcast} alt=""></img>
          {/* <section className="bg-[#4A0D57] py-20 px-6 lg:px-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-60 h-60 bg-[#009688] rounded-full -translate-x-1/2 opacity-70"></div>

            <h2 className="text-3xl font-bold mb-4">
              Explore our podcasts where every voice sparks a shift
            </h2>
            <p className="text-gray-200 max-w-2xl mx-auto mb-10">
              Explore honest conversations that inspire growth, healing, and inner
              peace. Join us as we share personal journeys and mindful insights that
              spark meaningful change.
            </p>

            <div className="flex flex-col items-center">
              <div className="relative w-80 h-80 rounded-full overflow-hidden mb-8 shadow-lg border-4 border-[#009688]">
                <img
                  src="https://picsum.photos/600/400?random=10"
                  alt="Podcast"
                  className="object-cover w-full h-full"
                />
              </div>
              <button className="bg-[#009688] text-white px-6 py-2 rounded-md hover:bg-[#00796B] transition">
                Listen Now
              </button>
            </div>
          </section> */}

          {/* === FAQ SECTION === */}
          <section className="bg-white py-20 px-6 lg:px-20 relative">
            <div className="absolute top-0 right-0 w-52 h-52 bg-[#F9C300] rounded-full translate-x-1/3 -translate-y-1/3 opacity-60"></div>

            <h2 className="text-4xl font-bold text-left mb-10 text-[#009688]">FAQ</h2>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                "How long will it take to deliver your first blog post?",
                "Can I join the wellness programs remotely?",
                "Are your meal plans customizable?",
              ].map((q, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
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
        </div>

        <Footer />

      </div>
    </main>

  );
};

export default Home;
