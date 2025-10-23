import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section
      className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] lg:min-h-[90vh] flex items-center"
      style={{
        backgroundImage: "url(/assets/homepage/new-hero-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-3xl">
          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight"
            style={{ fontFamily: '"Lilita One", sans-serif' }}
          >
            Empower your wellbeing.
            <br />
            Be Stronger for Longer.
          </h1>

          <div className="mt-4 sm:mt-6">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:bg-brand-green-dark transition-colors shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


