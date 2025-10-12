import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPodcastById, type PodcastEpisode } from "@/api/podcast.api";
import { TextSkeleton, CardSkeleton } from "@/components/ui/SkeletonLoader";
import podcast1 from "@/assets/images/podcast1.png";
import {
  Play,
  Pause,
  ArrowLeft,
  Clock,
  Calendar,
  Headphones,
  Volume2,
  SkipBack,
  SkipForward,
} from "lucide-react";

const PodcastDetail: React.FC = () => {
  const { id = "" } = useParams();
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const storageKey = `podcastProgress:${id}`;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPodcastById(id)
      .then((ep) => {
        if (!mounted) return;
        if (ep) {
          setEpisode(ep);
          setError(null);
        } else {
          setError("Podcast not found");
        }
      })
      .catch(() => mounted && setError("Failed to load podcast"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!episode) return;
    const saved = localStorage.getItem(storageKey);
    if (saved && audioRef.current) {
      try {
        const { position } = JSON.parse(saved);
        if (typeof position === "number" && position > 0) {
          audioRef.current.currentTime = position;
        }
      } catch {}
    }
  }, [episode, storageKey]);

  const onTimeUpdate = () => {
    const el = audioRef.current;
    if (!el) return;
    const position = Math.floor(el.currentTime || 0);
    const dur = Math.floor(el.duration || episode?.duration || 0);
    setCurrentTime(el.currentTime);
    if (Number.isFinite(position)) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          position,
          duration: dur,
          updatedAt: new Date().toISOString(),
        })
      );
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 15
      );
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        duration,
        audioRef.current.currentTime + 15
      );
    }
  };

  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl);
  };

  // Handle vertical slider click and drag
  const handleVolumeSliderInteraction = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, 1 - y / rect.height));
    setVolume(percentage);
    if (audioRef.current) {
      audioRef.current.volume = percentage;
    }
  };

  const handleVolumeSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleVolumeSliderInteraction(e);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const slider = e.currentTarget;
      const rect = slider.getBoundingClientRect();
      const y = moveEvent.clientY - rect.top;
      const percentage = Math.max(0, Math.min(1, 1 - y / rect.height));
      setVolume(percentage);
      if (audioRef.current) {
        audioRef.current.volume = percentage;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Close volume control when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showVolumeControl) {
        const target = event.target as Element;
        if (!target.closest(".volume-control-container")) {
          setShowVolumeControl(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showVolumeControl]);

  return (
    <main className="min-h-[80vh] bg-gradient-to-br from-gray-50 via-brand-green/5 to-brand-purple/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-brand-green/5 to-brand-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <Link
          to="/podcasts"
          className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark font-medium transition-colors group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Podcasts
        </Link> */}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <CardSkeleton className="md:col-span-2" />
            <div className="md:col-span-3">
              <TextSkeleton lines={2} className="mb-4" />
              <TextSkeleton lines={6} />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : episode ? (
          <div className="relative h-[calc(100vh-80px)] overflow-hidden rounded-3xl">
            {/* Full-screen Background Image */}
            <div className="absolute inset-0">
              <img
                src={episode.imageUrl || podcast1}
                alt={episode.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay with blur effect */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-purple/20" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl w-full text-center">
                {/* Podcast Badge */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                    <div className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">
                        Podcast
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-4">
                  {episode.title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                  {episode.publishedAt && (
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/30">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">
                        {new Date(episode.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                  {episode.duration && (
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/30">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">
                        {formatDuration(episode.duration)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description - Truncated for space */}
                {episode.description && (
                  <div className="mb-6 max-w-2xl mx-auto">
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-2">
                      {episode.description
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 150)}
                      ...
                    </p>
                  </div>
                )}

                {/* Enhanced Audio Player */}
                {episode.audioUrl && (
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb-white"
                        style={{
                          background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                            (currentTime / (duration || 1)) * 100
                          }%, rgba(255,255,255,0.2) ${
                            (currentTime / (duration || 1)) * 100
                          }%, rgba(255,255,255,0.2) 100%)`,
                        }}
                      />
                      <div className="flex justify-between items-center mt-2 text-xs font-medium text-white/80">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Main Controls with Volume on Left */}
                    <div className="flex items-center justify-between gap-4 sm:gap-6 mb-4">
                      {/* Volume Control - Left Side */}
                      <div className="relative volume-control-container">
                        <button
                          onClick={toggleVolumeControl}
                          className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30"
                          aria-label="Toggle volume control"
                        >
                          <Volume2 className="w-5 h-5 text-white" />
                        </button>

                        {/* Vertical Volume Slider */}
                        {showVolumeControl && (
                          <div className="absolute bottom-full left-0 mb-2 bg-white/20 backdrop-blur-xl rounded-lg p-3 border border-white/30 shadow-2xl z-50 min-w-[60px]">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-xs text-white/80 font-medium">
                                {Math.round(volume * 100)}%
                              </span>
                              <div
                                className="relative h-24 w-3 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition-colors"
                                onMouseDown={handleVolumeSliderMouseDown}
                                onClick={handleVolumeSliderInteraction}
                              >
                                <div
                                  className="absolute bottom-0 left-0 w-full bg-white rounded-full transition-all duration-150 pointer-events-none"
                                  style={{ height: `${volume * 100}%` }}
                                />
                                <div
                                  className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-150 pointer-events-none"
                                  style={{
                                    bottom: `calc(${volume * 100}% - 8px)`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Center Controls */}
                      <div className="flex items-center gap-4 sm:gap-6">
                        {/* Skip Backward */}
                        <button
                          onClick={skipBackward}
                          className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30"
                          aria-label="Skip backward 15 seconds"
                        >
                          <SkipBack className="w-5 h-5 text-white" />
                        </button>

                        {/* Play/Pause Button */}
                        <button
                          onClick={togglePlayPause}
                          className="bg-white text-gray-900 rounded-full p-4 hover:scale-105 active:scale-95 transition-transform shadow-2xl hover:shadow-white/25"
                          aria-label={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 fill-current" />
                          ) : (
                            <Play className="w-6 h-6 fill-current ml-1" />
                          )}
                        </button>

                        {/* Skip Forward */}
                        <button
                          onClick={skipForward}
                          className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30"
                          aria-label="Skip forward 15 seconds"
                        >
                          <SkipForward className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      {/* Right Side - Empty for balance */}
                      <div className="w-12"></div>
                    </div>

                    {/* Hidden audio element */}
                    <audio
                      ref={audioRef}
                      src={episode.audioUrl}
                      onTimeUpdate={onTimeUpdate}
                      onLoadedMetadata={onLoadedMetadata}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

function formatTime(seconds: number) {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDuration(seconds?: number) {
  if (!seconds && seconds !== 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h > 0 ? h : null, m, s]
    .filter((v) => v !== null)
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

function sanitizeHtml(html: string) {
  try {
    // very light sanitization for RSS descriptions; strip script/style
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  } catch {
    return html;
  }
}

export default PodcastDetail;
