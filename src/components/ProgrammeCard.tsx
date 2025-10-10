import React from "react";
import { Clock, Play, Eye } from "lucide-react";
import { Programme } from "../api/programme.api";
import { useNavigate } from "react-router-dom";

interface ProgrammeCardProps {
  programme: Programme;
}

const ProgrammeCard: React.FC<ProgrammeCardProps> = ({ programme }) => {
  const navigate = useNavigate();

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const handleCardClick = () => {
    navigate(`/programmes/${programme.productId}`);
  };

  return (
    <article
      className="group flex flex-col gap-3 border rounded-3xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white hover:bg-gray-50"
      onClick={handleCardClick}
    >
      {/* Thumbnail Container */}
      <div className="relative overflow-hidden rounded-xl">
        {programme.thumbnail ? (
          <img
            src={programme.thumbnail}
            alt={programme.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-[#4444B3] to-[#6B4EF0] flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-80" />
          </div>
        )}

        {/* Overlay with Play Button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <div className="bg-white bg-opacity-90 rounded-full p-3">
              <Play className="w-6 h-6 text-[#4444B3] fill-current" />
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        {programme.duration && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(programme.duration)}
          </div>
        )}

        {/* Featured Badge */}
        {programme.isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#4444B3] to-[#6B4EF0] text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-[#4444B3] transition-colors">
          {programme.title}
        </h3>

        {programme.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {programme.description}
          </p>
        )}

        {/* Categories */}
        {programme.categories && programme.categories.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {programme.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="text-xs font-medium text-[#4444B3] bg-[#4444B3]/10 px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
            {programme.categories.length > 3 && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                +{programme.categories.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            {programme.isPublished ? (
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Eye className="w-3 h-3" />
                Published
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <Eye className="w-3 h-3" />
                Draft
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400 font-medium">Watch Now →</div>
        </div>
      </div>
    </article>
  );
};

export default ProgrammeCard;
