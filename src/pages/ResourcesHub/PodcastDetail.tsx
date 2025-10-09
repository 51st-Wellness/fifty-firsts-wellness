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
} from "lucide-react";

const PodcastDetail: React.FC = () => {
  const { id = "" } = useParams();
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
    const duration = Math.floor(el.duration || episode?.duration || 0);
    if (Number.isFinite(position)) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          position,
          duration,
          updatedAt: new Date().toISOString(),
        })
      );
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-green/5 to-brand-purple/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-brand-green/5 to-brand-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/podcasts"
          className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark font-medium transition-colors group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Podcasts
        </Link>

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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Podcast Cover Art */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-purple/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <img
                  src={episode.imageUrl || podcast1}
                  alt={episode.title}
                  className="relative w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Podcast Details & Player */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 leading-tight">
                  {episode.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {episode.publishedAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="bg-brand-green/10 p-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-brand-green" />
                      </div>
                      <span className="font-medium">
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="bg-brand-purple/10 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-brand-purple" />
                      </div>
                      <span className="font-medium">
                        {formatDuration(episode.duration)}
                      </span>
                    </div>
                  )}
                </div>

                {episode.description && (
                  <div
                    className="prose prose-sm sm:prose lg:prose-lg mt-6 text-gray-700 max-w-none font-primary"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(episode.description),
                    }}
                  />
                )}
              </div>

              {/* Custom Audio Player */}
              {episode.audioUrl && (
                <div className="mt-8 bg-gradient-to-br from-white to-brand-green/5 border border-brand-green/20 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlayPause}
                      className="flex-shrink-0 bg-gradient-to-br from-brand-green to-brand-green-dark text-white rounded-full p-4 hover:scale-105 active:scale-95 transition-transform shadow-lg hover:shadow-xl"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 fill-white" />
                      ) : (
                        <Play className="w-8 h-8 fill-white ml-1" />
                      )}
                    </button>

                    <div className="flex-1">
                      <audio
                        ref={audioRef}
                        src={episode.audioUrl}
                        controls
                        controlsList="nodownload"
                        onTimeUpdate={onTimeUpdate}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        className="w-full podcast-audio-player"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <Headphones className="w-4 h-4 text-brand-green" />
                    <span>Your progress is saved automatically</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

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
