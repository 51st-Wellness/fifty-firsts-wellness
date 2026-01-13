import React from "react";
import { Link } from "react-router-dom";

const AboutSection: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-24 md:py-32 lg:py-40 xl:py-52 bg-brand-green-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center bg-no-repeat"
        style={{
          backgroundImage: "url(/assets/homepage/about-section-bg.svg)",
          backgroundSize: "250% 250%",
          backgroundPosition: "center",
        }}
      >
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-normal text-white mb-3 sm:mb-4"
          style={{ fontFamily: '"Lilita One", sans-serif' }}
        >
          About Us
        </h2>
        <div className="w-12 sm:w-16 h-1 bg-brand-green-light mx-auto rounded-full mb-6 sm:mb-8 md:mb-12" />
        <p className="text-white text-sm sm:text-base leading-6 sm:leading-7">
          We're not just a wellness brand, we are re-writing the narrative on wellness and midlife. 
          We're building a rebellion against burnout, overwhelm, invisibility and one-size-fits-all wellness services. 
          Whether you're levelling up your routine or rewriting the rules entirely, we make wellness simple, available and a little bit of fun. 
          Living well shouldn't be for the elite and ageing doesn't have to be a decline, it's an uprising! 
          We have coaching, workshops, webinars, wellness warrior events and so much more to kickstart or elevate your wellbeing, 
          inspire your midlife reinvention or walk alongside you during your menopause transition. 
          Our workplace wellness programmes build momentum because thriving people make thriving businesses. 
          We help teams and leaders nurture positive employee experience, inspire wellness work-spaces, 
          build connection and identity with purpose and empower your people to embrace and manage their own wellbeing. 
          Ask us about our Wellbeing Ambassador Training, Workplace Wellness Charter and programmes to deliver Employment Rights Bill Compliance. 
          Contact us on{" "}
          <a
            href="mailto:info@fiftyfirstswellness.co.uk"
            className="underline text-white hover:text-white/80"
          >
            info@fiftyfirstswellness.co.uk
          </a>{" "}
          for more information.
        </p>
        <div className="mt-6 sm:mt-8">
          <Link
            to="/about"
            className="inline-block bg-brand-green-light text-white px-5 py-2 sm:px-6 rounded-full text-sm sm:text-base font-semibold hover:bg-brand-green-light/80 transition-colors"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

