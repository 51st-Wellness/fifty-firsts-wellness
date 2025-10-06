import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPodcastById, type PodcastEpisode } from "@/api/podcast.api";
import { TextSkeleton, CardSkeleton } from "@/components/ui/SkeletonLoader";
import podcast1 from "@/assets/images/podcast1.png";

const PodcastDetail: React.FC = () => {
  const { id = "" } = useParams();
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link to="/podcasts" className="text-brand-green hover:underline">
            ← Back to Podcasts
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <CardSkeleton className="md:col-span-2" />
            <div className="md:col-span-3">
              <TextSkeleton lines={2} className="mb-4" />
              <TextSkeleton lines={6} />
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : episode ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <img
                src={episode.imageUrl || podcast1}
                alt={episode.title}
                className="w-full rounded-2xl shadow-sm"
              />
            </div>
            <div className="md:col-span-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {episode.title}
              </h1>
              <div className="mt-2 text-sm text-gray-500">
                {episode.publishedAt
                  ? new Date(episode.publishedAt).toLocaleDateString()
                  : ""}
                {episode.duration
                  ? ` · ${formatDuration(episode.duration)}`
                  : ""}
              </div>
              {episode.audioUrl && (
                <div className="mt-4 bg-white border rounded-2xl p-4 shadow-sm">
                  <audio
                    ref={audioRef}
                    src={episode.audioUrl}
                    controls
                    onTimeUpdate={onTimeUpdate}
                    className="w-full"
                  />
                </div>
              )}
              {episode.description && (
                <div
                  className="prose prose-sm sm:prose base mt-6 text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(episode.description),
                  }}
                />
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
