export declare const SITE_NAME = "OmniQure";
export declare const SITE_URL = "https://omniqure.com";
export declare const DEFAULT_SITE_TITLE = "OmniQure \u2014 Verified Research Peptides";
export declare const DEFAULT_SITE_DESCRIPTION = "Buy high-purity research peptides verified to 98%+. BPC-157, TB-500, Ipamorelin, CJC-1295, Epithalon and 100+ peptides. Worldwide shipping. For research use only.";
type ResolvedMetadata = {
    title: string;
    description: string;
    titleIsFallback: boolean;
    descriptionIsFallback: boolean;
};
export declare function getProductSeoMetadata({ name, category, description, purity, seoTitle, seoDescription, }: {
    name: string | null | undefined;
    category: string | null | undefined;
    description: string | null | undefined;
    purity: string | null | undefined;
    seoTitle: string | null | undefined;
    seoDescription: string | null | undefined;
}): ResolvedMetadata;
export declare function getBlogSeoMetadata({ title, excerpt, seoTitle, seoDescription, }: {
    title: string | null | undefined;
    excerpt: string | null | undefined;
    seoTitle: string | null | undefined;
    seoDescription: string | null | undefined;
}): ResolvedMetadata;
export declare function formatSearchTitle(title: string): string;
export declare function getPublicProductPath(slug: string): string;
export declare function getPublicBlogPath(slug: string): string;
export {};
//# sourceMappingURL=seo-metadata.d.ts.map