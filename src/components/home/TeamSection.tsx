import React, { useState } from "react";

// SVG Path Constants for the Alternating Card Shapes using clip-path
const PATH_CONVEX_TOP = "path('M 0 20 Q 88 -10, 176 20 L 176 204 Q 88 190, 0 204 Z')"; // Top bulges up, bottom pinches in
const PATH_CONCAVE_TOP = "path('M 0 20 Q 88 50, 176 20 L 176 204 Q 88 234, 0 204 Z')"; // Top dips down, bottom bulges out

type FrameVariant = "convex" | "concave"; // convex: top bulges up; concave: top dips down

const TeamFrame: React.FC<{ variant: FrameVariant; color: string; children?: React.ReactNode }> = ({ variant, color, children }) => {
  const clipPathStyle = variant === "convex" ? PATH_CONVEX_TOP : PATH_CONCAVE_TOP;
  
  return (
    <div
      className="relative overflow-hidden shadow-xl"
      style={{
        clipPath: clipPathStyle,
        backgroundColor: color,
        width: '176px',
        height: '224px',
      }}
    >
      {children}
    </div>
  );
};

const teamMembers = [
  { name: "John Smith", role: "Company CEO", variant: "convex" as const, color: "#0FB9A5" },
  { name: "David Johnson", role: "Co‑Founder", variant: "concave" as const, color: "#530F40" },
  { name: "Mary Johnson", role: "Property Managers", variant: "convex" as const, color: "#007a7e" },
  { name: "Patricia Davis", role: "Estate Consultant", variant: "concave" as const, color: "#0FB9A5" },
];

const TeamSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const totalSlides = 2; // 2 slides (showing 2 cards per slide on mobile)
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  return (
    <section className="w-full py-40 sm:py-52">
      <div
        className="max-w-7xl mx-auto px-4 text-center bg-no-repeat"
        style={{
          backgroundImage: "url(/assets/homepage/about-section-bg.svg)",
          backgroundSize: "200% 200%",
          backgroundPosition: "center",
        }}
      >
        <h2
          className="text-3xl sm:text-4xl font-normal text-brand-green-dark mb-4"
          style={{ fontFamily: '"Lilita One", sans-serif' }}
        >
          Meet Our Team
        </h2>
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-600 mb-10">
          Our dedicated team of experienced wellness professionals is at the heart of what we do. With deep knowledge and expertise allowing you achieve your wellness needs.
        </p>
        
        {/* Desktop: Show all cards in a row */}
        <div className="hidden md:flex justify-center flex-wrap gap-x-6 gap-y-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <TeamFrame variant={member.variant} color={member.color}>
                {/* <img src="/assets/homepage/team/Team-1.svg" alt={member.name} className="w-full h-full object-cover p-2 rounded-2xl" /> */}
              </TeamFrame>
              <div className={member.variant === "convex" ? "-mt-3 text-center" : "mt-3 text-center"}>
                <h3 className="text-base font-semibold text-gray-900">{member.name}</h3>
                <p className="text-xs" style={{ color: "#580F41" }}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel showing 2 cards at a time */}
        <div 
          className="md:hidden overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className="flex transition-transform duration-300 ease-in-out touch-pan-x"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* Slide 1: First 2 members */}
            <div className="min-w-full flex justify-center gap-6">
              {teamMembers.slice(0, 2).map((member, index) => (
                <div key={index} className="flex flex-col items-center">
                  <TeamFrame variant={member.variant} color={member.color}>
                    {/* <img src="/assets/homepage/team/Team-1.svg" alt={member.name} className="w-full h-full object-cover p-2 rounded-2xl" /> */}
                  </TeamFrame>
                  <div className={member.variant === "convex" ? "-mt-3 text-center" : "mt-3 text-center"}>
                    <h3 className="text-base font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-xs" style={{ color: "#580F41" }}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slide 2: Last 2 members */}
            <div className="min-w-full flex justify-center gap-6">
              {teamMembers.slice(2, 4).map((member, index) => (
                <div key={index + 2} className="flex flex-col items-center">
                  <TeamFrame variant={member.variant} color={member.color}>
                    {/* <img src="/assets/homepage/team/Team-1.svg" alt={member.name} className="w-full h-full object-cover p-2 rounded-2xl" /> */}
                  </TeamFrame>
                  <div className={member.variant === "convex" ? "-mt-3 text-center" : "mt-3 text-center"}>
                    <h3 className="text-base font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-xs" style={{ color: "#580F41" }}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation - Indicators only on mobile */}
        <div className="mt-10 flex md:hidden items-center justify-center gap-2">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="touch-manipulation"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span 
                className="w-10 h-[2px] inline-block transition-colors"
                style={{ backgroundColor: currentSlide === index ? "#580F41" : "#d1d5db" }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;


