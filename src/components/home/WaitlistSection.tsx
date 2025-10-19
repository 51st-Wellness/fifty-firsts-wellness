import React from "react";
import { Mail } from "lucide-react";

const WaitlistSection: React.FC = () => {
  return (
    <section className="w-full py-12 sm:py-16 bg-[#580F41]">
      <div
        className="max-w-7xl mx-auto px-4 rounded-3xl bg-no-repeat min-h-[320px] sm:min-h-[380px]"
        style={{
          backgroundImage: "url(/assets/homepage/waitlist-bg.svg)",
          backgroundSize: "250% 250%",
          backgroundPosition: "center",
        }}
      >
        <div className="py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-6">
          <div className="lg:mr-8">
            <h2
              className="text-white text-7xl sm:text-8xl lg:text-9xl font-normal"
              style={{ fontFamily: '"Lilita One", sans-serif' }}
            >
              Join Our
              <br />
              Waitlist!
            </h2>
          </div>

          <div className="relative mt-20 sm:mt-28 lg:ml-16">
            <div className="absolute -top-10 -left-2 sm:-top-12 sm:-left-4 w-20 sm:w-24 z-10">
              <img src="/assets/homepage/waitlist-icon.svg" alt="mail" />
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl max-w-xl relative">
              <label className="block text-xs pt-5 text-gray-500 ml-1 mb-1">Email</label>
              <div className="flex flex-col gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none"
                  />
                </div>
                <div className="flex justify-start">
                  <button className="rounded-full bg-brand-green text-white px-6 py-3 font-semibold hover:bg-brand-green-dark transition-colors whitespace-nowrap mt-2">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;


