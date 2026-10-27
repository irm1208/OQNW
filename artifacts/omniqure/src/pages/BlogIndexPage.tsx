import { HeroPicture } from "@/components/PageHero";
import { Link } from "wouter";
import { useBlogPosts } from "@/hooks/useBlog";
import { useSEO } from "@/hooks/useSEO";
import { ChevronRight, FileText, Loader2 } from "lucide-react";

export default function BlogIndexPage() {
  useSEO({
    title: "Research Blog",
    description: "Read the latest verified peptide education, research insights, and laboratory updates from the OmniQure team.",
    canonicalPath: "/blog",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" }
    ]
  });

  const { data, isLoading, isError } = useBlogPosts(50, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-16 md:py-24">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <header className="mb-16 text-center md:text-left">
          <HeroPicture image={{ key: "hdr-blog", alt: "Six OmniQure research vials" }} className="cat-banner" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Research & Education
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto md:mx-0">
            Explore authoritative insights, scientific updates, and verified educational resources from our research institute.
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-secondary animate-spin" />
            <p className="text-slate-500 font-medium tracking-wide">Loading publications...</p>
          </div>
        ) : isError ? (
          <div className="bg-white border border-red-100 p-10 rounded-xl text-center shadow-sm">
            <p className="text-red-600 font-medium mb-4">Unable to load publications at this time.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !data || data.posts.length === 0 ? (
          <div className="bg-white border border-slate-200 p-16 rounded-xl text-center shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Publications Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Our research team is currently preparing new educational resources. Please check back soon for our latest articles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {data.posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300"
              >
                {post.featuredImageUrl && (
                  <Link href={`/blog/${post.slug}`} className="block h-56 overflow-hidden bg-slate-100">
                    <img 
                      src={post.featuredImageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                )}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-slate-500 uppercase mb-4">
                    {post.publishedAt ? (
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </time>
                    ) : (
                      <span>Unpublished</span>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-secondary">{post.tags[0]}</span>
                      </>
                    )}
                  </div>
                  
                  <Link href={`/blog/${post.slug}`} className="group block mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 leading-snug group-hover:text-secondary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  {post.excerpt && (
                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-900">
                      By {post.author || "OmniQure Team"}
                    </span>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-bold text-secondary hover:text-blue-800 transition-colors"
                    >
                      Read full article
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
