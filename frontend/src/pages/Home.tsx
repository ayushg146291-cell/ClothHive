import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import AnimatedPage from '@/components/common/AnimatedPage'
import ProductCard from '@/components/product/ProductCard'
import ProductSkeleton from '@/components/product/ProductSkeleton'
import { fadeUp } from '@/lib/animations'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product.service'
import { Button } from '@/components/ui/button'
import { SplitText } from '@/components/magic/SplitText'

export default function Home() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productService.getFeatured,
  })

  return (
    <AnimatedPage>
      <div className="flex flex-col bg-background min-h-screen">
        {/* Stark Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-safe-nav">
          <div className="page-container flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <SplitText 
                text="ESSENTIALS."
                className="h1 text-foreground mb-4 tracking-tighter"
                delay={20}
              />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="p-fluid max-w-xl mx-auto mb-12 text-muted-foreground uppercase tracking-widest text-sm"
            >
              Curated minimal wear for the modern purist.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link to="/shop">
                <Button size="lg" className="h-16 px-12 text-sm font-bold uppercase tracking-widest rounded-none bg-foreground text-background hover:bg-muted-foreground transition-colors duration-300">
                  Shop Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="page-container py-section border-t border-border">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-4">Latest Arrivals</h2>
            </motion.div>
            <Link to="/shop?isFeatured=true" className="group flex items-center text-sm font-bold uppercase tracking-widest hover:text-muted-foreground transition-colors">
              View All <MoveRight className="ml-4 h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {!isLoading && (!featured || featured.length === 0) ? (
            <div className="py-32 text-center border border-border">
              <p className="text-xl font-bold text-foreground uppercase tracking-widest mb-4">No pieces available</p>
              <p className="text-muted-foreground text-sm uppercase tracking-widest">Our collection is being curated.</p>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
                : featured?.slice(0, 4).map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
            </div>
          )}
        </section>

        {/* Minimal CTA Banner */}
        <section className="page-container py-section border-t border-border">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center py-24"
          >
            <h2 className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter mb-8">
              Join The List
            </h2>
            <Link to="/auth/signup">
              <Button size="lg" className="h-16 px-12 text-sm font-bold uppercase tracking-widest rounded-none bg-foreground text-background hover:bg-muted-foreground transition-colors duration-300">
                Become a Member
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </AnimatedPage>
  )
}
