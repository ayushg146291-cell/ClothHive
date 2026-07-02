import AnimatedPage from '@/components/common/AnimatedPage'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/constants'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OrderHistory() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  })

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-[5vh]">
        <h1 className="text-4xl font-black text-foreground mb-8">Order History</h1>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : !orders?.length ? (
          <div className="text-center py-24">
            <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl font-bold text-foreground mb-2">No orders yet</p>
            <p className="text-muted-foreground mb-6">Your order history will appear here.</p>
            <Link to="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-3 font-bold shadow-lg shadow-primary/20">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="glass rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Order #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold" 
                    style={{ background: `${ORDER_STATUS_COLORS[order.status]}20`, color: ORDER_STATUS_COLORS[order.status] }}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground font-semibold">{order.items.length} item(s)</p>
                  <p className="text-foreground font-bold tabular-nums">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
