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

type ProgrammeWithToken = Programme & {
  playback?: { playbackId: string; signedToken: string; expiresAt: Date };
};

const ProgrammeDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [programmeData, setProgrammeData] = useState<ProgrammeWithToken | null>(
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
        const response = await fetchSecureProgrammeById(productId!);
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
          title: programmeData?.title,
          text:
            programmeData?.description || "Check out this wellness programme",
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
            <button
              onClick={() => navigate("/programmes")}
              className="block w-full text-[#4444B3] hover:underline"
            >
              Back to Programmes
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
          <button
            onClick={() => navigate("/programmes")}
            className="text-[#4444B3] hover:underline"
          >
            Back to Programmes
          </button>
        </div>
      </div>
    );
  }

  const { playback, ...programme } = programmeData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-green/5 to-brand-purple/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/programmes")}
          className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark font-medium transition-colors group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Programmes
        </button>

        {/* Immersive Video Container */}
        <div className="relative h-[calc(100vh-160px)] overflow-hidden rounded-3xl">
          {/* Background with blur effect */}
          <div className="absolute inset-0">
            {programme.thumbnailUrl && (
              <img
                src={programme.thumbnailUrl}
                alt={programme.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-purple/20" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full">
              {/* Title and Metadata */}
              <div className="text-center mb-6">
                {/* Programme Badge */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">
                        Programme
                      </span>
                      {programme.isFeatured && (
                        <>
                          <span className="text-white/60">•</span>
                          <span className="text-sm font-medium text-white">
                            Featured
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-4">
                  {programme.title}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                  {programme.duration && (
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/30">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">
                        {formatDuration(programme.duration)}
                      </span>
                    </div>
                  )}
                  {programme.categories && programme.categories.length > 0 && (
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/30">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">
                        {programme.categories[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description - Truncated */}
                {programme.description && (
                  <div className="mb-6 max-w-3xl mx-auto">
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-2">
                      {programme.description.substring(0, 150)}...
                    </p>
                  </div>
                )}
              </div>

              {/* Video Player Container */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                <div className="relative aspect-video bg-black">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-lg">Loading video...</p>
                      </div>
                    </div>
                  ) : programme.muxPlaybackId && playback?.signedToken ? (
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
                        borderRadius: "0",
                      }}
                      accentColor="#00969b"
                      primaryColor="#FFFFFF"
                      secondaryColor="#000000"
                    />
                  ) : !programme.muxPlaybackId ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Video is still processing</p>
                        <p className="text-sm opacity-75">
                          Please check back later
                        </p>
                      </div>
                    </div>
                  ) : !playback?.signedToken ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Loading video access...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Video not available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Bar Below Video */}
                <div className="bg-white/5 backdrop-blur-sm p-4 flex items-center justify-between">
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {programme.categories &&
                      programme.categories
                        .slice(0, 3)
                        .map((category, index) => (
                          <span
                            key={index}
                            className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/30"
                          >
                            {category}
                          </span>
                        ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBookmark}
                      className={`p-2 rounded-full transition ${
                        isBookmarked
                          ? "bg-white text-brand-green"
                          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition backdrop-blur-sm border border-white/30"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetail;
