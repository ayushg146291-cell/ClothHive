import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { SlidersHorizontal, ChevronDown, X, RefreshCcw } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import AnimatedPage from '@/components/common/AnimatedPage'
import ProductCard from '@/components/product/ProductCard'
import ProductSkeleton from '@/components/product/ProductSkeleton'
import { SortDropdown } from '@/components/common/SortDropdown'
import { productService } from '@/services/product.service'
import { filterPanelVariants, staggerContainer } from '@/lib/animations'
import { SORT_OPTIONS, ITEMS_PER_PAGE } from '@/lib/constants'
import type { ProductQuery } from '@/types'
import { Button } from '@/components/ui/button'

const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100 – $200', min: 100, max: 200 },
  { label: '$200+', min: 200, max: 99999 },
]

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)

  const query: ProductQuery = {
    page,
    limit: ITEMS_PER_PAGE,
    category: searchParams.get('category') || undefined,
    sort: (searchParams.get('sort') as ProductQuery['sort']) || 'newest',
    search: searchParams.get('search') || undefined,
    sale: searchParams.get('sale') === 'true',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', query],
    queryFn: () => productService.getProducts(query),
    placeholderData: (prev) => prev,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  })

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchParams({})
    setPage(1)
  }

  const hasFilters = searchParams.has('category') || searchParams.has('minPrice') || searchParams.has('search')

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [page])

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-24">
        {/* Page header */}
        <div className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter mb-4">
            {searchParams.get('search') ? `Search: "${searchParams.get('search')}"` : 'Collection'}
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {data ? `${data.total} items` : 'Loading...'}
            {searchParams.get('category') && ` • ${searchParams.get('category')}`}
          </p>
        </div>

        {/* Controls bar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="rounded-none h-12 px-6 uppercase font-bold tracking-widest text-xs border-foreground hover:bg-muted"
            id="filters-toggle"
          >
            <SlidersHorizontal size={14} className="mr-2" />
            Filters
            {hasFilters && (
              <span className="w-1.5 h-1.5 ml-2 rounded-full bg-foreground" />
            )}
            <ChevronDown size={14} className={`ml-2 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </Button>

          <div className="flex items-center gap-6">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} /> Clear all
              </button>
            )}
            <SortDropdown
              options={SORT_OPTIONS}
              value={searchParams.get('sort') || 'newest'}
              onChange={(val) => updateParam('sort', val)}
            />
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              variants={filterPanelVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="overflow-hidden mb-12 relative z-10"
            >
              <div className="flex flex-wrap gap-12 p-8 border border-border bg-background">
                {/* Category */}
                <div className="w-full sm:w-auto min-w-[200px]">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-6">Category</h3>
                  <div className="space-y-4">
                    {(categories || []).map((cat: { slug: string; name: string }) => (
                      <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={searchParams.get('category') === cat.slug}
                          onChange={() => updateParam('category', cat.slug)}
                          className="accent-foreground w-4 h-4"
                        />
                        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="w-full sm:w-auto min-w-[200px]">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-6">Price Range</h3>
                  <div className="space-y-4">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="price"
                          checked={
                            searchParams.get('minPrice') === String(range.min) &&
                            searchParams.get('maxPrice') === String(range.max)
                          }
                          onChange={() => {
                            updateParam('minPrice', String(range.min))
                            updateParam('maxPrice', String(range.max))
                          }}
                          className="accent-foreground w-4 h-4"
                        />
                        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="animate"
          className="grid gap-x-8 gap-y-16"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
          {isLoading || isFetching
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <ProductSkeleton key={i} />)
            : data?.data?.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </motion.div>

        {/* No results */}
        {!isLoading && data?.data?.length === 0 && (
          <div className="text-center py-32 border border-border mt-8 flex flex-col items-center">
            <p className="text-2xl font-black text-foreground uppercase tracking-tighter mb-4">No pieces found</p>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-8">Try adjusting your filters or search term.</p>
            
            <Button onClick={clearFilters} className="rounded-none h-14 px-8 uppercase font-bold tracking-widest text-sm bg-foreground text-background">
              <RefreshCcw size={16} className="mr-2" />
              Reset Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-24">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-none h-12 px-6 uppercase font-bold tracking-widest text-xs border-border hover:bg-muted"
            >
              Prev
            </Button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <div key={`page-wrapper-${p}`} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span key={`dots-${p}`} className="text-muted-foreground px-2">…</span>
                  )}
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    onClick={() => setPage(p)}
                    className={`rounded-none h-12 w-12 flex items-center justify-center font-bold text-sm ${
                      p === page
                        ? 'bg-foreground text-background'
                        : 'border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {p}
                  </Button>
                </div>
              ))}
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="rounded-none h-12 px-6 uppercase font-bold tracking-widest text-xs border-border hover:bg-muted"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
