import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchBlogBySlug,
  mediaUrl,
  type BlogEntity,
  type AuthorEntity,
} from "../api/blog.api";
import RichTextWrapper from "../components/RichTextWrapper";
import { ChevronRight } from "lucide-react";

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
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="w-full h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
  const tags = String(a.tags || "")
    .split("#")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative">
        {cover && (
          <div className="h-72 overflow-hidden">
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
          <div className="max-w-7xl mx-auto">
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 leading-tight ${
                cover ? "text-white" : "text-gray-900"
              }`}
              style={{ fontFamily: '"League Spartan", sans-serif' }}
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

            {/* Authors Section */}
            {a.authors && a.authors.length > 0 && (
              <div
                className={`mt-6 ${cover ? "text-white/90" : "text-gray-600"}`}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium font-primary">
                    {a.authors.length === 1 ? "Author:" : "Authors:"}
                  </span>
                  <div className="flex items-center gap-4 flex-wrap">
                    {a.authors.map((author: AuthorEntity) => {
                      const authorPicture =
                        author.picture?.url ||
                        author.picture?.data?.attributes?.url;
                      const AuthorContent = (
                        <div className="flex items-center gap-2 group">
                          {authorPicture && (
                            <img
                              src={mediaUrl(authorPicture)}
                              alt={author.fullName}
                              className="w-8 h-8 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-colors"
                            />
                          )}
                          <span className="text-sm font-medium font-primary group-hover:underline">
                            {author.fullName}
                          </span>
                        </div>
                      );

                      return author.externalLink ? (
                        <a
                          key={author.id}
                          href={author.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-opacity hover:opacity-80"
                        >
                          {AuthorContent}
                        </a>
                      ) : (
                        <div key={author.id}>{AuthorContent}</div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link to="/blog" className="hover:text-brand-green transition-colors">
            Blog
          </Link>
          <ChevronRight size={16} />
          <span className="text-brand-green font-medium line-clamp-1">
            {a.title}
          </span>
        </nav>
      </div>

      {/* Article Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Article Content */}
          <div className="lg:col-span-2">
            <RichTextWrapper content={a.content as any} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-16">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                {/* Tags */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t, i) => (
                      <span
                        key={i}
                        className="bg-brand-green/10 text-brand-green text-sm font-medium px-3 py-1.5 rounded-full font-primary hover:bg-brand-green/20 transition-colors cursor-pointer"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Back Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Link
                    to="/blog"
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-green text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-green-dark transition-colors font-primary"
                  >
                    ← Back to All Articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
