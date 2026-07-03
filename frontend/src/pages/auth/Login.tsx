import { Link } from 'react-router-dom'
import { User, Sparkles } from 'lucide-react'
import AnimatedPage from '@/components/common/AnimatedPage'
import { API_BASE_URL } from '@/lib/constants'
import { SplitText } from '@/components/magic/SplitText'
import { Button } from '@/components/ui/button'

export default function Login() {
  const handleOAuthLogin = (provider: 'google' | 'github') => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 md:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 border border-foreground shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Left Panel */}
          <div className="bg-foreground text-background p-12 md:p-16 flex flex-col justify-between min-h-[40vh]">
            <div className="w-12 h-12 bg-background flex items-center justify-center rounded-none mb-16">
              <Sparkles size={24} strokeWidth={2.5} className="text-foreground" />
            </div>
            
            <div>
              <SplitText 
                text="WELCOME"
                className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-background mb-2"
                delay={20}
              />
              <SplitText 
                text="BACK."
                className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-background mb-6"
                delay={40}
              />
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-8">Elevate your wardrobe. Sign in to continue.</p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-background text-foreground p-12 md:p-16 flex flex-col justify-center">
            
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Sign In</h2>
            
            <div className="flex flex-col gap-6 w-full mb-12">
              <Button
                onClick={() => handleOAuthLogin('google')}
                className="w-full h-14 rounded-none flex items-center justify-center gap-4 bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                CONTINUE WITH GOOGLE
              </Button>

              <Button
                onClick={() => handleOAuthLogin('github')}
                className="w-full h-14 rounded-none flex items-center justify-center gap-4 bg-foreground text-background border-2 border-foreground hover:bg-muted-foreground font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <User size={18} strokeWidth={2.5} />
                CONTINUE WITH GITHUB
              </Button>
            </div>
            
            <div className="text-center pt-8 border-t border-border">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed">
                BY CONTINUING, YOU AGREE TO OUR <br/>
                <span className="text-foreground hover:underline cursor-pointer">TERMS OF SERVICE</span> AND <span className="text-foreground hover:underline cursor-pointer">PRIVACY POLICY</span>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </AnimatedPage>
  )
}
