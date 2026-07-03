import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
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
      <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-foreground">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Orders</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">MANAGE CUSTOMER ORDERS AND FULFILLMENT</p>
        </div>
      </div>

      <div className="border border-border bg-background">
        <div className="p-6 border-b border-border bg-background flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={20} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="SEARCH ORDERS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-background text-foreground text-xs font-bold uppercase tracking-widest rounded-none pl-12 pr-4 outline-none border border-border focus:border-foreground transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] font-black uppercase tracking-widest bg-muted text-foreground">
              <tr>
                <th className="px-8 py-6">ORDER ID</th>
                <th className="px-8 py-6">CUSTOMER</th>
                <th className="px-8 py-6">DATE</th>
                <th className="px-8 py-6">TOTAL</th>
                <th className="px-8 py-6">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={5} className="px-8 py-6"><div className="h-4 bg-muted animate-pulse" /></td>
                  </tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NO ORDERS FOUND</td></tr>
              ) : data?.data?.map((order: any) => (
                <tr key={order.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-8 py-4 font-black uppercase tracking-widest text-foreground">#{order.orderNumber}</td>
                  <td className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{order.user?.name || order.user?.email || 'GUEST'}</td>
                  <td className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{order.createdAt ? formatDate(order.createdAt) : '—'}</td>
                  <td className="px-8 py-4 text-foreground font-black tracking-widest">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-8 py-4">
                    <select
                      value={order.status}
                      disabled={updateStatus.isPending && updateStatus.variables?.id === order.id}
                      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                      className="px-3 py-2 border border-foreground bg-background text-foreground text-[10px] font-black uppercase tracking-widest cursor-pointer focus:outline-none hover:bg-foreground hover:text-background transition-colors appearance-none"
                    >
                      {Object.keys(ORDER_STATUS_LABELS).map(key => (
                         <option key={key} value={key} className="bg-background text-foreground">
                           {ORDER_STATUS_LABELS[key].toUpperCase()}
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
          <div className="flex items-center justify-between px-8 py-6 border-t border-border bg-background">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              PAGE {data.page} OF {data.totalPages} · {data.total} ORDERS
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                className="h-10 rounded-none border-border hover:border-foreground text-[10px] font-bold uppercase tracking-widest"
              >
                <ChevronLeft size={16} strokeWidth={2.5} className="mr-2" /> PREVIOUS
              </Button>
              <Button 
                variant="outline" 
                disabled={page >= data.totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="h-10 rounded-none border-border hover:border-foreground text-[10px] font-bold uppercase tracking-widest"
              >
                NEXT <ChevronRight size={16} strokeWidth={2.5} className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
