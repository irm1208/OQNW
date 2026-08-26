import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { productsCatalogTable, productsInventoryTable, blogPostsTable } from "@workspace/db";
import { and, eq, desc, notInArray } from "drizzle-orm";
import { RETIRED_PRODUCT_SLUGS } from "../lib/retiredProducts";

const router = Router();

const SITE_URL = "https://omniqure.com";

// Static core pages — paths + crawl hints
const STATIC_PAGES = [
  { path: "/",               changefreq: "weekly",  priority: "1.0" },
  { path: "/all-peptides",   changefreq: "weekly",  priority: "0.9" },
  { path: "/stacks",         changefreq: "monthly", priority: "0.7" },
  { path: "/bundle-and-save",changefreq: "monthly", priority: "0.7" },
  { path: "/blog",           changefreq: "weekly",  priority: "0.7" },
  { path: "/protocols",      changefreq: "monthly", priority: "0.6" },
  { path: "/storage-guide",  changefreq: "monthly", priority: "0.6" },
  { path: "/calculator",     changefreq: "monthly", priority: "0.6" },
  { path: "/faq",            changefreq: "monthly", priority: "0.5" },
  { path: "/glossary",       changefreq: "monthly", priority: "0.5" },
  { path: "/bac-water",      changefreq: "monthly", priority: "0.5" },
  { path: "/about",          changefreq: "yearly",  priority: "0.5" },
  { path: "/refer-a-friend", changefreq: "yearly",  priority: "0.4" },
  { path: "/contact",        changefreq: "yearly",  priority: "0.4" },
  { path: "/shipping",       changefreq: "yearly",  priority: "0.3" },
  { path: "/terms",          changefreq: "yearly",  priority: "0.2" },
  { path: "/privacy",        changefreq: "yearly",  priority: "0.2" },
];

function xmlEsc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isoDate(d: Date | string | null | undefined): string {
  if (!d) return new Date().toISOString().split("T")[0];
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().split("T")[0];
}

router.get(["/sitemap.xml", "/api/sitemap.xml"], async (req: Request, res: Response): Promise<void> => {
  try {
    const [products, blogPosts] = await Promise.all([
      db
        .select({
          slug: productsCatalogTable.slug,
          name: productsCatalogTable.name,
          imageUrl: productsCatalogTable.imageUrl,
          updatedAt: productsCatalogTable.updatedAt,
          inventoryPublished: productsInventoryTable.isPublished,
        })
        .from(productsCatalogTable)
        .leftJoin(productsInventoryTable, eq(productsInventoryTable.productId, productsCatalogTable.id))
        .where(and(
          eq(productsCatalogTable.isPublished, true),
          notInArray(productsCatalogTable.slug, [...RETIRED_PRODUCT_SLUGS]),
        ))
        .orderBy(productsCatalogTable.sortOrder, productsCatalogTable.name),
      db
        .select({
          slug: blogPostsTable.slug,
          publishedAt: blogPostsTable.publishedAt,
          updatedAt: blogPostsTable.updatedAt,
        })
        .from(blogPostsTable)
        .where(eq(blogPostsTable.status, "published"))
        .orderBy(desc(blogPostsTable.publishedAt)),
    ]);

    const today = new Date().toISOString().split("T")[0];
    const lines: string[] = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      "",
      "  <!-- Core pages -->",
    ];

    for (const page of STATIC_PAGES) {
      lines.push(
        `  <url>`,
        `    <loc>${SITE_URL}${page.path}</loc>`,
        `    <changefreq>${page.changefreq}</changefreq>`,
        `    <priority>${page.priority}</priority>`,
        `    <lastmod>${today}</lastmod>`,
        `  </url>`,
      );
    }

    lines.push("", "  <!-- Product pages -->");

    for (const p of products.filter((product) => product.inventoryPublished !== false)) {
      const imgUrl = p.imageUrl
        ? p.imageUrl.startsWith("http")
          ? p.imageUrl
          : `${SITE_URL}${p.imageUrl}`
        : null;

      lines.push(`  <url>`);
      lines.push(`    <loc>${SITE_URL}/product/${xmlEsc(p.slug)}</loc>`);
      lines.push(`    <changefreq>weekly</changefreq>`);
      lines.push(`    <priority>0.85</priority>`);
      lines.push(`    <lastmod>${isoDate(p.updatedAt)}</lastmod>`);
      if (imgUrl) {
        lines.push(
          `    <image:image>`,
          `      <image:loc>${xmlEsc(imgUrl)}</image:loc>`,
          `      <image:title>${xmlEsc(p.name)}</image:title>`,
          `    </image:image>`,
        );
      }
      lines.push(`  </url>`);
    }

    lines.push("", "  <!-- Blog posts -->");

    for (const post of blogPosts) {
      const lastmod = isoDate(post.updatedAt ?? post.publishedAt);
      lines.push(
        `  <url>`,
        `    <loc>${SITE_URL}/blog/${xmlEsc(post.slug)}</loc>`,
        `    <changefreq>monthly</changefreq>`,
        `    <priority>0.6</priority>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `  </url>`,
      );
    }

    lines.push("", "</urlset>", "");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).send(lines.join("\n"));
  } catch (err) {
    req.log?.error?.({ err }, "Failed to generate sitemap");
    res.status(500).send("<!-- sitemap generation error -->");
  }
});

export default router;
