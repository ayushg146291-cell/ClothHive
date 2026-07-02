import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { cardVariants, scalePop } from '@/lib/animations'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'
import { toast } from 'sonner'
import { productService } from '@/services/product.service'

import { Card, CardContent } from '@/components/ui/card'
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
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      onHoverStart={prefetchProduct}
      className="group relative cursor-pointer"
    >
      <div className="h-full">
        <Link to={`/products/${product.slug}`} className="block h-full">
          <Card className="h-full overflow-hidden bg-background brutal-border brutal-shadow brutal-shadow-hover hover-flood-acid transition-colors rounded-none p-2 group">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 brutal-border border-b-4">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
            )}
            <motion.img
              src={product.images?.[0] || 'https://placehold.co/400x533/1e293b/BE185D?text=ClothHive'}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isFeatured && (
                <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white bg-primary">
                  Featured
                </span>
              )}
              {discount > 0 && (
                <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white bg-secondary">
                  -{discount}%
                </span>
              )}
              {product.stock === 0 && (
                <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white bg-zinc-600">
                  Sold Out
                </span>
              )}
            </div>

            {/* Wishlist button */}
            <motion.button
              variants={scalePop}
              animate={heartState}
              onClick={handleWishlist}
              className="absolute top-3 right-3 h-11 w-11 flex items-center justify-center rounded-full glass hover:bg-zinc-800/50 transition-all duration-200 z-10"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={16}
                className="transition-colors duration-200"
                fill={inWishlist ? '#EC4899' : 'none'}
                stroke={inWishlist ? '#EC4899' : 'currentColor'}
              />
            </motion.button>

            {/* Hover overlay actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 brutal-btn bg-primary text-white pointer-events-auto hover:bg-primary"
                id={`add-to-cart-${product.id}`}
              >
                <ShoppingBag size={16} className="mr-2" />
                {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="brutal-btn bg-background text-foreground pointer-events-auto hover:bg-background"
              >
                <Eye size={16} />
              </Button>
            </div>
          </div>

          {/* Info */}
          <CardContent className="px-2 py-4 bg-transparent">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 group-hover:text-black">{product.category?.name}</p>
            <h3 className="text-xl font-black text-foreground mb-2 line-clamp-2 leading-tight uppercase group-hover:text-black">
              {product.name}
            </h3>

            {/* Rating */}
            {(product.avgRating ?? 0) > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    fill={i < Math.round(product.avgRating ?? 0) ? '#D97706' : 'none'}
                    stroke={i < Math.round(product.avgRating ?? 0) ? '#D97706' : 'currentColor'}
                    className="text-accent"
                  />
                ))}
                <span className="text-xs text-zinc-500 ml-1">({product.reviewCount ?? 0})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-black text-primary group-hover:text-primary">{formatCurrency(product.price)}</span>
              {product.comparePrice && (
                <span className="text-sm font-bold text-muted-foreground line-through group-hover:text-black/60">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  </motion.article>
  )
})

export default ProductCard
