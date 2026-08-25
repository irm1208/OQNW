import assert from "node:assert/strict";
import test from "node:test";
import { and, eq, inArray } from "drizzle-orm";
import { blogPostsTable, db } from "@workspace/db";

const apiBaseUrl = (process.env.API_TEST_BASE_URL ?? "http://127.0.0.1:8080").replace(/\/$/, "");
const fixtureSuffix = `${process.pid}-${Date.now()}`;
const draftSlug = `seo-regression-draft-${fixtureSuffix}`;
const publishedSlug = `seo-regression-published-${fixtureSuffix}`;

async function getText(path: string): Promise<string> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  assert.equal(response.status, 200, `Expected ${path} to return 200`);
  return response.text();
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  assert.equal(response.status, 200, `Expected ${path} to return 200`);
  return response.json() as Promise<T>;
}

async function getAllPublicBlogPosts(): Promise<Array<{ slug: string; status?: string }>> {
  const posts: Array<{ slug: string; status?: string }> = [];
  let offset = 0;
  let total = 0;

  do {
    const page = await getJson<{
      total: number;
      posts: Array<{ slug: string; status?: string }>;
    }>(`/api/blog/posts?limit=50&offset=${offset}`);
    total = page.total;
    posts.push(...page.posts);
    offset += page.posts.length;
    assert.ok(page.posts.length > 0 || offset >= total, "Public blog listing ended before its total");
  } while (offset < total);

  return posts;
}

test("public blog APIs and sitemap expose published posts, never drafts", async () => {
  await db
    .delete(blogPostsTable)
    .where(inArray(blogPostsTable.slug, [draftSlug, publishedSlug]));

  try {
    await db.insert(blogPostsTable).values([
      {
        title: "SEO regression draft fixture",
        slug: draftSlug,
        content: "This draft must not be publicly discoverable.",
        status: "draft",
      },
      {
        title: "SEO regression published fixture",
        slug: publishedSlug,
        content: "This published fixture should be publicly discoverable.",
        status: "published",
        publishedAt: new Date(),
      },
    ]);

    const list = await getAllPublicBlogPosts();
    const listedSlugs = new Set(list.map((post) => post.slug));
    assert.equal(list.some((post) => post.slug === draftSlug), false);
    assert.equal(listedSlugs.has(publishedSlug), true);
    assert.equal(list.find((post) => post.slug === publishedSlug)?.status, undefined);

    const publishedPost = await fetch(`${apiBaseUrl}/api/blog/posts/${publishedSlug}`);
    assert.equal(publishedPost.status, 200);
    assert.equal((await publishedPost.json() as { slug: string }).slug, publishedSlug);

    const draftPost = await fetch(`${apiBaseUrl}/api/blog/posts/${draftSlug}`);
    assert.equal(draftPost.status, 404);

    const sitemap = await getText("/sitemap.xml");
    assert.match(sitemap, new RegExp(`<loc>https://omniqure\\.com/blog/${publishedSlug}</loc>`));
    assert.doesNotMatch(sitemap, new RegExp(`<loc>https://omniqure\\.com/blog/${draftSlug}</loc>`));
  } finally {
    await db
      .delete(blogPostsTable)
      .where(and(eq(blogPostsTable.slug, draftSlug)));
    await db
      .delete(blogPostsTable)
      .where(and(eq(blogPostsTable.slug, publishedSlug)));
  }
});