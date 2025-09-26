import React from "react";

// Animated loader for suspense fallbacks and route-level loading states
const Loader: React.FC = () => {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-gray-200 border-t-indigo-500 animate-spin" />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500 tracking-wide">
          Loading…
        </div>
      </div>
    </div>
  );
};

export default Loader;
