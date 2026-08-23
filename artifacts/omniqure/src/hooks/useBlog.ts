import { useQuery } from "@tanstack/react-query";

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  tags: string[];
  featuredImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export interface BlogPostsResponse {
  total: number;
  posts: BlogPostSummary[];
}

export interface BlogPostDetail {
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
}

export function useBlogPosts(limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: ["blogPosts", limit, offset],
    queryFn: async (): Promise<BlogPostsResponse> => {
      const res = await fetch(`/api/blog/posts?limit=${limit}&offset=${offset}`);
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async (): Promise<BlogPostDetail> => {
      const res = await fetch(`/api/blog/posts/${slug}`);
      if (res.status === 404) throw new Error("Post not found");
      if (!res.ok) throw new Error("Failed to fetch blog post");
      return res.json();
    },
    enabled: !!slug,
    retry: (failureCount, error) => {
      if (error.message === "Post not found") return false;
      return failureCount < 3;
    }
  });
}