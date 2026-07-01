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
    .replace(/^\| (.+)$/gm, (_, row) => {
      if (row.replace(/[-|\s]/g, '') === '') return '';
      const cells = row.split('|').map((c: string) => c.trim());
      return '<tr>' + cells.map((c: string) => `<td class="border border-gray-200 px-3 py-2 text-sm text-gray-700">${c}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, m => `<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-gray-200 rounded-lg">${m}</table></div>`)
    .replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-600 leading-relaxed">')
    .replace(/^(?!<[h|l|t|d])(.+)$/gm, '<p class="mb-4 text-gray-600 leading-relaxed">$1</p>');
}

function getRelated(all: Post[], current: Post, count = 3): Post[] {
  const currentTags = new Set(current.tags);
  return all
    .filter(p => p.id !== current.id)
    .map(p => ({ post: p, shared: p.tags.filter(t => currentTags.has(t)).length }))
    .sort((a, b) => b.shared - a.shared || b.post.id - a.post.id)
    .slice(0, count)
    .map(x => x.post);
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

  const { data: allPosts } = useQuery<{ posts: Post[]; total: number }>({
    queryKey: ["blog-posts-all"],
    queryFn: () => fetch(api("blog/posts?limit=50")).then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const related = post && allPosts ? getRelated(allPosts.posts, post) : [];

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

      {post.author && (
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <span className="font-medium text-gray-600">{post.author}</span>
        </div>
      )}

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

      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
            Related Articles
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`}>
                <article className="group rounded-xl border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-200 bg-white h-full flex flex-col">
                  {r.featuredImageUrl && (
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                      <img
                        src={r.featuredImageUrl}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    {r.tags.length > 0 && (
                      <span className="text-xs text-blue-600 font-medium mb-2">{r.tags[0]}</span>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-3">
                      {r.title}
                    </h3>
                    {r.excerpt && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{r.excerpt}</p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-gray-100">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium">
          ← All Articles
        </Link>
      </div>
    </div>
  );
}
