import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
      <div className="page-container pt-safe-nav pb-[5vh]">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            {searchParams.get('search') ? `Results for "${searchParams.get('search')}"` : 'All Products'}
          </h1>
          <p className="text-gray-400">
            {data ? `${data.total} items` : 'Loading...'}
            {searchParams.get('category') && ` in ${searchParams.get('category')}`}
          </p>
        </div>

        {/* Controls bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="btn-glass"
            id="filters-toggle"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: 'var(--color-primary-500)' }}
              />
            )}
            <ChevronDown
              size={14}
              className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <X size={12} /> Clear all
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
              className="overflow-hidden mb-8 relative z-10"
            >
              <div
                className="flex flex-wrap gap-[10%] p-6 rounded-2xl"
                style={{ 
                  background: 'var(--surface-glass)', 
                  border: '1px solid var(--border-glass)'
                }}
              >
                {/* Category */}
                <div className="w-full sm:w-auto min-w-[200px]">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Category</h3>
                  <div className="space-y-2">
                    {(categories || []).map((cat: { slug: string; name: string }) => (
                      <label key={cat.slug} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={searchParams.get('category') === cat.slug}
                          onChange={() => updateParam('category', cat.slug)}
                          className="accent-indigo-500"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="w-full sm:w-auto min-w-[200px]">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
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
                          className="accent-indigo-500"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{range.label}</span>
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
          className="grid gap-4 md:gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' }}
        >
          {isLoading || isFetching
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <ProductSkeleton key={i} />)
            : data?.data.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </motion.div>

        {/* No results */}
        {!isLoading && data?.data.length === 0 && (
          <div className="text-center py-24 flex flex-col items-center">
            <p className="text-2xl font-bold text-white mb-2">No products found</p>
            <p className="text-gray-400 mb-8">Try adjusting your filters or search term.</p>
            
            <button onClick={clearFilters} className="magic-button px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 shadow-glow">
              <RefreshCcw size={16} />
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm glass glass-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span key={`dots-${p}`} className="text-gray-500 px-1">…</span>
                  )}
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      p === page
                        ? 'magic-button text-white shadow-glow'
                        : 'glass glass-hover text-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                </>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="px-4 py-2 rounded-lg text-sm glass glass-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
