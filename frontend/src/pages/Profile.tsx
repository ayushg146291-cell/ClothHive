import AnimatedPage from '@/components/common/AnimatedPage'
import { useAuthStore } from '@/store/authStore'
import { User, Package, Heart, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuthStore()
  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-[5vh] w-full">
        <h1 className="font-black text-white mb-8" style={{ fontSize: 'var(--fluid-header)' }}>My Account</h1>
        <div className="glass rounded-3xl p-8 space-y-6" style={{ border: '1px solid var(--border-glass)' }}>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-glow relative" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
              {user?.name?.[0] ?? 'U'}
              <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name ?? 'Guest'}</h2>
              <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-500/20">{user?.role}</span>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-white/5">
            {[
              { icon: Package, label: 'My Orders', href: '/orders' },
              { icon: Heart, label: 'Wishlist', href: '/wishlist' },
              { icon: Settings, label: 'Settings', href: '/profile/settings' },
            ].map(({ icon: Icon, label, href }) => (
              <Link key={href} to={href} className="flex items-center gap-4 p-4 rounded-2xl glass-hover glass transition-all duration-300 text-gray-300 hover:text-white hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] group">
                <div className="p-2 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
                  <Icon size={18} className="text-indigo-400" />
                </div>
                <span className="font-semibold">{label}</span>
              </Link>
            ))}
            <button onClick={logout} className="flex items-center gap-4 p-4 rounded-2xl w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 glass glass-hover hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] group mt-4">
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-red-500/20 transition-colors">
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
