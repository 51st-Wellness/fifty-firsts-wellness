import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown, ListFilter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import webinarImg from "../../assets/images/webinars.png";
import { GoClock } from "react-icons/go";
import { LuCalendarDays } from "react-icons/lu";
import { fetchProgrammes, Programme } from "../../api/programme.api";
import { mediaUrl } from "../../api/blog.api";

interface WebinarsProps {
  onSearch?: (query: string) => void;
}

const categories = ["All","Healthy","Social","Psychology","Health","Work","Productivity","Mindfulness"];

const Webinars: React.FC<WebinarsProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("Newest First");
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 9;
  const sortRef = useRef<HTMLDivElement | null>(null);

  // Fetch programmes
  useEffect(() => {
    const loadProgrammes = async () => {
      try {
        setLoading(true);
        const response = await fetchProgrammes({
          page,
          limit: pageSize,
          isPublished: true,
        });
        
        if (page === 1) {
          setProgrammes(response.data.data.items);
        } else {
          setProgrammes((prev) => [...prev, ...response.data.data.items]);
        }
        
        setTotal(response.data.data.pagination.total);
      } catch (error) {
        console.error("Failed to fetch programmes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgrammes();
  }, [page]);

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
    const base = programmes;
    
    // Filter by category
    const byCat = selectedCategory === "All" 
      ? base 
      : base.filter(p => 
          p.categories?.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
        );
    
    // Filter by search query
    const byQuery = query 
      ? byCat.filter(p => 
          (p.title + " " + (p.description || "")).toLowerCase().includes(query.toLowerCase())
        )
      : byCat;
    
    // Sort
    const sorted = [...byQuery].sort((a, b) => {
      if (sortLabel === "Newest First") return b.createdAt - a.createdAt;
      if (sortLabel === "Oldest First") return a.createdAt - b.createdAt;
      return a.title.localeCompare(b.title);
    });
    
    return sorted;
  }, [programmes, query, selectedCategory, sortLabel]);

  const hasMore = programmes.length < total;

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
            {/* Search Bar and Filter Icon (Mobile) */}
            <div className="w-full max-w-xl">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white rounded-xl overflow-hidden focus-within:border-brand-green-dark transition-colors flex items-center">
                  <div className="pl-3 text-gray-400"><Search size={18} /></div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What webinar are you looking for?"
                    className="w-full px-3 py-3 outline-none text-sm bg-white"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  />
                </div>
                
                {/* Mobile Filter Icon */}
                <div className="md:hidden relative" ref={sortRef}>
                  <button
                    type="button"
                    onClick={() => setSortOpen(o => !o)}
                    className="flex items-center justify-center w-12 h-12 bg-white border rounded-full transition-colors text-brand-green-dark border-brand-green-dark"
                  >
                    <ListFilter size={20} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md z-10 overflow-hidden">
                      {(["Newest First","Oldest First","A-Z Title"]).map(opt => (
                        <button key={opt} type="button" onClick={() => { setSortLabel(opt); setSortOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortLabel===opt?'text-brand-green-dark':'text-gray-700'}`} style={{ fontFamily: '"League Spartan", sans-serif' }}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Categories - Horizontally Scrollable */}
              <div 
                className="w-full md:flex-1 overflow-x-auto scrollbar-hide"
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="flex gap-2 pb-2" style={{ minWidth: 'min-content' }}>
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} type="button"
                      className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap flex-shrink-0 ${selectedCategory===cat?'text-brand-green-dark border-brand-green-dark':'text-gray-600 border-gray-300'}`}
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >{cat}</button>
                  ))}
                </div>
              </div>
              
              {/* Sort Dropdown - Desktop Only */}
              <div className="hidden md:block relative" ref={sortRef}>
                <button type="button" onClick={() => setSortOpen(o=>!o)} className="bg-white border rounded-full px-4 py-2 text-sm text-brand-green-dark border-brand-green-dark flex items-center gap-2 whitespace-nowrap" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                  {sortLabel}
                  <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180':''}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md z-10 overflow-hidden">
                    {(["Newest First","Oldest First","A-Z Title"]).map(opt => (
                      <button key={opt} type="button" onClick={() => { setSortLabel(opt); setSortOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortLabel===opt?'text-brand-green-dark':'text-gray-700'}`} style={{ fontFamily: '"League Spartan", sans-serif' }}>{opt}</button>
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
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-8">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="p-3">
                    <div className="w-full h-48 bg-gray-200 rounded-2xl"></div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                      <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: '\"League Spartan\", sans-serif' }}>No webinars found</div>
              <p className="text-white/80 mb-6">Try a different search or switch categories.</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('All'); setQuery(''); }}
                className="px-4 py-2 rounded-full bg-brand-green-light text-white text-sm hover:bg-brand-green-light/80"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((programme) => (
                <div 
                  key={programme.productId} 
                  onClick={() => navigate(`/programmes/${programme.productId}`)}
                  className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="p-3">
                    <img 
                      src={programme.thumbnail ? mediaUrl(programme.thumbnail) : webinarImg} 
                      alt={programme.title} 
                      className="w-full h-48 object-cover rounded-2xl" 
                    />
                  </div>
                  <div className="px-6 pb-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 leading-tight line-clamp-2 min-h-[40px]" style={{ fontFamily: '\"League Spartan\", sans-serif' }}>
                      {programme.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3 min-h-[63px]">
                      {programme.description || "Explore this comprehensive wellness programme."}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 min-h-[20px]">
                      <div className="flex items-center gap-1">
                        <LuCalendarDays /> {new Date(programme.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <GoClock /> {programme.duration ? `${Math.floor(programme.duration / 60)} min` : 'TBD'}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
                      {programme.categories && programme.categories.length > 0 && (
                        programme.categories.slice(0, 3).map((cat, i) => (
                          <span 
                            key={i} 
                            className="text-xs px-2 py-0.5 rounded-full border text-[#229EFF] border-[#229EFF] bg-[#229EFF1A]"
                          >
                            {cat}
                          </span>
                        ))
                      )}
                    </div>
                    <div className="text-xs text-gray-700 font-medium min-h-[16px]">
                      {programme.isFeatured && "Featured Programme"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && hasMore && (
            <div className="pt-10 flex justify-center">
              <button 
                onClick={() => setPage(p => p + 1)} 
                className="px-6 py-3 rounded-full text-white bg-brand-green-dark hover:opacity-90 transition-opacity" 
                style={{ fontFamily: '\"League Spartan\", sans-serif' }}>
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

export default Webinars;
