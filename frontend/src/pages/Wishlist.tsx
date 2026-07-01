import AnimatedPage from '@/components/common/AnimatedPage'
import ProductCard from '@/components/product/ProductCard'
import { useWishlistStore } from '@/store/wishlistStore'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Wishlist() {
  const { items } = useWishlistStore()
  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-[5vh]">
        <h1 className="text-4xl font-black text-white mb-2">Wishlist</h1>
        <p className="text-gray-400 mb-10">{items.length} saved items</p>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center glass shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/5 animate-pulse">
              <Heart size={36} className="text-gray-500" />
            </div>
            <p className="text-white font-bold text-xl mt-2">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm">Save items you love for later.</p>
            <Link to="/shop" className="magic-button mt-4 px-8 py-3 rounded-xl text-sm font-bold text-white shadow-glow">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
