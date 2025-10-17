import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Footer from "../../components/Footer";
import webinarImg from "../../assets/images/webinars.png";
import { GoClock } from "react-icons/go";
import { LuCalendarDays } from "react-icons/lu";

interface WebinarsProps {
  onSearch?: (query: string) => void;
}

const categories = ["All","Healthy","Social","Psychology","Health","Work","Productivity","Mindfulness"];

type Webinar = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO
  time: string;
  category: string;
  image: string;
  tags?: string[];
  host?: string;
};

const demoWebinars: Webinar[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i+1),
  title: "Finding Stillness in a Busy and Exhausting World",
  description: "Learn daily rituals to ease anxiety and improve sleep.",
  date: "2025-06-25",
  time: "6 PM WAT",
  category: categories[(i % (categories.length-1)) + 1] || "Healthy",
  image: webinarImg,
  tags: i % 2 ? ["Limited Slots","Upcoming"] : ["Free Entry","Upcoming"],
  host: "Francis Maria",
}));

const Webinars: React.FC<WebinarsProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("Newest First");
  const [visibleCount, setVisibleCount] = useState(9);
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const base = demoWebinars;
    const byCat = selectedCategory === "All" ? base : base.filter(w => w.category.toLowerCase() === selectedCategory.toLowerCase());
    const byQuery = query ? byCat.filter(w => (w.title + " " + w.description).toLowerCase().includes(query.toLowerCase())) : byCat;
    const sorted = [...byQuery].sort((a,b) => {
      if (sortLabel === "Newest First") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortLabel === "Oldest First") return new Date(a.date).getTime() - new Date(b.date).getTime();
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [query, selectedCategory, sortLabel]);

  const hasMore = filtered.length > visibleCount;

  return (
    <main className="relative min-h-screen pb-0 bg-[#F7F8FA]">
      {/* Hero */}
      <section className="relative w-full">
        <img src="/assets/Vector.svg" alt="Decoration" className="pointer-events-none select-none absolute right-0 top-0 w-40 sm:w-48 md:w-56 lg:w-64" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-3" style={{ fontFamily: '"League Spartan", sans-serif' }}>Webinars</h1>
          <p className="text-sm sm:text-base text-[#475464] leading-relaxed max-w-3xl">Dive into a wealth of information designed to help you.</p>

          {/* Controls */}
          <div className="mt-6 flex flex-col gap-4">
            {/* Search input */}
            <div className="w-full max-w-xl">
              <div className="bg-white rounded-xl overflow-hidden focus-within:border-[#4444B3] transition-colors flex items-center">
                <div className="pl-3 text-gray-400"><Search size={18} /></div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What webinar are you looking for?"
                  className="w-full px-3 py-3 outline-none text-sm"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} type="button"
                    className={`px-3 py-1.5 rounded-full border text-sm ${selectedCategory===cat?'text-[#4444B3] border-[#4444B3]':'text-gray-600 border-gray-300'}`}
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >{cat}</button>
                ))}
              </div>
              <div className="relative" ref={sortRef}>
                <button type="button" onClick={() => setSortOpen(o=>!o)} className="bg-white border rounded-full px-4 py-2 text-sm text-[#4444B3] border-[#4444B3] flex items-center gap-2" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                  {sortLabel}
                  <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180':''}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md z-10 overflow-hidden">
                    {(["Newest First","Oldest First","A-Z Title"]).map(opt => (
                      <button key={opt} type="button" onClick={() => { setSortLabel(opt); setSortOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortLabel===opt?'text-[#4444B3]':'text-gray-700'}`} style={{ fontFamily: '"League Spartan", sans-serif' }}>{opt}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid with background */}
      <section className="w-full" style={{ backgroundImage:'url(/assets/general-background.svg)', backgroundRepeat:'no-repeat', backgroundSize:'cover', backgroundPosition:'center' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: '\"League Spartan\", sans-serif' }}>No webinars found</div>
              <p className="text-white/80 mb-6">Try a different search or switch categories.</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('All'); setQuery(''); }}
                className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-50"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.slice(0, visibleCount).map((w) => (
                <div key={w.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-3">
                    <img src={w.image} alt={w.title} className="w-full h-48 object-cover rounded-2xl" />
                  </div>
                  <div className="px-6 pb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight line-clamp-2" style={{ fontFamily: '\"League Spartan\", sans-serif' }}>{w.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{w.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1"><LuCalendarDays /> {new Date(w.date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1"><GoClock /> {w.time}</div>
                    </div>
                    {w.tags && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {w.tags.map((t,i)=> (
                          <span key={i} className={`text-xs px-2 py-0.5 rounded-full border ${t.includes('Free')?'text-[#229EFF] border-[#229EFF] bg-[#229EFF1A]': t.includes('Upcoming')?'text-[#00D743] border-[#00D743] bg-[#00D7431A]':'text-[#229EFF] border-[#229EFF] bg-[#229EFF1A]'}`}>{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-700">Host: {w.host}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {filtered.length > 0 && hasMore && (
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-16 flex justify-center">
            <button 
              onClick={() => setVisibleCount(v=>Math.min(v+6, filtered.length))} 
              className="px-6 py-3 rounded-full text-white bg-[#4444B3] hover:opacity-90 transition-opacity" 
              style={{ fontFamily: '\"League Spartan\", sans-serif' }}>
              Load More
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default Webinars;
