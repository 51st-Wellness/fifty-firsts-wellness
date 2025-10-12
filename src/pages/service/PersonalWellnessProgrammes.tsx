import React from "react";
import ProgrammeList from "../../components/ProgrammeList";

const PersonalWellnessProgrammes: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header Section */}
        <article className="flex flex-col justify-center items-center w-full gap-6 pt-20">
          {/* Centered Content */}
          <div className="flex flex-col gap-4 w-full text-center">
            <div className="text-3xl sm:text-4xl lg:text-6xl font-semibold">
              Personal Wellness Programmes
            </div>
            <div className="text-sm sm:text-base text-[#475464] max-w-2xl mx-auto">
              Choose a program designed to support your unique wellness goals —
              from reducing stress to building mindful routines, one step at a
              time.
            </div>
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
