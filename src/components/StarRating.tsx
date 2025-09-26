import React from "react";

type StarSize = "sm" | "md" | "lg";

interface StarRatingProps {
  rating?: number;
  outOf?: number;
  size?: StarSize;
}

interface StarProps {
  filled?: boolean;
  half?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating = 0, outOf = 5, size = "md" }) => {
    const sizeMap: Record<StarSize, string> = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };
    const starSize = sizeMap[size] || sizeMap.md;

    // Single star SVG
    const Star: React.FC<StarProps> = ({ filled = false, half = false }) => (
        <div className="relative inline-block">
            {/* Gray background star */}
            <svg
                viewBox="0 0 20 20"
                className={`${starSize} text-gray-300`}
                fill="currentColor"
            >
                <path d="M9.049.927a1 1 0 011.902 0l1.39 3.939a1 1 0 00.95.69h4.07a1 1 0 01.588 1.81l-3.294 2.394a1 1 0 00-.364 1.118l1.26 4.007a1 1 0 01-1.53 1.118L10.6 13.88a1 1 0 00-1.2 0l-3.421 2.123a1 1 0 01-1.53-1.118l1.26-4.007a1 1 0 00-.364-1.118L1.73 7.366a1 1 0 01.588-1.81h4.07a1 1 0 00.95-.69L9.049.927z" />
            </svg>

            {/* Full yellow star overlay */}
            {filled && (
                <svg
                    viewBox="0 0 20 20"
                    className={`${starSize} text-yellow-400 absolute inset-0`}
                    fill="currentColor"
                >
                    <path d="M9.049.927a1 1 0 011.902 0l1.39 3.939a1 1 0 00.95.69h4.07a1 1 0 01.588 1.81l-3.294 2.394a1 1 0 00-.364 1.118l1.26 4.007a1 1 0 01-1.53 1.118L10.6 13.88a1 1 0 00-1.2 0l-3.421 2.123a1 1 0 01-1.53-1.118l1.26-4.007a1 1 0 00-.364-1.118L1.73 7.366a1 1 0 01.588-1.81h4.07a1 1 0 00.95-.69L9.049.927z" />
                </svg>
            )}

            {/* Half yellow star overlay */}
            {half && (
                <svg
                    viewBox="0 0 20 20"
                    className={`${starSize} text-yellow-400 absolute inset-0`}
                    fill="currentColor"
                    style={{ clipPath: "inset(0 50% 0 0)" }} // left half only
                >
                    <path d="M9.049.927a1 1 0 011.902 0l1.39 3.939a1 1 0 00.95.69h4.07a1 1 0 01.588 1.81l-3.294 2.394a1 1 0 00-.364 1.118l1.26 4.007a1 1 0 01-1.53 1.118L10.6 13.88a1 1 0 00-1.2 0l-3.421 2.123a1 1 0 01-1.53-1.118l1.26-4.007a1 1 0 00-.364-1.118L1.73 7.366a1 1 0 01.588-1.81h4.07a1 1 0 00.95-.69L9.049.927z" />
                </svg>
            )}
        </div>
    );

    return (
        <div className="flex gap-1">
            {Array.from({ length: outOf }).map((_, i) => {
                const starNum = i + 1;
                if (starNum <= Math.floor(rating)) {
                    return <Star key={i} filled />;
                } else if (starNum === Math.ceil(rating) && !Number.isInteger(rating)) {
                    return <Star key={i} half />;
                } else {
                    return <Star key={i} />;
                }
            })}
        </div>
    );
};

export default StarRating;
