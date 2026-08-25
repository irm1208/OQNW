import { AlertCircle, CheckCircle2, ExternalLink, Search } from "lucide-react";
import {
  SITE_NAME,
  SITE_URL,
  formatSearchTitle,
  getBlogSeoMetadata,
  getProductSeoMetadata,
} from "@workspace/api-client-react";

export const PUBLIC_SITE_URL = SITE_URL;
export const SEO_TITLE_LIMIT = 60;
export const SEO_DESCRIPTION_LIMIT = 160;

type SearchMetadata = ReturnType<typeof getProductSeoMetadata>;

type SeoSearchPreviewProps = SearchMetadata & {
  urlPath: string;
  urlNote?: string;
};

export function getProductSearchMetadata({
  name,
  category,
  purity,
  description,
  seoTitle,
  seoDescription,
}: {
  name: string;
  category: string;
  purity: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}): SearchMetadata {
  const metadata = getProductSeoMetadata({
    name,
    category,
    purity,
    description,
    seoTitle,
    seoDescription,
  });
  return { ...metadata, title: formatSearchTitle(metadata.title) };
}

export function getBlogSearchMetadata({
  title,
  excerpt,
  seoTitle,
  seoDescription,
}: {
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
}): SearchMetadata {
  const metadata = getBlogSeoMetadata({ title, excerpt, seoTitle, seoDescription });
  return { ...metadata, title: formatSearchTitle(metadata.title) };
}

export function slugifyPreview(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

function LengthGuidance({
  label,
  value,
  limit,
}: {
  label: string;
  value: string;
  limit: number;
}) {
  const length = value.length;
  const isOver = length > limit;
  const isClose = !isOver && length >= Math.ceil(limit * 0.9);

  return (
    <div
      className={`flex items-start gap-1.5 text-xs ${
        isOver
          ? "text-destructive"
          : isClose
            ? "text-amber-700"
            : "text-muted-foreground"
      }`}
      role={isOver || isClose ? "status" : undefined}
    >
      {isOver ? (
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      ) : isClose ? (
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
      )}
      <span>
        {isOver
          ? `${label} is ${length - limit} character${length - limit === 1 ? "" : "s"} over the recommended ${limit}-character limit and is likely to be truncated.`
          : isClose
            ? `${label} is close to the ${limit}-character limit; shorter text is less likely to be truncated.`
            : `${label} is within the recommended ${limit}-character search range.`}
      </span>
    </div>
  );
}

export default function SeoSearchPreview({
  title,
  description,
  urlPath,
  titleIsFallback,
  descriptionIsFallback,
  urlNote,
}: SeoSearchPreviewProps) {
  const safePath = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
  const previewUrl = `${PUBLIC_SITE_URL}${safePath}`;

  return (
    <div className="rounded-lg border bg-muted/20 p-4" data-testid="seo-search-preview">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Search result preview</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            This is how the saved values, or the storefront defaults, may appear in Google.
          </p>
        </div>
        <span className="shrink-0 rounded-full border bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Google
        </span>
      </div>

      <div className="rounded-md border bg-background p-3 shadow-sm">
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
          aria-label={`Open public page ${previewUrl}`}
        >
          <div className="flex items-center gap-1 text-xs text-emerald-700">
            <span className="truncate">{previewUrl}</span>
            <ExternalLink className="h-3 w-3 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="mt-1 line-clamp-2 text-lg leading-6 text-[#1a0dab] group-hover:underline">
            {title}
          </div>
          <p className="mt-1 line-clamp-3 text-sm leading-5 text-slate-600">{description}</p>
        </a>
      </div>

      <div className="mt-3 space-y-2">
        <LengthGuidance label="Effective title" value={title} limit={SEO_TITLE_LIMIT} />
        <LengthGuidance label="Description" value={description} limit={SEO_DESCRIPTION_LIMIT} />
      </div>

      {(titleIsFallback || descriptionIsFallback || urlNote) && (
        <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
          {titleIsFallback && descriptionIsFallback
            ? "Using the public page title and description fallbacks."
            : titleIsFallback
              ? "Using the public page title fallback."
              : descriptionIsFallback
                ? "Using the public page description fallback."
                : null}
          {urlNote && <>{titleIsFallback || descriptionIsFallback ? " " : ""}{urlNote}</>}
        </p>
      )}
    </div>
  );
}