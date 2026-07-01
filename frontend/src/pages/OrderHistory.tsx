import AnimatedPage from '@/components/common/AnimatedPage'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/constants'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'

export default function OrderHistory() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  })

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-[5vh]">
        <h1 className="text-4xl font-black text-white mb-8">Order History</h1>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}
          </div>
        ) : !orders?.length ? (
          <div className="text-center py-24">
            <Package size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-xl font-bold text-white mb-2">No orders yet</p>
            <p className="text-gray-400 mb-6">Your order history will appear here.</p>
            <Link to="/shop" className="magic-button inline-flex px-8 py-3 rounded-xl text-sm font-bold text-white shadow-glow">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="glass rounded-2xl p-6 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-[0_0_15px_currentColor]" style={{ background: ORDER_STATUS_COLORS[order.status], color: ORDER_STATUS_COLORS[order.status] }}>
                    <span className="text-white mix-blend-difference">{ORDER_STATUS_LABELS[order.status]}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold">{order.items.length} item(s)</p>
                  <p className="text-white font-bold">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
