import React, { useState } from "react";

type QA = { q: string; a: string };

const data: QA[] = [
  {
    q: "What makes Fifty Firsts Wellness different from other wellbeing providers?",
    a: "We focus on making wellness practical, inspiring, fresh and accessible. Our approach is guided by our NICE framework, Nurture, Inspire, Connect, Empower, and our Values. We don’t just talk about wellbeing; we create supportive spaces, practical tools and empowering programmes that help people thrive through life’s transitions to live well, sleep well and age well; to be stronger for longer!",
  },
  {
    q: "Who are your personal wellness services for?",
    a: "Our services are designed for anyone embracing self-care, wellbeing or who may need extra help and insight through key life events, like menopause, navigating midlife, workplace challenges or personal change. We work with individuals who want to feel more energised, supported and confident, as well as organisations looking to create healthier, more inclusive cultures with people focus and wellbeing as an intrinsic foundation to great employee experience and performance.",
  },
  {
    q: "What is the Wellness Warrior Programme?",
    a: "The Wellness Warrior Programme pairs people with supportive companions, whether as walking partners, gym buddies, life / career coaches or coffee companions. It’s about connection and belonging as much as health, helping to reduce isolation, build confidence and make self care feel more enjoyable and sustainable; helping you in the first steps, the new steps and everything in between.",
  },
  {
    q: "Do you offer one to one support?",
    a: "Yes. Our coaching and one to one sessions are tailored to your goals and challenges. We use evidence based strategies to help you manage change, take first steps into wellbeing and self-care, reduce stress, build resilience and explore what’s next in your personal or professional life.",
  },
  {
    q: "How do your workshops and group programmes work?",
    a: "We run interactive sessions on topics such as menopause, midlife wellbeing, stress management, wellbeing ambassador programmes and longevity practices. These workshops are designed to be engaging, stigma free, inspiring, nurturing personal growth and practical;  blending expert insight with peer connection so participants leave with tools they can use straight away, personally or in the workplace.",
  },
  {
    q: "How can I get involved or start working with Fifty Firsts?",
    a: "You can join as an individual through our personal wellness services, sign up for community membership (coming soon) or connect with us about workplace programmes. Whether you’re looking for a walking buddy, a coaching session or a tailored wellbeing strategy for yourself or your organisation, we’ll help you find the right starting point, partner you on your journey, evaluate your success and empower your wellness as personal coach, or fractional wellbeing partner.",
  },
  {
    q: "How do you measure impact?",
    a: "We believe wellness should be more than a “feel good” initiative, although this is a great goal too! Wellness should not be a secret for an elite few but should create real, lasting change; a lifestyle for longevity, firsts steps of wellness or you but better! That’s why we measure impact through feedback, wellbeing assessments and practical outcomes. For individuals, this might mean improved energy, better sleep, confidence or resilience. For your workplace that could be stronger engagement, reduced absence, increased performance, higher retention / attraction, lower people risk or a healthier workplace culture. Our focus is always on meaningful results that reflect both personal growth and community benefit.",
  },
];

const Item: React.FC<{ qa: QA; idx: number; open: number | null; setOpen: (n: number | null) => void }>
  = ({ qa, idx, open, setOpen }) => {
  const isOpen = open === idx;
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <button
        onClick={() => setOpen(isOpen ? null : idx)}
        className="w-full flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-4">
          <span className="text-brand-green text-xl">{isOpen ? "−" : "+"}</span>
          <span className="font-medium text-gray-900 text-left">{qa.q}</span>
        </div>
      </button>
      <div
        className={`px-6 sm:px-16 text-sm text-gray-600 transition-all duration-300 ease-out overflow-hidden ${
          isOpen ? "max-h-96 sm:max-h-40 pb-5" : "max-h-0 pb-0"
        }`}
      >
        {qa.a}
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="w-full py-24 sm:py-48 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left label */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start items-start">
          <div
            className="relative w-72 h-72 bg-no-repeat"
            style={{
              backgroundImage: 'url(/assets/homepage/faq/faq-text-bg.svg)',
              backgroundSize: 'contain',
              backgroundPosition: 'left center',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <h2
                className="text-5xl font-bold text-gray-900"
                style={{ fontFamily: '"Lilita One", sans-serif' }}
              >
                FAQs’
              </h2>
            </div>
          </div>
        </div>

        {/* Right accordion */}
        <div className="lg:col-span-8 relative">
          {/* Background splash - positioned absolutely to allow overflow */}
          <div
            className="absolute inset-0 -inset-x-8 -inset-y-12 sm:-inset-x-20 sm:-inset-y-24 bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: 'url(/assets/homepage/about-section-bg.svg)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              zIndex: 0,
            }}
          />
          {/* Accordion items on top */}
          <div className="relative z-10 space-y-4">
            {data.map((qa, idx) => (
              <Item key={idx} qa={qa} idx={idx} open={open} setOpen={setOpen} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;