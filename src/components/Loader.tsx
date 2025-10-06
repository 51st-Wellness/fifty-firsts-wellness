import React from "react";
import PageLoader from "./ui/PageLoader";

// Animated loader for suspense fallbacks and route-level loading states
const Loader: React.FC = () => {
  return <PageLoader message="Loading..." size="lg" />;
};

export default Loader;
