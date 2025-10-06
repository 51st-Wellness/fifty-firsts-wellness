import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Play, Clock, Calendar } from "lucide-react";
import podcast1 from "../../assets/images/podcast1.png";
import { fetchPodcasts, type PodcastEpisode } from "@/api/podcast.api";
import { useNavigate } from "react-router-dom";
import { CardSkeleton } from "@/components/ui/SkeletonLoader";

interface PodcastsProps {
  onSearch?: (query: string) => void;
}

const Podcasts: React.FC<PodcastsProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(12);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPodcasts(limit)
      .then((eps) => {
        if (mounted) {
          setEpisodes(eps);
          setError(null);
        }
      })
      .catch((e) => {
        if (mounted) setError("Failed to load podcasts");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [limit]);

  const filteredEpisodes = useMemo(() => {
    if (!query) return episodes;
    const q = query.toLowerCase();
    return episodes.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }, [episodes, query]);

  const handleLoadMore = () => setLimit((l) => l + 9);
  const hasMore = episodes.length >= limit; // heuristic since API slices by limit

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <main className="relative min-h-screen pb-20 bg-gray-50 px-4 sm:px-8 lg:px-16">
      {/* Header Section */}
      <article className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start w-full gap-6 mt-6">
        {/* Left Content */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold">
            Podcasts
          </h1>
          <p className="text-sm sm:text-base text-[#475464] leading-relaxed">
            Explore thoughtfully curated wellness podcasts designed to nourish
            your body, calm your mind, and support your everyday self-care
            rituals.
          </p>
        </div>
      </article>

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto flex items-center bg-white border rounded-full shadow-sm overflow-hidden mt-6 w-full"
      >
        <div className="pl-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search podcasts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-sm sm:text-base focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 sm:px-6 py-2 bg-indigo-600 text-white text-sm sm:text-base font-medium hover:bg-indigo-700 transition-all"
        >
          Search
        </button>
      </form>

      {/* Removed tags/filters; keeping layout clean */}

      {/* Podcast Section */}
      <article className="flex flex-col p-4 sm:p-6 w-full mt-6 items-center">
        {loading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </section>
        ) : error ? (
          <div className="w-full text-center text-red-500">{error}</div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredEpisodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </section>
        )}

        {/* Load More Button */}
        {!loading && !error && hasMore && (
          <button
            onClick={handleLoadMore}
            className="flex rounded-full text-white justify-center mt-6 px-6 py-2 text-center bg-[#4444B3] text-sm sm:text-base hover:bg-[#343494] transition"
          >
            Load More
          </button>
        )}
      </article>
    </main>
  );
};

export default Podcasts;

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

const EpisodeCard: React.FC<{ episode: PodcastEpisode }> = ({ episode }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/podcasts/${encodeURIComponent(episode.id)}`)}
      className="text-left group relative bg-gradient-to-br from-white via-brand-green/5 to-brand-purple/5 border border-gray-200 rounded-3xl p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green/30 overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-green/10 to-brand-purple/10 rounded-full blur-3xl -z-0 group-hover:scale-150 transition-transform duration-500" />

      <div className="relative z-10">
        <img
          src={episode.imageUrl || podcast1}
          alt={episode.title}
          className="rounded-2xl w-full h-44 object-cover shadow-md group-hover:shadow-xl transition-shadow"
        />
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 via-brand-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
          <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-8 h-8 text-brand-green fill-brand-green" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-3 text-xs text-gray-500">
        {episode.publishedAt && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-green" />
            <span>{new Date(episode.publishedAt).toLocaleDateString()}</span>
          </div>
        )}
        {episode.duration && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-purple" />
            <span>{formatDuration(episode.duration)}</span>
          </div>
        )}
      </div>

      <h3 className="relative z-10 mt-3 text-base sm:text-lg lg:text-xl font-heading font-bold line-clamp-2 text-gray-900 group-hover:text-brand-green transition-colors">
        {episode.title}
      </h3>

      {episode.description && (
        <p className="relative z-10 mt-2 text-sm text-gray-600 line-clamp-2 font-primary">
          {episode.description.replace(/<[^>]+>/g, "")}
        </p>
      )}

      <div className="relative z-10 mt-4 flex items-center justify-end">
        <span className="text-xs font-medium text-brand-green group-hover:text-brand-purple transition-colors flex items-center gap-1">
          Tap to play <Play className="w-3 h-3" />
        </span>
      </div>
    </button>
  );
};
