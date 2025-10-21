import React from "react";
import { Link } from "react-router-dom";

type ServiceCardProps = {
  imageSrc: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
  isComingSoon?: boolean;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ imageSrc, title, description, ctaText, ctaLink, isComingSoon = false }) => {
  const CTAButton = () => {
    if (isComingSoon) {
      return (
        <button
          className="mt-6 inline-block bg-gray-400 text-white px-6 py-3 rounded-full text-sm font-semibold cursor-not-allowed"
        >
          {ctaText}
        </button>
      );
    }
    
    return (
      <Link
        to={ctaLink || "/marketplace"}
        className="mt-6 inline-block bg-brand-green text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors"
      >
        {ctaText}
      </Link>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border border-gray-100 h-full">
      <div className="w-full overflow-hidden rounded-2xl">
        <img src={imageSrc} alt={title} className="w-full h-72 sm:h-80 object-cover" />
      </div>
      <h3 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-900 min-h-[64px] flex items-center justify-center" style={{ fontFamily: '"League Spartan", sans-serif' }}>{title}</h3>
      <p className="mt-4 text-sm sm:text-base text-gray-600 leading-7 flex-grow">
        {description}
      </p>
      <CTAButton />
    </div>
  );
};

const ServicesSection: React.FC = () => {
  return (
    <section
      className="relative w-full py-24 lg:py-32 min-h-[1100px] lg:min-h-[1300px] z-20"
      style={{
        backgroundImage: 'url(/assets/homepage/service-cards/new-service-bg.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        marginBottom: '-160px',
        zIndex: 20,
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-normal text-white"
            style={{ fontFamily: '"Lilita One", sans-serif' }}
          >
            Wellness Pillars
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <ServiceCard
            imageSrc="/assets/homepage/service-cards/service1.png"
            title="Personal Wellness Services"
            description="This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle."
            ctaText="Learn More"
            ctaLink="/service/personal-wellness"
          />
          <ServiceCard
            imageSrc="/assets/homepage/service-cards/service2.png"
            title="Workplace Wellness Services"
            description="This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle."
            ctaText="Learn More"
            ctaLink="/service/business-wellness"
          />
          <ServiceCard
            imageSrc="/assets/homepage/service-cards/service3.png"
            title="Wellness Products and Supplements"
            description="This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle."
            ctaText="Coming Soon"
            isComingSoon={true}
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;


