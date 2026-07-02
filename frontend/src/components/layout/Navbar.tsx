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
          'fixed top-4 left-0 right-0 z-50 transition-all duration-300 w-full px-4 md:px-8 flex justify-center pointer-events-none'
        )}
      >
        <div className={cn(
          'w-full max-w-5xl pointer-events-auto transition-all duration-500',
          scrolled ? 'glass-pill px-6 py-1' : 'bg-transparent px-2 py-2'
        )}>
          <nav className="flex items-center justify-between min-h-[56px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                <span className="text-white font-medium text-sm">C</span>
              </div>
              <span className="font-semibold text-lg tracking-tight text-foreground">
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      'text-sm font-medium transition-colors duration-200 relative group',
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300',
                        location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <Search size={20} />
              </Button>

              <Link to="/wishlist" className="relative">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50">
                  <Heart size={20} />
                </Button>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white bg-secondary"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              <div className="relative">
                <Button variant="ghost" size="icon" onClick={openCart} className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50">
                  <ShoppingBag size={20} />
                </Button>
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white bg-primary"
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {isAuthenticated ? (
                <Link to={user?.role === 'ADMIN' ? '/admin' : '/profile'} className="hidden md:flex">
                  <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50">
                    <User size={20} />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth/login" className="hidden md:flex ml-2">
                  <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-medium px-6 shadow-lg shadow-primary/25">
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Trigger via Shadcn Sheet */}
              <div className="md:hidden ml-1 flex items-center">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Menu size={24} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] glass border-r-border bg-background/95 backdrop-blur-xl">
                    <SheetHeader>
                      <SheetTitle className="text-left text-primary font-bold text-xl">{APP_NAME}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 flex flex-col gap-4">
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "text-lg font-medium transition-colors",
                            location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="mt-6 pt-6 border-t border-border flex flex-col gap-4">
                        {isAuthenticated ? (
                          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground font-medium">My Account</Link>
                        ) : (
                          <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl text-white">Sign In</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </nav>
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
              className="fixed inset-0 bg-background/70 z-[60] backdrop-blur-md"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl z-[70]"
            >
              <div className="glass rounded-2xl p-2 shadow-xl border-primary/20">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Search size={20} className="text-primary shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for premium fashion..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
                      }
                    }}
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-lg font-sans"
                  />
                  <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground rounded-full">
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
