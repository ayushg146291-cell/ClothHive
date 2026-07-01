import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, User } from 'lucide-react'
import AnimatedPage from '@/components/common/AnimatedPage'
import { buttonPress } from '@/lib/animations'
import { API_BASE_URL } from '@/lib/constants'

export default function Login() {
  const handleOAuthLogin = (provider: 'google' | 'github') => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Deep immersive background orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none mix-blend-screen" style={{ background: 'var(--color-primary-600)' }} />
        <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none mix-blend-screen" style={{ background: 'var(--color-secondary-600)' }} />

        <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
          
          {/* Spatial Icon Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-glow"
            style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
          >
            <Sparkles size={28} className="text-white" />
          </motion.div>

          {/* Typography */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center mb-10 w-full"
          >
            <h1 className="text-4xl font-black text-white tracking-tight mb-3">Welcome Back</h1>
            <p className="text-gray-400 text-sm font-medium">Elevate your wardrobe. Sign in to continue.</p>
          </motion.div>

          {/* Ultra-Premium Glass Panel */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full rounded-[2rem] p-8 sm:p-10 relative overflow-hidden"
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Inner Glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="flex flex-col gap-5 w-full">
              {/* Google Button with Magic Border */}
              <div className="magic-button w-full h-[56px] rounded-2xl">
                <motion.button
                  {...buttonPress}
                  onClick={() => handleOAuthLogin('google')}
                  className="magic-button-content !rounded-2xl w-full flex items-center justify-center gap-3 text-base"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </motion.button>
              </div>

              {/* GitHub Button with Glass Style */}
              <motion.button
                {...buttonPress}
                onClick={() => handleOAuthLogin('github')}
                className="w-full h-[56px] rounded-2xl flex items-center justify-center gap-3 font-bold text-white transition-all hover:bg-white/10"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <User size={20} />
                Continue with GitHub
              </motion.button>
            </div>
            
            <p className="text-center text-xs text-gray-500 font-medium mt-8 leading-relaxed">
              By continuing, you agree to our <br/>
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Terms of Service</span> and <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  )
}
