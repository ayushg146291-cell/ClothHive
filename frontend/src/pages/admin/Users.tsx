import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Search, ShieldAlert } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AdminUsers() {
  const [page, setPage] = useState(1)

  // Stub data for MVP
  const users = [
    { id: '1', email: 'admin@clothhive.com', name: 'Admin User', role: 'ADMIN', isActive: true, createdAt: new Date().toISOString() },
    { id: '2', email: 'customer@example.com', name: 'John Doe', role: 'CUSTOMER', isActive: true, createdAt: new Date().toISOString() },
  ]

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm">Manage customer accounts and admin roles</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-glass)' }}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4 bg-white/5">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full glass-input text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-gray-800/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-gray-800 text-gray-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-indigo-400 transition-colors"><ShieldAlert size={16} /></button>
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
