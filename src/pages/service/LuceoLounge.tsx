import React from "react";
import {
  Sun,
  Droplets,
  Heart,
  Brain,
  Sparkles,
  Shield,
  ArrowRight,
  Thermometer,
  Waves,
  Leaf,
} from "lucide-react";
import { Link } from "react-router-dom";

const LuceoLounge: React.FC = () => {
  const redLightBenefits = [
    {
      title: "Skin Refresh & Radiance",
      description:
        "Red Light Therapy naturally boosts collagen production, helping skin appear smoother, brighter and more even in tone. With consistent sessions, many clients experience a rejuvenated complexion and a youthful glow.",
      icon: Sparkles,
    },
    {
      title: "Enhanced Healing & Repair",
      description:
        "This gentle therapy supports the body's natural recovery processes, encouraging faster tissue repair and helping minimise the appearance of scars. It's a restorative boost for overall skin and cellular health.",
      icon: Heart,
    },
    {
      title: "Comfort, Circulation & Deep Relief",
      description:
        "Near infrared wavelengths warm and soothe deeper tissues, promoting healthy circulation and easing everyday muscle and joint discomfort. It's a calming, restorative experience for the whole body.",
      icon: Waves,
    },
    {
      title: "Stronger, Healthier Hair",
      description:
        "Low level red light can energise hair follicles, supporting fuller, healthier looking hair and complementing wider hair wellness routines.",
      icon: Leaf,
    },
    {
      title: "Mood Lift & Mental Clarity",
      description:
        "Emerging research suggests red light exposure may help support emotional balance and overall wellbeing. Many clients report leaving sessions feeling brighter, more centred and mentally refreshed.",
      icon: Brain,
    },
  ];

  const contrastBenefits = [
    {
      title: "Muscle Recovery & Reduced Inflammation",
      description:
        "Hot/cold cycling can alleviate delayed onset muscle soreness (DOMS) and regulate the nervous system for faster recovery.",
      icon: Shield,
    },
    {
      title: "Mental Health & Mood Boost",
      description:
        "The stimulation of endorphins, serotonin and dopamine creates a natural antidepressant effect and promotes emotional balance.",
      icon: Brain,
    },
    {
      title: "Sleep Enhancement",
      description:
        "By regulating cortisol and relaxing the body, contrast therapy can support deeper, more restorative sleep.",
      icon: Heart,
    },
    {
      title: "Hormonal Support",
      description:
        "Heat helps alleviate cramping and muscle tension, while mood regulating endorphins support those experiencing hormonal symptoms like menopause / imbalances.",
      icon: Heart,
    },
  ];

  const wellnessPhilosophy = [
    {
      title: "Cellular Health & Recovery",
      description:
        "Through therapies that enhance mitochondrial function, circulation, and natural healing.",
      icon: Heart,
      color: "bg-[#E0F8F8]",
    },
    {
      title: "Nervous System Balance",
      description:
        "Helping you shift between activation and calm to build resilience and reduce stress.",
      icon: Brain,
      color: "bg-[#F6F2FF]",
    },
    {
      title: "Mental Clarity & Emotional Restoration",
      description:
        "Light and temperature exposure can positively influence mood-regulating neurochemistry.",
      icon: Sparkles,
      color: "bg-[#FFF0E7]",
    },
    {
      title: "Preventative Wellness",
      description:
        "Safe, science supported modalities that fit naturally into modern routines to maintain long-term health.",
      icon: Shield,
      color: "bg-[#E5FBEC]",
    },
  ];

  const whyChoose = [
    "Evidence-led therapies rooted in established clinical research",
    "A tranquil environment crafted for restoration and renewal",
    "State-of-the-art equipment and meticulously guided protocols",
    "Wellness sessions designed to fit busy professional lives",
    "A premium, peaceful retreat in the heart of the our wonderful town",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full pt-16 pb-16 sm:pt-20 sm:pb-24 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="flex flex-col justify-center">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Luceo Lounge
              </h1>
              <div className="w-20 h-1 bg-white rounded-full mb-6" />

              <p className="text-base sm:text-lg text-white leading-relaxed mb-6">
                Our Wellness Hub, Luceo Lounge is here! A wellness space for
                regeneration, revival and restorative health.
              </p>
              <p className="text-base sm:text-lg text-white leading-relaxed">
                At Luceo Lounge, our mission is simple: to elevate your
                physical and mental wellbeing through evidence based light and
                temperature therapies. Our lounge offers two core treatments,
                Red Light Therapy and Contrast Therapy. Each designed to restore
                vitality, enhance recovery and bring equilibrium to both body and
                mind.
              </p>
            </div>

            {/* Right Side - Image Placeholder */}
            <div className="relative">
              <div className="w-full h-[400px] bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">
                  Luceo Lounge Image Placeholder
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Therapies Section */}
      <section className="w-full py-16 sm:py-24 bg-[#580F41]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Our Core Wellness Therapies
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
              Two evidence-based treatments designed to restore vitality, enhance
              recovery and bring equilibrium to both body and mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Red Light Therapy Card */}
            <div className="bg-[#006666] rounded-2xl p-6 text-left">
              <div className="w-12 h-12 mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <h3
                className="text-xl font-semibold text-white mb-3"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Red Light Therapy (Photobiomodulation)
              </h3>
              <p className="text-sm text-white/90 leading-relaxed mb-4">
                Uses low level wavelengths of red and near infrared light to
                stimulate cellular repair, enhance circulation and promote
                tissue rejuvenation. It works at a cellular level by acting on
                the mitochondria, the "power plants" of your cells.
              </p>
              <p className="text-xs text-white/80 leading-relaxed">
                Typical course: Introductory session of 10 minutes (5 mins front
                / 5 min back) followed by 20 minute sessions.
              </p>
            </div>

            {/* Contrast Therapy Card */}
            <div className="bg-brand-green rounded-2xl p-6 text-left">
              <div className="w-12 h-12 mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <h3
                className="text-xl font-semibold text-white mb-3"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Contrast Therapy (Hot and Cold Immersion)
              </h3>
              <p className="text-sm text-white/90 leading-relaxed mb-4">
                Alternating between hot and cold environments to improve physical
                recovery, enhance mood and strengthen the nervous system. Our
                suite provides access to a Sauna pod, Steam Pod and Cold Plunge
                Tub.
              </p>
              <p className="text-xs text-white/80 leading-relaxed">
                Typical session: 5–10 minutes in sauna, 2–5 minutes in cold
                plunge, repeated 2–3 cycles for optimal effect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Red Light Therapy Details */}
      <section className="w-full py-16 sm:py-24 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
            {/* Left Side - Image Placeholder */}
            <div className="relative">
              <div className="w-full h-[400px] bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">
                  Red Light Therapy Image Placeholder
                </span>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Red Light Therapy
              </h2>
              <div className="w-20 h-1 bg-white rounded-full mb-6" />

              <div className="mb-6">
                <h3
                  className="text-xl font-semibold text-white mb-3"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  How it Works
                </h3>
                <ul className="text-base text-white/90 leading-relaxed space-y-2">
                  <li>
                    • Red Light (approx. 620–750 nm) and Near Infrared Light
                    penetrate the skin to be absorbed by cellular components.
                  </li>
                  <li>
                    • This interaction can support improved mitochondrial
                    function, triggering biological responses such as enhanced
                    blood flow and anti inflammatory effects.
                  </li>
                </ul>
              </div>

              <p className="text-base text-white/90 leading-relaxed">
                Red Light Therapy is safe and non-invasive. It doesn't use UV
                rays and requires no downtime, making it an ideal addition to
                your weekly wellness routine.
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="mt-12">
            <h3
              className="text-2xl sm:text-3xl font-semibold text-white mb-8 text-center"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Key Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redLightBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <div className="w-10 h-10 mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4
                      className="text-lg font-semibold text-white mb-3"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contrast Therapy Details */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
            {/* Left Side - Content */}
            <div className="flex flex-col justify-center">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Contrast Therapy
              </h2>
              <div className="w-20 h-1 bg-brand-green rounded-full mb-6" />

              <div className="mb-6">
                <h3
                  className="text-xl font-semibold text-gray-900 mb-3"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  How it Works
                </h3>
                <ul className="text-base text-gray-700 leading-relaxed space-y-2">
                  <li>
                    • The dramatic temperature shifts stimulate circulation,
                    helping flush metabolic waste and deliver nutrients to
                    muscles.
                  </li>
                  <li>
                    • It activates both the sympathetic and parasympathetic
                    nervous systems, helping the body transition out of fight or
                    flight and into deeper calm.
                  </li>
                </ul>
              </div>

              <p className="text-base text-gray-700 leading-relaxed mb-4">
                Breathwork is central: calm breathing in heat, regulated
                breathing in cold.
              </p>
            </div>

            {/* Right Side - Image Placeholder */}
            <div className="relative">
              <div className="w-full h-[400px] bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">
                  Contrast Therapy Image Placeholder
                </span>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="mt-12">
            <h3
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Key Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contrastBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                  >
                    <div className="w-10 h-10 mb-4 bg-brand-green/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-green" />
                    </div>
                    <h4
                      className="text-lg font-semibold text-gray-900 mb-3"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Philosophy Section */}
      <section className="w-full py-16 sm:py-24 bg-[#580F41]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Our Wellness Philosophy
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
              At Luceo Lounge, we believe wellbeing is both holistic and highly
              personal. Our space is designed to support your journey to optimal
              health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wellnessPhilosophy.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`${item.color} rounded-2xl p-6 text-left`}
                >
                  <div className="w-12 h-12 mb-4 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-gray-900 mb-3"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Luceo Lounge Section */}
      <section className="w-full py-16 sm:py-24 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Why Choose Luceo Lounge
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <ul className="space-y-4 list-disc list-inside">
              {whyChoose.map((item, index) => (
                <li
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
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
              Ready to Experience Luceo Lounge?
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
              Contact us today to book your session and begin your journey to
              regeneration, revival and restorative health.
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

export default LuceoLounge;
