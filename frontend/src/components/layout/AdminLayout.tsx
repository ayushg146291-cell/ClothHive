import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Users, Package, Store, LogOut, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const navLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: ShoppingBag, label: 'Products', href: '/admin/products' },
  { icon: Package, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Star, label: 'Reviews', href: '/admin/reviews' },
]

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { logout } = useAuthStore()
  const location = useLocation()

  return (
    <div className="min-h-screen relative flex bg-background overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/40 backdrop-blur-3xl border-border flex flex-col fixed inset-y-0 z-20 shadow-xl">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-accent">
              <span className="text-white font-black text-sm">C</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">ClothHive Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ icon: Icon, label, href }) => {
            const isActive = location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href))
            return (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/15 text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
            <Store size={18} /> Storefront
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        <header className="h-16 border-b border-border bg-card/20 backdrop-blur-3xl sticky top-0 z-10 flex items-center px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground capitalize">
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
