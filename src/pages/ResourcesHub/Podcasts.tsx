import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  VolumeX,
  Volume,
  Volume1,
  Volume2,
  Search,
  ChevronDown,
  SkipBack,
  SkipForward,
  Expand,
  ListFilter,
  X,
} from "lucide-react";
import podcast1 from "../../assets/images/podcast1.png";
import { fetchPodcasts, type PodcastEpisode } from "@/api/podcast.api";
import { useNavigate } from "react-router-dom";
import { CardSkeleton } from "@/components/ui/SkeletonLoader";
import SearchBar from "@/components/ui/SearchBar";
import Footer from "@/components/Footer";

interface PodcastsProps {
  onSearch?: (query: string) => void;
}

const categories = [
  "All",
  "Healthy",
  "Social",
  "Psychology",
  "Health",
  "Work",
  "Productivity",
  "Mindfulness",
];

// Podcasts page listing and filtering episodes
const Podcasts: React.FC<PodcastsProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [sortLabel, setSortLabel] = useState<string>("Newest First");
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // Fetch a generous amount; client controls visible count
    fetchPodcasts(60)
      .then((eps) => {
        if (mounted) {
          const safe = Array.isArray(eps) ? eps : [];
          setEpisodes(safe);
          setError(null);
        }
      })
      .catch(() => {
        if (mounted) setError("Failed to load podcasts");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Outside click to close sort dropdown
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filteredEpisodes = useMemo(() => {
    const base = Array.isArray(episodes) ? episodes : [];
    const byQuery = (() => {
      if (!query) return base;
      const q = query.toLowerCase();
      return base.filter((e) => {
        const title = (e?.title || "").toLowerCase();
        const desc = extractPlainText(e?.description || "").toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    })();
    const byCategory =
      selectedCategory === "All"
        ? byQuery
        : byQuery.filter(
            (e) =>
              ((e as any)?.category || "").toLowerCase() ===
              selectedCategory.toLowerCase()
          );

    const sorted = [...byCategory].sort((a, b) => {
      if (sortLabel === "Newest First") {
        return (
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime()
        );
      }
      if (sortLabel === "Oldest First") {
        return (
          new Date(a.publishedAt || 0).getTime() -
          new Date(b.publishedAt || 0).getTime()
        );
      }
      // A-Z Title
      return (a.title || "").localeCompare(b.title || "");
    });
    return sorted;
  }, [episodes, query, selectedCategory, sortLabel]);

  const handleLoadMore = () =>
    setVisibleCount((v) => Math.min(v + 6, filteredEpisodes.length));
  const hasMore = filteredEpisodes.length > visibleCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <main className="relative min-h-screen pb-0 bg-[#F7F8FA]">
      {/* Hero Section */}
      <section className="relative w-full">
        <img
          src="/assets/Vector.svg"
          alt="Decoration"
          className="pointer-events-none select-none absolute right-0 top-0 w-40 sm:w-48 md:w-56 lg:w-64"
        />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-16">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-3"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Podcasts
          </h1>
          <p className="text-sm sm:text-base text-[#475464] leading-relaxed max-w-3xl">
            Explore thoughtfully curated wellness podcasts designed to nourish
            your body, calm your mind, and support your everyday self-care
            rituals.
          </p>

          {/* Controls: Search, Categories, Sort */}
          <div className="mt-6 flex flex-col gap-4">
            {/* Search Bar and Filter Icon (Mobile) */}
            <div className="w-full max-w-xl">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white rounded-xl overflow-hidden focus-within:border-[#4444B3] transition-colors flex items-center">
                  <div className="pl-4 text-gray-400">
                    <Search size={20} />
                  </div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What podcast are you looking for?"
                    className="w-full px-4 py-3 outline-none text-sm bg-white"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  />
                </div>

                {/* Mobile Filter Icon */}
                <div className="md:hidden relative" ref={sortRef}>
                  <button
                    type="button"
                    onClick={() => setSortOpen((o) => !o)}
                    className="flex items-center justify-center w-12 h-12 bg-white border rounded-full transition-colors text-[#4444B3] border-[#4444B3]"
                  >
                    <ListFilter size={20} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md z-50 overflow-hidden">
                      {["Newest First", "Oldest First", "A-Z Title"].map(
                        (opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSortLabel(opt);
                              setSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                              sortLabel === opt
                                ? "text-[#4444B3]"
                                : "text-gray-700"
                            }`}
                            style={{
                              fontFamily: '"League Spartan", sans-serif',
                            }}
                          >
                            {opt}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Categories and Sort */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Categories - Horizontally Scrollable */}
              <div
                className="w-full md:flex-1 overflow-x-auto scrollbar-hide"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div
                  className="flex gap-2 pb-2"
                  style={{ minWidth: "min-content" }}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap flex-shrink-0 ${
                        selectedCategory === cat
                          ? "text-[#4444B3] border-[#4444B3]"
                          : "text-gray-600 border-gray-300"
                      } transition-colors`}
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Dropdown - Desktop Only */}
              <div className="hidden md:block relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setSortOpen((o) => !o)}
                  className="bg-white border rounded-full px-4 py-2 text-sm text-[#4444B3] border-[#4444B3] flex items-center gap-2 whitespace-nowrap"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  {sortLabel}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      sortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md z-10 overflow-hidden">
                    {["Newest First", "Oldest First", "A-Z Title"].map(
                      (opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSortLabel(opt);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            sortLabel === opt
                              ? "text-[#4444B3]"
                              : "text-gray-700"
                          }`}
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          {opt}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid with background that kisses footer */}
      <section
        className="w-full"
        style={{
          backgroundImage: "url(/assets/general-background.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-10 sm:px-10 lg:px-16 pt-8 pb-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredEpisodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="text-2xl font-semibold mb-2 text-white"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                No episodes found
              </div>
              <p className="mb-6 text-white/80">
                Try a different search or switch categories.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setQuery("");
                  }}
                  className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-50"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredEpisodes.slice(0, visibleCount).map((ep) => (
                <EpisodeCard key={ep.id} episode={ep} />
              ))}
            </div>
          )}

          {/* Load More inside background */}
          {!loading && !error && hasMore && (
            <div className="pt-10 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 rounded-full text-white bg-[#4444B3] hover:opacity-90 transition-opacity"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Podcasts;

// Format seconds into H:MM:SS
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

// Extract plain text from potential HTML content
function extractPlainText(html?: string): string {
  if (!html) return "";
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

// Episode card with audio controls and description
const EpisodeCard: React.FC<{ episode: PodcastEpisode }> = ({ episode }) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [duration, setDuration] = useState<number>(0);
  const [volumeLevel, setVolumeLevel] = useState<0 | 25 | 50 | 75 | 100>(75);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="text-left group bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden min-h-[380px] sm:min-h-[420px] md:min-h-[380px] lg:min-h-[420px] flex flex-col">
        <div className="w-full text-left flex flex-col flex-grow">
          <div className="p-2 lg:p-3">
            <div className="relative">
              <img
                src={episode.imageUrl || podcast1}
                alt={episode.title}
                className="w-full h-40 sm:h-44 md:h-36 lg:h-48 object-cover rounded-2xl"
              />
            </div>
          </div>
        <div className="px-3 lg:px-5 flex flex-col flex-grow">
          <h3
            className="text-base sm:text-lg md:text-base lg:text-base font-semibold text-gray-900 mb-2 lg:mb-3 leading-tight line-clamp-2 min-h-[2.5rem] flex items-start"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            {episode.title}
          </h3>
          {/* Description */}
            <div className="flex-grow">
              {/* Mobile/Tablet: 2 lines */}
              <p
                className="text-sm sm:text-base md:text-sm text-gray-600 mb-2 lg:mb-3 leading-snug lg:hidden"
                style={{ 
                  fontFamily: '"League Spartan", sans-serif',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: '2.5rem'
                }}
                title={extractPlainText(episode.description || "")}
              >
                {extractPlainText(episode.description || "")}
              </p>
              
              {/* Desktop: 3 lines */}
              <p
                className="hidden lg:block text-sm text-gray-600 mb-2 lg:mb-3 leading-snug"
                style={{ 
                  fontFamily: '"League Spartan", sans-serif',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: '3.75rem'
                }}
                title={extractPlainText(episode.description || "")}
              >
                {extractPlainText(episode.description || "")}
              </p>
            </div>
          {(isPlaying || progress > 0) && (
            <div className="mb-3">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => {
                  const a = audioRef.current;
                  if (!a) return;
                  const pct = Number(e.target.value);
                  setProgress(pct);
                  if (a.duration) a.currentTime = (pct / 100) * a.duration;
                }}
                className="w-full h-1.5 accent-emerald-600"
              />
            </div>
          )}
        </div>
      </div>
      {/* Bottom bar */}
      <div className="px-3 lg:px-5 pb-3 lg:pb-5 mt-auto">
        <div className="flex items-end justify-between min-h-[3rem]">
          {/* Left: timestamp up, play down */}
          <div className="flex flex-col gap-1 lg:gap-2 justify-end">
            <div className="text-xs sm:text-sm text-gray-700 font-medium">
              {formatDuration(duration || episode.duration)}
            </div>
            <div className="flex items-center gap-1.5 lg:gap-3">
              <button
                onClick={() => {
                  const a = audioRef.current;
                  if (!a) return;
                  a.currentTime = Math.max(0, a.currentTime - 10);
                }}
                className="p-0.5 lg:p-1 rounded-full hover:bg-gray-100"
                aria-label="Back 10s"
              >
                <SkipBack className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
              <button
                onClick={() => {
                  const a = audioRef.current;
                  if (!a) return;
                  if (isPlaying) {
                    a.pause();
                    setIsPlaying(false);
                  } else {
                    a.play()
                      .then(() => setIsPlaying(true))
                      .catch(() => {});
                  }
                }}
                className="p-0.5 lg:p-1 rounded-full hover:bg-gray-100"
                aria-label="Play/Pause"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : (
                  <Play className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
              </button>
              <button
                onClick={() => {
                  const a = audioRef.current;
                  if (!a) return;
                  a.currentTime = Math.min(
                    a.duration || 1e9,
                    a.currentTime + 10
                  );
                }}
                className="p-0.5 lg:p-1 rounded-full hover:bg-gray-100"
                aria-label="Forward 10s"
              >
                <SkipForward className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
              {/* Volume cycle button */}
              <button
                onClick={() => {
                  const a = audioRef.current;
                  if (!a) return;
                  const order: Array<0 | 25 | 50 | 75 | 100> = [
                    0, 25, 50, 75, 100,
                  ];
                  const idx = order.indexOf(volumeLevel);
                  const next = order[(idx + 1) % order.length];
                  setVolumeLevel(next);
                  if (next === 0) {
                    a.muted = true;
                  } else {
                    a.muted = false;
                    a.volume = next / 100;
                  }
                }}
                className="p-0.5 lg:p-1 rounded-full hover:bg-gray-100"
                aria-label="Volume"
              >
                {volumeLevel === 0 ? (
                  <VolumeX className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : volumeLevel === 25 ? (
                  <Volume className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : volumeLevel === 50 ? (
                  <Volume1 className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : volumeLevel === 75 ? (
                  <Volume2 className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
              </button>
            </div>
          </div>
          {/* Right: category text then controls */}
          <div className="flex flex-col items-end gap-1 lg:gap-2 justify-end">
            <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              {(episode as any).category || "Morning Talk"}
            </div>
            <div className="flex items-center gap-1.5 lg:gap-3 text-gray-700">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="p-1 sm:p-1.5 lg:p-1 rounded-full hover:bg-gray-100"
                aria-label="Expand episode"
              >
                <Expand className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* audio and progress management */}
      <audio
        ref={audioRef}
        src={(episode as any).audioUrl || (episode as any).audio || ""}
        onLoadedMetadata={() => {
          const a = audioRef.current;
          if (!a) return;
          setDuration(a.duration || 0);
        }}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a) return;
          setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
        }}
        onEnded={() => setIsPlaying(false)}
      />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full">
              {/* Left side - Image */}
              <div className="lg:w-1/2 p-6">
                <img
                  src={episode.imageUrl || podcast1}
                  alt={episode.title}
                  className="w-full h-48 lg:h-full object-cover rounded-xl"
                />
              </div>
              
              {/* Right side - Content and Controls */}
              <div className="lg:w-1/2 p-6 flex flex-col">
                {/* Header with close button */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 
                      className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      {episode.title}
                    </h2>
                    <div className="text-sm text-gray-500 mb-4">
                      {(episode as any).category || "Morning Talk"} • {formatDuration(duration || episode.duration)}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="ml-4 p-2 rounded-full hover:bg-gray-100"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <div className="flex-1 mb-6">
                  <p 
                    className="text-sm text-gray-600 leading-relaxed"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    {extractPlainText(episode.description || "")}
                  </p>
                </div>

                {/* Audio Controls */}
                <div className="space-y-4">
                  {/* Progress bar */}
                  {(isPlaying || progress > 0) && (
                    <div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={progress}
                        onChange={(e) => {
                          const a = audioRef.current;
                          if (!a) return;
                          const pct = Number(e.target.value);
                          setProgress(pct);
                          if (a.duration) a.currentTime = (pct / 100) * a.duration;
                        }}
                        className="w-full h-2 accent-emerald-600"
                      />
                    </div>
                  )}

                  {/* Control buttons */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        const a = audioRef.current;
                        if (!a) return;
                        a.currentTime = Math.max(0, a.currentTime - 10);
                      }}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="Back 10s"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        const a = audioRef.current;
                        if (!a) return;
                        if (isPlaying) {
                          a.pause();
                          setIsPlaying(false);
                        } else {
                          a.play()
                            .then(() => setIsPlaying(true))
                            .catch(() => {});
                        }
                      }}
                      className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                      aria-label="Play/Pause"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const a = audioRef.current;
                        if (!a) return;
                        a.currentTime = Math.min(
                          a.duration || 1e9,
                          a.currentTime + 10
                        );
                      }}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="Forward 10s"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        const a = audioRef.current;
                        if (!a) return;
                        const order: Array<0 | 25 | 50 | 75 | 100> = [
                          0, 25, 50, 75, 100,
                        ];
                        const idx = order.indexOf(volumeLevel);
                        const next = order[(idx + 1) % order.length];
                        setVolumeLevel(next);
                        if (next === 0) {
                          a.muted = true;
                        } else {
                          a.muted = false;
                          a.volume = next / 100;
                        }
                      }}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="Volume"
                    >
                      {volumeLevel === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : volumeLevel === 25 ? (
                        <Volume className="w-5 h-5" />
                      ) : volumeLevel === 50 ? (
                        <Volume1 className="w-5 h-5" />
                      ) : volumeLevel === 75 ? (
                        <Volume2 className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
