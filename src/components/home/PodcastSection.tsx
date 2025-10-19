import React from "react";
import { Link } from "react-router-dom";

const PodcastSection: React.FC = () => {
  return (
    <section className="w-full py-20 bg-[#580F41] relative overflow-hidden">
      {/* Decorative dots */}
      <img
        src="/assets/homepage/podcast/top-right-dots.svg"
        alt=""
        className="pointer-events-none select-none absolute -top-10 right-0 w-64 sm:w-80 lg:w-[28rem] opacity-80 z-0"
      />
      <img
        src="/assets/homepage/podcast/bottom-left-dots.svg"
        alt=""
        className="pointer-events-none select-none absolute -bottom-12 -left-12 w-80 sm:w-[28rem] lg:w-[36rem] opacity-80 z-0"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Corner icons - far apart at top left and top right */}
        <div className="relative mb-6">
          <img
            src="/assets/homepage/podcast/mic.svg"
            alt=""
            className="pointer-events-none select-none absolute left-0 top-0 w-12 sm:w-14 opacity-80"
          />
          <img
            src="/assets/homepage/podcast/speaker.svg"
            alt=""
            className="pointer-events-none select-none absolute right-0 top-0 w-12 sm:w-14 opacity-80"
          />
          {/* Spacer to maintain height */}
          <div className="h-14 sm:h-16"></div>
        </div>
        <h2
          className="text-white text-3xl sm:text-4xl font-normal mb-3"
          style={{ fontFamily: '"Lilita One", sans-serif' }}
        >
          Explore our podcasts where
        </h2>
        <h3
          className="text-white text-3xl sm:text-4xl font-normal"
          style={{ fontFamily: '"Lilita One", sans-serif' }}
        >
          every voice sparks a shift
        </h3>
        <p className="text-white/90 mt-4 max-w-3xl mx-auto">
          Explore heartfelt conversations that inspire growth, healing, and inner peace. Join us as we share
          personal journeys and mindful insights that spark meaningful change.
        </p>

        <div className="mt-10 flex justify-center">
          <div >
            <img src="/assets/homepage/podcast/podcast-image.svg" alt="Podcast" className="w-[720px] max-w-full" />
          </div>
        </div>

        <Link 
          to="/podcasts"
          className="mt-8 inline-block bg-brand-green text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-green-dark transition-colors"
        >
          Listen Now
        </Link>
      </div>
    </section>
  );
};

export default PodcastSection;


