import React, { useState, useEffect } from "react";
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

  // Truncate description to ~150 characters
  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-12">
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
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-12">
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


