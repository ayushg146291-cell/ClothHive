import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import { fadeUp } from '@/lib/animations'
import { formatCurrency, formatDate } from '@/lib/utils'
import { api } from '@/services/api'
import { orderService } from '@/services/order.service'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/constants'
import type { Order } from '@/types'
import { Link } from 'react-router-dom'

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
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    { title: 'Total Revenue', value: stats.revenue, format: formatCurrency, icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Orders', value: stats.totalOrders, format: (v: number) => v.toString(), icon: ShoppingBag, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { title: 'Customers', value: stats.totalCustomers, format: (v: number) => v.toString(), icon: Users, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { title: 'Products', value: stats.totalProducts, format: (v: number) => v.toString(), icon: Package, color: 'text-primary bg-primary/10 border-primary/20' },
  ]

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">{stat.format(stat.value)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass rounded-2xl p-6 min-h-[400px] flex items-center justify-center border border-border">
          <p className="text-muted-foreground">Revenue Chart (Coming Soon)</p>
        </div>
        <div className="glass rounded-2xl p-6 min-h-[400px] border border-border flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-foreground">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-primary hover:underline font-medium">View all</Link>
          </div>
          
          <div className="flex-1 overflow-auto space-y-3 pr-1">
            {recentOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No orders yet</p>
              </div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="p-3 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold" 
                      style={{ background: `${ORDER_STATUS_COLORS[order.status]}20`, color: ORDER_STATUS_COLORS[order.status] }}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground truncate max-w-[120px]">{order.user?.name || order.user?.email || 'Guest'}</p>
                    <p className="font-bold text-foreground tabular-nums">{formatCurrency(order.totalAmount)}</p>
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
