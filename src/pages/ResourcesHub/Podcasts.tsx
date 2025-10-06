import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import Footer from "../../components/Footer";
import { MdOutlineExpandMore, MdSlowMotionVideo } from "react-icons/md";
import podcast1 from "../../assets/images/podcast1.png";
import { fetchPodcasts, type PodcastEpisode } from "@/api/podcast.api";
import { RiForward10Line } from "react-icons/ri";
import { BsCopy } from "react-icons/bs";
import { GrBackTen } from "react-icons/gr";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <main className="relative min-h-screen pb-20 bg-gray-50">
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

      {/* Filter Section */}
      <article className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        {/* Categories */}
        <section className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 items-center">
          <div className="text-[#4444B3] border-[#4444B3] rounded-full border py-1 px-3 text-xs sm:text-sm font-medium">
            All
          </div>
          {["Healthy", "Social", "Psychology", "Health"].map((cat, i) => (
            <div
              key={i}
              className="text-xs sm:text-sm font-medium cursor-pointer hover:text-[#4444B3] transition"
            >
              {cat}
            </div>
          ))}
        </section>

        {/* Sort Dropdown */}
        <div className="flex gap-1.5 text-[#4444B3] border-[#4444B3] rounded-full border py-1 px-3 text-xs sm:text-sm cursor-pointer">
          Newest First
          <MdOutlineExpandMore className="mt-0.5 sm:mt-1 text-lg" />
        </div>
      </article>

      {/* Podcast Section */}
      <article className="flex flex-col p-4 sm:p-6 w-full mt-6 items-center">
        {loading ? (
          <div className="w-full text-center text-gray-500">
            Loading podcasts...
          </div>
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
        {!loading && !error && (
          <button
            onClick={handleLoadMore}
            className="flex rounded-full text-white justify-center mt-6 px-6 py-2 text-center bg-[#4444B3] text-sm sm:text-base hover:bg-[#343494] transition"
          >
            Load More
          </button>
        )}
      </article>

      <Footer />
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const storageKey = `podcastProgress:${episode.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const { position } = JSON.parse(saved);
        if (audioRef.current && typeof position === "number" && position > 0) {
          audioRef.current.currentTime = position;
        }
      } catch {}
    }
  }, [storageKey]);

  const onTimeUpdate = () => {
    const el = audioRef.current;
    if (!el) return;
    const position = Math.floor(el.currentTime || 0);
    const duration = Math.floor(el.duration || episode.duration || 0);
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
    <div className="flex flex-col gap-2 border rounded-3xl p-4 hover:shadow-md transition bg-white">
      <img
        src={episode.imageUrl || podcast1}
        alt={episode.title}
        className="rounded-lg w-full h-40 sm:h-48 object-cover"
      />
      <div className="text-xs sm:text-sm text-gray-500 font-semibold">
        {episode.publishedAt
          ? new Date(episode.publishedAt).toLocaleDateString()
          : ""}
      </div>
      <div className="text-base sm:text-lg lg:text-xl font-medium line-clamp-2">
        {episode.title}
      </div>
      <div className="text-sm sm:text-base text-[#667085] flex justify-between">
        <span>{formatDuration(episode.duration)}</span>
        <span className="text-[#98A2B3]">Podcast</span>
      </div>
      {episode.audioUrl && (
        <audio
          ref={audioRef}
          src={episode.audioUrl}
          controls
          onTimeUpdate={onTimeUpdate}
          className="mt-2"
        />
      )}
    </div>
  );
};
