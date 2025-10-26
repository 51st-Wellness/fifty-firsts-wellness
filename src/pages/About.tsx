import React, { useState } from "react";
import { Target, Eye, Mail } from "lucide-react";
import about1 from "../assets/images/about1.png";
import { subscribeToNewsletter } from "../api/contact-subscription.api";

const About: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await subscribeToNewsletter({ email });

      if (response.success) {
        setMessage(response.message);
        setIsSuccess(true);
        setEmail(""); // Clear the form
      } else {
        setMessage(response.message);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);

      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage("");
        setIsSuccess(false);
      }, 5000);
    }
  };

  const visionPillars = [
    {
      title: "Nurturing",
      description: "Growth grounded in strength, compassion and empathy",
      color: "bg-[#006666]",
    },
    {
      title: "Inspiring",
      description: "Full of possibility, bold and uplifting",
      color: "bg-[#4444B3]",
    },
    {
      title: "Connecting",
      description: "Designed for real people, real workplaces and real life",
      color: "bg-[#580F41]",
    },
    {
      title: "Empowering",
      description: "Practical, inclusive and achievable",
      color: "bg-brand-green",
    },
  ];

  const coreValues = [
    {
      title: "Community",
      description:
        "We believe in the power of belonging, good vibes and great connections, making a space for every voice, every wellness journey, no matter the stage. We celebrate diversity and actively create communities that feel like home, where people and businesses come together.",
      color: "bg-[#E0F8F8]",
    },
    {
      title: "People",
      description:
        "People are at the heart of everything we do. We lead with kindness, listen with empathy and want everyone to know they matter and their wellness matters. We recognise that everyone's wellness is unique and strive to uplift our community through people focused practices.",
      color: "bg-[#F6F2FF]",
    },
    {
      title: "Growth",
      description:
        "We are lifelong learners. Curiosity, adaptability and resilience are key to how we evolve, individually and collectively. We embrace new opportunities and challenges as stepping stones to progress, to living the life we want and getting the support we need to get there.",
      color: "bg-[#FFF0E7]",
    },
    {
      title: "Fresh",
      description:
        "We don't do boring, so whether it's a 'first', a refresh or dreaming big, we support new possibilities and inspire fresh approaches to wellness, midlife, menopause and transformations. Creativity helps us shape meaningful change and bring ideas to life.",
      color: "bg-[#E5FBEC]",
    },
    {
      title: "Empower",
      description:
        "We're committed to helping people take charge of their wellbeing journey. Through resources, support, and encouragement, we foster confidence, ownership, and pride. Our goal is to create an environment where everyone feels equipped to thrive, with confidence and on their own terms.",
      color: "bg-[#FFF0E7]",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full pt-16 pb-16 sm:pt-20 sm:pb-24 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-8">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              About Us
            </h1>
            <div className="w-20 h-1 bg-brand-green mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-12">
            <div className="flex flex-col justify-center">
              <p className="text-base sm:text-lg text-white leading-relaxed mb-6">
                At Fifty Firsts Wellness, we believe wellness and self-care is
                for everyone, at every stage of life, personally and in the
                workplace, empowering progress not perfection. We see midlife as
                a time of reinvention, a time to embrace change, explore new
                possibilities and age well with confidence.
              </p>
              <p className="text-base sm:text-lg text-white leading-relaxed mb-6">
                We want to support the challenging times, like menopause or
                mental / physical ill health, calmly and with empathy. We
                challenge outdated ideas about what it means to live and age
                well, replacing them with a fresh perspective. This stage of
                life can be energising, creative and full of opportunity.
              </p>
            </div>
            <div className="relative">
              <img
                src={about1}
                alt="Wellness Community"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-12">
            <div className="relative order-2 lg:order-1">
              <img
                src="/assets/about/bottom.png"
                alt="Community Connection"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
            <div className="flex flex-col justify-center order-1 lg:order-2">
              <p className="text-base sm:text-lg text-white leading-relaxed mb-6">
                We are built on community and connection. Our work brings people
                together to share experiences, support one another and grow
                stronger through our belonging, new opportunities and life's
                transitions.
              </p>
              <p className="text-base sm:text-lg text-white leading-relaxed">
                By combining practical tools with empowering conversations, we
                help individuals feel equipped to take charge of their
                wellbeing, build resilience and thrive, in work and life, to be
                stronger for longer. We offer a suite of services, resources and
                a network of experts to support you on your wellness journey,
                wherever you are starting from.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full py-16 sm:py-24 bg-[#580F41]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <div>
              <div className="mb-6">
                <div className="w-12 h-12 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center transform">
                    <Target className="w-6 h-6 text-white transform" />
                  </div>
                </div>
                <h2
                  className="text-3xl sm:text-4xl font-semibold text-white mb-4"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Our Mission
                </h2>
              </div>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                At Fifty Firsts Wellness, our mission is to nurture, inspire,
                connect, and empower individuals and businesses on their unique
                wellness journeys. We support people through life's messy
                middles, significant pivots, and transformative moments by
                emphasising that wellness is about progress, not perfection. Our
                aim is to create a safe and compassionate space where every
                step, experience, and intention matters as we embrace the
                complexities of change, midlife transitions, health challenges,
                career shifts, and identity explorations.
              </p>
            </div>

            {/* Vision */}
            <div>
              <div className="mb-6">
                <div className="w-12 h-12 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center transform5">
                    <Eye className="w-6 h-6 text-white transform" />
                  </div>
                </div>
                <h2
                  className="text-3xl sm:text-4xl font-semibold text-white mb-4"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Our Vision
                </h2>
              </div>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                Our vision is to build a world and unite a community where
                wellness feels nurturing, inspiring, connecting, and empowering.
              </p>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                We're redefining what it means to thrive in midlife and beyond,
                with tools that support change, reflection that sparks
                reinvention and programmes that make wellbeing a way of life.
                Because when we nurture, inspire, connect and empower, we don't
                just support wellbeing, we transform it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Origin Story Section */}
      <section className="w-full py-16 sm:py-24 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-4xl mb-12">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-8"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Our Story
            </h2>
            <p className="text-base sm:text-lg text-white  leading-relaxed mb-6">
              Fifty Firsts Wellness was born from a deep understanding that
              wellness is not a destination, but a continuous journey of
              discovery and growth. Our founder's personal experience navigating
              midlife transitions and witnessing the transformative power of
              community support inspired the creation of a space where everyone
              could find their path to wellbeing.
            </p>
            <p className="text-base sm:text-lg text-white  leading-relaxed">
              What started as a vision to reimagine wellness for the modern age
              has evolved into a thriving community. We've built our foundation
              on the belief that every person deserves access to compassionate,
              evidence-based support as they navigate life's changes. Today, we
              continue to grow and evolve alongside our community, always
              staying true to our core mission of nurturing, inspiring,
              connecting, and empowering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <img
              src="/assets/about/story1.png"
              alt="Wellness Journey"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
            <img
              src="/assets/about/story2.png"
              alt="Community Support"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
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
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Our Core Values
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                A vibrant wellness movement fuelled by positivity and insight.
                At the heart of everything we do lies our core values that shape
                our culture, guide our actions and inspire our vision for the
                future.
              </p>
            </div>

            {/* Right Side - First Row Cards (Community and People) */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {coreValues.slice(0, 2).map((value, index) => (
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
            {coreValues.slice(2, 5).map((value, index) => (
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

      {/* World Map Section */}
      {/* <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <img
            src="/assets/about/mapbase.png"
            alt="Global Reach"
            className="w-full h-auto"
          />
        </div>
      </section> */}

      {/* Newsletter Section */}
      <section className="w-full py-16 sm:py-24 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Text */}
            <div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Stay in the wellness loop!
              </h2>
              <p className="text-base sm:text-lg text-white leading-relaxed">
                Subscribe to our newsletter for exclusive tips, stories, and
                product updates to support your wellness journey.
              </p>
            </div>

            {/* Right Side - Newsletter Form */}
            <div>
              <div className="relative">
                <div className="absolute -top-10 -left-2 sm:-top-12 sm:-left-4 w-20 sm:w-24 z-10">
                  <img src="/assets/homepage/waitlist-icon.svg" alt="mail" />
                </div>

                <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl max-w-xl relative">
                  <label className="block text-xs pt-5 text-gray-500 ml-1 mb-1">
                    Email
                  </label>

                  {/* Success/Error Message */}
                  {message && (
                    <div
                      className={`mb-3 p-3 rounded-lg text-sm ${
                        isSuccess
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail className="w-5 h-5" />
                      </span>
                      <input
                        type="email"
                        placeholder="john.doe@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:opacity-50"
                        required
                      />
                    </div>
                    <div className="flex justify-start">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-full bg-brand-green text-white px-6 py-3 font-semibold hover:bg-brand-green-dark transition-colors whitespace-nowrap mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
