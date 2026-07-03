import AnimatedPage from '@/components/common/AnimatedPage'
import { useTheme } from '@/components/theme-provider'
import { Moon, Sun, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Switch } from '@/components/ui/switch'
import { SplitText } from '@/components/magic/SplitText'

export default function Settings() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-24 min-h-screen">
        
        <Link to="/profile" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft size={16} strokeWidth={2.5} className="mr-3" />
          BACK TO PROFILE
        </Link>
        
        <SplitText 
          text="SETTINGS"
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground mb-16"
          delay={20}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 lg:gap-24">
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">Preferences</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">MANAGE YOUR ACCOUNT SETTINGS AND PREFERENCES</p>
          </div>

          <div className="space-y-8">
            <div className="border border-border p-8 bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 flex items-center justify-center border border-border bg-foreground text-background">
                  {isDark ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-1">Theme</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">TOGGLE BETWEEN LIGHT AND DARK MODE</p>
                </div>
              </div>
              <Switch 
                checked={isDark} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                className="data-[state=checked]:bg-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}
