import React, { useState } from "react";
import { Clock, Play, Eye, Calendar, Star } from "lucide-react";
import { Programme } from "../api/programme.api";
import { useNavigate } from "react-router-dom";
import { getUserActiveSubscription } from "../api/subscription.api";
import { getAuthToken } from "../lib/utils";
import SubscriptionRequiredModal from "./SubscriptionRequiredModal";

interface ProgrammeCardProps {
  programme: Programme;
}

const ProgrammeCard: React.FC<ProgrammeCardProps> = ({ programme }) => {
  const navigate = useNavigate();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const handleCardClick = async () => {
    // If user is not logged in, show subscription modal
    if (!getAuthToken()) {
      setShowSubscriptionModal(true);
      return;
    }

    try {
      // Check if user has active subscription
      const subscriptionResponse = await getUserActiveSubscription();

      if (subscriptionResponse.success && subscriptionResponse.data) {
        // User has active subscription, navigate to programme
        navigate(`/programmes/${programme.productId}`);
      } else {
        // User doesn't have active subscription, show modal
        setShowSubscriptionModal(true);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      // On error, show subscription modal to be safe
      setShowSubscriptionModal(true);
    }
  };

  return (
    <>
      <article
        className="group relative bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 border border-gray-200 rounded-3xl p-5 hover:shadow-2xl hover:scale-[1.02] hover:border-indigo-300 transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-300/50"
        onClick={handleCardClick}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl -z-0 group-hover:scale-150 transition-transform duration-500" />

        {/* Thumbnail Container */}
        <div className="relative z-10 overflow-hidden rounded-2xl mb-4">
          {programme.thumbnail ? (
            <img
              src={programme.thumbnail}
              alt={programme.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 shadow-md group-hover:shadow-xl"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-[#4444B3] to-[#6B4EF0] flex items-center justify-center shadow-md">
              <Play className="w-12 h-12 text-white opacity-80" />
            </div>
          )}

          {/* Play overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 via-indigo-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
            <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
              <Play className="w-8 h-8 text-indigo-600 fill-indigo-600" />
            </div>
          </div>

          {/* Duration Badge */}
          {programme.duration && (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Clock className="w-3 h-3" />
              {formatDuration(programme.duration)}
            </div>
          )}

          {/* Featured Badge */}
          {/* {programme.isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2.5 py-1.5 rounded-full font-medium flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )} */}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-3 flex-1">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {programme.createdAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>
                  {new Date(programme.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
            {programme.title}
          </h3>

          {programme.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {programme.description}
            </p>
          )}

          {/* Categories */}
          {programme.categories && programme.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {programme.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
              {programme.categories.length > 2 && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  +{programme.categories.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </article>

      {/* Subscription Modal - rendered outside the card */}
      <SubscriptionRequiredModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        programmeTitle={programme.title}
      />
    </>
  );
};

export default ProgrammeCard;
