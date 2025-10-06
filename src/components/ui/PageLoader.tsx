import React from "react";
import Spinner from "./Spinner";

interface PageLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
  size = "lg",
  className = "",
}) => {
  return (
    <div
      className={`min-h-[60vh] w-full flex items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        <Spinner size={size} color="brand-green" />
        <p className="text-muted-foreground font-primary text-sm tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
