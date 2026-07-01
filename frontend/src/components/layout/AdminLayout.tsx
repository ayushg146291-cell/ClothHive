import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'

const navLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: ShoppingBag, label: 'Products', href: '/admin/products' },
  { icon: Package, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Users', href: '/admin/users' },
]

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { logout } = useAuthStore()
  const location = useLocation()

  return (
    <div className="min-h-screen relative flex bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-950/40 backdrop-blur-3xl border-white/5 flex flex-col fixed inset-y-0 z-20 shadow-[4px_0_40px_rgba(0,0,0,0.5)]">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500">
              <span className="text-white font-black text-sm">C</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">ClothHive Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ icon: Icon, label, href }) => {
            const isActive = location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href))
            return (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Settings size={18} /> Storefront
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all shadow-[0_0_20px_rgba(239,68,68,0)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        <header className="h-16 border-b border-white/5 bg-gray-950/20 backdrop-blur-3xl sticky top-0 z-10 flex items-center px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-white capitalize">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h2>
        </header>
        <div className="p-8 flex-1">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  )
}
