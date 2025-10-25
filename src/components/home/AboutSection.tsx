import React from "react";
import { Link } from "react-router-dom";

const AboutSection: React.FC = () => {
  return (
    <section className="w-full py-40 sm:py-52 bg-brand-green-light">
      <div className="max-w-5xl mx-auto px-4 text-center bg-no-repeat"
        style={{
          backgroundImage: "url(/assets/homepage/about-section-bg.svg)",
          backgroundSize: "250% 250%",
          backgroundPosition: "center",
        }}
      >
        <h2
          className="text-3xl sm:text-4xl font-normal text-white mb-4"
          style={{ fontFamily: '"Lilita One", sans-serif' }}
        >
          About Us
        </h2>
        <div className="w-16 h-1 bg-brand-green-dark mx-auto rounded-full mb-12" />
        <p className="text-white leading-7">
        We’re not just a wellness brand, we are re-writing the narrative on wellness and midlife. 
        We’re building a rebellion against burnout, overwhelm, invisibility and one-size-fits-all wellness services. 
        Whether you’re levelling up your routine or rewriting the rules entirely, we make wellness simple, available and a little bit fun. 
        Living well shouldn’t be for the elite and ageing doesn’t have to be a decline, it’s a uprising! 
        We have coaching, workshops, webinars, wellness warrior events and so much more to kickstart or elevate your wellbeing, 
        inspire your midlife reinvention or walk alongside you during your menopause transition. 
        Our workplace wellness programmes build momentum because thriving people make thriving businesses. 
        We help teams and leaders nurture positive employee experience, inspire wellness work-spaces, 
        build connection and identity with purpose and empower your people to embrace and manage their own wellbeing. 
        Ask us about our Wellbeing Ambassador Training, Workplace Wellness Charter and programmes to deliver Employment Rights Bill Compliance. 
        Contact us on info@fiftyfirstswellness.co.uk for more information.

        </p>
        <div className="mt-8">
          <Link
            to="/about"
            className="inline-block bg-[#580F41] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#580F41]/80 transition-colors"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


