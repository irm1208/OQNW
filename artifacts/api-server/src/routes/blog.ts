import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { firstString } from "../lib/query";

const router = Router();

router.get("/blog/posts", async (req: Request, res: Response): Promise<void> => {
  const limit = Math.min(parseInt(String(req.query.limit ?? "12"), 10), 50);
  const offset = parseInt(String(req.query.offset ?? "0"), 10);
  try {
    const [posts, [{ total }]] = await Promise.all([
      db.select({
        id: blogPostsTable.id,
        title: blogPostsTable.title,
        slug: blogPostsTable.slug,
        excerpt: blogPostsTable.excerpt,
        author: blogPostsTable.author,
        tags: blogPostsTable.tags,
        featuredImageUrl: blogPostsTable.featuredImageUrl,
        publishedAt: blogPostsTable.publishedAt,
        createdAt: blogPostsTable.createdAt,
      }).from(blogPostsTable)
        .where(eq(blogPostsTable.status, "published"))
        .orderBy(desc(blogPostsTable.publishedAt))
        .limit(limit).offset(offset),
      db.select({ total: sql<number>`count(*)::int` }).from(blogPostsTable)
        .where(eq(blogPostsTable.status, "published")),
    ]);
    res.json({
      total,
      posts: posts.map(p => ({
        ...p,
        excerpt: p.excerpt ?? null,
        featuredImageUrl: p.featuredImageUrl ?? null,
        tags: p.tags ?? [],
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list blog posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/posts/:slug", async (req: Request, res: Response): Promise<void> => {
  const slug = firstString(req.params.slug);
  if (!slug) { res.status(400).json({ error: "Invalid slug" }); return; }
  try {
    const [post] = await db.select().from(blogPostsTable)
      .where(and(eq(blogPostsTable.slug, slug), eq(blogPostsTable.status, "published")))
      .limit(1);
    if (!post) { res.status(404).json({ error: "Post not found" }); return; }
    res.json({
      id: post.id, title: post.title, slug: post.slug,
      excerpt: post.excerpt ?? null, content: post.content,
      author: post.author, tags: post.tags ?? [],
      featuredImageUrl: post.featuredImageUrl ?? null,
      seoTitle: post.seoTitle ?? null, seoDescription: post.seoDescription ?? null,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
