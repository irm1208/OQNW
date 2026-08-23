import { useRoute, Link } from "wouter";
import { useBlogPost } from "@/hooks/useBlog";
import { useSEO } from "@/hooks/useSEO";
import { ArrowLeft, Loader2, Twitter, Linkedin } from "lucide-react";
import NotFound from "./not-found";

function SafePostContent({ content }: { content: string }) {
  const documentFragment = new DOMParser().parseFromString(content, "text/html");
  documentFragment
    .querySelectorAll("script, style, iframe, object, embed, link, meta")
    .forEach((element) => element.remove());

  const elements = Array.from(documentFragment.body.children);
  if (elements.length === 0) {
    return (
      <>
        {content.split(/\n{2,}/).map((paragraph, index) => (
          <p key={index}>{paragraph.trim()}</p>
        ))}
      </>
    );
  }

  return (
    <>
      {elements.map((element, index) => {
        const text = element.textContent?.trim();
        if (!text) return null;

        if (/^H[1-6]$/.test(element.tagName)) {
          const Heading = element.tagName.toLowerCase() as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
          return <Heading key={index}>{text}</Heading>;
        }

        if (element.tagName === "UL" || element.tagName === "OL") {
          const List = element.tagName.toLowerCase() as "ul" | "ol";
          return (
            <List key={index}>
              {Array.from(element.querySelectorAll(":scope > li")).map((item, itemIndex) => (
                <li key={itemIndex}>{item.textContent?.trim()}</li>
              ))}
            </List>
          );
        }

        if (element.tagName === "BLOCKQUOTE") {
          return <blockquote key={index}>{text}</blockquote>;
        }

        return <p key={index}>{text}</p>;
      })}
    </>
  );
}

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = match ? params?.slug : "";

  const { data: post, isLoading, isError, error } = useBlogPost(slug || "");

  useSEO(post ? {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    ogImage: post.featuredImageUrl,
    ogType: "article",
    canonicalPath: `/blog/${encodeURIComponent(post.slug)}`,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` }
    ],
    article: {
      headline: post.title,
      description: post.seoDescription || post.excerpt || "",
      url: `/blog/${post.slug}`,
      image: post.featuredImageUrl,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: post.author
    }
  } : {
    title: "Loading Article..."
  });

  if (!match) return <NotFound />;

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 text-secondary animate-spin" />
        <p className="text-slate-500 font-medium tracking-wide">Loading article...</p>
      </div>
    );
  }

  if (isError) {
    if (error?.message === "Post not found") {
      return <NotFound />;
    }
    return (
      <div className="bg-slate-50 min-h-screen py-24 flex items-center justify-center px-4">
        <div className="bg-white border border-red-100 p-10 rounded-xl text-center shadow-sm max-w-md w-full">
          <p className="text-red-600 font-medium mb-4">Unable to load the article at this time.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!post) return <NotFound />;

  // Create absolute URL for sharing
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <article className="bg-white min-h-screen">
      <div className="bg-slate-50 py-12 md:py-16 border-b border-slate-200">
        <div className="container max-w-4xl mx-auto px-4 md:px-6">
          <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-secondary transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Research Blog
          </Link>
          
          <div className="flex items-center gap-3 text-sm font-semibold tracking-wider text-slate-500 uppercase mb-6 flex-wrap">
            {post.tags && post.tags.map(tag => (
              <span key={tag} className="text-secondary bg-blue-50 px-3 py-1 rounded-full">{tag}</span>
            ))}
            {post.publishedAt && (
              <time dateTime={post.publishedAt} className="ml-2">
                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between py-6 border-t border-slate-200 mt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                {(post.author || "O")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{post.author || "OmniQure Research Team"}</p>
                <p className="text-sm text-slate-500">Verified Contributor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-400 mr-2 hidden sm:inline-block">Share:</span>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-colors" aria-label="Share on X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-colors" aria-label="Share on LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {post.featuredImageUrl && (
        <div className="container max-w-5xl mx-auto px-4 md:px-6 -mt-8 mb-12 relative z-10">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white aspect-[21/9] max-h-[500px]">
            <img 
              src={post.featuredImageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className={`container max-w-3xl mx-auto px-4 md:px-6 pb-24 ${!post.featuredImageUrl ? 'pt-16' : ''}`}>
        <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight">
          <SafePostContent content={post.content} />
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 font-medium">
            © {new Date().getFullYear()} OmniQure Research Institute. For research use only.
          </p>
          <Link href="/blog" className="px-6 py-3 bg-slate-100 text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors">
            Read more articles
          </Link>
        </div>
      </div>
    </article>
  );
}
