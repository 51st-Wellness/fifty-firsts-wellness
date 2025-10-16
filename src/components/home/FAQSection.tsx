import React, { useState } from "react";

type QA = { q: string; a: string };

const data: QA[] = [
  {
    q: "How long until we deliver your first blog post?",
    a: "Really boy law county she unable her sister. Feet you off its like like six. Among sex are leave law built now. In built table in an rapid blush. Merits behind on afraid or warmly.",
  },
  {
    q: "What is included in the wellness membership?",
    a: "Access to resources, webinars, programmes, and member-only offers delivered monthly.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription anytime from your account settings.",
  },
  {
    q: "Do you offer business wellness programmes?",
    a: "Yes. We provide tailored programmes for teams with workshops, resources, and ongoing support.",
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
        className={`px-16 text-sm text-gray-600 transition-all duration-300 ease-out overflow-hidden ${
          isOpen ? "max-h-40 pb-5" : "max-h-0 pb-0"
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
    <section className="w-full py-28 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left label */}
        <div className="lg:col-span-4 flex lg:justify-start justify-center">
          <div
            className="relative w-full h-72 bg-no-repeat"
            style={{
              backgroundImage: 'url(/assets/homepage/faq/faq-text-bg.svg)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <h2
                className="text-5xl font-bold text-gray-900"
                style={{ fontFamily: '"Lilita One", sans-serif' }}
              >
                FAQ
              </h2>
            </div>
          </div>
        </div>

        {/* Right accordion */}
        <div
          className="lg:col-span-8 space-y-4 bg-no-repeat"
          style={{
            backgroundImage: 'url(/assets/homepage/about-section-bg.svg)',
            backgroundSize: '250% 250%',
            backgroundPosition: 'center',
          }}
        >
          {data.map((qa, idx) => (
            <Item key={idx} qa={qa} idx={idx} open={open} setOpen={setOpen} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;