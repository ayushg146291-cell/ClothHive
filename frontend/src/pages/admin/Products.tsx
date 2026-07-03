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
    const finalStock = variants.length > 0 ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) : stock;
    updateProduct.mutate({
      name,
      stock: finalStock,
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
      <DialogContent className="max-w-2xl bg-background border border-border rounded-none p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Edit Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 bg-background px-4 text-foreground border border-border focus:border-foreground outline-none transition-colors text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-2">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-12 bg-background px-4 text-foreground border border-border focus:border-foreground outline-none transition-colors text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-2">
                Total Stock {variants.length > 0 && '(Auto)'}
              </label>
              <input
                type="number"
                value={variants.length > 0 ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) : stock}
                onChange={(e) => setStock(Number(e.target.value))}
                disabled={variants.length > 0}
                className="w-full h-12 bg-background px-4 text-foreground border border-border focus:border-foreground outline-none transition-colors disabled:bg-muted text-sm font-medium"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded-none border-foreground text-foreground focus:ring-foreground bg-background"
                />
                <span className="text-xs font-bold uppercase tracking-widest text-foreground">Active (Visible)</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Variants</h3>
              <Button 
                variant="outline" 
                className="h-8 rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background text-xs font-bold uppercase tracking-widest"
                onClick={() => setVariants([...variants, { id: Date.now().toString(), productId: product.id, stock: 0, sku: `NEW-SKU-${Date.now()}` } as any])}
              >
                <Plus size={14} strokeWidth={2.5} className="mr-2" /> Add Variant
              </Button>
            </div>
            
            {variants.length === 0 ? (
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NO VARIANTS AVAILABLE.</p>
            ) : (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={variant.id || index} className="flex gap-4 items-center p-4 border border-border">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-1 block">Size</label>
                      <input
                        type="text"
                        placeholder="M"
                        value={variant.size || ''}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        className="w-full h-10 bg-background px-3 text-sm text-foreground border border-border outline-none focus:border-foreground"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-1 block">Color</label>
                      <input
                        type="text"
                        placeholder="BLK"
                        value={variant.color || ''}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        className="w-full h-10 bg-background px-3 text-sm text-foreground border border-border outline-none focus:border-foreground"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-1 block">SKU</label>
                      <input
                        type="text"
                        placeholder="SKU"
                        value={variant.sku || ''}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        className="w-full h-10 bg-background px-3 text-sm text-foreground border border-border outline-none focus:border-foreground"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-1 block">Stock</label>
                      <input
                        type="number"
                        value={variant.stock || 0}
                        onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                        className="w-full h-10 bg-background px-3 text-sm text-foreground border border-border outline-none focus:border-foreground"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-5 h-10 w-10 rounded-none border-border hover:border-foreground hover:bg-foreground hover:text-background p-0 flex items-center justify-center transition-colors"
                      onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-8 pt-6 border-t border-border gap-4">
          <DialogClose asChild>
            <Button variant="outline" className="h-12 rounded-none border-foreground text-foreground font-bold uppercase tracking-widest text-xs">CANCEL</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={updateProduct.isPending}
            className="h-12 rounded-none bg-foreground text-background hover:bg-muted-foreground font-bold uppercase tracking-widest text-xs"
          >
            {updateProduct.isPending ? 'SAVING...' : 'SAVE CHANGES'}
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
      <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-foreground">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Products</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">MANAGE YOUR PRODUCT CATALOG</p>
        </div>
        <Button className="h-12 rounded-none bg-foreground text-background hover:bg-muted-foreground font-bold uppercase tracking-widest text-xs">
          <Plus size={16} strokeWidth={2.5} className="mr-2" /> ADD PRODUCT
        </Button>
      </div>

      <div className="border border-border bg-background">
        <div className="p-6 border-b border-border bg-background flex flex-col sm:flex-row gap-6 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search size={20} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-background text-foreground text-xs font-bold uppercase tracking-widest rounded-none pl-12 pr-4 outline-none border border-border focus:border-foreground transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] font-black uppercase tracking-widest bg-muted text-foreground">
              <tr>
                <th className="px-8 py-6">PRODUCT</th>
                <th className="px-8 py-6">CATEGORY</th>
                <th className="px-8 py-6">PRICE</th>
                <th className="px-8 py-6">STOCK</th>
                <th className="px-8 py-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={5} className="px-8 py-6"><div className="h-4 bg-muted animate-pulse" /></td>
                  </tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NO PRODUCTS FOUND</td></tr>
              ) : data?.data?.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-6">
                      <img src={product.images?.[0] || 'https://placehold.co/40'} alt="" className="w-12 h-12 object-cover border border-border" />
                      <div>
                        <span className="font-black text-sm uppercase tracking-widest text-foreground block mb-1">{product.name}</span>
                        {!product.isActive && <span className="text-[10px] px-2 py-0.5 border border-foreground font-black uppercase tracking-widest">INACTIVE</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{product.category?.name || 'UNCATEGORIZED'}</td>
                  <td className="px-8 py-4 text-foreground font-black tracking-widest">{formatCurrency(product.price)}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${product.stock > 0 ? 'border-foreground text-foreground' : 'border-muted-foreground text-muted-foreground'}`}>
                      {product.stock} IN STOCK
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right space-x-4">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit2 size={18} strokeWidth={2.5} />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-6 border-t border-border bg-background">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              PAGE {data.page} OF {data.totalPages} · {data.total} PRODUCTS
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline"
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                className="h-10 rounded-none border-border hover:border-foreground text-[10px] font-bold uppercase tracking-widest"
              >
                <ChevronLeft size={16} strokeWidth={2.5} className="mr-2" /> PREVIOUS
              </Button>
              <Button 
                variant="outline"
                disabled={page >= data.totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="h-10 rounded-none border-border hover:border-foreground text-[10px] font-bold uppercase tracking-widest"
              >
                NEXT <ChevronRight size={16} strokeWidth={2.5} className="ml-2" />
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
