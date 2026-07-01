import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw } from 'lucide-react'
import AnimatedPage from '@/components/common/AnimatedPage'
import ProductCard from '@/components/product/ProductCard'
import ProductSkeleton from '@/components/product/ProductSkeleton'
import { staggerContainer, cardVariants, fadeUp } from '@/lib/animations'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product.service'

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $75. Fast & reliable.' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free returns.' },
  { icon: Shield, title: 'Secure Payment', desc: 'Your data is always protected.' },
  { icon: Sparkles, title: 'Quality Assured', desc: 'Curated premium pieces only.' },
]

const categories = [
  { name: "Women's", slug: 'womens', image: 'https://placehold.co/400x500/1e1b4b/6366f1?text=Women', gradient: 'from-indigo-900 to-purple-900' },
  { name: "Men's", slug: 'mens', image: 'https://placehold.co/400x500/1a1a2e/ec4899?text=Men', gradient: 'from-gray-900 to-indigo-950' },
  { name: 'Accessories', slug: 'accessories', image: 'https://placehold.co/400x500/0f0f1a/a855f7?text=Acc', gradient: 'from-purple-900 to-pink-950' },
]

export default function Home() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productService.getFeatured,
  })

  return (
    <AnimatedPage>
      <div className="flex flex-col gap-[clamp(4rem,8vw,8rem)] pb-[8vh]">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'var(--color-primary-500)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: 'var(--color-secondary-500)' }}
        />

        <div className="page-container relative z-10 pt-safe-nav pb-[8vh]">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 glass"
              style={{ color: 'var(--color-primary-400)' }}
            >
              <Sparkles size={14} />
              New Summer Collection 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[clamp(3.5rem,7vw,5.5rem)] font-black text-white leading-tight mb-6"
            >
              Dress for the{' '}
              <span className="gradient-text">life you want</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-xl"
            >
              Premium fashion crafted for the modern individual. Discover pieces that speak your style — curated, sustainable, and built to last.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-4"
            >
              <div className="magic-button">
                <Link
                  to="/shop"
                  className="magic-button-content"
                  id="hero-shop-btn"
                >
                  Shop Now
                  <ArrowRight size={18} />
                </Link>
              </div>
              <Link
                to="/shop?sort=newest"
                className="btn-glass"
              >
                New Arrivals
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Banner (Progressive Disclosure) */}
      <section className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-between gap-8 p-8 md:p-12 rounded-3xl"
          style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-glass)' }}
        >
          {[['50K+', 'Happy Customers'], ['2K+', 'Premium Products'], ['4.9★', 'Average Rating']].map(([num, label]) => (
            <div key={label} className="text-center md:text-left flex-1 min-w-[150px]">
              <p className="text-4xl md:text-5xl font-black text-white mb-2">{num}</p>
              <p className="text-sm md:text-base text-gray-400">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Categories */}
      <section className="page-container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-3xl font-black text-white mb-2">Shop by Category</h2>
          <p className="text-gray-400 mb-10">Find your perfect style in our curated collections</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' }}
        >
          {categories.map((cat, i) => (
            <motion.div key={cat.slug} variants={cardVariants} custom={i}>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/5]"
                id={`category-${cat.slug}`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 backdrop-blur-md bg-gray-950/40 border-t border-white/10 transition-all duration-500 group-hover:bg-gray-950/60 group-hover:backdrop-blur-xl">
                  <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                  <span className="text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    Explore →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="page-container">
        <div className="flex items-end justify-between mb-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-2">Featured Picks</h2>
            <p className="text-gray-400">Hand-picked pieces our team is obsessed with</p>
          </motion.div>
          <Link
            to="/shop?isFeatured=true"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {!isLoading && (!featured || featured.length === 0) ? (
          <div className="py-24 text-center border border-dashed border-gray-700 rounded-3xl glass">
            <p className="text-2xl font-bold text-white mb-2">New drops coming soon!</p>
            <p className="text-gray-400">We're meticulously curating the next batch of premium fashion.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' }}>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : featured?.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="page-container">
        <div
          className="grid gap-6 p-8 rounded-3xl"
          style={{ 
            background: 'var(--surface-glass)', 
            border: '1px solid var(--border-glass)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))' 
          }}
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3 p-4"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-glass)' }}
              >
                <feat.icon size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-sm">{feat.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="page-container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
          style={{ background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 50%, #500724 100%)' }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: 'var(--color-primary-500)' }}
          />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 relative z-10">
            Get 20% off your first order
          </h2>
          <p className="text-gray-300 mb-8 relative z-10">
            Join ClothHive and unlock exclusive member perks from day one.
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-indigo-900 bg-white hover:bg-gray-100 transition-all text-base relative z-10"
            id="signup-cta-btn"
          >
            Create Account
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
      </div>
    </AnimatedPage>
  )
}
