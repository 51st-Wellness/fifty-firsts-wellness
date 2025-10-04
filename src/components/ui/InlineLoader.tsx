import React from "react";
import Spinner from "./Spinner";
import { cn } from "@/lib/utils";

interface InlineLoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "brand-green" | "brand-purple";
  text?: string;
  className?: string;
}

const InlineLoader: React.FC<InlineLoaderProps> = ({
  size = "sm",
  color = "brand-green",
  text,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Spinner size={size} color={color} />
      {text && (
        <span className="text-sm text-muted-foreground font-primary">
          {text}
        </span>
      )}
    </div>
  );
};

// Button loader for loading states in buttons
export const ButtonLoader: React.FC<{
  children: React.ReactNode;
  loading: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ children, loading, disabled, className }) => {
  return (
    <button
      disabled={disabled || loading}
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {loading && <Spinner size="sm" color="brand-green" />}
      {children}
    </button>
  );
};

// Table row loader
export const TableRowLoader: React.FC<{
  columns: number;
  className?: string;
}> = ({ columns, className }) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="animate-pulse">
          <div className="h-4 bg-muted/50 rounded w-3/4"></div>
        </div>
      </td>
    ))}
  </tr>
);

export default InlineLoader;
