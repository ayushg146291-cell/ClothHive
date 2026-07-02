import AnimatedPage from '@/components/common/AnimatedPage'
import { useTheme } from '@/components/theme-provider'
import { Moon, Sun, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Switch } from '@/components/ui/switch'

export default function Settings() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-[5vh] w-full max-w-2xl mx-auto">
        
        <Link to="/profile" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </Link>
        
        <h1 className="font-black text-foreground mb-8" style={{ fontSize: 'var(--fluid-header)' }}>Settings</h1>
        
        <div className="glass rounded-3xl p-8 space-y-8" style={{ border: '1px solid var(--border-glass)' }}>
          
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Appearance</h2>
            <div className="flex items-center justify-between p-4 rounded-2xl glass-hover glass border border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  {isDark ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Theme Preference</h3>
                  <p className="text-sm text-muted-foreground">Toggle between Light and Dark mode</p>
                </div>
              </div>
              <Switch 
                checked={isDark} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </section>
          
        </div>
      </div>
    </AnimatedPage>
  )
}
