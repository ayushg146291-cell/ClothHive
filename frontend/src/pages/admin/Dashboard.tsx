import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import { fadeUp } from '@/lib/animations'
import { formatCurrency, formatDate } from '@/lib/utils'
import { api } from '@/services/api'
import { orderService } from '@/services/order.service'
import type { Order } from '@/types'
import { Link } from 'react-router-dom'
import { SplitText } from '@/components/magic/SplitText'

interface StatsData {
  revenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').then(res => res.data),
      orderService.getAllOrders({ limit: 5 }).then(res => res.data || [])
    ])
      .then(([statsData, ordersData]) => {
        setStats(statsData)
        setRecentOrders(ordersData || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-foreground border-t-transparent animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    { title: 'Total Revenue', value: stats.revenue, format: formatCurrency, icon: DollarSign },
    { title: 'Orders', value: stats.totalOrders, format: (v: number) => v.toString(), icon: ShoppingBag },
    { title: 'Customers', value: stats.totalCustomers, format: (v: number) => v.toString(), icon: Users },
    { title: 'Products', value: stats.totalProducts, format: (v: number) => v.toString(), icon: Package },
  ]

  return (
    <AdminLayout>
      
      <SplitText 
        text="OVERVIEW"
        className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-12"
        delay={20}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.1 }}
            className="border border-border p-8 bg-background flex flex-col justify-between h-48 group hover:border-foreground transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 border border-border group-hover:bg-foreground group-hover:text-background text-foreground transition-colors`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{stat.title}</p>
              <p className="text-3xl font-black text-foreground uppercase tracking-tighter">{stat.format(stat.value)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border border-border p-12 bg-background min-h-[400px] flex flex-col justify-center items-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">REVENUE CHART</p>
          <p className="text-2xl font-black uppercase tracking-tighter text-foreground">COMING SOON</p>
        </div>
        <div className="border border-border p-8 bg-background flex flex-col h-full min-h-[400px]">
          <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
            <h3 className="font-black text-xl uppercase tracking-tighter text-foreground">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">VIEW ALL</Link>
          </div>
          
          <div className="flex-1 overflow-auto space-y-6 pr-2">
            {recentOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NO ORDERS YET</p>
              </div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">#{order.orderNumber}</p>
                      <p className="text-sm font-black uppercase tracking-tighter text-foreground">{order.user?.name || order.user?.email || 'GUEST'}</p>
                    </div>
                    <span 
                      className="px-2 py-1 border border-foreground text-[10px] font-black uppercase tracking-widest"
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{formatDate(order.createdAt)}</p>
                    <p className="font-black tracking-widest text-foreground">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
