import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import AnimatedPage from '@/components/common/AnimatedPage'
import { scalePop, fadeUp } from '@/lib/animations'
import { api } from '@/services/api'
import { Order } from '@/types'

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      api.get(`/orders/${id}`)
        .then((res) => {
          setOrder(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id])

  if (loading) {
    return (
      <AnimatedPage>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="min-h-[80vh] flex items-center justify-center py-20 page-container">
        <div className="max-w-md w-full text-center">
          <motion.div
            variants={scalePop}
            initial="idle"
            animate="pop"
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}
          >
            <CheckCircle2 size={48} className="text-white" />
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <h1 className="text-4xl font-black text-white mb-4">Order Confirmed!</h1>
            <p className="text-gray-400 mb-2">
              Thank you for your purchase. Your order <span className="text-white font-medium">#{order?.orderNumber || id}</span> has been received.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              We'll send you an email confirmation with tracking details once your items ship.
            </p>
            <div className="p-4 rounded-xl text-sm text-gray-300 glass border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)] mb-8 inline-block text-left mx-auto">
              <p className="font-bold text-white mb-1">Payment Method: Cash on Delivery</p>
              <p>Please have the exact amount ready when the delivery arrives.</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="flex flex-col gap-3">
            <Link
              to={`/profile?tab=orders`}
              className="magic-button w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white shadow-glow"
            >
              View Order Details
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/shop"
              className="w-full py-4 rounded-xl font-medium text-gray-300 hover:text-white glass glass-hover transition-all"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  )
}
