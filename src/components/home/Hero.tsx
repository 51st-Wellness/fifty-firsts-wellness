import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section
      className="relative w-full min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex items-center"
      style={{
        backgroundImage: "url(/assets/homepage/hero-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1
            className="text-white text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight"
            style={{ fontFamily: '"Lilita One", sans-serif' }}
          >
            Restore Your Balance.
            <br />
            Reclaim Your Peace.
          </h1>

          <div className="mt-6">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-brand-green-dark transition-colors shadow-lg"
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


