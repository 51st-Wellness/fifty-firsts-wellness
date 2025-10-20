import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  Eye,
  Tag,
  Share2,
  Play,
  Calendar,
} from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { Programme, fetchSecureProgrammeById } from "../api/programme.api";
import { useAuth } from "../context/AuthContextProvider";
import Loader from "../components/Loader";
import SubscriptionRequiredModal from "../components/SubscriptionRequiredModal";
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
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

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
      setError(null);
      setAccessError(null);

      if (isAuthenticated) {
        // Use secure endpoint for authenticated users
        const response = (await fetchSecureProgrammeById(
          productId!
        )) as ProgrammeResponse;
        setProgrammeData(response);
      } else {
        // For non-authenticated users, show subscription modal
        setShowSubscriptionModal(true);
        return;
      }
    } catch (err: any) {
      console.error("Error fetching programme:", err);
      if (err.response?.status === 401) {
        toast.error("Please log in to access this programme");
        navigate("/login");
      } else if (err.response?.status === 403) {
        // User is authenticated but doesn't have subscription access
        setAccessError(
          err.response?.data?.message ||
            "You need an active subscription to access this programme."
        );
        setShowSubscriptionModal(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 mb-4 text-lg">{error}</div>
          <div className="space-y-3">
            <button
              onClick={fetchProgrammeData}
              className="bg-[#4444B3] text-white px-6 py-2 rounded-full hover:bg-[#343494] transition"
            >
              Try Again
            </button>
            <div className="text-sm text-gray-600">
              Having trouble?{" "}
              <Link
                to="/subscriptions"
                className="text-[#4444B3] hover:underline"
              >
                View our subscription plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!programmeData && !showSubscriptionModal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Programme not found</div>
        </div>
      </div>
    );
  }

  // Show subscription modal if user doesn't have access
  if (showSubscriptionModal && !programmeData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-gray-600 mb-4 text-lg">
            {accessError || "Subscription required to access this programme"}
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/subscriptions")}
              className="bg-[#4444B3] text-white px-6 py-2 rounded-full hover:bg-[#343494] transition"
            >
              View Subscription Plans
            </button>
            <button
              onClick={() => navigate("/programmes")}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-200 transition"
            >
              Back to Programmes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { playback, programme } = programmeData!;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-brand-green transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link
            to="/resources/webinars"
            className="text-gray-600 hover:text-brand-green transition-colors"
          >
            Webinars
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-brand-green font-medium">
            {programme.title}
          </span>
        </nav>

        {/* Main Content: Video Left, Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Video */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div
              className="bg-black rounded-2xl overflow-hidden shadow-lg mb-6"
              style={{ aspectRatio: "16/9" }}
            >
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
                  accentColor="#0E7777"
                  primaryColor="#FFFFFF"
                  secondaryColor="#000000"
                />
              ) : !programme.muxPlaybackId ? (
                <div className="flex items-center justify-center h-full bg-black">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Video is still processing</p>
                    <p className="text-sm opacity-75">
                      Please check back later
                    </p>
                  </div>
                </div>
              ) : !playback?.signedToken ? (
                <div className="flex items-center justify-center h-full bg-black">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Loading video access...</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-black">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Video not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Title and Description */}
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                {programme.title}
              </h1>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                {programme.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(programme.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  </div>
                )}
                {programme.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(programme.duration)}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {programme.description && (
                <div className="mb-6">
                  <h2
                    className="text-lg font-semibold text-gray-900 mb-3"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    About this webinar
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {programme.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-6">
              {/* Featured Badge */}
              {programme.isFeatured && (
                <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                  <Tag className="w-4 h-4" />
                  Featured
                </div>
              )}

              {/* Categories */}
              {programme.categories && programme.categories.length > 0 && (
                <div className="mb-6">
                  <h3
                    className="text-sm font-semibold text-gray-900 mb-3"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {programme.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-white text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-gray-700 border border-gray-300 hover:border-brand-green hover:text-brand-green font-medium transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionRequiredModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        programmeTitle={programme?.title || "this programme"}
      />
    </div>
  );
};

export default ProgrammeDetail;
