import React from "react";
import { Loader } from "lucide-react";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  rounded?: "full" | "xl" | "lg" | "md";
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  loadingText,
  children,
  variant = "primary",
  fullWidth = false,
  rounded = "full",
  disabled,
  className = "",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-brand-green text-white hover:bg-brand-green-dark",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border-2 border-brand-green text-brand-green hover:bg-brand-green/5",
  };

  const roundedClasses = {
    full: "rounded-full",
    xl: "rounded-xl",
    lg: "rounded-lg",
    md: "rounded-md",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const roundedClass = roundedClasses[rounded];

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${roundedClass} ${className}`;

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={combinedClasses}
      style={{ fontFamily: variant === "primary" ? '"League Spartan", sans-serif' : undefined }}
    >
      {loading && (
        <Loader className="w-4 h-4 animate-spin" />
      )}
      {loading ? (loadingText || children) : children}
    </button>
  );
};

export default LoadingButton;

