import AnimatedPage from '@/components/common/AnimatedPage'
import { useAuthStore } from '@/store/authStore'
import { Package, Heart, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SplitText } from '@/components/magic/SplitText'
import { Button } from '@/components/ui/button'

export default function Profile() {
  const { user, logout } = useAuthStore()
  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-24 min-h-screen">
        <SplitText 
          text="ACCOUNT"
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground mb-16"
          delay={20}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 lg:gap-24">
          {/* Sidebar */}
          <div className="space-y-12">
            <div className="border border-border p-8 text-center bg-background">
              <div className="w-24 h-24 mx-auto bg-foreground text-background flex items-center justify-center font-black text-4xl uppercase mb-6">
                {user?.name?.[0] ?? 'U'}
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">{user?.name ?? 'Guest'}</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{user?.email}</p>
              <span className="inline-block mt-4 px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest">
                {user?.role}
              </span>
            </div>

            <div className="flex flex-col border border-border">
              {[
                { icon: Package, label: 'MY ORDERS', href: '/orders' },
                { icon: Heart, label: 'WISHLIST', href: '/wishlist' },
                { icon: Settings, label: 'SETTINGS', href: '/profile/settings' },
              ].map(({ icon: Icon, label, href }) => (
                <Link key={href} to={href} className="flex items-center gap-4 p-6 border-b border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors group last:border-b-0">
                  <Icon size={20} strokeWidth={2.5} />
                  <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
                </Link>
              ))}
            </div>

            <Button 
              onClick={logout} 
              variant="outline"
              className="w-full h-16 rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-4"
            >
              <LogOut size={18} strokeWidth={2.5} />
              SIGN OUT
            </Button>
          </div>

          {/* Main Content Area (Optional, currently just a placeholder for dashboard data) */}
          <div className="border border-border p-8 md:p-16 flex flex-col justify-center items-center text-center bg-background min-h-[50vh]">
             <Package size={48} strokeWidth={1.5} className="text-muted-foreground mb-8" />
             <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-4">Dashboard</h3>
             <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SELECT AN OPTION FROM THE MENU TO VIEW DETAILS</p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}
