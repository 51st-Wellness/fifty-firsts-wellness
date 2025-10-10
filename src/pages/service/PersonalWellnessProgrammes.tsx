import React from "react";
import leaf from "../../assets/images/leaf.png";
import ProgrammeList from "../../components/ProgrammeList";

const PersonalWellnessProgrammes: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header Section */}
        <article className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start w-full gap-4 pt-20">
          {/* Left Content */}
          <div className="flex flex-col gap-4 w-full md:w-1/2 text-center md:text-left">
            <div className="text-2xl sm:text-4xl lg:text-6xl font-semibold">
              Personal Wellness Programmes
            </div>
            <div className="text-sm sm:text-base text-[#475464]">
              Choose a program designed to support your unique wellness goals —
              from reducing stress to building mindful routines, one step at a
              time.
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end w-full md:w-1/2">
            <img src={leaf} alt="leaf" className="w-24 sm:w-32 lg:w-40" />
          </div>
        </article>

        {/* Programme List */}
        <article className="mt-8">
          <ProgrammeList showFilters={true} isPublished={true} />
        </article>
      </div>
    </main>
  );
};

export default PersonalWellnessProgrammes;
