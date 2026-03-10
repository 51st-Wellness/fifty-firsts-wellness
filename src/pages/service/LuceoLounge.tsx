import React from "react";
import {
  Sun,
  Heart,
  Brain,
  Sparkles,
  Shield,
  ArrowRight,
  Thermometer,
  Waves,
  Leaf,
} from "lucide-react";

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
      {/* Hero Section – full-bleed image, text bottom left */}
      <section className="relative w-full min-h-[90vh] sm:min-h-[90vh] lg:min-h-[90vh] flex flex-col justify-end">
        <img
          src="/assets/services/hero.png"
          alt="Luceo Lounge – wellness and restoration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pb-12 sm:pb-16 lg:pb-20 pt-32">
          <div className="max-w-xl">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white mb-4 drop-shadow-md"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Luceo Lounge
            </h1>
            <div className="w-20 h-1 bg-white rounded-full mb-6 drop-shadow-sm" />
            <p className="text-base sm:text-lg lg:text-xl text-white leading-relaxed mb-4 drop-shadow-md">
              Our Wellness Hub. A wellness space for regeneration, revival and restorative health.
            </p>
            <p className="text-base sm:text-lg text-white/95 leading-relaxed max-w-lg drop-shadow-md">
              At Luceo Lounge, our mission is simple: to elevate your physical and mental wellbeing through evidence-based light and temperature therapies. Red Light Therapy and Contrast Therapy—each designed to restore vitality, enhance recovery and bring equilibrium to body and mind.
            </p>
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
                suite provides access to a Sauna pod and Cold Plunge
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
            {/* Left Side - Image */}
            <div className="relative">
              <img
                src="/assets/services/redlight.png"
                alt="Red Light Therapy session"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
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

            {/* Right Side - Image */}
            <div className="relative">
              <img
                src="/assets/services/contrast.png"
                alt="Contrast Therapy – sauna and cold plunge"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
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

      {/* Philosophy – editorial block + grid */}
      <section className="w-full py-20 sm:py-28 lg:py-36 bg-[#580F41]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl mb-16 lg:mb-20">
            <p className="text-white/60 text-sm uppercase tracking-widest mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Our Philosophy
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Wellbeing is holistic and highly personal.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Our space is designed to support your journey to optimal health.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wellnessPhilosophy.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={`${item.color} rounded-2xl p-6 lg:p-8`}>
                  <div className="w-12 h-12 mb-5 rounded-xl bg-white/80 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-800" />
                  </div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose – two-column list, clean */}
      <section className="w-full py-20 sm:py-28 lg:py-36 bg-brand-green-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start">
            <div className="lg:col-span-4 mb-12 lg:mb-0 lg:sticky lg:top-24">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                Why Choose Luceo Lounge
              </h2>
            </div>
            <div className="lg:col-span-8">
              <ul className="space-y-1">
                {whyChoose.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 py-5 border-b border-white/15 last:border-b-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-2.5 flex-shrink-0" aria-hidden />
                    <span className="text-white/90 text-base sm:text-lg leading-relaxed pt-0.5">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA – minimal, confident */}
      <section className="w-full py-20 sm:py-28 lg:py-36 bg-[#580F41]">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            Ready to Experience Luceo Lounge?
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Book your session and begin your journey to regeneration, revival and restorative health.
          </p>
          <a
            href="https://www.fresha.com/book-now/luceo-lounge-by-fifty-firsts-wellness-vh9nwjwm/services?lid=2859509&share=true&pId=2764905"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-brand-green px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/95 transition-colors"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Book Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default LuceoLounge;
