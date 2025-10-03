import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBlogBySlug, mediaUrl, type BlogEntity } from "../api/blog.api";
import RichTextWrapper from "../components/RichTextWrapper";

// Strapi RichText stores HTML; we render it safely and restyle with Tailwind prose classes.
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const b = await fetchBlogBySlug(slug);
        setBlog(b);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading)
    return <div className="container mx-auto px-4 py-12">Loading post...</div>;
  if (!blog)
    return (
      <div className="container mx-auto px-4 py-12">
        Post not found.{" "}
        <Link to="/blog" className="text-blue-600">
          Go back
        </Link>
      </div>
    );

  const a = blog.attributes;
  const cover = a.coverImage?.data?.attributes?.url;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/blog" className="text-indigo-600">
          ← Back to blog
        </Link>
        <h1 className="text-4xl font-bold mt-4">{a.title}</h1>
        {a.publishedAt && (
          <div className="text-sm text-gray-500 mt-2">
            {new Date(a.publishedAt).toLocaleDateString()}
          </div>
        )}
        {a.tags && a.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {a.tags.map((t, i) => (
              <span
                key={i}
                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {cover && (
          <img
            src={mediaUrl(cover)}
            alt={a.title}
            className="w-full rounded-lg my-6"
          />
        )}

        <RichTextWrapper content={a.content as any} className="mt-4" />
      </div>
    </main>
  );
}
