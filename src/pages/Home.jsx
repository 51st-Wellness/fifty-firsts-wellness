import React from "react";
import StarRating from "../components/StarRating";
import family from "../assets/images/family.png";
import serenity from "../assets/images/serenity.png";
import yoga from "../assets/images/yoga.png";
import screenshot from "../assets/images/screenshot.png";
import podcast from "../assets/images/podcast.png";
import comment from "../assets/images/comment.png";
import profilepic from "../assets/images/profilepic.png";
import diary from "../assets/images/diary.png";
import skincare from "../assets/images/skincare.png";
import bathtub from "../assets/images/bathtub.png";
import selflove from "../assets/images/selflove.png";
import jump from "../assets/images/jump.png";
import stretch from "../assets/images/stretch.png";
import { CiShoppingCart } from "react-icons/ci";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center px-4">
        {/* Hero Section */}
        <article className="w-full md:w-4/5 mt-10 flex flex-col">
          <section>
            <div className="flex flex-wrap justify-center gap-3 font-semibold text-3xl sm:text-5xl lg:text-7xl xl:text-8xl text-center">
              <span className="bg-[#363689] px-1 text-white">RESTORE</span>
              <span>YOUR BALANCE</span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 font-semibold text-3xl sm:text-5xl lg:text-7xl xl:text-8xl text-center">
              RECLAIM YOUR
              <div className="bg-[#006666] px-1 text-white">PRICE</div>
            </div>

            <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-center mt-4 mb-3">
              Access curated wellness content, calming practices, and a supportive space to help you feel better — one step at a time.
            </div>
          </section>
          <img src={family} alt="" className="w-full h-auto mt-6" />
        </article>

        {/* Services Section */}
        <article className="w-full md:w-3/4 mt-10 flex flex-col text-center gap-2">
          <div className="italic font-medium text-3xl sm:text-5xl">Our Services</div>
          <div className="text-base sm:text-lg font-light">
            Get instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goals
          </div>
        </article>

        {/* Service Details */}
        <article className="flex flex-col gap-6 mt-6 w-full md:w-4/5">
          <section className="flex flex-col md:flex-row w-full gap-4">
            <div className="md:w-2/5 w-full">
              <img src={serenity} alt="" className="w-full h-auto rounded-xl" />
            </div>
            <div className="md:w-3/5 flex flex-col justify-between py-2">
              <div className="italic text-2xl sm:text-3xl lg:text-4xl">Personal Wellness</div>
              <div className="text-base sm:text-lg mt-2">
                Get instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goals.
              </div>
              <button className="w-fit mt-4 border border-[#4444B3] rounded-full font-semibold text-sm sm:text-base px-4 py-2 text-[#4444B3]">
                See Programmes
              </button>
            </div>
          </section>

          <section className="flex flex-col-reverse md:flex-row w-full gap-4">
            <div className="md:w-3/5 flex flex-col justify-between py-2">
              <div className="italic text-2xl sm:text-3xl lg:text-4xl">Business Wellness</div>
              <div className="text-base sm:text-lg mt-2">
                Get instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goals.
              </div>
              <button className="w-fit mt-4 border border-[#4444B3] rounded-full font-semibold text-sm sm:text-base px-4 py-2 text-[#4444B3]">
                See Programmes
              </button>
            </div>
            <div className="md:w-2/5 w-full">
              <img src={yoga} alt="" className="w-full h-auto rounded-xl" />
            </div>
          </section>
        </article>

        {/* AI Assistant */}
        <article className="w-full md:w-3/5 flex flex-col mt-12">
          <div className="flex flex-col text-center gap-2">
            <div className="italic text-2xl sm:text-3xl lg:text-4xl">
              Your Personal Wellness Assistant, Powered by
              <span className="text-[#229999]"> AI</span>
            </div>
            <div className="text-base sm:text-lg font-light mt-4 mb-8">
              Get instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goals.
            </div>
          </div>
          <img src={screenshot} alt="" className="w-full h-auto rounded-xl" />
        </article>

        {/* Podcast */}
        <img src={podcast} alt="" className="mt-10 w-full md:w-3/5 h-auto rounded-xl" />

        {/* Testimonials */}
        <article className="w-full md:w-3/4 text-center font-medium text-2xl sm:text-3xl lg:text-4xl mt-10">
          Words of praise from others about our presence
        </article>

        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full p-4">
          {[...Array(9)].map((_, idx) => (
            <section key={idx} className="p-4 border rounded-xl shadow-sm flex flex-col gap-2">
              <img src={comment} alt="" className="w-10 h-10" />
              <div className="text-sm sm:text-base">
                We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you.
              </div>
              <div className="flex items-center gap-2">
                <img src={profilepic} alt="" className="w-10 h-10 rounded-full" />
                <div className="flex flex-col text-sm">
                  <div>Gabrielle Williams</div>
                  <div className="text-xs text-gray-500">CEO, Mandilla Inc.</div>
                </div>
              </div>
            </section>
          ))}
        </article>

        {/* Products */}
        <article className="flex flex-col p-6 w-full">
          <div className="text-2xl sm:text-3xl font-medium mb-6">Selected Products</div>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[diary, skincare, bathtub, diary, skincare, bathtub, diary, skincare].map((img, idx) => (
              <article key={idx} className="flex border rounded-3xl p-4 flex-col">
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
                <button className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-2 px-4 mt-4 text-sm sm:text-base">
                  <CiShoppingCart className="text-lg sm:text-xl" />
                  Add to Cart
                </button>
              </article>
            ))}
          </section>
        </article>

        {/* Blog Section */}
        <article className="flex flex-col p-6 w-full">
          <div className="text-2xl sm:text-3xl font-medium mb-6">Featured Blog Content</div>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[jump, stretch, selflove].map((img, idx) => (
              <div key={idx} className="flex flex-col gap-2 border rounded-3xl p-4">
                <img src={img} alt="" className="rounded-lg" />
                <div className="text-xs sm:text-sm text-gray-500 font-semibold">March 4, 2025</div>
                <div className="text-lg sm:text-xl font-medium">
                  10 Innovative workplace wellness tips: Unlocking Happiness at Work
                </div>
                <div className="text-sm sm:text-base text-[#667085]">
                  Discover practical and creative ways to boost morale, reduce stress, and create a happier, healthier work environment.
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["Wellness", "Mindfulness", "Workplace"].map((tag, i) => (
                    <div key={i} className="font-medium text-xs text-[#667085] rounded-full px-3 py-1 border bg-[#C7C7C729]">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </article>

        {/* Newsletter */}
        <div className="flex flex-col lg:flex-row w-full items-center mt-12 px-4 gap-8">
          <div className="w-full lg:w-1/2 flex flex-col gap-3 text-center lg:text-left">
            <div className="text-2xl sm:text-3xl lg:text-5xl font-semibold">Stay in the wellness loop!</div>
            <div className="text-sm sm:text-base text-[#475464]">
              Subscribe to our newsletter for exclusive tips, stories, and product updates to support your wellness journey.
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="bg-[#F9F9F9] shadow-lg flex flex-col rounded-2xl w-full sm:w-4/5 p-6">
              <label className="text-sm sm:text-base">Email</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                className="px-4 py-2 bg-white border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 sm:px-8 rounded-full mt-4 py-2 bg-[#4444B3] text-white font-medium hover:bg-blue-400 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
};

export default Home;
