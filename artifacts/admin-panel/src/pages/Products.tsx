import { useState, useRef } from "react";
import { 
  useListAdminProducts, 
  getListAdminProductsQueryKey,
  useUpdateProductInventory,
  useUpdateProductVisibility
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { AdminProduct } from "@workspace/api-client-react";

export default function Products() {
  const [search, setSearch] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const queryClient = useQueryClient();
  
  const queryParams = { 
    ...(search ? { search } : {}),
    ...(lowStockFilter ? { lowStock: true } : {})
  };
  
  const { data: products, isLoading } = useListAdminProducts(queryParams, {
    query: { queryKey: getListAdminProductsQueryKey(queryParams) }
  });

  const updateInventory = useUpdateProductInventory();
  const updateVisibility = useUpdateProductVisibility();

  const handleVisibilityToggle = (product: AdminProduct, checked: boolean) => {
    updateVisibility.mutate({ id: product.id, data: { isPublished: checked } }, {
      onSuccess: () => {
        toast.success(`${product.productName} is now ${checked ? 'published' : 'hidden'}`);
        // Optimistic update
        queryClient.setQueryData(getListAdminProductsQueryKey(queryParams), (old: AdminProduct[]) => 
          old ? old.map(p => p.id === product.id ? { ...p, isPublished: checked } : p) : old
        );
      },
      onError: () => toast.error("Failed to update visibility")
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
      onError: () => toast.error("Failed to update stock")
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Products & Inventory</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 bg-card border px-4 py-2 rounded-md h-10">
          <Switch 
            id="low-stock" 
            checked={lowStockFilter} 
            onCheckedChange={setLowStockFilter} 
          />
          <label htmlFor="low-stock" className="text-sm font-medium cursor-pointer">
            Low Stock Only
          </label>
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
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
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
                      className={`h-8 w-20 ${product.stockLevel <= product.lowStockThreshold ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                      onBlur={(e) => handleStockUpdate(product, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
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
                        onCheckedChange={(checked) => handleVisibilityToggle(product, checked)}
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
