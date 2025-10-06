import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card skeleton for product cards
export const CardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("bg-white rounded-2xl p-6 shadow-lg", className)}>
    <Skeleton className="w-full h-48 rounded-lg mb-4" />
    <Skeleton className="h-6 w-3/4 rounded mb-2" />
    <Skeleton className="h-4 w-1/2 rounded mb-4" />
    <Skeleton className="h-10 w-full rounded" />
  </div>
);

// Blog card skeleton
export const BlogCardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={cn("bg-white rounded-2xl overflow-hidden shadow-lg", className)}
  >
    <Skeleton className="w-full h-48" />
    <div className="p-6">
      <Skeleton className="h-6 w-3/4 rounded mb-3" />
      <Skeleton className="h-4 w-full rounded mb-2" />
      <Skeleton className="h-4 w-2/3 rounded mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  </div>
);

// Text skeleton for paragraphs
export const TextSkeleton: React.FC<{
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}> = ({ lines = 3, className, lastLineWidth = "w-1/2" }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          "h-4 rounded",
          i === lines - 1 ? lastLineWidth : "w-full"
        )}
      />
    ))}
  </div>
);

// List skeleton for navigation or menu items
export const ListSkeleton: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 5, className }) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: items }).map((_, i) => (
      <Skeleton key={i} className="h-4 w-full rounded" />
    ))}
  </div>
);

// Avatar skeleton
export const AvatarSkeleton: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
  );
};

// Button skeleton
export const ButtonSkeleton: React.FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = "w-24", height = "h-10", className }) => (
  <Skeleton className={cn("rounded-lg", width, height, className)} />
);

export default Skeleton;
