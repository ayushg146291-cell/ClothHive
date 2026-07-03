import AnimatedPage from '@/components/common/AnimatedPage'
import ProductCard from '@/components/product/ProductCard'
import { useWishlistStore } from '@/store/wishlistStore'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SplitText } from '@/components/magic/SplitText'

export default function Wishlist() {
  const { items } = useWishlistStore()
  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-24 min-h-screen">
        <SplitText 
          text="WISHLIST"
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground mb-4"
          delay={30}
        />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-16 pb-8 border-b border-border">
          {items.length} SAVED ITEMS
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-border">
            <Heart size={48} strokeWidth={1.5} className="text-muted-foreground mb-8" />
            <p className="text-2xl font-black uppercase tracking-tighter text-foreground mb-2">Wishlist is empty</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">SAVE ITEMS YOU LOVE FOR LATER</p>
            <Link to="/shop" className="h-14 px-12 bg-foreground flex items-center justify-center text-background font-bold uppercase tracking-widest text-sm hover:bg-muted-foreground transition-colors">
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
