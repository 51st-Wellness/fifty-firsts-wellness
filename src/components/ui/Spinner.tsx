import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "brand-green" | "brand-purple";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "brand-green",
  className,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary",
    "brand-green": "border-brand-green",
    "brand-purple": "border-brand-purple",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-200",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={{
        borderTopColor: "transparent",
      }}
    />
  );
};

export default Spinner;
