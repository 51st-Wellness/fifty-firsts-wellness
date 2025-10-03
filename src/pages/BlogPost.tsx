import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBlogBySlug, mediaUrl, type BlogEntity } from "../api/blog.api";
import RichTextWrapper from "../components/RichTextWrapper";

// Strapi RichText stores HTML; we render it safely and restyle with Tailwind prose classes.
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  // const slug = "blog";
  const [blog, setBlog] = useState<BlogEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("slug", slug);
    if (!slug) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setError(null);
        console.log("fetching blog");
        const b = await fetchBlogBySlug(slug);
        console.log("BlogPost fetched", { slug, blog: b });
        setBlog(b);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading)
    return <div className="container mx-auto px-4 py-12">Loading post...</div>;
  if (error)
    return (
      <div className="container mx-auto px-4 py-12 text-red-600">{error}</div>
    );
  if (!blog)
    return (
      <div className="container mx-auto px-4 py-12">
        Post not found.{" "}
        <Link to="/blog" className="text-blue-600">
          Go back
        </Link>
      </div>
    );

  const a = blog;
  const cover = a.coverImage?.url || a.coverImage?.data?.attributes?.url;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative">
        {cover && (
          <div className="h-96 overflow-hidden">
            <img
              src={mediaUrl(cover)}
              alt={a.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        )}

        {/* Article Header */}
        <div
          className={`${
            cover ? "absolute bottom-0 left-0 right-0 p-8" : "py-16 px-8"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {String(a.tags || "")
                .split("#")
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 3)
                .map((t, i) => (
                  <span
                    key={i}
                    className="bg-brand-green/90 text-white text-sm font-medium px-3 py-1 rounded-full font-primary"
                  >
                    {t}
                  </span>
                ))}
            </div>

            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-heading leading-tight ${
                cover ? "text-white" : "text-gray-900"
              }`}
            >
              {a.title}
            </h1>

            <div
              className={`flex items-center gap-6 text-sm font-primary ${
                cover ? "text-white/90" : "text-gray-600"
              }`}
            >
              {a.publishedAt && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {new Date(a.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                5 min read
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <RichTextWrapper content={a.content as any} />
        </div>

        {/* Article Footer */}
        <div className="mt-12 p-8 bg-white rounded-2xl shadow-lg">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="text-gray-700 font-medium font-primary">
              Tags:
            </span>
            {String(a.tags || "")
              .split("#")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((t, i) => (
                <span
                  key={i}
                  className="bg-brand-green/10 text-brand-green text-sm font-medium px-3 py-1 rounded-full font-primary hover:bg-brand-green/20 transition-colors cursor-pointer"
                >
                  {t}
                </span>
              ))}
          </div>

          <div className="border-t pt-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors font-primary"
            >
              ← Back to All Articles
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
