import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs, BlogEntity, mediaUrl } from "../../api/blog.api";

type BlogCardProps = {
  imageSrc: string;
  title: string;
  excerpt: string;
  to: string;
};

const BlogCard: React.FC<BlogCardProps> = ({ imageSrc, title, excerpt, to }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border border-gray-100">
      <div className="w-full overflow-hidden rounded-2xl">
        <img src={imageSrc} alt={title} className="w-full h-72 sm:h-80 object-cover" />
      </div>
      <h3
        className="mt-6 text-xl sm:text-2xl font-semibold text-gray-900 leading-snug line-clamp-2"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        {title}
      </h3>
      <p className="mt-4 text-sm sm:text-base text-gray-600 leading-7">
        {excerpt}
      </p>
      <Link
        to={to}
        className="mt-6 inline-block bg-brand-green text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors"
      >
        Read More
      </Link>
    </div>
  );
};

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetchBlogs(1, 3); // Fetch only 3 blogs for homepage
        setBlogs(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Auto-scroll functionality for mobile carousel
  useEffect(() => {
    // Only auto-scroll on mobile (when blogs exist and we're showing carousel)
    if (blogs.length <= 1 || isPaused) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      return;
    }

    // Set up auto-scroll interval
    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Loop back to 0 when reaching the end
        return prevIndex === blogs.length - 1 ? 0 : prevIndex + 1;
      });
    }, 3500); // 3.5 seconds

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [blogs.length, isPaused]);

  // Truncate description to ~150 characters
  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  // Swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true); // Pause auto-scroll when user starts touching
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      // Resume auto-scroll if no swipe was detected
      setIsPaused(false);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < blogs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    
    // Resume auto-scroll after a short delay
    setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };

  return (
    <section
      className="w-full py-40 lg:py-52 min-h-[1100px] lg:min-h-[1400px] bg-no-repeat"
      style={{
        backgroundImage: "url(/assets/homepage/blog-bg.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-40">
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className="text-3xl sm:text-4xl font-normal text-white"
            style={{ fontFamily: '"Lilita One", sans-serif' }}
          >
            Read Our Blog
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto rounded-full mt-3" />
        </div>

        {loading ? (
          <>
            {/* Desktop Loading */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border border-gray-100 animate-pulse"
                >
                  <div className="w-full h-72 sm:h-80 bg-gray-200 rounded-2xl" />
                  <div className="w-3/4 h-6 bg-gray-200 rounded mt-6" />
                  <div className="w-full h-4 bg-gray-200 rounded mt-4" />
                  <div className="w-5/6 h-4 bg-gray-200 rounded mt-2" />
                  <div className="w-24 h-10 bg-gray-200 rounded-full mt-6" />
                </div>
              ))}
            </div>
            {/* Mobile Loading */}
            <div className="md:hidden mt-8">
              <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center text-center border border-gray-100 animate-pulse">
                <div className="w-full h-72 bg-gray-200 rounded-2xl" />
                <div className="w-3/4 h-6 bg-gray-200 rounded mt-6" />
                <div className="w-full h-4 bg-gray-200 rounded mt-4" />
                <div className="w-5/6 h-4 bg-gray-200 rounded mt-2" />
                <div className="w-24 h-10 bg-gray-200 rounded-full mt-6" />
              </div>
            </div>
          </>
        ) : blogs.length > 0 ? (
          <>
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-12">
              {blogs.map((blog) => {
                const coverImageUrl =
                  mediaUrl(blog.coverImage?.url) ||
                  mediaUrl(blog.coverImage?.data?.attributes?.url) ||
                  "/assets/homepage/blog/blog-1.svg";
                
                return (
                  <BlogCard
                    key={blog.documentId}
                    imageSrc={coverImageUrl}
                    title={blog.title}
                    excerpt={truncateText(blog.description || "", 150)}
                    to={`/blog/${blog.slug}`}
                  />
                );
              })}
            </div>

            {/* Mobile Swipeable Carousel */}
            <div className="md:hidden mt-8">
              <div
                ref={carouselRef}
                className="relative overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {blogs.map((blog) => {
                    const coverImageUrl =
                      mediaUrl(blog.coverImage?.url) ||
                      mediaUrl(blog.coverImage?.data?.attributes?.url) ||
                      "/assets/homepage/blog/blog-1.svg";
                    
                    return (
                      <div key={blog.documentId} className="w-full flex-shrink-0 px-2">
                        <BlogCard
                          imageSrc={coverImageUrl}
                          title={blog.title}
                          excerpt={truncateText(blog.description || "", 150)}
                          to={`/blog/${blog.slug}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Dots Indicator */}
              {blogs.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {blogs.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setIsPaused(true);
                        // Resume auto-scroll after clicking a dot
                        setTimeout(() => {
                          setIsPaused(false);
                        }, 1000);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-brand-green w-6"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-white py-12">
            <p className="text-lg">No blog posts available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;


