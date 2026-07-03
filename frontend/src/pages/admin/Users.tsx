import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
  isActive: boolean
  createdAt: string
  provider: string
}

export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: async () => {
      const { data } = await api.get('/admin/users', { params: { page, limit: 10 } })
      return data
    },
  })

  const users: AdminUser[] = data?.data || []

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-foreground">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Users</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">MANAGE CUSTOMER ACCOUNTS AND ADMIN ROLES</p>
        </div>
      </div>

      <div className="border border-border bg-background">
        <div className="p-6 border-b border-border bg-background flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={20} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="SEARCH USERS..."
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
                <th className="px-8 py-6">USER</th>
                <th className="px-8 py-6">PROVIDER</th>
                <th className="px-8 py-6">ROLE</th>
                <th className="px-8 py-6">STATUS</th>
                <th className="px-8 py-6">JOINED</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={5} className="px-8 py-6"><div className="h-4 bg-muted animate-pulse" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NO USERS FOUND</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-foreground bg-background text-foreground flex items-center justify-center font-black text-sm uppercase">
                        {(user.name || user.email)?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">{user.name || '—'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{user.provider}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 border text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'border-foreground text-foreground' : 'border-muted-foreground text-muted-foreground'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 border text-[10px] font-black uppercase tracking-widest ${user.isActive ? 'border-foreground text-foreground' : 'border-muted-foreground text-muted-foreground'}`}>
                      {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{user.createdAt ? formatDate(user.createdAt) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-6 border-t border-border bg-background">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              PAGE {data.page} OF {data.totalPages} · {data.total} USERS
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
