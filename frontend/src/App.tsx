import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import AdminRoute from '@/components/common/AdminRoute'

// Lazy-loaded pages for code-splitting
const Home = lazy(() => import('@/pages/Home'))
const ProductList = lazy(() => import('@/pages/ProductList'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Signup = lazy(() => import('@/pages/auth/Signup'))
const OAuthCallback = lazy(() => import('@/pages/auth/OAuthCallback'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Profile = lazy(() => import('@/pages/Profile'))
const OrderHistory = lazy(() => import('@/pages/OrderHistory'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('@/pages/admin/Products'))
const AdminOrders = lazy(() => import('@/pages/admin/Orders'))
const AdminUsers = lazy(() => import('@/pages/admin/Users'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes
      gcTime: 10 * 60 * 1000,     // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950" />
      
      <div className="relative flex flex-col items-center gap-6 z-10">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-indigo-500/30 blur-[2px] animate-[spin_3s_linear_infinite]" />
          
          {/* Inner pulsing orb */}
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-glow animate-pulse"
            style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
          >
            <span className="text-white font-black text-xl tracking-tighter">C</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <p className="text-transparent bg-clip-text font-bold uppercase tracking-[0.2em] text-sm" style={{ backgroundImage: 'linear-gradient(to right, #818cf8, #e879f9)' }}>
            Loading Spatial UI
          </p>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoading />}>
            <Routes location={location} key={location.pathname}>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ProductList />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Auth */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              </Route>

              {/* Admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
      <CartDrawer />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            theme="dark"
            richColors
            toastOptions={{
              style: {
                background: 'var(--color-gray-800)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
