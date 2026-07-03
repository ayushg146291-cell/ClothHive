import AnimatedPage from '@/components/common/AnimatedPage'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SplitText } from '@/components/magic/SplitText'

export default function OrderHistory() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  })

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-24 min-h-screen">
        <SplitText 
          text="ORDERS"
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground mb-16"
          delay={20}
        />
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse border border-border" />)}
          </div>
        ) : !orders?.length ? (
          <div className="text-center py-32 border border-border bg-background">
            <Package size={48} strokeWidth={1.5} className="mx-auto mb-8 text-muted-foreground" />
            <p className="text-2xl font-black uppercase tracking-tighter text-foreground mb-2">No orders yet</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">YOUR ORDER HISTORY WILL APPEAR HERE.</p>
            <Link to="/shop">
              <Button className="h-14 px-12 rounded-none bg-foreground hover:bg-muted-foreground text-background font-bold text-xs uppercase tracking-widest transition-colors">
                START SHOPPING
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border border-border p-8 bg-background flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:border-foreground group">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">ORDER #{order.orderNumber}</p>
                  <p className="text-sm font-black uppercase tracking-tighter text-foreground">{formatDate(order.createdAt)}</p>
                </div>
                
                <div className="flex flex-col md:items-end gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground px-3 py-1 border border-foreground bg-background group-hover:bg-foreground group-hover:text-background transition-colors w-max">
                    {order.status}
                  </span>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{order.items.length} ITEM(S)</p>
                    <p className="text-lg font-black tracking-widest text-foreground">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}
