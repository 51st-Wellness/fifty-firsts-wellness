import React from "react";
import { Link } from "react-router-dom";

type ServiceCardProps = {
  imageSrc: string;
  title: string;
  description: string;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ imageSrc, title, description }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 flex flex-col items-center text-center border border-gray-100">
      <div className="w-full overflow-hidden rounded-2xl">
        <img src={imageSrc} alt={title} className="w-full h-56 sm:h-60 object-cover" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>{title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-6">
        {description}
      </p>
      <div className="mt-4 w-full flex-1" />
      <Link
        to="/marketplace"
        className="mt-auto inline-block bg-brand-green text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors"
      >
        Shop Now
      </Link>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  return (
    <section
      className="relative w-full py-24 lg:py-32 min-h-[1100px] lg:min-h-[1300px] z-20"
      style={{
        backgroundImage: 'url(/assets/homepage/service-cards/service-bg/new-service-bg.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        marginBottom: '-160px',
        zIndex: 20,
      }}
    >
      {/* Decorative elements commented out per request */}
      {/**
      <img src="/assets/homepage/service-cards/service-bg/top-left.svg" alt="" className="pointer-events-none select-none absolute top-12 -left-16 w-[240px] sm:w-[300px] opacity-80 z-0" />
      <img src="/assets/homepage/service-cards/service-bg/bottom-left.svg" alt="" className="pointer-events-none select-none absolute bottom-10 -left-12 w-[180px] sm:w-[220px] opacity-80 z-0" />
      <img src="/assets/homepage/service-cards/service-bg/bottom-right.svg" alt="" className="pointer-events-none select-none absolute bottom-24 right-10 w-[300px] sm:w-[360px] opacity-80 z-0" />
      */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-normal text-white"
            style={{ fontFamily: '"Lilita One", sans-serif' }}
          >
            Our Services
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <ServiceCard
            imageSrc="/assets/homepage/service-cards/service-1.svg"
            title="Wellness Programmes for Healthy Lifestyle"
            description="This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle."
          />
          <ServiceCard
            imageSrc="/assets/homepage/service-cards/service-2.svg"
            title="Personalized Sustainable Meal Plans"
            description="This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle."
          />
          <ServiceCard
            imageSrc="/assets/homepage/service-cards/service-3.svg"
            title="Products and Food Supplements"
            description="This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle."
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;


