import React from 'react'
import about1 from "../assets/images/about1.png"
import about2 from "../assets/images/about2.png"
import art1 from "../assets/images/art1.png"
import art2 from "../assets/images/art2.png"
import youtube from "../assets/images/youtube.png"
import mapbase from "../assets/images/mapbase.png"
import Footer from '../components/Footer'

const About = () => {
  return (
    <main className="px-4 sm:px-8">
      {/* About Section */}
      <article className="flex flex-col md:flex-row w-full">
        <section className="w-full md:w-1/2 p-4">
          <div className="w-full flex flex-col gap-5">
            <div className="text-3xl sm:text-5xl lg:text-7xl font-semibold">ABOUT US</div>
            <div className="text-sm sm:text-base text-[#475464]">
              Our journey to Well-Being - Discover who we are, what drives us, and how we’re creating a better world through wellness.
            </div>
            <div><img src={about2} alt="" className="w-full h-auto" /></div>
          </div>
        </section>

        <section className="w-full md:w-1/2 p-4">
          <div className="w-full flex flex-col gap-5">
            <div><img src={about1} alt="" className="w-full h-auto" /></div>
            <div className="italic text-3xl sm:text-4xl lg:text-5xl">Our Philosophy</div>
            <div className="text-sm sm:text-lg text-[#475464]">
              We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you.
            </div>
          </div>
        </section>
      </article>

      {/* Mission */}
      <article className="flex flex-col md:flex-row w-full mt-6 gap-6">
        <section className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="italic text-3xl sm:text-4xl lg:text-5xl">Our Mission</div>
          <div className="text-sm sm:text-lg text-[#475464]">
            We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you...
          </div>
        </section>

        <section className="relative w-full md:w-1/2 flex items-center justify-center bg-white">
          <div className="grid grid-cols-3 grid-rows-3 w-full h-64 sm:h-80 relative">
            <div className="flex items-center justify-center col-start-2 row-start-1">
              <div className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-full shadow text-center text-sm sm:text-base">
                Holistic Care
              </div>
            </div>
            <div className="flex items-center justify-center col-start-3 row-start-2">
              <div className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-full shadow text-center text-sm sm:text-base">
                Integrity
              </div>
            </div>
            <div className="flex items-center justify-center col-start-1 row-start-2">
              <div className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-full shadow text-center text-sm sm:text-base">
                Community
              </div>
            </div>
            <div className="flex items-center justify-center col-start-2 row-start-3">
              <div className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-full shadow text-center text-sm sm:text-base">
                Sustainability
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Brand Origin Story */}
      <article className="w-full md:w-4/6 flex flex-col gap-4 mt-6">
        <section className="italic text-3xl sm:text-4xl lg:text-5xl">Brand Origin Story</section>
        <section className="text-sm sm:text-base text-[#475464]">We’re here to help! ...</section>
        <section className="text-sm sm:text-base text-[#475464]">We’re here to help! ...</section>
      </article>

      {/* Artwork */}
      <article className="w-full flex flex-col md:flex-row gap-4 p-4 mt-4">
        <img src={art1} alt="" className="w-full md:w-1/2 h-auto" />
        <img src={art2} alt="" className="w-full md:w-1/2 h-auto" />
      </article>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="md:col-span-2 flex flex-col gap-3 p-6 shadow-sm">
          <div className="italic text-3xl sm:text-4xl lg:text-5xl">Our Core Values</div>
          <div className="text-sm sm:text-lg text-[#475464]">We’re here to help...</div>
        </div>
        <div className="bg-[#F6F2FF] flex flex-col gap-3 p-6 shadow-sm">
          <div className="text-lg sm:text-xl font-medium">Empowerment</div>
          <div className="text-sm sm:text-lg text-[#475464]">We aim to equip individuals...</div>
        </div>
        <div className="bg-[#FFF0E7] p-6 shadow-sm">
          <div className="text-lg sm:text-xl font-medium">Integrity</div>
          <div className="text-sm sm:text-lg text-[#475464]">We aim to equip individuals...</div>
        </div>
        <div className="p-6 opacity-70" aria-hidden="true" />
        <div className="bg-[#E5FBEC] p-6 shadow-sm">
          <div className="text-lg sm:text-xl font-medium">Empowerment</div>
          <div className="text-sm sm:text-lg text-[#475464]">We aim to equip individuals...</div>
        </div>
        <div className="bg-[#FFF0E7] p-6 shadow-sm">
          <div className="text-lg sm:text-xl font-medium">Integrity</div>
          <div className="text-sm sm:text-lg text-[#475464]">We aim to equip individuals...</div>
        </div>
        <div className="border-dashed border-gray-300 p-6 opacity-70" aria-hidden="true" />
      </div>

      {/* Founder Section */}
      <article className="flex flex-col items-center mt-4 gap-6 py-8 px-4 sm:px-10">
        <div className="italic text-3xl sm:text-4xl lg:text-5xl pb-6">A Word from Our Founder</div>
        <img src={youtube} alt="" className="w-full sm:w-3/4 h-auto" />
        <div className="w-full sm:w-3/4 text-[#475464] text-sm sm:text-base">
          “We’re here to help! Whether you have a question...”
        </div>
        <div className="italic font-medium text-base sm:text-xl">
          -Maria Carey, <span className="font-normal">Founder of Fifty Firsts Wellness</span>
        </div>
      </article>

      <img src={mapbase} alt="" className="w-full h-auto" />

      {/* Commitment */}
      <article className="w-full flex flex-col md:flex-row gap-6 mt-6">
        <section className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="italic text-3xl sm:text-4xl lg:text-5xl">Our Commitment to a better world</div>
          <div className="text-sm sm:text-lg text-[#475464]">
            We believe true wellness extends beyond individuals—it touches the planet...
          </div>
        </section>

        <section className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-72 sm:w-96 h-48">
            {/* Dots Layout */}
            <div className="absolute left-0 top-1/4 -translate-x-1/2 flex items-center space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-400 border-4 border-purple-200"></div>
              <span className="text-xs sm:text-sm">Waste Reduction Policy</span>
            </div>
            <div className="absolute left-0 top-1/2 -translate-x-1/2 flex items-center space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-400 border-4 border-blue-200"></div>
              <span className="text-xs sm:text-sm">Data Privacy & Security</span>
            </div>
            <div className="absolute left-1/4 bottom-0 translate-y-1/2 flex items-center space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-400 border-4 border-green-200"></div>
              <span className="text-xs sm:text-sm">Fair Labor Practices</span>
            </div>
            <div className="absolute right-1/4 top-0 -translate-y-1/2 flex items-center space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-500 border-4 border-gray-300"></div>
              <span className="text-xs sm:text-sm">Transparent Policies</span>
            </div>
            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-orange-400 border-4 border-orange-200"></div>
              <span className="text-xs sm:text-sm">Mental Health Advocacy</span>
            </div>
            <div className="absolute right-0 bottom-1/4 translate-x-1/2 flex items-center space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500 border-4 border-red-200"></div>
              <span className="text-xs sm:text-sm">Accessibility</span>
            </div>
          </div>
        </section>
      </article>

      {/* Newsletter */}
      <div className="flex flex-col lg:flex-row w-full items-center mt-6 mb-12 px-4 gap-8">
        <div className="w-full lg:w-1/2 flex flex-col gap-3 text-center lg:text-left">
          <div className="text-xl sm:text-3xl lg:text-5xl font-semibold">Stay in the wellness loop!</div>
          <div className="text-sm sm:text-base text-[#475464]">
            Subscribe to our newsletter for exclusive tips, stories, and product updates.
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

      <Footer />
    </main>
  )
}

export default About
