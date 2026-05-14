import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api/${path}`.replace(/\/+/g, "/"); }

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author: string;
  tags: string[];
  featuredImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
};

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3 text-gray-900">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 text-gray-900">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-4 text-gray-900">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-600 leading-relaxed">')
    .replace(/^(?!<[h|l])(.+)$/gm, '<p class="mb-4 text-gray-600 leading-relaxed">$1</p>');
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery<Post>({
    queryKey: ["blog-post", slug],
    queryFn: () => fetch(api(`blog/posts/${slug}`)).then(async r => {
      if (!r.ok) throw new Error("Not found");
      return r.json() as Promise<Post>;
    }),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-[760px] mx-auto px-4 py-16">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-64 bg-gray-100 rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-[760px] mx-auto px-4 py-24 text-center">
        <p className="text-2xl font-bold text-gray-900 mb-3">Article not found</p>
        <Link href="/blog" className="text-blue-600 hover:underline text-sm">← Back to Research</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors">
        ← Research &amp; Education
      </Link>

      {(post.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {(post.tags ?? []).map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="text-lg text-gray-500 mb-6 leading-relaxed">{post.excerpt}</p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
        <span className="font-medium text-gray-600">{post.author}</span>
        {post.publishedAt && (
          <>
            <span>·</span>
            <span>{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          </>
        )}
      </div>

      {post.featuredImageUrl && (
        <div className="rounded-xl overflow-hidden mb-8 bg-gray-100">
          <img src={post.featuredImageUrl} alt={post.title} className="w-full object-cover max-h-[420px]" />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none text-gray-700"
        style={{ fontFamily: "'Arimo', Arial, sans-serif", lineHeight: "1.8" }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      <div className="mt-16 pt-8 border-t border-gray-100">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium">
          ← More Articles
        </Link>
      </div>
    </div>
  );
}
