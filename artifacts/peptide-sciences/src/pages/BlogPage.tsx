import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api/${path}`.replace(/\/+/g, "/"); }

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  tags: string[];
  featuredImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const limit = 9;
  const offset = (page - 1) * limit;

  const { data, isLoading } = useQuery<{ total: number; posts: Post[] }>({
    queryKey: ["blog-posts", page],
    queryFn: () => fetch(api(`blog/posts?limit=${limit}&offset=${offset}`)).then(r => r.json() as Promise<{ total: number; posts: Post[] }>),
  });

  const posts = data?.posts ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Arimo', Arial, sans-serif", color: "#0a1628" }}>
          Research &amp; Education
        </h1>
        <p className="text-gray-500 text-sm max-w-xl">
          Evidence-based articles, peptide research summaries, and educational content from the OmniQure team.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-xl font-semibold mb-2">No articles yet</p>
          <p className="text-sm">Check back soon for research updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                {post.featuredImageUrl ? (
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={post.featuredImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <span className="text-4xl">🔬</span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  {(post.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(post.tags ?? []).slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-blue-700 transition-colors mb-2" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-3 flex-1">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
                    <span>{post.author}</span>
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
