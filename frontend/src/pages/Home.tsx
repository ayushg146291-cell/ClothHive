import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Star } from 'lucide-react'
import AnimatedPage from '@/components/common/AnimatedPage'
import ProductCard from '@/components/product/ProductCard'
import ProductSkeleton from '@/components/product/ProductSkeleton'
import { staggerContainer, cardVariants, fadeUp } from '@/lib/animations'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product.service'
import { SparklesCore } from '@/components/ui/sparkles'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import { Marquee } from '@/components/ui/marquee'
import { Button } from '@/components/ui/button'
import { ShinyText } from '@/components/magic/ShinyText'
import { TiltCard } from '@/components/magic/TiltCard'
import { SplitText } from '@/components/magic/SplitText'
import { Magnetic } from '@/components/magic/Magnetic'
import { AuroraBackground } from '@/components/magic/AuroraBackground'

const features = [
  { 
    name: 'Free Shipping', 
    description: 'On orders over ₹1000. Fast & reliable.',
    Icon: Truck,
    href: '/shipping',
    cta: 'Learn More',
    className: 'col-span-3 lg:col-span-1',
    background: <div className="absolute inset-0 bg-primary/10 blur-xl transition-all duration-300 group-hover:bg-primary/20" />
  },
  { 
    name: 'Easy Returns', 
    description: '30-day hassle-free returns.',
    Icon: RotateCcw,
    href: '/returns',
    cta: 'View Policy',
    className: 'col-span-3 lg:col-span-1',
    background: <div className="absolute inset-0 bg-secondary/10 blur-xl transition-all duration-300 group-hover:bg-secondary/20" />
  },
  { 
    name: 'Secure Payment', 
    description: 'Your data is always protected.',
    Icon: Shield,
    href: '/security',
    cta: 'Read More',
    className: 'col-span-3 lg:col-span-1',
    background: <div className="absolute inset-0 bg-accent/10 blur-xl transition-all duration-300 group-hover:bg-accent/20" />
  },
]

const reviews = [
  { name: "Aarav S.", body: "The quality of these clothes is absolutely insane for the price. The shipping was also incredibly fast to Mumbai.", rating: 5 },
  { name: "Priya M.", body: "I've completely overhauled my wardrobe using ClothHive. The aesthetic of their site perfectly matches their clothing.", rating: 5 },
  { name: "Rohan K.", body: "Customer service is top notch. Had to exchange a size and it was completely hassle-free.", rating: 5 },
  { name: "Meera T.", body: "Stunning pieces! I wore their summer collection dress to a party and got so many compliments.", rating: 5 },
  { name: "Kunal D.", body: "Premium fashion without the insane markup. I am a customer for life.", rating: 5 },
]

export default function Home() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productService.getFeatured,
  })

  return (
    <AnimatedPage>
      <div className="flex flex-col gap-0 pb-[8vh]">
        {/* Hero Spatial UI */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <AuroraBackground className="w-full h-full flex flex-col items-center justify-center">
          <div className="page-container relative z-10 pt-safe-nav pb-[8vh] flex flex-col items-center text-center">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 glass text-foreground"
              >
                <Sparkles size={14} className="text-muted-foreground" />
                <ShinyText text="New Summer Collection 2026" />
              </motion.div>

              <SplitText 
                text="Live the spatial life."
                className="h1 text-foreground mb-6"
                delay={40}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="p-fluid max-w-2xl mx-auto mb-10 text-muted-foreground"
              >
                Discover our curated collection of premium clothing designed for the modern lifestyle.
                Elevate your everyday look with pieces that make a subtle statement.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Magnetic>
                  <Link to="/shop">
                    <Button size="lg" className="h-14 px-8 text-base rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-2xl">
                      Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </Magnetic>
                <Link to="/lookbook">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full glass-pill border-foreground/20 text-foreground hover:bg-foreground/5">
                    View Lookbook
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
          </AuroraBackground>
        </section>

        {/* Marquee Section */}
        <section className="py-8 bg-muted/20 border-y border-border overflow-hidden">
          <Marquee pauseOnHover className="[--duration:30s]">
            {['VOGUE', 'GQ', 'HYPEBEAST', 'HIGHSNOBIETY', 'ESQUIRE', 'ELLE', 'COMPLEX', 'GRAILED'].map((brand) => (
              <div key={brand} className="mx-8 text-2xl font-bold text-muted-foreground/30 tracking-widest uppercase">
                {brand}
              </div>
            ))}
          </Marquee>
        </section>

        {/* Bento Grid Features */}
        <section className="page-container py-section">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="h2 text-foreground mb-4">Why Choose ClothHive?</h2>
            <p className="p-fluid text-muted-foreground">Experience premium shopping with our world-class services.</p>
          </motion.div>

          <BentoGrid className="lg:grid-rows-1">
            {features.map((feature) => (
              <TiltCard key={feature.name} glareEnable={true} className="rounded-3xl">
                <div className="glass h-full rounded-3xl p-6 hover:bg-white/10 transition-colors">
                  <BentoCard {...feature} />
                </div>
              </TiltCard>
            ))}
          </BentoGrid>
        </section>

        {/* Featured Products */}
        <section className="page-container py-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="h2 text-foreground mb-2">Featured Picks</h2>
              <p className="p-fluid text-muted-foreground">Hand-picked pieces our team is obsessed with</p>
            </motion.div>
            <Link to="/shop?isFeatured=true">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full px-6">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {!isLoading && (!featured || featured.length === 0) ? (
            <div className="py-24 text-center glass rounded-3xl">
              <p className="text-2xl font-medium text-foreground mb-2">New drops coming soon!</p>
              <p className="text-muted-foreground">We're meticulously curating the next batch of premium fashion.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
                : featured?.slice(0, 4).map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
            </div>
          )}
        </section>

        {/* Testimonials Marquee */}
        <section className="py-section relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/30" />
          <div className="page-container relative z-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <h2 className="h2 text-foreground mb-4">Loved by Thousands</h2>
              <p className="p-fluid text-muted-foreground">Don't just take our word for it.</p>
            </motion.div>

            <Marquee pauseOnHover className="[--duration:40s]">
              {reviews.map((review, i) => (
                <div key={i} className="glass w-[350px] p-6 rounded-2xl mx-4 flex flex-col gap-4 border border-border">
                  <div className="flex text-accent">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground flex-1">"{review.body}"</p>
                  <p className="font-bold text-foreground">— {review.name}</p>
                </div>
              ))}
            </Marquee>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="page-container py-section">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center border border-border bg-muted/30"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
            <h2 className="h2 text-foreground mb-4 relative z-10">
              Get 20% off your first order
            </h2>
            <p className="p-fluid text-muted-foreground mb-8 relative z-10 max-w-2xl mx-auto">
              Join ClothHive and unlock exclusive member perks from day one.
            </p>
            <Link to="/auth/signup" className="relative z-10">
              <Button className="h-14 px-8 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
                Create Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </AnimatedPage>
  )
}
