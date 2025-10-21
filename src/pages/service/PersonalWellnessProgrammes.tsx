import React, { useState } from "react";
import { Heart, Lightbulb, Users, Zap, User, BookOpen, Award, Activity, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PersonalWellnessProgrammes: React.FC = () => {
  const [currentService, setCurrentService] = useState(0);
  const niceFramework = [
    {
      title: "Nurture",
      description: "We create safe, supportive spaces (virtual or in-person) where people feel seen and valued, encouraging self compassion, self-care, growth and resilience.",
      icon: Heart,
      color: "bg-[#006666]"
    },
    {
      title: "Inspire", 
      description: "Through storytelling, workshops and practical tools, we spark curiosity, discipline and motivation, reframing wellness, change and midlife as opportunities growth and discovery.",
      icon: Lightbulb,
      color: "bg-[#4444B3]"
    },
    {
      title: "Connect",
      description: "Wellness thrives in community. From walking partners to group workshops, we prioritise connection, belonging, shared experiences, removing isolation and fear.",
      icon: Users,
      color: "bg-[#580F41]"
    },
    {
      title: "Empower",
      description: "We equip individuals with action plans, support, strategies and confidence to take charge of their wellbeing and make lasting change in their lives.",
      icon: Zap,
      color: "bg-brand-green"
    }
  ];

  const services = [
    {
      title: "Our Wellness Warrior Programme",
      description: "Wellness is easier with company. Our Wellness Warriors provide advice, companionship and encouragement, whether as walking partners, career / life coaches, ideas support, gym buddies or coffee companions. This programme is about connection as much as health, reminding people that self care does not have to be a solo journey. We are in it together and you are unstoppable!",
      icon: User,
      color: "bg-[#E0F8F8]"
    },
    {
      title: "Life Coaching and One to One Support",
      description: "Our coaching sessions are tailored to your goals and challenges, offering evidence based strategies for stress, energy, self-care, to help you live well, sleep well and age well. We provide a safe, supportive space to explore what's next in your personal or professional life, wellbeing journey, menopause or midlife transitions.",
      icon: Heart,
      color: "bg-[#F6F2FF]"
    },
    {
      title: "Workshops and Group Programmes",
      description: "We deliver interactive sessions on wellbeing, menopause, midlife wellness, stress management, and longevity practices. Our training, webinars, workshops or wellbeing spotlight sessions blend expert insight with peer connection, creating playful, stigma free conversations that reframe midlife as an opportunity.",
      icon: BookOpen,
      color: "bg-[#FFF0E7]"
    },
    {
      title: "Wellness Ambassador Training",
      description: "We train individuals to become trusted wellbeing champions within their organisations. Our frameworks combine empathy, evidence, and practical action, helping to create healthier workplace cultures.",
      icon: Award,
      color: "bg-[#E5FBEC]"
    },
    {
      title: "Live and Age Well (Longevity and Biohacking) Services",
      description: "We are striving to make advanced wellness strategies accessible, from physical therapy and recovery practices to biohacking tools and insights (coming soon). Our focus is on translating and embedding cutting edge science into everyday routines that support energy, focus and vitality.",
      icon: Activity,
      color: "bg-[#FFF0E7]"
    },
    {
      title: "Community Membership and Resources",
      description: "Our community members gain ongoing access to guides, check ins and live webinars. We provide a supportive network where individuals can share experiences, celebrate progress and access practical toolkits designed to fit into busy lives.",
      icon: Users,
      color: "bg-[#E0F8F8]"
    }
  ];

  const values = [
    {
      title: "Community",
      description: "We bring people together, nurture personal and professional growth, put people at the heart of everything we do.",
      color: "bg-[#E0F8F8]"
    },
    {
      title: "Growth", 
      description: "We nurture personal and professional growth, embracing new opportunities and challenges as stepping stones to progress.",
      color: "bg-[#F6F2FF]"
    },
    {
      title: "Fresh",
      description: "We keep our approach fresh, creative and relevant, supporting new possibilities and inspiring fresh approaches to wellness.",
      color: "bg-[#FFF0E7]"
    },
    {
      title: "People",
      description: "We put people at the heart of everything we do, leading with kindness and empathy.",
      color: "bg-[#E5FBEC]"
    },
    {
      title: "Empower",
      description: "We empower individuals to take ownership of their wellbeing and make lasting change in their lives.",
      color: "bg-[#FFF0E7]"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full pt-16 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="flex flex-col justify-center">
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Personal Wellness Programmes
              </h1>
              <div className="w-20 h-1 bg-brand-green rounded-full mb-6" />
              
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                At Fifty Firsts, we believe wellness should be practical, inclusive, and stigma free. Our personal wellness services are designed to support individuals through midlife transitions, workplace challenges, and everyday wellbeing. Everything we do is grounded in community and connection, supporting longer, healthier living.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We are guided by our values of community, growth, fresh, people and empower. Whether through a coaching call, a walking buddy, a training session or a workshop, our goal is to help people feel supported, motivated and equipped to thrive; to be stronger for longer!
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="relative">
              <img 
                src="/assets/homepage/service-cards/service1.png" 
                alt="Personal Wellness Programmes" 
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NICE Framework Section */}
      <section className="w-full py-16 sm:py-24 bg-[#580F41]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Our NICE Framework
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
              Shaped by our NICE framework, we create comprehensive wellness experiences that nurture, inspire, connect, and empower.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {niceFramework.map((item, index) => {
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
      <section className="w-full py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Centered Title and Supporting Text */}
          <div className="text-center mb-12">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Support to Suit Your Self Care and Wellness Needs
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Our comprehensive range of services is designed to meet you wherever you are on your wellness journey.
            </p>
          </div>

          {/* Centered Carousel */}
          <div className="flex justify-center">
            <div className="relative max-w-6xl w-full">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentService * 33.33}%)` }}
                >
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div key={index} className="w-1/3 flex-shrink-0 px-2">
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
                onClick={() => setCurrentService((prev) => (prev > 0 ? prev - 1 : services.length - 3))}
                className="absolute -top-12 right-12 w-10 h-10 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setCurrentService((prev) => (prev < services.length - 3 ? prev + 1 : 0))}
                className="absolute -top-12 right-0 w-10 h-10 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Next service"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Top Row - Heading and First Two Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-6">
            {/* Left Side - Heading & Description */}
            <div className="lg:col-span-4">
              <h2 
                className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Your First Choice
                <br /> Wellness Partner
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We bring people together, nurture personal and professional growth, put people at the heart of everything we do, empower individuals to take ownership of their wellbeing and keep our approach fresh, creative and relevant.
              </p>
            </div>

            {/* Right Side - First Row Cards (Community and People) */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {values.slice(0, 2).map((value, index) => (
                  <div 
                    key={index}
                    className={`${value.color} rounded-2xl p-8 transition-shadow`}
                  >
                    <h3 
                      className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      {value.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row - Growth, Fresh, and Empowering (Full Width) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.slice(2, 5).map((value, index) => (
              <div 
                key={index + 2}
                className={`${value.color} rounded-2xl p-8 transition-shadow`}
              >
                <h3 
                  className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 sm:py-24 bg-[#580F41]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
              Get in touch with us today to discover how our personal wellness programmes can support your unique journey to better health and wellbeing.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-brand-green text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-brand-green-dark transition-colors"
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

export default PersonalWellnessProgrammes;