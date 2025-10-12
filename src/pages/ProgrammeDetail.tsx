import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Eye,
  Tag,
  Share2,
  Bookmark,
  Play,
} from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { Programme, fetchSecureProgrammeById } from "../api/programme.api";
import { useAuth } from "../context/AuthContextProvider";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

type ProgrammeResponse = {
  programme: Programme;
  playback?: { playbackId: string; signedToken: string; expiresAt: Date };
};

const ProgrammeDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [programmeData, setProgrammeData] = useState<ProgrammeResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError("Programme ID is required");
      setLoading(false);
      return;
    }

    fetchProgrammeData();
  }, [productId]);

  const fetchProgrammeData = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Use secure endpoint for authenticated users
        const response = (await fetchSecureProgrammeById(
          productId!
        )) as ProgrammeResponse;
        setProgrammeData(response);
      } else {
        // For non-authenticated users, you might want to show a preview or redirect to login
        toast.error("Please log in to watch programmes");
        navigate("/login");
        return;
      }

      setError(null);
    } catch (err: any) {
      console.error("Error fetching programme:", err);
      if (err.response?.status === 401) {
        toast.error("Please log in to access this programme");
        navigate("/login");
      } else if (err.response?.status === 403) {
        setError(
          "You don't have access to this programme. Please check your subscription."
        );
      } else {
        setError("Failed to load programme. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: programmeData?.programme.title,
          text:
            programmeData?.programme.description ||
            "Check out this wellness programme",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    // This would typically make an API call to bookmark/unbookmark
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 mb-4 text-lg">{error}</div>
          <div className="space-y-3">
            <button
              onClick={fetchProgrammeData}
              className="bg-[#4444B3] text-white px-6 py-2 rounded-full hover:bg-[#343494] transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!programmeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Programme not found</div>
        </div>
      </div>
    );
  }

  const { playback, programme } = programmeData;
  console.log("programmeData", programmeData);
  console.log("programme", programme);
  console.log("playback", playback);
  return (
    <div className="min-h-screen bg-black">
      {/* Back Button - Floating */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate("/programmes")}
          className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md text-white hover:bg-black/70 font-medium transition-all group px-4 py-2 rounded-full border border-white/20"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Programmes
        </button>
      </div>

      {/* Main Video Container - Full Screen */}
      <div className="relative h-screen">
        {/* Video Player - Takes most of the screen */}
        <div className="h-[75vh] bg-black">
          {programme.muxPlaybackId && playback?.signedToken ? (
            <MuxPlayer
              playbackId={programme.muxPlaybackId}
              tokens={{ playback: playback?.signedToken }}
              metadata={{
                video_title: programme.title,
                viewer_user_id: "user-id",
              }}
              streamType="on-demand"
              autoPlay={false}
              muted={false}
              style={{
                width: "100%",
                height: "100%",
              }}
              accentColor="#00969b"
              primaryColor="#FFFFFF"
              secondaryColor="#000000"
            />
          ) : !programme.muxPlaybackId ? (
            <div className="flex items-center justify-center h-full bg-black">
              <div className="text-center text-white">
                <Play className="w-20 h-20 mx-auto mb-6 opacity-50" />
                <p className="text-xl mb-2">Video is still processing</p>
                <p className="text-sm opacity-75">Please check back later</p>
              </div>
            </div>
          ) : !playback?.signedToken ? (
            <div className="flex items-center justify-center h-full bg-black">
              <div className="text-center text-white">
                <Play className="w-20 h-20 mx-auto mb-6 opacity-50" />
                <p className="text-xl">Loading video access...</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-black">
              <div className="text-center text-white">
                <Play className="w-20 h-20 mx-auto mb-6 opacity-50" />
                <p className="text-xl">Video not available</p>
              </div>
            </div>
          )}
        </div>

        {/* Programme Details - Bottom Section */}
        <div className="h-[25vh] bg-gradient-to-t from-gray-900 to-gray-800 text-white overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Title and Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-brand-green/20 backdrop-blur-sm px-3 py-1 rounded-full border border-brand-green/30">
                    <div className="flex items-center gap-2">
                      <Play className="w-3 h-3 text-brand-green" />
                      <span className="text-xs font-medium text-brand-green">
                        Programme
                      </span>
                    </div>
                  </div>
                  {programme.isFeatured && (
                    <div className="bg-brand-purple/20 backdrop-blur-sm px-3 py-1 rounded-full border border-brand-purple/30">
                      <span className="text-xs font-medium text-brand-purple">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-3 leading-tight">
                  {programme.title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                  {programme.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-green" />
                      <span>{formatDuration(programme.duration)}</span>
                    </div>
                  )}
                  {programme.categories && programme.categories.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-green" />
                      <span>{programme.categories[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 ml-6">
                <button
                  onClick={handleBookmark}
                  className={`p-3 rounded-full transition-all ${
                    isBookmarked
                      ? "bg-brand-green text-white"
                      : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
                  }`}
                  title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                >
                  <Bookmark className="w-5 h-5" />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Description */}
            {programme.description && (
              <div className="mb-4">
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {programme.description}
                </p>
              </div>
            )}

            {/* Categories */}
            {programme.categories && programme.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {programme.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetail;
