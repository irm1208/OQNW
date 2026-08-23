import { useState } from "react";
import {
  useListCatalogProducts,
  getListCatalogProductsQueryKey,
  useCreateCatalogProduct,
  useUpdateCatalogProduct,
  useDeleteCatalogProduct,
  useDisableCatalogProductsWithoutJanoshikReport,
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
  Search, Loader2, AlertCircle, Plus, Pencil, Trash2, Star, Eye, EyeOff, Download,
} from "lucide-react";
import { toast } from "sonner";
import type { CatalogProduct, AdminProduct } from "@workspace/api-client-react";

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
  coaUrl: string;
  msImageUrl: string;
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
  coaUrl: "",
  msImageUrl: "",
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
    coaUrl: p.coaUrl ?? "",
    msImageUrl: p.msImageUrl ?? "",
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
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CatalogProduct | null>(null);
  const [bulkDisableOpen, setBulkDisableOpen] = useState(false);
  const [form, setForm] = useState<ProductFormData>(emptyForm());
  const [saving, setSaving] = useState(false);

  const queryParams = {
    ...(search ? { search } : {}),
    ...(categoryFilter && categoryFilter !== "all" ? { category: categoryFilter } : {}),
  };

  const { data: products, isLoading } = useListCatalogProducts(queryParams, {
    query: { queryKey: getListCatalogProductsQueryKey(queryParams) },
  });

  const createProduct = useCreateCatalogProduct();
  const updateProduct = useUpdateCatalogProduct();
  const deleteProduct = useDeleteCatalogProduct();
  const disableWithoutReport = useDisableCatalogProductsWithoutJanoshikReport();

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
      coaUrl: form.coaUrl || undefined,
      msImageUrl: form.msImageUrl || undefined,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, data: payload });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync({ data: payload });
        toast.success("Product created");
      }
      await invalidate();
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
      toast.success(`${p.name} is now ${next ? "live on storefront" : "disabled and hidden"}`);
    } catch {
      toast.error("Failed to update visibility");
    }
  }

  async function handleBulkDisableWithoutReport() {
    try {
      const result = await disableWithoutReport.mutateAsync();
      await invalidate();
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
        </div>
        <div className="flex flex-wrap justify-end gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setBulkDisableOpen(true)}
            disabled={disableWithoutReport.isPending}
            className="text-destructive border-destructive/30 hover:bg-destructive/5"
          >
            {disableWithoutReport.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <EyeOff className="w-4 h-4 mr-2" />}
            Disable Without Report
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
                  <TableCell className="text-sm font-medium">
                    {product.priceGbp != null ? `£${Number(product.priceGbp).toFixed(2)}` : <span className="text-muted-foreground">—</span>}
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
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                        }`}
                      >
                        {product.isPublished
                          ? <><Eye className="w-3 h-3" /> Live</>
                          : <><EyeOff className="w-3 h-3" /> Disabled</>
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
            <AlertDialogTitle>Disable products without a Janoshik report?</AlertDialogTitle>
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
              Disable Products
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

              {/* Lab Documents */}
              <div className="pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Lab Documents</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload or paste URLs for real lab-verified documents. These appear as "Download Lab PDF" buttons in the COA modal on the storefront.
                  {!editingProduct && " (Save the product first to enable file uploads.)"}
                </p>
                {(
                  [
                    { key: "coaUrl" as const, label: "COA PDF", type: "coa", placeholder: "https://…/coa.pdf" },
                    { key: "msImageUrl" as const, label: "MS Spectrum", type: "ms", placeholder: "https://…/ms.pdf" },
                  ] as const
                ).map(doc => (
                  <div key={doc.key} className="space-y-1.5 mb-3">
                    <Label>{doc.label}</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={form[doc.key]}
                        onChange={e => setForm(f => ({ ...f, [doc.key]: e.target.value }))}
                        placeholder={doc.placeholder}
                        className="flex-1"
                      />
                      {editingProduct && (
                        <>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            id={`upload-${doc.key}`}
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append("file", file);
                              try {
                                const r = await fetch(`/api/admin/catalog/${editingProduct.id}/upload-doc?type=${doc.type}`, {
                                  method: "POST",
                                  credentials: "include",
                                  body: fd,
                                });
                                if (r.ok) {
                                  const { url } = await r.json() as { url: string };
                                  setForm(f => ({ ...f, [doc.key]: url }));
                                  toast.success(`${doc.label} uploaded`);
                                } else {
                                  toast.error("Upload failed");
                                }
                              } catch {
                                toast.error("Upload failed");
                              }
                              e.target.value = "";
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => document.getElementById(`upload-${doc.key}`)?.click()}
                          >
                            Upload
                          </Button>
                        </>
                      )}
                      {form[doc.key] && (
                        <a href={form[doc.key]} target="_blank" rel="noopener noreferrer" className="shrink-0">
                          <Button type="button" variant="ghost" size="icon" className="h-9 w-9" title="View">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* SEO */}
              <div className="pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">SEO</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Override the auto-generated title and description that appear in Google search results.
                  Leave blank to use the defaults (product name + purity line).
                </p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>
                      SEO Title
                      <span className="ml-1 text-muted-foreground font-normal text-xs">
                        ({form.seoTitle.length}/60 chars)
                      </span>
                    </Label>
                    <Input
                      value={form.seoTitle}
                      onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))}
                      placeholder={`${form.name || "BPC-157 5mg"} | OmniQure Peptide Research Institute`}
                      maxLength={80}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>
                      SEO Description
                      <span className="ml-1 text-muted-foreground font-normal text-xs">
                        ({form.seoDescription.length}/160 chars)
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
