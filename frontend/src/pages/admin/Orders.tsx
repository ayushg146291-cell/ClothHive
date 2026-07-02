import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Search, Eye } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/constants'

export default function AdminOrders() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', page],
    queryFn: () => orderService.getAllOrders({ page, limit: 10 }),
  })

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 text-sm">Manage customer orders and fulfillment</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-glass)' }}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4 bg-white/5">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full glass-input text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-gray-800/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : data?.data.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">#{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.user?.email || 'Guest'}</td>
                  <td className="px-6 py-4">{order.createdAt ? formatDate(order.createdAt) : 'Unknown'}</td>
                  <td className="px-6 py-4">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ background: ORDER_STATUS_COLORS[order.status] }}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-indigo-400 transition-colors"><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
