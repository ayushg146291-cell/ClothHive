import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { cardVariants, scalePop, buttonPress } from '@/lib/animations'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'
import { toast } from 'sonner'
import { productService } from '@/services/product.service'

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

  // Prefetch product details on hover to make navigation instant
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
      whileHover={{ y: -8, rotateX: 2, rotateY: -2, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      onHoverStart={prefetchProduct}
      className="group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_40px_rgba(99,102,241,0.25)] transition-shadow duration-500"
      style={{ background: 'var(--color-gray-800)', transformPerspective: 1000 }}
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer" />
          )}
          <motion.img
            src={product.images[0] || 'https://placehold.co/400x533/1e293b/6366f1?text=ClothHive'}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isFeatured && (
              <span
                className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: 'var(--color-primary-500)' }}
              >
                Featured
              </span>
            )}
            {discount > 0 && (
              <span
                className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: 'var(--color-secondary-500)' }}
              >
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white bg-gray-600">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <motion.button
            variants={scalePop}
            animate={heartState}
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full glass transition-all duration-200"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={16}
              className="transition-colors duration-200"
              fill={inWishlist ? '#ec4899' : 'none'}
              stroke={inWishlist ? '#ec4899' : 'currentColor'}
            />
          </motion.button>

          {/* Hover overlay actions */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}
            >
              <motion.button
                {...buttonPress}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--color-primary-600)' }}
                id={`add-to-cart-${product.id}`}
              >
                <ShoppingBag size={14} />
                {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </motion.button>
              <Link
                to={`/products/${product.slug}`}
                className="p-2.5 rounded-xl glass flex items-center justify-center"
                aria-label="Quick view"
              >
                <Eye size={14} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
          <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          {(product.avgRating ?? 0) > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  fill={i < Math.round(product.avgRating ?? 0) ? '#f59e0b' : 'none'}
                  stroke={i < Math.round(product.avgRating ?? 0) ? '#f59e0b' : 'currentColor'}
                  className="text-amber-400"
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviewCount ?? 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
})

export default ProductCard
