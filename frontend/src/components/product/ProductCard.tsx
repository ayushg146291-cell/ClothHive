import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'
import { toast } from 'sonner'
import { productService } from '@/services/product.service'

import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
  index?: number
}

const ProductCard = React.memo(function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [heartState, setHeartState] = useState<'idle' | 'pop'>('idle')
  const [imageLoaded, setImageLoaded] = useState(false)
  const queryClient = useQueryClient()

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const { toggle, isInWishlist } = useWishlistStore()

  const inWishlist = isInWishlist(product.id)
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, 1)
    openCart()
    toast.success(`${product.name} added to cart`, {
      description: formatCurrency(product.price),
    })
  }, [product, addItem, openCart])

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    toggle(product)
    setHeartState('pop')
    setTimeout(() => setHeartState('idle'), 400)
    if (!inWishlist) {
      toast.success('Added to wishlist')
    }
  }, [product, toggle, inWishlist])

  const prefetchProduct = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['product', product.slug],
      queryFn: () => productService.getProduct(product.slug),
      staleTime: 5 * 60 * 1000,
    })
  }, [queryClient, product.slug])

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      onHoverStart={prefetchProduct}
      className="group relative cursor-pointer flex flex-col"
    >
      <Link to={`/products/${product.slug}`} className="block h-full w-full">
        <div className="w-full flex flex-col h-full bg-transparent group">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted w-full mb-6">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <motion.img
              src={product.images?.[0] || 'https://placehold.co/400x533/18181B/FFFFFF?text=Shoppe'}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />

            {/* Minimal Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isFeatured && (
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-background bg-foreground">
                  New
                </span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-background bg-foreground">
                  -{discount}%
                </span>
              )}
              {product.stock === 0 && (
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-border">
                  Sold Out
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-background border border-border hover:bg-muted transition-colors duration-200 z-10"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={16}
                className="transition-colors duration-200"
                fill={inWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
              />
            </button>

            {/* Hover overlay actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 rounded-none h-12 bg-foreground text-background hover:bg-muted-foreground font-bold uppercase tracking-widest text-xs pointer-events-auto"
                id={`add-to-cart-${product.id}`}
              >
                <ShoppingBag size={14} className="mr-2" />
                {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1 px-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-1 line-clamp-1">
              {product.name}
            </h3>
            
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {product.category?.name || 'Essentials'}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mt-auto">
              <span className="text-sm font-bold text-foreground tracking-widest">{formatCurrency(product.price)}</span>
              {product.comparePrice && (
                <span className="text-xs text-muted-foreground line-through tracking-widest">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
})

export default ProductCard
