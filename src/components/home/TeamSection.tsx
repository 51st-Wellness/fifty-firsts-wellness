import React from "react";

type FrameVariant = "down" | "up"; // down: top dents downward, bottom bulges downward; up: top bulges upward, bottom dents upward

const TeamFrame: React.FC<{ variant: FrameVariant; color: string }> = ({ variant, color }) => {
  return (
    <svg viewBox="0 0 300 400" className="w-full h-full" preserveAspectRatio="none">
      {variant === "down" ? (
        // Top: concave downward. Bottom: convex downward (uses extra viewBox height for bulge)
        <path d="M0 0 Q150 40 300 0 L300 360 Q150 400 0 360 Z" fill={color} />
      ) : (
        // Top: convex upward (within viewBox). Bottom: concave upward
        <path d="M0 40 Q150 0 300 40 L300 360 Q150 320 0 360 Z" fill={color} />
      )}
    </svg>
  );
};

const TeamSection: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-20">
      <div
        className="max-w-7xl mx-auto px-4 text-center bg-no-repeat"
        style={{
          backgroundImage: "url(/assets/homepage/about-section-bg.svg)",
          backgroundSize: "200% 200%",
          backgroundPosition: "center",
        }}
      >
        <h2
          className="text-3xl sm:text-4xl font-normal text-brand-green-dark mb-4"
          style={{ fontFamily: '"Lilita One", sans-serif' }}
        >
          Meet Our Team
        </h2>
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-600 mb-10">
          Our dedicated team of experienced wellness professionals is at the heart of what we do. With deep knowledge and expertise allowing you achieve your wellness needs.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 items-end">
          <div className="text-center">
            <div className="relative w-full h-60">
              <TeamFrame variant="down" color="#0FB9A5" />
              {/* <img src="/assets/homepage/team/Team-1.svg" alt="John Smith" className="absolute inset-0 m-auto h-56 object-contain" /> */}
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">John Smith</h3>
            <p className="text-xs" style={{ color: "#580F41" }}>Comany CEO</p>
          </div>
          <div className="text-center">
            <div className="relative w-full h-60">
              <TeamFrame variant="up" color="#530F40" />
              {/* <img src="/assets/homepage/team/team-2.svg" alt="David Johnson" className="absolute inset-0 m-auto h-56 object-contain" /> */}
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">David Johnson</h3>
            <p className="text-xs" style={{ color: "#580F41" }}>Co‑Founder</p>
          </div>
          <div className="text-center">
            <div className="relative w-full h-60">
              <TeamFrame variant="down" color="#007a7e" />
              {/* <img src="/assets/homepage/team/team-3.svg" alt="Mary Johnson" className="absolute inset-0 m-auto h-56 object-contain" /> */}
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">Mary Johnson</h3>image.png
            <p className="text-xs" style={{ color: "#580F41" }}>Property Managers</p>
          </div>
          <div className="text-center">
            <div className="relative w-full h-60">
              <TeamFrame variant="up" color="#0FB9A5" />
              {/* <img src="/assets/homepage/team/team-4.svg" alt="Patricia Davis" className="absolute inset-0 m-auto h-56 object-contain" /> */}
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">Patricia Davis</h3>
            <p className="text-xs" style={{ color: "#580F41" }}>Estate Consultant</p>
          </div>
          <div className="text-center">
            <div className="relative w-full h-60">
              <TeamFrame variant="down" color="#530F40" />
              {/* <img src="/assets/homepage/team/team-5.svg" alt="Grace Lee" className="absolute inset-0 m-auto h-56 object-contain" /> */}
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">Grace Lee</h3>
            <p className="text-xs" style={{ color: "#580F41" }}>Wellness Coach</p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-16">
          <button className="w-20 h-20 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors text-sm font-semibold flex flex-col items-center justify-center">
            <span>Prev</span>
            <span>&larr;</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-10 h-[2px] inline-block" style={{ backgroundColor: "#580F41" }} />
            <span className="w-10 h-[2px] bg-gray-300 inline-block" />
            <span className="w-10 h-[2px] bg-gray-300 inline-block" />
          </div>
          <button className="w-20 h-20 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors text-sm font-semibold flex flex-col items-center justify-center">
            <span>Next</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;


