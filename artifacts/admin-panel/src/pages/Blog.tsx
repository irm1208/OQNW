import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api/${path}`.replace(/\/+/g, "/"); }

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author: string;
  tags: string[];
  status: string;
  featuredImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
};

const BLANK = {
  title: "", excerpt: "", content: "", author: "OmniQure Team",
  tags: "", status: "draft", featuredImageUrl: "", seoTitle: "", seoDescription: "",
};

export default function Blog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ ...BLANK });

  const params = new URLSearchParams({ limit: "100" });
  if (statusFilter !== "all") params.set("status", statusFilter);
  if (search) params.set("search", search);

  const { data, isLoading } = useQuery<{ total: number; posts: Post[] }>({
    queryKey: ["admin-blog", statusFilter, search],
    queryFn: () => fetch(api(`admin/blog/posts?${params}`), { credentials: "include" }).then(r => r.json() as Promise<{ total: number; posts: Post[] }>),
  });

  const posts = data?.posts ?? [];

  const save = useMutation({
    mutationFn: async (v: typeof form & { id?: number }) => {
      const url = v.id ? api(`admin/blog/posts/${v.id}`) : api("admin/blog/posts");
      const res = await fetch(url, {
        method: v.id ? "PATCH" : "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: v.title,
          excerpt: v.excerpt || null,
          content: v.content,
          author: v.author,
          tags: v.tags.split(",").map(t => t.trim()).filter(Boolean),
          status: v.status,
          featuredImageUrl: v.featuredImageUrl || null,
          seoTitle: v.seoTitle || null,
          seoDescription: v.seoDescription || null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: editing ? "Post updated" : "Post created" });
      void queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      setOpen(false);
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api(`admin/blog/posts/${id}`), { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: "Post deleted" });
      void queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(api(`admin/blog/posts/${id}`), {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-blog"] }),
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  function openCreate() { setEditing(null); setForm({ ...BLANK }); setOpen(true); }
  function openEdit(p: Post) {
    setEditing(p);
    setForm({
      title: p.title, excerpt: p.excerpt ?? "", content: p.content,
      author: p.author, tags: (p.tags ?? []).join(", "), status: p.status,
      featuredImageUrl: p.featuredImageUrl ?? "", seoTitle: p.seoTitle ?? "",
      seoDescription: p.seoDescription ?? "",
    });
    setOpen(true);
  }

  const published = posts.filter(p => p.status === "published").length;
  const drafts = posts.filter(p => p.status === "draft").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog</h2>
          <p className="text-sm text-muted-foreground mt-1">Research articles and educational content</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> New Post</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Published</p>
          <p className="text-3xl font-bold text-green-600">{published}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Drafts</p>
          <p className="text-3xl font-bold text-orange-500">{drafts}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Posts</p>
          <p className="text-3xl font-bold">{data?.total ?? 0}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No posts yet</p>
            <Button className="mt-4" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Write First Post</Button>
          </div>
        ) : (
          <div className="divide-y">
            {posts.map(p => (
              <div key={p.id} className="flex items-start gap-4 p-5 hover:bg-muted/30">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold truncate">{p.title}</p>
                    <Badge variant="outline" className={p.status === "published"
                      ? "text-green-600 border-green-200 bg-green-50 text-xs shrink-0"
                      : "text-orange-500 border-orange-200 bg-orange-50 text-xs shrink-0"}>
                      {p.status}
                    </Badge>
                  </div>
                  {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{p.author}</span>
                    {p.publishedAt && <span>Published {new Date(p.publishedAt).toLocaleDateString("en-GB")}</span>}
                    {(p.tags ?? []).length > 0 && (
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{(p.tags ?? []).slice(0, 3).join(", ")}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" title={p.status === "published" ? "Unpublish" : "Publish"}
                    onClick={() => toggleStatus.mutate({ id: p.id, status: p.status === "published" ? "draft" : "published" })}>
                    {p.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove.mutate(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "New Blog Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Post title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Excerpt</label>
              <Textarea placeholder="Brief summary shown in listings…" rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Content (Markdown supported)</label>
              <Textarea placeholder="Write your article…" rows={10} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Author</label>
                <Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input placeholder="peptides, research, BPC-157" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Featured Image URL</label>
              <Input placeholder="https://…" value={form.featuredImageUrl} onChange={e => setForm(f => ({ ...f, featuredImageUrl: e.target.value }))} />
            </div>
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">SEO</p>
              <div className="space-y-1">
                <label className="text-sm font-medium">SEO Title</label>
                <Input placeholder="Overrides page title for search engines" value={form.seoTitle} onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea placeholder="150–160 chars shown in search results" rows={2} value={form.seoDescription} onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate(editing ? { ...form, id: editing.id } : form)} disabled={save.isPending || !form.title}>
              {save.isPending ? "Saving…" : editing ? "Save Changes" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
