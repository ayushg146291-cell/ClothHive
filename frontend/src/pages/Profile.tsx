import AnimatedPage from '@/components/common/AnimatedPage'
import { useAuthStore } from '@/store/authStore'
import { Package, Heart, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuthStore()
  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-[5vh] w-full max-w-3xl mx-auto">
        <h1 className="font-black text-foreground mb-8" style={{ fontSize: 'var(--fluid-header)' }}>My Account</h1>
        <div className="glass rounded-3xl p-8 space-y-6 border border-border">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-lg relative" style={{ background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))' }}>
              {user?.name?.[0] ?? 'U'}
              <div className="absolute inset-0 rounded-[2rem] border-2 border-foreground/10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.name ?? 'Guest'}</h2>
              <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider rounded-lg border border-primary/20">{user?.role}</span>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-border">
            {[
              { icon: Package, label: 'My Orders', href: '/orders' },
              { icon: Heart, label: 'Wishlist', href: '/wishlist' },
              { icon: Settings, label: 'Settings', href: '/profile/settings' },
            ].map(({ icon: Icon, label, href }) => (
              <Link key={href} to={href} className="flex items-center gap-4 p-4 rounded-2xl glass-hover glass transition-all duration-300 text-muted-foreground hover:text-foreground hover:-translate-y-0.5 hover:shadow-lg group">
                <div className="p-2 rounded-xl bg-muted/50 group-hover:bg-primary/15 transition-colors">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="font-semibold">{label}</span>
              </Link>
            ))}
            <button onClick={logout} className="flex items-center gap-4 p-4 rounded-2xl w-full text-left text-destructive hover:bg-destructive/10 transition-all duration-300 glass glass-hover hover:-translate-y-0.5 hover:shadow-lg group mt-4">
              <div className="p-2 rounded-xl bg-muted/50 group-hover:bg-destructive/15 transition-colors">
                <LogOut size={18} />
              </div>
              <span className="font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}
