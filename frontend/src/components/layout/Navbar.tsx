import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Search, Menu, X, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { NAV_LINKS, APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location])

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'glass shadow-card' : 'bg-transparent'
        )}
      >
        <div className="page-container">
          <nav className="flex items-center justify-between h-[8vh] min-h-[64px] max-h-[80px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
              >
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--color-gray-50)' }}>
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
                        ? 'text-indigo-400'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 h-px bg-indigo-500 transition-all duration-300',
                        location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </motion.button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    style={{ background: 'var(--color-secondary-500)' }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCart}
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Cart"
                id="cart-trigger"
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                      style={{ background: 'var(--color-primary-500)' }}
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Auth */}
              {isAuthenticated ? (
                <Link
                  to={user?.role === 'ADMIN' ? '/admin' : '/profile'}
                  className="hidden md:flex items-center gap-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User size={20} />
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200"
                  style={{ background: 'var(--color-primary-600)' }}
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden border-t"
              style={{ borderColor: 'var(--border-glass)' }}
            >
              <div className="page-container py-4 flex flex-col gap-3 glass backdrop-blur-2xl">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-base font-medium text-gray-300 hover:text-white py-2 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t" style={{ borderColor: 'var(--border-glass)' }}>
                  {isAuthenticated ? (
                    <Link to="/profile" className="text-sm text-gray-400">My Account</Link>
                  ) : (
                    <Link
                      to="/auth/login"
                      className="w-full flex items-center justify-center py-3 rounded-lg text-sm font-medium text-white"
                      style={{ background: 'var(--color-primary-600)' }}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[70] px-4"
            >
              <div className="glass backdrop-blur-2xl rounded-2xl p-2 shadow-[0_0_50px_rgba(99,102,241,0.15)] border border-indigo-500/20">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Search size={20} className="text-gray-400 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
                      }
                    }}
                    className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
