import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LazyImage from "../ui/LazyImage";

const SLIDES = [
  {
    image: "/assets/services/redlight.png",
    title: "Red Light Therapy",
    subtitle: "Cellular repair, circulation & rejuvenation",
  },
  {
    image: "/assets/services/contrast.png",
    title: "Contrast Therapy",
    subtitle: "Sauna & cold plunge",
  },
];

const LuceoLoungeSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    setTimeout(() => setIsPaused(false), 1000);
  };

  useEffect(() => {
    if (isPaused) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      return;
    }
    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isPaused]);

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-[#580F41]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-white"
              style={{ fontFamily: '"Lilita One", sans-serif' }}
            >
              Luceo Lounge
            </h2>
            <div className="w-10 sm:w-12 lg:w-16 h-1 bg-brand-green mx-auto lg:mx-0 rounded-full mt-2 mb-4 sm:mb-6" />
            <p className="text-white/90 text-xs sm:text-sm md:text-base leading-6 sm:leading-7 mb-3 sm:mb-4">
              Our wellness hub for regeneration, revival and restorative health.
              Luceo Lounge offers evidence-based light and temperature therapies
              to elevate your physical and mental wellbeing.
            </p>
            <p className="text-white/90 text-xs sm:text-sm md:text-base leading-6 sm:leading-7 mb-4 sm:mb-6">
              Two core treatments—<strong className="text-white">Red Light Therapy</strong> (photobiomodulation)
              and <strong className="text-white">Contrast Therapy</strong> (hot & cold immersion)—each
              designed to restore vitality, enhance recovery and bring equilibrium
              to body and mind.
            </p>
            <Link
              to="/services/luceo-lounge"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold hover:bg-brand-green-dark transition-colors"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Discover Luceo Lounge
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </Link>
          </div>

          {/* Right: Carousel with full-width images, text overlay bottom-right, swiper dots – visible on all screen sizes */}
          <div className="order-1 lg:order-2 w-full">
            <div
              className="overflow-hidden touch-pan-x rounded-xl sm:rounded-2xl"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {SLIDES.map((slide, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 relative"
                  >
                    <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[3/2] lg:max-h-[340px] xl:max-h-[380px]">
                      <LazyImage
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-12 pb-3 pr-4 pl-4 sm:pb-4 sm:pr-5 sm:pl-5 lg:pt-14 lg:pb-4 lg:pr-5 lg:pl-5 text-right"
                        aria-hidden
                      >
                        <h3
                          className="text-white font-semibold text-sm sm:text-base lg:text-lg drop-shadow-sm"
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          {slide.title}
                        </h3>
                        <p className="text-white/90 text-xs sm:text-sm lg:text-base mt-0.5 lg:mt-1 drop-shadow-sm">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Swiper dots – always visible */}
            {SLIDES.length > 1 && (
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-4">
                {SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 1000);
                    }}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-brand-green w-4 sm:w-5"
                        : "bg-white/50 w-1.5 sm:w-2"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuceoLoungeSection;
