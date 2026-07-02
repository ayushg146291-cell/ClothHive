import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminOrders() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', page],
    queryFn: () => orderService.getAllOrders({ page, limit: 10 }),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      toast.success('Order status updated')
    },
    onError: () => toast.error('Failed to update status')
  })

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground text-sm">Manage customer orders and fulfillment</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-muted/30">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background text-foreground text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none border border-border focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No orders found</td></tr>
              ) : data?.data?.map((order: any) => (
                <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">#{order.orderNumber}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.user?.name || order.user?.email || 'Guest'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.createdAt ? formatDate(order.createdAt) : '—'}</td>
                  <td className="px-6 py-4 text-foreground font-medium tabular-nums">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      disabled={updateStatus.isPending && updateStatus.variables?.id === order.id}
                      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                      className="px-2.5 py-1 rounded-full text-xs font-bold border border-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                      style={{ 
                        background: `${ORDER_STATUS_COLORS[order.status] || '#888'}20`, 
                        color: ORDER_STATUS_COLORS[order.status] || '#888' 
                      }}
                    >
                      {Object.keys(ORDER_STATUS_LABELS).map(key => (
                        <option key={key} value={key} className="bg-background text-foreground">
                          {ORDER_STATUS_LABELS[key]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages} · {data.total} orders
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                className="border-border"
              >
                <ChevronLeft size={14} className="mr-1" /> Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= data.totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="border-border"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
