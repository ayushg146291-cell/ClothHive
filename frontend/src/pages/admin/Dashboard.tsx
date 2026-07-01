import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import { fadeUp } from '@/lib/animations'
import { formatCurrency } from '@/lib/utils'
import { api } from '@/services/api'

interface StatsData {
  revenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    { title: 'Total Revenue', value: stats.revenue, format: formatCurrency, icon: DollarSign, trend: '+12.5%' },
    { title: 'Orders', value: stats.totalOrders, format: (v: number) => v.toString(), icon: ShoppingBag, trend: '+5.2%' },
    { title: 'Customers', value: stats.totalCustomers, format: (v: number) => v.toString(), icon: Users, trend: '+18.1%' },
    { title: 'Products', value: stats.totalProducts, format: (v: number) => v.toString(), icon: Package, trend: '+1.1%' },
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
            className="glass rounded-2xl p-6 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 border border-white/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.format(stat.value)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for charts/tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Revenue Chart (Coming Soon)</p>
        </div>
        <div className="glass rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Recent Orders (Coming Soon)</p>
        </div>
      </div>
    </AdminLayout>
  )
}
