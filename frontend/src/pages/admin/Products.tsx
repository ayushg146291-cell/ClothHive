import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X, Save } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/services/product.service'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { Product, ProductVariant } from '@/types'

function EditProductModal({ 
  product, 
  isOpen, 
  onClose 
}: { 
  product: Product | null, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const queryClient = useQueryClient()
  
  const [name, setName] = useState('')
  const [stock, setStock] = useState(0)
  const [price, setPrice] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [variants, setVariants] = useState<ProductVariant[]>([])

  // Reset form when product changes
  import('react').then(React => {
    React.useEffect(() => {
      if (product) {
        setName(product.name)
        setStock(product.stock)
        setPrice(product.price)
        setIsActive(product.isActive)
        setVariants(product.variants || [])
      }
    }, [product])
  })

  const updateProduct = useMutation({
    mutationFn: (data: Partial<Product>) => productService.updateProduct(product!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Product updated successfully')
      onClose()
    },
    onError: () => toast.error('Failed to update product')
  })

  const handleSave = () => {
    if (!product) return
    updateProduct.mutate({
      name,
      stock,
      price,
      isActive,
      variants,
    })
  }

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass bg-background/50 rounded-xl px-4 py-2 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full glass bg-background/50 rounded-xl px-4 py-2 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Total Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full glass bg-background/50 rounded-xl px-4 py-2 text-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary bg-background"
                />
                <span className="text-sm font-medium text-foreground">Active (Visible in store)</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Variants (Sizes/Colors)</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => setVariants([...variants, { id: Date.now().toString(), productId: product.id, stock: 0, sku: `NEW-SKU-${Date.now()}` } as any])}
              >
                <Plus size={14} className="mr-1" /> Add Variant
              </Button>
            </div>
            
            {variants.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No variants available.</p>
            ) : (
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={variant.id || index} className="flex gap-3 items-center glass p-3 rounded-xl border border-border">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Size</label>
                      <input
                        type="text"
                        placeholder="e.g. M"
                        value={variant.size || ''}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        className="w-full bg-background/50 rounded-lg px-3 py-1.5 text-sm text-foreground border border-border outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Color</label>
                      <input
                        type="text"
                        placeholder="e.g. Black"
                        value={variant.color || ''}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        className="w-full bg-background/50 rounded-lg px-3 py-1.5 text-sm text-foreground border border-border outline-none"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Stock</label>
                      <input
                        type="number"
                        value={variant.stock || 0}
                        onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                        className="w-full bg-background/50 rounded-lg px-3 py-1.5 text-sm text-foreground border border-border outline-none"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive mt-5"
                      onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="mr-2">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={updateProduct.isPending}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {updateProduct.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminProducts() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', page, search],
    queryFn: () => productService.getProducts({ page, limit: 10, search: search || undefined }),
  })

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your product catalog</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg">
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-border">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/30">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background text-foreground text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none border border-border focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No products found</td></tr>
              ) : data?.data?.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="w-10 h-10 rounded-md object-cover bg-muted" />
                      <div>
                        <span className="font-medium text-foreground block">{product.name}</span>
                        {!product.isActive && <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-bold">INACTIVE</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{product.category?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4 text-foreground font-medium tabular-nums">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages} · {data.total} products
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                className="border-border"
              >
                <ChevronLeft size={14} className="mr-1" /> Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= data.totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="border-border"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <EditProductModal 
        product={editingProduct} 
        isOpen={!!editingProduct} 
        onClose={() => setEditingProduct(null)} 
      />
    </AdminLayout>
  )
}
