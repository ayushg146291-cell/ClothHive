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
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-foreground bg-background flex flex-col fixed inset-y-0 z-20">
        <div className="p-8 border-b-2 border-foreground">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 flex items-center justify-center bg-foreground text-background font-black text-xl">
              C
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 flex flex-col overflow-y-auto">
          {navLinks.map(({ icon: Icon, label, href }) => {
            const isActive = location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href))
            return (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-4 p-6 border-b border-border text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'bg-foreground text-background border-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon size={18} strokeWidth={2.5} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t-2 border-foreground flex flex-col">
          <Link to="/" className="flex items-center gap-4 p-6 border-b border-border text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Store size={18} strokeWidth={2.5} /> STOREFRONT
          </Link>
          <button onClick={logout} className="flex items-center gap-4 p-6 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors">
            <LogOut size={18} strokeWidth={2.5} /> SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-24 border-b-2 border-foreground bg-background sticky top-0 z-10 flex items-center px-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h2>
        </header>
        <div className="p-12 flex-1">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  )
}
