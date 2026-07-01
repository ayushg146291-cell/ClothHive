import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import AnimatedPage from '@/components/common/AnimatedPage';

export default function NotFound() {
  return (
    <AnimatedPage>
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 text-center">
        <div className="relative z-10 glass p-16 rounded-[3rem] shadow-[0_0_100px_rgba(99,102,241,0.15)] border border-indigo-500/20 backdrop-blur-3xl overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/30 rounded-full blur-[100px] -z-10" />
          
          <h1 className="text-9xl font-black text-transparent bg-clip-text mb-4 drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]" style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
            404
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Page not found</h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <Link
            to="/"
            className="magic-button inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-glow"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </AnimatedPage>
  );
}
