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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/programmes")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#4444B3] transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Programmes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Video Player */}
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
                      viewer_user_id: "user-id", // You'd get this from auth context
                    }}
                    streamType="on-demand"
                    autoPlay={false}
                    muted={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "0",
                    }}
                    accentColor="#4444B3"
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

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {programme.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      {programme.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(programme.duration)}
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {programme.isPublished ? "Published" : "Draft"}
                      </div>

                      {programme.isFeatured && (
                        <div className="bg-gradient-to-r from-[#4444B3] to-[#6B4EF0] text-white text-xs px-2 py-1 rounded-full font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={handleBookmark}
                      className={`p-2 rounded-full border transition ${
                        isBookmarked
                          ? "bg-[#4444B3] text-white border-[#4444B3]"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#4444B3] hover:text-[#4444B3]"
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full border bg-white text-gray-600 border-gray-300 hover:border-[#4444B3] hover:text-[#4444B3] transition"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {programme.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      About this programme
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {programme.description}
                    </p>
                  </div>
                )}

                {/* Categories */}
                {programme.categories && programme.categories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {programme.categories.map((category, index) => (
                        <span
                          key={index}
                          className="bg-[#4444B3]/10 text-[#4444B3] px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Programme Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Programme Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {formatDuration(programme.duration)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium ${
                      programme.isPublished ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {programme.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Categories</span>
                  <span className="font-medium">
                    {programme.categories?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Programmes - Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Related Programmes
              </h3>
              <div className="text-center text-gray-500 py-8">
                <p>Related programmes will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetail;
