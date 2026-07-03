import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'

const cartDrawerVariants = {
  closed: { x: '100%', transition: { type: 'spring', stiffness: 400, damping: 40 } },
  open: { x: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } },
  exit: { x: '100%', transition: { type: 'spring', stiffness: 400, damping: 40 } }
}

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
  exit: { opacity: 0 }
}

const cartItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 }
}

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
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[80]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            variants={cartDrawerVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full max-w-md z-[90] flex flex-col bg-background border-l-2 border-foreground"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b-2 border-foreground">
              <div className="flex items-center gap-4">
                <h2 className="font-black text-foreground text-2xl uppercase tracking-tighter">Cart</h2>
                {items.length > 0 && (
                  <span className="w-6 h-6 flex items-center justify-center bg-foreground text-background text-xs font-bold">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-foreground hover:text-muted-foreground transition-colors"
                aria-label="Close cart"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-8">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-6 py-16"
                >
                  <ShoppingBag size={48} strokeWidth={1.5} className="text-muted-foreground" />
                  <div>
                    <p className="text-foreground font-black uppercase tracking-tighter text-3xl mb-2">Cart is empty</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-8 h-14 bg-foreground text-background font-bold uppercase tracking-widest text-xs transition-colors hover:bg-muted-foreground"
                  >
                    CONTINUE SHOPPING
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  <ul className="space-y-6 mt-4">
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        variants={cartItemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                        className="flex gap-6 pb-6 border-b border-border group"
                      >
                        {/* Product image */}
                        <Link to={`/products/${item.product.slug}`} onClick={closeCart}>
                          <img
                            src={item.product.images[0] || 'https://placehold.co/80x100/18181B/FFFFFF?text=Item'}
                            alt={item.product.name}
                            className="w-20 h-28 object-cover shrink-0 border border-border"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/products/${item.product.slug}`}
                              onClick={closeCart}
                              className="text-sm font-black uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors line-clamp-2 leading-snug"
                            >
                              {item.product.name}
                            </Link>
                            {item.variant && (
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                                {item.variant.size && `SIZE: ${item.variant.size}`}
                                {item.variant.color && ` · ${item.variant.color}`}
                              </p>
                            )}
                            <p className="text-sm font-bold tracking-widest text-foreground mt-2">
                              {formatCurrency(item.variant?.price ?? item.product.price)}
                            </p>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-border h-10">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} strokeWidth={2.5} />
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
              <div className="border-t-2 border-foreground p-8 bg-background">
                <div className="space-y-4 text-xs font-bold uppercase tracking-widest mb-8">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground">{formatCurrency(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated tax (8%)</span>
                    <span className="text-foreground">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-foreground">FREE</span>
                  </div>
                  <div className="flex justify-between font-black text-xl tracking-tighter text-foreground pt-4 border-t border-border">
                    <span>TOTAL</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full h-14 bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:bg-muted-foreground transition-colors mb-4"
                  id="checkout-btn"
                >
                  Checkout
                  <ArrowRight size={16} strokeWidth={2.5} className="ml-2" />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full h-14 border border-foreground text-foreground font-bold uppercase tracking-widest text-xs hover:bg-muted transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
