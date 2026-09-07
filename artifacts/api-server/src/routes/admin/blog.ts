import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { eq, desc, ilike, and, sql } from "drizzle-orm";
import { firstString } from "../../lib/query";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

function postToResponse(p: typeof blogPostsTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? null,
    content: p.content,
    author: p.author,
    tags: p.tags ?? [],
    status: p.status,
    featuredImageUrl: p.featuredImageUrl ?? null,
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/admin/blog/posts", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const search = typeof req.query.search === "string" ? req.query.search : null;
  const status = typeof req.query.status === "string" ? req.query.status : null;
  const limit = Math.min(parseInt(String(req.query.limit ?? "50"), 10), 200);
  const offset = parseInt(String(req.query.offset ?? "0"), 10);
  try {
    const conditions = [];
    if (search) conditions.push(ilike(blogPostsTable.title, `%${search}%`));
    if (status) conditions.push(eq(blogPostsTable.status, status));
    const [posts, [{ total }]] = await Promise.all([
      db.select().from(blogPostsTable)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(blogPostsTable.createdAt)).limit(limit).offset(offset),
      db.select({ total: sql<number>`count(*)::int` }).from(blogPostsTable)
        .where(conditions.length ? and(...conditions) : undefined),
    ]);
    res.json({ total, posts: posts.map(postToResponse) });
  } catch (err) {
    req.log.error({ err }, "Failed to list blog posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/blog/posts", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { title, excerpt, content, author, tags, status, featuredImageUrl, seoTitle, seoDescription } = req.body as {
    title: string; excerpt?: string; content?: string; author?: string; tags?: string[];
    status?: string; featuredImageUrl?: string; seoTitle?: string; seoDescription?: string;
  };
  if (!title) { res.status(400).json({ error: "title is required" }); return; }
  const baseSlug = slugify(title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  try {
    const [created] = await db.insert(blogPostsTable).values({
      title, slug,
      excerpt: excerpt ?? null,
      content: content ?? "",
      author: author ?? "OmniQure Team",
      tags: tags ?? [],
      status: status ?? "draft",
      featuredImageUrl: featuredImageUrl ?? null,
      seoTitle: seoTitle ?? null,
      seoDescription: seoDescription ?? null,
      publishedAt: status === "published" ? new Date() : null,
    }).returning();
    res.status(201).json(postToResponse(created));
  } catch (err) {
    req.log.error({ err }, "Failed to create blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/blog/posts/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const { title, excerpt, content, author, tags, status, featuredImageUrl, seoTitle, seoDescription } = req.body as Partial<{
    title: string; excerpt: string; content: string; author: string; tags: string[];
    status: string; featuredImageUrl: string; seoTitle: string; seoDescription: string;
  }>;
  const updates: Partial<typeof blogPostsTable.$inferInsert> = {};
  if (title !== undefined) updates.title = title;
  if (excerpt !== undefined) updates.excerpt = excerpt;
  if (content !== undefined) updates.content = content;
  if (author !== undefined) updates.author = author;
  if (tags !== undefined) updates.tags = tags;
  if (featuredImageUrl !== undefined) updates.featuredImageUrl = featuredImageUrl;
  if (seoTitle !== undefined) updates.seoTitle = seoTitle;
  if (seoDescription !== undefined) updates.seoDescription = seoDescription;
  if (status !== undefined) {
    updates.status = status;
    if (status === "published") updates.publishedAt = new Date();
  }
  try {
    const [updated] = await db.update(blogPostsTable).set(updates).where(eq(blogPostsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Post not found" }); return; }
    res.json(postToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/blog/posts/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, id)).limit(1);
    if (!post) { res.status(404).json({ error: "Post not found" }); return; }
    if (post.status === "published") {
      const [archived] = await db.update(blogPostsTable).set({ status: "draft" }).where(eq(blogPostsTable.id, id)).returning();
      res.json(postToResponse(archived));
      return;
    }
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
