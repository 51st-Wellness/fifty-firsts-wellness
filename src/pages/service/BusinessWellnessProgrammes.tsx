import React, { useState } from "react";
import { Heart, Lightbulb, Users, Zap, User, BookOpen, Award, Activity, ChevronLeft, ChevronRight, ArrowRight, Target, TrendingUp, Shield, CheckCircle, Sparkles, Code, Zap as ZapIcon, DollarSign, Cloud, Route, HelpCircle, Settings, Heart as HeartIcon } from "lucide-react";
import { Link } from "react-router-dom";

// FeaturesSectionWithHoverEffects Component
function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Reduce absenteeism",
      description: "Decrease sick days and presenteeism through comprehensive wellness support.",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: "Boost productivity",
      description: "Improve team engagement and performance with evidence-based wellness strategies.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Improve retention",
      description: "Create a supportive culture that makes employees want to stay and thrive.",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      title: "Support mental health",
      description: "Build emotional resilience and create safe spaces for mental health discussions.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Create inclusive workplaces",
      description: "Foster diversity, belonging, and psychological safety for all team members.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Boost engagement",
      description: "Increase team motivation and active participation in wellness initiatives.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Deliver better experience",
      description: "Enhance overall employee satisfaction and workplace culture.",
      icon: <Award className="w-6 h-6" />,
    },
    {
      title: "Increase enterprise value",
      description: "Demonstrate ESG values and create strategic competitive advantages.",
      icon: <Target className="w-6 h-6" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={`flex flex-col lg:border-r py-10 relative group/feature border-gray-200 ${
        (index === 0 || index === 4) && "lg:border-l border-gray-200"
      } ${index < 4 && "lg:border-b border-gray-200"}`}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-brand-green/10 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-brand-green/10 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-brand-green">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-300 group-hover/feature:bg-brand-green transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-gray-800">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-600 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

const BusinessWellnessProgrammes: React.FC = () => {
  const [currentService, setCurrentService] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
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
    
    const isDesktop = window.innerWidth >= 1024;
    const maxIndex = isDesktop ? Math.max(0, services.length - 3) : services.length - 1;
    
    if (isLeftSwipe && currentService < maxIndex) {
      setCurrentService(currentService + 1);
    }
    if (isRightSwipe && currentService > 0) {
      setCurrentService(currentService - 1);
    }
  };
  
  const whatWeOffer = [
    {
      title: "Strategic",
      description: "Aligned with your values, culture, and business goals",
      icon: Target,
      color: "bg-[#006666]"
    },
    {
      title: "Scalable", 
      description: "Built to grow with your team and adapt to change",
      icon: TrendingUp,
      color: "bg-[#4444B3]"
    },
    {
      title: "Inclusive",
      description: "Designed for frontline staff, managers, and everyone in between",
      icon: Users,
      color: "bg-[#580F41] border border-white/30"
    },
    {
      title: "Actionable",
      description: "Easy to implement, measure, and sustain",
      icon: CheckCircle,
      color: "bg-brand-green"
    }
  ];

  const services = [
    {
      title: "Menopause Policy, Strategy and Action Plans",
      description: "Tailored support, policy guidance and training for teams to create inclusive workplace environments.",
      icon: Heart,
      color: "bg-[#E0F8F8]"
    },
    {
      title: "Policy and Strategy Development",
      description: "Your wellness partner to develop or refresh your Workplace wellbeing programme with policy, strategy, and planning.",
      icon: BookOpen,
      color: "bg-[#F6F2FF]"
    },
    {
      title: "Wellbeing Ambassador Training",
      description: "Frameworks and onboarding for peer-led wellbeing ambassadors; sessions to help you embed wellbeing and educate those passionate about supporting others (certificate awarded).",
      icon: Award,
      color: "bg-[#FFF0E7]"
    },
    {
      title: "Workplace Needs Assessments",
      description: "Collaborative audits / needs assessments to identify gaps and opportunities in your current wellness approach.",
      icon: Activity,
      color: "bg-[#E5FBEC]"
    },
    {
      title: "Bespoke Wellbeing Training",
      description: "Workshops tailored to support your policy, strategy and equip your team with necessary knowledge and awareness.",
      icon: User,
      color: "bg-[#FFF0E7]"
    },
    {
      title: "Branded Content & Toolkits",
      description: "Engaging resources for internal comms and campaigns to maintain consistent wellness messaging across your organization.",
      icon: BookOpen,
      color: "bg-[#E0F8F8]"
    },
    {
      title: "Workshops & Programmes",
      description: "Open and transparent sessions on midlife transitions, supporting an aging / diverse workforce, mental health and more.",
      icon: Users,
      color: "bg-[#F6F2FF]"
    },
    {
      title: "Workplace Space and Office Planning",
      description: "Helping you to co-create a welcoming office environment that fosters physical, mental and social wellness, including tech free zones and quiet spaces.",
      icon: Shield,
      color: "bg-[#FFF0E7]"
    },
    {
      title: "Bespoke Services",
      description: "Working with therapists, nutritionists, financial and cyber wellbeing partners (and much more) we can create bespoke wellness support to suit your needs.",
      icon: Zap,
      color: "bg-[#E5FBEC]"
    }
  ];

  const benefits = [
    "Reduce absenteeism and presenteeism",
    "Improve retention and morale", 
    "Support mental health and emotional resilience",
    "Create safer, more inclusive workplaces",
    "Boost productivity and engagement across teams",
    "Deliver improved employee experience",
    "Demonstrate core, holistic ESG values",
    "Increase enterprise value / USP"
  ];

  return (
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{
        __html: `
          .overflow-hidden::-webkit-scrollbar {
            display: none;
          }
          .overflow-hidden {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `
      }} />
      {/* Hero Section */}
      <section className="w-full pt-16 pb-16 sm:pt-20 sm:pb-24 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="flex flex-col justify-center">
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
              Workplace Wellness Programmes
              </h1>
              <div className="w-20 h-1 bg-white rounded-full mb-6" />
              
              <p className="text-base sm:text-lg text-white leading-relaxed mb-6">
                At Fifty Firsts Wellness, we help businesses build wellbeing into the everyday, building a foundation of performance and belonging; not a perk, but as a strategic advantage.
              </p>
              <p className="text-base sm:text-lg text-white leading-relaxed">
                We know that when people feel supported, connected and empowered, they show up differently. They're more engaged, more resilient and more likely to thrive.
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="relative">
              <img 
                src="/assets/homepage/service-cards/service1.png" 
                alt="Business Wellness Programmes" 
                className="w-3/4 h-auto rounded-2xl shadow-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="w-full py-16 sm:py-24 bg-[#580F41]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              What We Offer
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
              We work with businesses to co-create wellness solutions that are strategic, scalable, inclusive, and actionable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatWeOffer.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className={`${item.color} rounded-2xl p-6 text-left`}
                >
                  <div className="w-12 h-12 mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
            </div>
                  <h3 
                    className="text-xl font-semibold text-white mb-3"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {item.description}
                  </p>
            </div>
              );
            })}
            </div>
            </div>
          </section>

      {/* Services Section */}
      <section className="w-full py-16 sm:py-24 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Centered Title and Supporting Text */}
          <div className="text-center mb-12">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Our Services
            </h2>
            <p className="text-base sm:text-lg text-white leading-relaxed max-w-3xl mx-auto">
              Our services support your compliance with the Employment Rights Bill and help create a culture where wellbeing is an integral strategy.
            </p>
          </div>

          {/* Centered Carousel */}
          <div className="flex justify-center">
            <div className="relative max-w-6xl w-full">
              <div 
                className="overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
              <div 
                className="flex transition-transform duration-300 ease-in-out touch-pan-x"
                style={{ 
                  transform: window.innerWidth >= 1024 
                    ? `translateX(-${currentService * 33.33}%)` 
                    : `translateX(-${currentService * 100}%)` 
                }}
              >
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div key={index} className="w-full lg:w-1/3 flex-shrink-0 px-2">
                      <div className={`${service.color} rounded-2xl p-6 transition-shadow hover:shadow-lg h-full`}>
                        <div className="w-10 h-10 mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-700" />
                </div>
                        <h3 
                          className="text-lg font-semibold text-gray-900 mb-3"
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {service.description}
                        </p>
                </div>
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() => {
                  const isDesktop = window.innerWidth >= 1024;
                  const maxIndex = isDesktop ? Math.max(0, services.length - 3) : services.length - 1;
                  setCurrentService((prev) => (prev > 0 ? prev - 1 : maxIndex));
                }}
                className="absolute -top-12 right-12 w-10 h-10 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => {
                  const isDesktop = window.innerWidth >= 1024;
                  const maxIndex = isDesktop ? Math.max(0, services.length - 3) : services.length - 1;
                  setCurrentService((prev) => (prev < maxIndex ? prev + 1 : 0));
                }}
                className="absolute -top-12 right-0 w-10 h-10 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Next service"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Centered Header and Description */}
          <div className="text-center mb-12">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Why It Matters
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
              Wellness isn't a nice-to-have, it's a performance enabler. When done well, it helps transform your workplace culture and business outcomes.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              We don't do one-size-fits-all. We listen, adapt and build with you, not for you. Whether you're just starting your wellness programme or looking to deepen your impact, we'll meet you where you are and help you move forward with clarity and confidence.
            </p>
          </div>

          {/* Features Grid */}
          <FeaturesSectionWithHoverEffects />
        </div>
          </section>

      {/* CTA Section */}
      <section className="w-full py-16 sm:py-24 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Ready to Transform Your Workplace?
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
              Contact us today for a free 30 minutes discovery call and let's discuss how we can help build wellbeing into your everyday business strategy.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-white text-brand-green px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/90 transition-colors"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Contact Us Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      </div>
  );
};

export default BusinessWellnessProgrammes;