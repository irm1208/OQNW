import { useEffect, useState } from "react";
import {
  useListCatalogProducts,
  getListCatalogProductsQueryKey,
  useCreateCatalogProduct,
  useUpdateCatalogProduct,
  useDeleteCatalogProduct,
  useDisableCatalogProductsWithoutJanoshikReport,
  useEnableAllPeptideCatalogProducts,
  useListAdminProducts,
  getListAdminProductsQueryKey,
  useUpdateProductInventory,
  useUpdateProductVisibility,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search, Loader2, AlertCircle, Plus, Pencil, Trash2, Star, Eye, EyeOff, Download, Save,
} from "lucide-react";
import { toast } from "sonner";
import type { CatalogProduct, AdminProduct } from "@workspace/api-client-react";
import SeoSearchPreview, {
  getProductSearchMetadata,
  SEO_DESCRIPTION_LIMIT,
  SEO_TITLE_LIMIT,
  slugifyPreview,
} from "@/components/SeoSearchPreview";
import { getPublicProductPath } from "@workspace/api-client-react";

const CATEGORIES = [
  "Growth Peptides",
  "Growth Hormone",
  "Healing Peptides",
  "Peptide Blends",
  "Weight Management",
  "Longevity Peptides",
  "Skin & Repair",
  "Research Peptides",
  "Hormonal Peptides",
  "Anti-Inflammatory",
  "Immune Support",
  "Nootropics",
  "Cognitive Peptides",
  "Cellular Health",
];

function notifyStorefrontCatalogUpdated() {
  window.localStorage.setItem("omniqure:catalog-updated", String(Date.now()));
}

type ProductFormData = {
  name: string;
  slug: string;
  category: string;
  priceGbp: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  purity: string;
  alsoKnownAs: string;
  molecularWeight: string;
  casNumber: string;
  formula: string;
  sequence: string;
  storage: string;
  appearance: string;
  solubility: string;
  halfLife: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  isFeatured: boolean;
};

const emptyForm = (): ProductFormData => ({
  name: "",
  slug: "",
  category: "",
  priceGbp: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  purity: "",
  alsoKnownAs: "",
  molecularWeight: "",
  casNumber: "",
  formula: "",
  sequence: "",
  storage: "",
  appearance: "",
  solubility: "",
  halfLife: "",
  seoTitle: "",
  seoDescription: "",
  isPublished: true,
  isFeatured: false,
});

function productToForm(p: CatalogProduct): ProductFormData {
  return {
    name: p.name,
    slug: p.slug,
    category: p.category,
    priceGbp: p.priceGbp != null ? String(p.priceGbp) : "",
    shortDescription: p.shortDescription ?? "",
    description: p.description ?? "",
    imageUrl: p.imageUrl ?? "",
    purity: p.purity ?? "",
    alsoKnownAs: p.alsoKnownAs ?? "",
    molecularWeight: p.molecularWeight ?? "",
    casNumber: p.casNumber ?? "",
    formula: p.formula ?? "",
    sequence: p.sequence ?? "",
    storage: p.storage ?? "",
    appearance: p.appearance ?? "",
    solubility: p.solubility ?? "",
    halfLife: p.halfLife ?? "",
    seoTitle: p.seoTitle ?? "",
    seoDescription: p.seoDescription ?? "",
    isPublished: p.isPublished,
    isFeatured: p.isFeatured,
  };
}

function autoSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ── Catalog Tab ──────────────────────────────────────────────────────────────

function CatalogTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [publicationFilter, setPublicationFilter] = useState<"all" | "published" | "disabled">("all");
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CatalogProduct | null>(null);
  const [bulkDisableOpen, setBulkDisableOpen] = useState(false);
  const [bulkEnableOpen, setBulkEnableOpen] = useState(false);
  const [form, setForm] = useState<ProductFormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [savingPrices, setSavingPrices] = useState(false);
  const [priceDrafts, setPriceDrafts] = useState<Record<number, string>>({});

  const queryParams = {
    ...(search ? { search } : {}),
    ...(categoryFilter && categoryFilter !== "all" ? { category: categoryFilter } : {}),
    ...(publicationFilter === "published" ? { published: true } : {}),
    ...(publicationFilter === "disabled" ? { published: false } : {}),
  };

  const { data: products, isLoading } = useListCatalogProducts(queryParams, {
    query: { queryKey: getListCatalogProductsQueryKey(queryParams) },
  });

  useEffect(() => {
    if (!products) return;
    setPriceDrafts(previous => {
      const next = { ...previous };
      for (const product of products) {
        if (!(product.id in next)) {
          next[product.id] = product.priceGbp != null ? String(product.priceGbp) : "";
        }
      }
      return next;
    });
  }, [products]);

  const createProduct = useCreateCatalogProduct();
  const updateProduct = useUpdateCatalogProduct();
  const deleteProduct = useDeleteCatalogProduct();
  const disableWithoutReport = useDisableCatalogProductsWithoutJanoshikReport();
  const enableAllPeptides = useEnableAllPeptideCatalogProducts();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["/api/admin/catalog"] });

  function openCreate() {
    setForm(emptyForm());
    setIsCreating(true);
    setEditingProduct(null);
  }

  function openEdit(p: CatalogProduct) {
    setForm(productToForm(p));
    setEditingProduct(p);
    setIsCreating(false);
  }

  function closeDialog() {
    setIsCreating(false);
    setEditingProduct(null);
  }

  function handleNameChange(name: string) {
    setForm(f => ({
      ...f,
      name,
      slug: isCreating ? autoSlug(name) : f.slug,
    }));
  }

  async function handleSave() {
    if (!form.name || !form.slug || !form.category) {
      toast.error("Name, slug, and category are required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      category: form.category,
      priceGbp: form.priceGbp ? Number(form.priceGbp) : undefined,
      shortDescription: form.shortDescription || undefined,
      description: form.description || undefined,
      imageUrl: form.imageUrl || undefined,
      purity: form.purity || undefined,
      alsoKnownAs: form.alsoKnownAs || undefined,
      molecularWeight: form.molecularWeight || undefined,
      casNumber: form.casNumber || undefined,
      formula: form.formula || undefined,
      sequence: form.sequence || undefined,
      storage: form.storage || undefined,
      appearance: form.appearance || undefined,
      solubility: form.solubility || undefined,
      halfLife: form.halfLife || undefined,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          data: {
            ...payload,
            seoTitle: form.seoTitle.trim() || null,
            seoDescription: form.seoDescription.trim() || null,
          },
        });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync({ data: payload });
        toast.success("Product created");
      }
      await invalidate();
      notifyStorefrontCatalogUpdated();
      closeDialog();
    } catch {
      toast.error(editingProduct ? "Failed to update product" : "Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync({ id: deleteTarget.id });
      toast.success("Product deleted");
      await invalidate();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleTogglePublished(p: CatalogProduct) {
    const next = !p.isPublished;
    try {
      await updateProduct.mutateAsync({ id: p.id, data: { isPublished: next } });
      await invalidate();
      notifyStorefrontCatalogUpdated();
      toast.success(`${p.name} is now ${next ? "live on storefront" : "disabled and hidden"}`);
    } catch {
      toast.error("Failed to update visibility");
    }
  }

  async function handleBulkDisableWithoutReport() {
    try {
      const result = await disableWithoutReport.mutateAsync();
      await invalidate();
      notifyStorefrontCatalogUpdated();
      setBulkDisableOpen(false);
      if (result.disabledCount === 0) {
        toast.success("All products already have a Janoshik report or are disabled");
      } else {
        toast.success(`Disabled ${result.disabledCount} product${result.disabledCount === 1 ? "" : "s"} without a Janoshik report`);
      }
    } catch {
      toast.error("Failed to disable products without Janoshik reports");
    }
  }

  async function handleBulkEnableAllPeptides() {
    try {
      const result = await enableAllPeptides.mutateAsync();
      await invalidate();
      notifyStorefrontCatalogUpdated();
      setBulkEnableOpen(false);
      if (result.enabledCount === 0) {
        toast.success("All peptides are already live on the storefront");
      } else {
        toast.success(`Re-enabled ${result.enabledCount} peptide${result.enabledCount === 1 ? "" : "s"} on the storefront`);
      }
    } catch {
      toast.error("Failed to re-enable all peptides");
    }
  }

  const changedPriceProducts = (products ?? []).filter(product => {
    const draft = priceDrafts[product.id] ?? (product.priceGbp != null ? String(product.priceGbp) : "");
    if (draft.trim() === "") return product.priceGbp != null;
    const numericDraft = Number(draft);
    return !Number.isFinite(numericDraft) || numericDraft !== Number(product.priceGbp);
  });

  async function handleSavePrices() {
    if (changedPriceProducts.length === 0) return;

    const invalidProduct = changedPriceProducts.find(product => {
      const draft = (priceDrafts[product.id] ?? "").trim();
      if (draft === "") return false;
      const numericDraft = Number(draft);
      return !Number.isFinite(numericDraft) || numericDraft < 0;
    });
    if (invalidProduct) {
      toast.error(`Enter a valid non-negative price for ${invalidProduct.name}`);
      return;
    }

    setSavingPrices(true);
    try {
      await Promise.all(
        changedPriceProducts.map(product => {
          const draft = (priceDrafts[product.id] ?? "").trim();
          return updateProduct.mutateAsync({
            id: product.id,
            data: { priceGbp: draft === "" ? null : Number(draft) },
          });
        }),
      );
      await invalidate();
      notifyStorefrontCatalogUpdated();
      toast.success(`Saved ${changedPriceProducts.length} peptide price${changedPriceProducts.length === 1 ? "" : "s"}`);
    } catch {
      toast.error("Failed to save one or more prices");
    } finally {
      setSavingPrices(false);
    }
  }

  const isDialogOpen = isCreating || editingProduct !== null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={publicationFilter} onValueChange={(value) => setPublicationFilter(value as "all" | "published" | "disabled")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="published">Live</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap justify-end gap-2 shrink-0">
          <Button
            variant="default"
            onClick={handleSavePrices}
            disabled={savingPrices || changedPriceProducts.length === 0}
          >
            {savingPrices ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Prices{changedPriceProducts.length > 0 ? ` (${changedPriceProducts.length})` : ""}
          </Button>
          <Button
            variant="outline"
            onClick={() => setBulkEnableOpen(true)}
            disabled={enableAllPeptides.isPending}
            className="text-green-700 border-green-300 hover:bg-green-50"
          >
            {enableAllPeptides.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
            Enable All
          </Button>
          <Button
            variant="outline"
            onClick={() => setBulkDisableOpen(true)}
            disabled={disableWithoutReport.isPending}
            className="text-destructive border-destructive/30 hover:bg-destructive/5"
          >
            {disableWithoutReport.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <EyeOff className="w-4 h-4 mr-2" />}
            Disable Unverified
          </Button>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Janoshik</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products?.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-9 h-9 rounded object-cover border bg-muted" />
                    ) : (
                      <div className="w-9 h-9 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">—</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{product.slug}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.category}</TableCell>
                  <TableCell>
                    <div className="relative w-28">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">£</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        aria-label={`Price for ${product.name}`}
                        className="h-8 pl-6 pr-2 text-sm font-medium"
                        value={priceDrafts[product.id] ?? (product.priceGbp != null ? String(product.priceGbp) : "")}
                        onChange={event => setPriceDrafts(previous => ({
                          ...previous,
                          [product.id]: event.target.value,
                        }))}
                        disabled={savingPrices}
                        placeholder="—"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.hasJanoshikReport ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Missing</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublished(product)}
                        disabled={updateProduct.isPending}
                        title={product.isPublished ? "Click to disable" : "Click to enable"}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                          product.isPublished
                            ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-900 hover:border-red-300"
                            : "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900 hover:border-green-300"
                        }`}
                      >
                        {product.isPublished
                          ? <><EyeOff className="w-3 h-3" /> Disable</>
                          : <><Eye className="w-3 h-3" /> Enable</>
                        }
                      </button>
                      {product.isFeatured && (
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={bulkDisableOpen} onOpenChange={setBulkDisableOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable unverified products?</AlertDialogTitle>
            <AlertDialogDescription>
              This will hide every currently published peptide that is not linked to a published,
              verifiable Janoshik report. Existing orders are not changed, and you can re-enable
              products individually later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disableWithoutReport.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDisableWithoutReport}
              disabled={disableWithoutReport.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {disableWithoutReport.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Disable Unverified
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkEnableOpen} onOpenChange={setBulkEnableOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enable all peptides?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make every disabled peptide live on the storefront, including products
              without a Janoshik report. Accessories, prices, stock, report status, and existing
              orders will not be changed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={enableAllPeptides.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkEnableAllPeptides}
              disabled={enableAllPeptides.isPending}
            >
              {enableAllPeptides.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enable All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={open => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingProduct ? `Edit: ${editingProduct.name}` : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-5 pb-2">
              {/* Core fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Name <span className="text-destructive">*</span></Label>
                  <Input
                    value={form.name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="BPC-157 5mg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug <span className="text-destructive">*</span></Label>
                  <Input
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="bpc-157-5mg"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category <span className="text-destructive">*</span></Label>
                  <Select
                    value={form.category}
                    onValueChange={v => setForm(f => ({ ...f, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Price (£)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.priceGbp}
                    onChange={e => setForm(f => ({ ...f, priceGbp: e.target.value }))}
                    placeholder="65.00"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="/products/1.jpg"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Short Description</Label>
                <Textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
                  placeholder="Brief one-sentence summary shown on product cards"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Full Description</Label>
                <Textarea
                  rows={5}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Detailed research description shown on the product page"
                />
              </div>

              {/* Scientific / technical fields */}
              <div className="pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Technical Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Purity</Label>
                    <Input value={form.purity} onChange={e => setForm(f => ({ ...f, purity: e.target.value }))} placeholder="99%+" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Also Known As</Label>
                    <Input value={form.alsoKnownAs} onChange={e => setForm(f => ({ ...f, alsoKnownAs: e.target.value }))} placeholder="BPC157, Body Protection Compound" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Molecular Weight</Label>
                    <Input value={form.molecularWeight} onChange={e => setForm(f => ({ ...f, molecularWeight: e.target.value }))} placeholder="1419.56 g/mol" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CAS Number</Label>
                    <Input value={form.casNumber} onChange={e => setForm(f => ({ ...f, casNumber: e.target.value }))} placeholder="137525-51-0" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Formula</Label>
                    <Input value={form.formula} onChange={e => setForm(f => ({ ...f, formula: e.target.value }))} placeholder="C₆₂H₉₈N₁₆O₂₂" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Half Life</Label>
                    <Input value={form.halfLife} onChange={e => setForm(f => ({ ...f, halfLife: e.target.value }))} placeholder="Approximately 30 minutes" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Appearance</Label>
                    <Input value={form.appearance} onChange={e => setForm(f => ({ ...f, appearance: e.target.value }))} placeholder="White lyophilized powder" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Solubility</Label>
                    <Input value={form.solubility} onChange={e => setForm(f => ({ ...f, solubility: e.target.value }))} placeholder="Soluble in sterile water" />
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <Label>Sequence</Label>
                  <Input value={form.sequence} onChange={e => setForm(f => ({ ...f, sequence: e.target.value }))} placeholder="Gly-Glu-Pro-Pro-Pro-Gly..." className="font-mono text-sm" />
                </div>
                <div className="space-y-1.5 mt-4">
                  <Label>Storage</Label>
                  <Input value={form.storage} onChange={e => setForm(f => ({ ...f, storage: e.target.value }))} placeholder="Store lyophilized at -20°C." />
                </div>
              </div>

              {/* SEO */}
              <div className="pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">SEO</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Override the auto-generated title and description that appear in Google search results.
                  Leave blank to use the defaults (product name + purity line).
                </p>
                {(() => {
                  const searchMetadata = getProductSearchMetadata({
                    name: form.name,
                    category: form.category,
                    purity: form.purity,
                    description: form.description,
                    seoTitle: form.seoTitle,
                    seoDescription: form.seoDescription,
                  });
                  return (
                    <div className="mb-4">
                      <SeoSearchPreview
                        {...searchMetadata}
                        urlPath={getPublicProductPath(form.slug.trim() || "product")}
                      />
                    </div>
                  );
                })()}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>
                      SEO Title
                      <span className="ml-1 text-muted-foreground font-normal text-xs">
                        ({form.seoTitle.length} custom chars; {SEO_TITLE_LIMIT} recommended after the storefront suffix)
                      </span>
                    </Label>
                    <Input
                      value={form.seoTitle}
                      onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))}
                      placeholder={form.name || "BPC-157 5mg"}
                      maxLength={80}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>
                      SEO Description
                      <span className="ml-1 text-muted-foreground font-normal text-xs">
                        ({form.seoDescription.length}/{SEO_DESCRIPTION_LIMIT} chars)
                      </span>
                    </Label>
                    <Textarea
                      rows={2}
                      value={form.seoDescription}
                      onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))}
                      placeholder={`${form.name || "BPC-157 5mg"} — research peptide with 98%+ verified purity. For research use only.`}
                      maxLength={200}
                    />
                  </div>
                </div>
              </div>

              {/* Visibility toggles */}
              <div className="pt-2 border-t flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-3">
                  <Switch
                    id="is-published"
                    checked={form.isPublished}
                    onCheckedChange={v => setForm(f => ({ ...f, isPublished: v }))}
                  />
                  <Label htmlFor="is-published">Published (visible on storefront)</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="is-featured"
                    checked={form.isFeatured}
                    onCheckedChange={v => setForm(f => ({ ...f, isFeatured: v }))}
                  />
                  <Label htmlFor="is-featured">Featured product</Label>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={closeDialog} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Inventory Tab ────────────────────────────────────────────────────────────

function InventoryTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState(false);

  const queryParams = {
    ...(search ? { search } : {}),
    ...(lowStockFilter ? { lowStock: true } : {}),
  };

  const { data: products, isLoading } = useListAdminProducts(queryParams, {
    query: { queryKey: getListAdminProductsQueryKey(queryParams) },
  });

  const updateInventory = useUpdateProductInventory();
  const updateVisibility = useUpdateProductVisibility();

  const handleVisibilityToggle = (product: AdminProduct, checked: boolean) => {
    updateVisibility.mutate({ id: product.id, data: { isPublished: checked } }, {
      onSuccess: () => {
        toast.success(`${product.productName} is now ${checked ? "published" : "hidden"}`);
        queryClient.setQueryData(getListAdminProductsQueryKey(queryParams), (old: AdminProduct[]) =>
          old ? old.map(p => p.id === product.id ? { ...p, isPublished: checked } : p) : old
        );
        notifyStorefrontCatalogUpdated();
      },
      onError: () => toast.error("Failed to update visibility"),
    });
  };

  const handleStockUpdate = (product: AdminProduct, newStock: string) => {
    const stockLevel = parseInt(newStock, 10);
    if (isNaN(stockLevel) || stockLevel === product.stockLevel) return;
    updateInventory.mutate({ id: product.id, data: { stockLevel } }, {
      onSuccess: () => {
        toast.success(`Stock updated for ${product.productName}`);
        queryClient.setQueryData(getListAdminProductsQueryKey(queryParams), (old: AdminProduct[]) =>
          old ? old.map(p => p.id === product.id ? { ...p, stockLevel } : p) : old
        );
        notifyStorefrontCatalogUpdated();
      },
      onError: () => toast.error("Failed to update stock"),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 bg-card border px-4 py-2 rounded-md h-10">
          <Switch id="low-stock" checked={lowStockFilter} onCheckedChange={setLowStockFilter} />
          <label htmlFor="low-stock" className="text-sm font-medium cursor-pointer">Low Stock Only</label>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[120px]">Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Published</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No products found.</TableCell>
              </TableRow>
            ) : (
              products?.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {product.productImage ? (
                        <img src={product.productImage} alt={product.productName} className="w-8 h-8 rounded object-cover border bg-muted" />
                      ) : (
                        <div className="w-8 h-8 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">No img</div>
                      )}
                      {product.productName}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.productCategory}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={product.stockLevel}
                      className={`h-8 w-20 ${product.stockLevel <= product.lowStockThreshold ? "border-red-300 focus-visible:ring-red-500" : ""}`}
                      onBlur={e => handleStockUpdate(product, e.target.value)}
                      onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()}
                    />
                  </TableCell>
                  <TableCell>
                    {product.stockLevel <= 0 ? (
                      <Badge variant="destructive" className="bg-red-100 text-red-800 border-0 hover:bg-red-100">Out of Stock</Badge>
                    ) : product.stockLevel <= product.lowStockThreshold ? (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <AlertCircle className="w-3 h-3 mr-1" /> Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Switch
                        checked={product.isPublished}
                        onCheckedChange={checked => handleVisibilityToggle(product, checked)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

async function downloadCsv(url: string, filename: string) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href; a.download = filename; a.click();
  URL.revokeObjectURL(href);
}

export default function Products() {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await downloadCsv(`/api/admin/export/products.csv`, `products-${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success("Products exported");
    } catch { toast.error("Export failed"); }
    finally { setExporting(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your product catalog and stock levels</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
          {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Export CSV
        </Button>
      </div>

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="catalog" className="mt-6">
          <CatalogTab />
        </TabsContent>
        <TabsContent value="inventory" className="mt-6">
          <InventoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
