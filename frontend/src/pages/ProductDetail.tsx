import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import AnimatedPage from '@/components/common/AnimatedPage'
import ProductCard from '@/components/product/ProductCard'
import ProductSkeleton from '@/components/product/ProductSkeleton'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatCurrency } from '@/lib/utils'
import { buttonPress, scalePop, staggerContainer, cardVariants } from '@/lib/animations'
import type { ProductVariant } from '@/types'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [heartState, setHeartState] = useState<'idle' | 'pop'>('idle')

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const { toggle, isInWishlist } = useWishlistStore()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProduct(slug!),
    enabled: !!slug,
  })

  useSEO({
    title: product?.name,
    description: product?.description
  })

  const { data: related } = useQuery({
    queryKey: ['products', 'related', product?.categoryId],
    queryFn: () => productService.getProducts({ category: product?.category.slug, limit: 4 }),
    enabled: !!product,
  })

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="page-container pt-safe-nav pb-[5vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl shimmer" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-square rounded-xl shimmer" />)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded shimmer" />
              <div className="h-6 w-1/4 rounded shimmer" />
              <div className="h-16 rounded shimmer" />
            </div>
          </div>
        </div>
      </AnimatedPage>
    )
  }

  if (!product) return null

  const inWishlist = isInWishlist(product.id)
  const images = product.images.length > 0 ? product.images : ['https://placehold.co/600x700/1e293b/6366f1?text=ClothHive']
  const sizes = [...new Set(product.variants.filter((v) => v.size).map((v) => v.size!))]
  const colors = [...new Set(product.variants.filter((v) => v.color).map((v) => v.color!))]
  const currentPrice = selectedVariant?.price ?? product.price
  const inStock = (selectedVariant?.stock ?? product.stock) > 0

  const handleAddToCart = () => {
    if (!inStock) return
    addItem(product, quantity, selectedVariant ?? undefined)
    openCart()
    toast.success('Added to cart!')
  }

  const handleWishlist = () => {
    toggle(product)
    setHeartState('pop')
    setTimeout(() => setHeartState('idle'), 400)
  }

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-[5vh]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <button onClick={() => navigate(-1)} className="hover:text-white transition-colors">← Back</button>
          <span>/</span>
          <span>{product.category.name}</span>
          <span>/</span>
          <span className="text-gray-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass p-4" style={{ border: '1px solid var(--border-glass)' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.name}
                  fetchpriority="high"
                  layoutId="product-image"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain rounded-2xl drop-shadow-2xl"
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl glass"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl glass"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden transition-all ${
                      i === selectedImage ? 'ring-2 ring-indigo-500 scale-105 shadow-glow' : 'opacity-50 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-medium" style={{ color: 'var(--color-primary-400)' }}>
                {product.category.name}
              </span>
              <h1 className="text-3xl font-black text-white mt-1 leading-snug">{product.name}</h1>

              {/* Rating */}
              {(product.avgRating ?? 0) > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.round(product.avgRating ?? 0) ? '#f59e0b' : 'none'}
                        stroke={i < Math.round(product.avgRating ?? 0) ? '#f59e0b' : '#6b7280'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.avgRating?.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-4xl font-black text-white">{formatCurrency(currentPrice)}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{formatCurrency(product.comparePrice)}</span>
                    <span
                      className="px-2 py-1 rounded-lg text-sm font-bold text-white"
                      style={{ background: 'var(--color-secondary-500)' }}
                    >
                      Save {Math.round(((product.comparePrice - currentPrice) / product.comparePrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed">{product.description}</p>

            {/* Color selector */}
            {colors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const v = product.variants.find((v) => v.color === color)
                        setSelectedVariant(v ?? null)
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedVariant?.color === color
                          ? 'text-white ring-2 ring-indigo-500'
                          : 'glass glass-hover text-gray-300'
                      }`}
                      style={selectedVariant?.color === color ? { background: 'var(--color-primary-700)' } : undefined}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        const v = product.variants.find((v) => v.size === size && v.color === selectedVariant?.color)
                        setSelectedVariant(v ?? product.variants.find((v) => v.size === size) ?? null)
                      }}
                      className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${
                        selectedVariant?.size === size
                          ? 'text-white ring-2 ring-indigo-500'
                          : 'glass glass-hover text-gray-300'
                      }`}
                      style={selectedVariant?.size === size ? { background: 'var(--color-primary-700)' } : undefined}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-white">Quantity</span>
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border-glass)' }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >−</button>
                <span className="px-5 text-white font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(inStock ? 10 : 0, q + 1))}
                  className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >+</button>
              </div>
              <span className="text-sm text-gray-500">
                {inStock ? `${selectedVariant?.stock ?? product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <div className="flex-1 magic-button">
                <motion.button
                  {...buttonPress}
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="magic-button-content disabled:opacity-50 disabled:cursor-not-allowed"
                  id="product-add-cart"
                >
                  <ShoppingBag size={18} />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </motion.button>
              </div>
              <motion.button
                variants={scalePop}
                animate={heartState}
                onClick={handleWishlist}
                className="p-4 rounded-2xl glass glass-hover transition-all"
                aria-label="Wishlist"
              >
                <Heart
                  size={20}
                  fill={inWishlist ? '#ec4899' : 'none'}
                  stroke={inWishlist ? '#ec4899' : 'currentColor'}
                />
              </motion.button>
              <button className="p-4 rounded-2xl glass glass-hover transition-all" aria-label="Share">
                <Share2 size={20} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, text: 'Free shipping' },
                { icon: RotateCcw, text: '30-day returns' },
                { icon: Shield, text: 'Secure checkout' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center glass">
                  <Icon size={16} className="text-indigo-400" />
                  <span className="text-xs text-gray-400">{text}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs text-gray-400 glass"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related && related.data.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-black text-white mb-8">You may also like</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {related.data.slice(0, 4).map((p, i) => (
                <motion.div key={p.id} variants={cardVariants} custom={i}>
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </AnimatedPage>
  )
}
