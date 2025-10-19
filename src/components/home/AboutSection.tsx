import React from "react";
import { Link } from "react-router-dom";

const AboutSection: React.FC = () => {
  return (
    <section className="w-full py-40 sm:py-52">
      <div className="max-w-5xl mx-auto px-4 text-center bg-no-repeat"
        style={{
          backgroundImage: "url(/assets/homepage/about-section-bg.svg)",
          backgroundSize: "250% 250%",
          backgroundPosition: "center",
        }}
      >
        <h2
          className="text-3xl sm:text-4xl font-normal text-brand-green-dark mb-4"
          style={{ fontFamily: '"Lilita One", sans-serif' }}
        >
          About Us
        </h2>
        <div className="w-16 h-1 bg-brand-green-light mx-auto rounded-full mb-6" />
        <p className="text-gray-700 leading-7">
          At Fifty Firsts Wellness, we believe wellness should feel good, look good, and fit seamlessly
          into your everyday life. We’re here to make nutrition and self-care approachable, empowering,
          and even a little bit fun. Our mission is simple: to help women feel their best through balanced
          nutrition, mindful movement, and products that actually work. No quick fixes, no confusion—just
          real support for real women. Whether you’re starting your wellness journey or levelling up your
          routine, Fifty is your partner in feeling strong, confident, and unstoppable!
        </p>
        <div className="mt-8">
          <Link
            to="/about"
            className="inline-block bg-brand-green-light text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-green-dark transition-colors"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


