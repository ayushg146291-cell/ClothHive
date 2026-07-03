import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ShoppingBag, Heart, Search, Menu, User, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { NAV_LINKS, APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const openCart = useCartStore((s) => s.openCart)
  const totalItems = useCartStore((s) => s.totalItems())
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setSearchOpen(false)
  }, [location])

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full bg-background border-b',
          scrolled ? 'border-border py-4' : 'border-transparent py-6'
        )}
      >
        <div className="w-full px-4 md:px-12 mx-auto flex items-center justify-between min-h-[40px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase text-foreground">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    'text-xs font-bold uppercase tracking-widest transition-colors duration-200 relative group',
                    location.pathname === link.href
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-2 left-0 h-[2px] bg-foreground transition-all duration-300',
                      location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="text-foreground hover:text-muted-foreground transition-colors">
              <Search size={20} strokeWidth={2.5} />
            </button>

            <Link to="/wishlist" className="relative text-foreground hover:text-muted-foreground transition-colors">
              <Heart size={20} strokeWidth={2.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 w-5 h-5 rounded-none text-[10px] font-bold flex items-center justify-center text-background bg-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button onClick={openCart} className="text-foreground hover:text-muted-foreground transition-colors">
                <ShoppingBag size={20} strokeWidth={2.5} />
              </button>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-3 w-5 h-5 rounded-none text-[10px] font-bold flex items-center justify-center text-background bg-foreground"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <Link to={user?.role === 'ADMIN' ? '/admin' : '/profile'} className="hidden md:flex text-foreground hover:text-muted-foreground transition-colors ml-2">
                <User size={20} strokeWidth={2.5} />
              </Link>
            ) : (
              <Link to="/auth/login" className="hidden md:flex ml-4">
                <Button className="rounded-none bg-foreground hover:bg-muted-foreground text-background font-bold text-xs uppercase tracking-widest px-6 h-10">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Trigger via Shadcn Sheet */}
            <div className="md:hidden ml-2 flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="text-foreground hover:text-muted-foreground transition-colors">
                    <Menu size={24} strokeWidth={2.5} />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[400px] bg-background border-l-border rounded-none p-8">
                  <SheetHeader>
                    <SheetTitle className="text-left font-black text-3xl tracking-tighter uppercase text-foreground">{APP_NAME}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-12 flex flex-col gap-8">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-xl font-bold uppercase tracking-widest transition-colors",
                          location.pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="mt-8 pt-8 border-t border-border flex flex-col gap-6">
                      {isAuthenticated ? (
                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">My Account</Link>
                      ) : (
                        <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full h-14 bg-foreground hover:bg-muted-foreground rounded-none text-background font-bold text-sm uppercase tracking-widest">Sign In</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 z-[60]"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-32 left-0 right-0 w-full z-[70] px-4 md:px-12"
            >
              <div className="max-w-4xl mx-auto flex items-center border-b-2 border-foreground pb-4">
                <Search size={32} strokeWidth={3} className="text-foreground shrink-0 mr-6" />
                <input
                  autoFocus
                  type="text"
                  placeholder="SEARCH COLLECTION..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
                    }
                  }}
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-3xl md:text-5xl font-black uppercase tracking-tighter"
                />
                <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground ml-6">
                  <X size={32} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
