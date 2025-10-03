import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs, mediaUrl, type BlogEntity } from "../api/blog.api";

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchBlogs(1, 12);
        setBlogs(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <div className="container mx-auto px-4 py-12">Loading blogs...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Wellness Blog
          </h1>
          <p className="text-gray-600 mt-3">
            Insights, guides and stories to support your wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((b) => {
            const img =
              b.coverImage?.url || b.coverImage?.data?.attributes?.url;
            return (
              <Link
                key={b.id}
                to={`/blog/${b.slug}`}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                {img && (
                  <img
                    src={mediaUrl(img)}
                    alt={b.title}
                    className="w-full h-52 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{b.title}</h3>
                  {b.description && (
                    <p className="text-gray-600 mt-2 line-clamp-3">
                      {b.description}
                    </p>
                  )}
                  {b.publishedAt && (
                    <div className="text-sm text-gray-500 mt-3">
                      {new Date(b.publishedAt).toLocaleDateString()}
                    </div>
                  )}
                  {b.tags &&
                    (Array.isArray(b.tags)
                      ? b.tags.length > 0
                      : String(b.tags).length > 0) && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {(Array.isArray(b.tags)
                          ? b.tags
                          : String(b.tags)
                              .split("#")
                              .map((s) => s.trim())
                              .filter(Boolean)
                        ).map((t, i) => (
                          <span
                            key={i}
                            className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
