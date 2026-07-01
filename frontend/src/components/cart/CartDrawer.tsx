import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { cartDrawerVariants, backdropVariants, cartItemVariants } from '@/lib/animations'
import { formatCurrency } from '@/lib/utils'

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal } = useCartStore()
  const tax = subtotal() * 0.08
  const total = subtotal() + tax

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            variants={cartDrawerVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full max-w-md z-[90] flex flex-col bg-gray-950/60 backdrop-blur-3xl shadow-[-10px_0_40px_rgba(0,0,0,0.5)] border-l border-white/10"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b border-white/5"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-indigo-400" />
                <h2 className="font-bold text-white text-lg">Your Cart</h2>
                {items.length > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: 'var(--color-primary-600)' }}
                  >
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-[0_0_10px_rgba(0,0,0,0)] hover:shadow-glow"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-4 py-16"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                    style={{ background: 'var(--surface-glass)' }}
                  >
                    <ShoppingBag size={32} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1 text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm">Add some items to get started</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="magic-button mt-4 px-8 py-3 rounded-xl text-sm font-bold text-white shadow-glow"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        variants={cartItemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                        className="flex gap-4 p-3 rounded-2xl glass glass-hover group"
                      >
                        {/* Product image */}
                        <Link to={`/products/${item.product.slug}`} onClick={closeCart}>
                          <img
                            src={item.product.images[0] || 'https://placehold.co/80x100/1e293b/6366f1?text=Item'}
                            alt={item.product.name}
                            className="w-16 h-20 object-cover rounded-lg shrink-0"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors line-clamp-2 leading-snug"
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.variant.size && `Size: ${item.variant.size}`}
                              {item.variant.color && ` · ${item.variant.color}`}
                            </p>
                          )}
                          <p className="text-sm font-bold text-indigo-400 mt-1">
                            {formatCurrency(item.variant?.price ?? item.product.price)}
                          </p>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div
                              className="flex items-center rounded-lg overflow-hidden"
                              style={{ border: '1px solid var(--border-glass)' }}
                            >
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2.5 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-3 text-sm font-semibold text-white min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2.5 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </AnimatePresence>
              )}
            </div>

            {/* Footer — Totals + CTA */}
            {items.length > 0 && (
              <div
                className="border-t p-6 space-y-4"
                style={{ borderColor: 'var(--border-glass)', background: 'var(--surface-glass)' }}
              >
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">{formatCurrency(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Estimated tax (8%)</span>
                    <span className="text-white">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400 font-medium">Free</span>
                  </div>
                  <div
                    className="flex justify-between font-bold text-base text-white pt-2 border-t"
                    style={{ borderColor: 'var(--border-glass)' }}
                  >
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="magic-button flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white shadow-glow"
                  id="checkout-btn"
                >
                  Checkout
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full py-3 rounded-xl text-sm text-gray-400 hover:text-white glass-hover glass transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
