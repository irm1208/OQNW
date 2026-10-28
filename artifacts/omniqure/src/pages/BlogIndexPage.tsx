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
    <div className="bg-[#F4F5F8] min-h-screen py-16 md:py-24">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <header className="mb-16 text-center md:text-left">
          <HeroPicture image={{ key: "hdr-blog", alt: "Six OmniQure research vials" }} className="cat-banner" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#22252C] tracking-tight mb-4">
            Research & Education
          </h1>
          <p className="text-lg text-[#4A5672] max-w-2xl leading-relaxed mx-auto md:mx-0">
            Explore authoritative insights, scientific updates, and verified educational resources from our research institute.
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-secondary animate-spin" />
            <p className="text-[#4A5672] font-medium tracking-wide">Loading publications...</p>
          </div>
        ) : isError ? (
          <div className="bg-white border border-[#F8F2F3] p-10 rounded-xl text-center">
            <p className="text-[#9C4A44] font-medium mb-4">Unable to load publications at this time.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#22252C] text-white rounded-md hover:bg-[#1D2948] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !data || data.posts.length === 0 ? (
          <div className="bg-white border border-[#D3D8E2] p-16 rounded-xl text-center">
            <FileText className="w-12 h-12 text-[#D3D8E2] mx-auto mb-6" />
            <h3 className="text-xl font-bold text-[#22252C] mb-2">No Publications Yet</h3>
            <p className="text-[#4A5672] max-w-md mx-auto">
              Our research team is currently preparing new educational resources. Please check back soon for our latest articles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {data.posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-xl border border-[#D3D8E2] overflow-hidden flex flex-col transition-shadow duration-300"
              >
                {post.featuredImageUrl && (
                  <Link href={`/blog/${post.slug}`} className="block h-56 overflow-hidden bg-[#F4F5F8]">
                    <img 
                      src={post.featuredImageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                )}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-[#4A5672] uppercase mb-4">
                    {post.publishedAt ? (
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </time>
                    ) : (
                      <span>Unpublished</span>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#D3D8E2]" />
                        <span className="text-secondary">{post.tags[0]}</span>
                      </>
                    )}
                  </div>
                  
                  <Link href={`/blog/${post.slug}`} className="group block mb-4">
                    <h2 className="text-2xl font-bold text-[#22252C] leading-snug group-hover:text-secondary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  {post.excerpt && (
                    <p className="text-[#4A5672] leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#F4F5F8]">
                    <span className="text-sm font-medium text-[#22252C]">
                      By {post.author || "OmniQure Team"}
                    </span>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-bold text-secondary hover:text-[#0A2472] transition-colors"
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
