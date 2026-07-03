import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, Share2, Truck, Shield, RotateCcw, ImagePlus, X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnimatedPage from '@/components/common/AnimatedPage'
import ProductCard from '@/components/product/ProductCard'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatCurrency } from '@/lib/utils'
import { staggerContainer, fadeUp } from '@/lib/animations'
import type { ProductVariant } from '@/types'
import { toast } from 'sonner'
import { useSEO } from '@/hooks/useSEO'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { SplitText } from '@/components/magic/SplitText'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const { toggle, isInWishlist } = useWishlistStore()
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')
  const [reviewImages, setReviewImages] = useState<File[]>([])
  
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
    queryFn: () => productService.getProducts({ categoryId: product?.categoryId, limit: 6 }),
    enabled: !!product,
  })

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="page-container pt-safe-nav pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-muted animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted animate-pulse" />
              <div className="h-6 w-1/4 bg-muted animate-pulse" />
              <div className="h-16 bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </AnimatedPage>
    )
  }

  if (!product) return null

  const inWishlist = isInWishlist(product.id)
  const images = product.images?.length > 0 ? product.images : ['https://placehold.co/600x700/18181B/FFFFFF?text=Shoppe']
  const sizes = [...new Set(product.variants?.filter((v) => v.size).map((v) => v.size!) || [])]
  const colors = [...new Set(product.variants?.filter((v) => v.color).map((v) => v.color!) || [])]
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
    if (!inWishlist) {
      toast.success('Added to wishlist')
    }
  }

  const addReviewMutation = useMutation({
    mutationFn: (formData: FormData) => productService.addReview(product.id, formData),
    onSuccess: () => {
      toast.success('Your review has been submitted and is pending admin approval.')
      queryClient.invalidateQueries({ queryKey: ['product', slug] })
      setReviewRating(5)
      setReviewTitle('')
      setReviewBody('')
      setReviewImages([])
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    }
  })

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewRating) return toast.error('Please select a rating')
    
    const formData = new FormData()
    formData.append('rating', reviewRating.toString())
    if (reviewTitle) formData.append('title', reviewTitle)
    if (reviewBody) formData.append('body', reviewBody)
    reviewImages.forEach((img) => formData.append('images', img))
    
    addReviewMutation.mutate(formData)
  }

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-24 min-h-screen bg-background">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-12">
          <button onClick={() => navigate(-1)} className="hover:text-foreground transition-colors">← Back</button>
          <span>/</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">{product.category.name}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24 items-start">
          {/* Images Gallery */}
          <div className="space-y-4 lg:sticky lg:top-[120px]">
            <div className="relative aspect-[3/4] bg-muted overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.name}
                  fetchpriority="high"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background border border-border hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background border border-border hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-foreground' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-10 pt-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4 block">
                {product.category.name}
              </span>
              
              <SplitText 
                text={product.name}
                className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase mb-6 leading-none"
                delay={20}
              />

              {/* Rating */}
              {(product.avgRating ?? 0) > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        strokeWidth={2.5}
                        fill={i < Math.round(product.avgRating ?? 0) ? 'currentColor' : 'none'}
                        className="text-foreground"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    ({product.reviewCount} REVIEWS)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-end gap-6 mt-8 mb-8 border-b border-border pb-8">
                <span className="text-4xl font-black tracking-widest text-foreground">{formatCurrency(currentPrice)}</span>
                {product.comparePrice && (
                  <div className="flex flex-col gap-1 mb-1">
                    <span className="text-xl font-bold tracking-widest text-muted-foreground line-through">{formatCurrency(product.comparePrice)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-medium tracking-wide leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-8 py-8 border-y border-border">
              {/* Color selector */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-4">Color</h3>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          const v = product.variants.find((v) => v.color === color)
                          setSelectedVariant(v ?? null)
                        }}
                        className={`h-12 px-6 text-xs font-bold uppercase tracking-widest transition-all border ${
                          selectedVariant?.color === color
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-background text-foreground border-border hover:border-foreground'
                        }`}
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
                  <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-4">Size</h3>
                  <div className="flex flex-wrap gap-4">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          const v = product.variants.find((v) => v.size === size && v.color === selectedVariant?.color)
                          setSelectedVariant(v ?? product.variants.find((v) => v.size === size) ?? null)
                        }}
                        className={`h-12 w-16 text-xs font-bold uppercase tracking-widest transition-all border ${
                          selectedVariant?.size === size
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-background text-foreground border-border hover:border-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Container */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-foreground">Quantity</span>
                <div className="flex items-center border border-border h-12">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-12 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                  >−</button>
                  <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(inStock ? 10 : 0, q + 1))}
                    className="w-12 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                  >+</button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 h-16 rounded-none bg-foreground text-background hover:bg-muted-foreground text-sm font-black uppercase tracking-widest transition-colors"
                >
                  <ShoppingBag size={18} className="mr-3" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className="h-16 w-16 rounded-none border-border hover:border-foreground transition-colors"
                >
                  <Heart
                    size={20}
                    strokeWidth={2.5}
                    fill={inWishlist ? 'currentColor' : 'none'}
                    className={inWishlist ? 'text-foreground' : 'text-foreground'}
                  />
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 w-16 rounded-none border-border hover:border-foreground transition-colors"
                >
                  <Share2 size={20} strokeWidth={2.5} className="text-foreground" />
                </Button>
              </div>
              
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mt-2">
                {inStock ? `${selectedVariant?.stock ?? product.stock} IN STOCK` : 'CURRENTLY UNAVAILABLE'}
              </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              {[
                { icon: Truck, text: 'Free shipping' },
                { icon: RotateCcw, text: '30-day returns' },
                { icon: Shield, text: 'Secure checkout' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-3 text-center">
                  <Icon size={24} strokeWidth={2} className="text-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-32 pt-24 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
            
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-12">
              <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase mb-12">Reviews</h2>
              
              {(!product.reviews || product.reviews.length === 0) ? (
                <div className="p-12 text-center border border-border">
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    NO REVIEWS YET. BE THE FIRST TO REVIEW THIS PRODUCT.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {product.reviews?.map((review) => (
                    <div key={review.id} className="pb-12 border-b border-border space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center font-black text-lg uppercase">
                            {review.user?.name?.[0] || 'A'}
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-widest text-foreground">{review.user?.name || 'Anonymous'}</p>
                            <p className="text-xs font-bold tracking-widest text-muted-foreground mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={16} strokeWidth={2.5} fill={i < review.rating ? 'currentColor' : 'none'} className="text-foreground" />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {review.title && <h4 className="text-sm font-black uppercase tracking-widest text-foreground">{review.title}</h4>}
                        {review.body && <p className="text-sm font-medium tracking-wide text-muted-foreground leading-relaxed">{review.body}</p>}
                      </div>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                          {review.images.map((img, i) => (
                            <img key={i} src={img} alt="Review attachment" className="h-32 w-32 object-cover border border-border" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write Review Form */}
            <div>
              <div className="sticky top-[120px] p-8 border border-border bg-background">
                <h3 className="text-xl font-black text-foreground uppercase tracking-widest mb-8">Write a Review</h3>
                
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-8">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-4">Rating</label>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewRating(i + 1)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110 text-foreground"
                          >
                            <Star size={24} strokeWidth={2.5} fill={i < reviewRating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-4">Title (Optional)</label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full h-12 bg-background border border-border px-4 text-foreground outline-none focus:border-foreground transition-colors font-medium text-sm"
                        placeholder="SUM UP YOUR EXPERIENCE"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-4">Review (Optional)</label>
                      <textarea
                        value={reviewBody}
                        onChange={(e) => setReviewBody(e.target.value)}
                        rows={4}
                        className="w-full bg-background border border-border p-4 text-foreground outline-none focus:border-foreground transition-colors resize-none font-medium text-sm"
                        placeholder="WHAT DID YOU LIKE OR DISLIKE?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-4">Add Photos</label>
                      <div className="flex flex-wrap gap-4">
                        {reviewImages.map((file, i) => (
                          <div key={i} className="relative w-20 h-20 border border-border">
                            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 bg-background border border-foreground text-foreground hover:bg-foreground hover:text-background p-1 transition-colors"
                            >
                              <X size={12} strokeWidth={3} />
                            </button>
                          </div>
                        ))}
                        {reviewImages.length < 5 && (
                          <label className="w-20 h-20 flex items-center justify-center border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground cursor-pointer transition-colors">
                            <ImagePlus size={24} strokeWidth={2} />
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files) {
                                  const newFiles = Array.from(e.target.files)
                                  setReviewImages(prev => [...prev, ...newFiles].slice(0, 5))
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={addReviewMutation.isPending}
                      className="w-full h-14 rounded-none font-black uppercase tracking-widest text-sm bg-foreground hover:bg-muted-foreground text-background transition-colors"
                    >
                      {addReviewMutation.isPending ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">LOGIN TO LEAVE A REVIEW</p>
                    <Button 
                      onClick={() => navigate('/auth/login')} 
                      className="w-full h-12 rounded-none bg-foreground text-background font-bold uppercase tracking-widest text-xs"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related && (related.data?.filter(p => p.id !== product.id)?.length ?? 0) > 0 && (
          <section className="mt-32 pt-24 border-t border-border">
            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-16">You May Also Like</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4"
            >
              {related.data?.filter(p => p.id !== product.id).slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </AnimatedPage>
  )
}
