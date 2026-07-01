import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AnimatedPage from '@/components/common/AnimatedPage'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@/services/api'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { buttonPress } from '@/lib/animations'

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Valid ZIP code is required'),
  country: z.string().default('IN'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function Checkout() {
  const { items, subtotal, clearCart } = useCartStore()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tax = subtotal() * 0.08
  const shipping = subtotal() > 100 ? 0 : 10
  const total = subtotal() + tax + shipping

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'US' } // Or 'IN', depending on the target market
  })

  const onSubmit = async (data: CheckoutForm) => {
    try {
      setIsSubmitting(true)
      const res = await api.post('/orders', {
        shippingAddress: {
          name: data.name,
          phone: data.phone,
          line1: data.line1,
          line2: data.line2 || '',
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        }
      })
      
      toast.success('Order placed successfully!')
      clearCart()
      navigate(`/order-confirmation/${res.data.id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <AnimatedPage>
        <div className="page-container pt-safe-nav pb-[5vh] text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-600" />
          <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
          <Link to="/shop" className="text-indigo-400 hover:text-indigo-300">Continue shopping →</Link>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-[5vh]">
        <h1 className="text-4xl font-black text-white mb-8">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left: Form */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6" style={{ border: '1px solid var(--border-glass)' }}>
              <h2 className="text-lg font-bold text-white mb-4">Shipping Address</h2>
              <div className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input {...register('name')} placeholder="John Doe" className="w-full glass-input rounded-xl px-4 py-3" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input {...register('email')} type="email" placeholder="john@example.com" className="w-full glass-input rounded-xl px-4 py-3" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <input {...register('phone')} placeholder="+1 555 000 0000" className="w-full glass-input rounded-xl px-4 py-3" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address Line 1</label>
                  <input {...register('line1')} placeholder="123 Main St" className="w-full glass-input rounded-xl px-4 py-3" />
                  {errors.line1 && <p className="text-red-400 text-xs mt-1">{errors.line1.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                    <input {...register('city')} placeholder="San Francisco" className="w-full glass-input rounded-xl px-4 py-3" />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">State/Province</label>
                    <input {...register('state')} placeholder="CA" className="w-full glass-input rounded-xl px-4 py-3" />
                    {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</label>
                    <input {...register('postalCode')} placeholder="94102" className="w-full glass-input rounded-xl px-4 py-3" />
                    {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                    <input {...register('country')} placeholder="US" className="w-full glass-input rounded-xl px-4 py-3" />
                  </div>
                </div>

              </div>
            </div>

            <div className="glass rounded-2xl p-6" style={{ border: '1px solid var(--border-glass)' }}>
              <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>
              <div className="p-4 rounded-xl text-center text-white text-base glass shadow-[0_0_30px_rgba(99,102,241,0.15)] border-indigo-500/30">
                <span className="font-bold">Cash on Delivery (COD)</span>
                <p className="text-sm text-gray-400 mt-1">Pay with cash when your order is delivered.</p>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="glass rounded-2xl p-6 sticky top-24" style={{ border: '1px solid var(--border-glass)' }}>
              <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate pr-4">{item.product.name} × {item.quantity}</span>
                    <span className="text-white shrink-0">{formatCurrency((item.variant?.price ?? item.product.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-sm border-t pt-4 mb-6" style={{ borderColor: 'var(--border-glass)' }}>
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-white">{formatCurrency(subtotal())}</span></div>
                <div className="flex justify-between text-gray-400"><span>Tax (8%)</span><span className="text-white">{formatCurrency(tax)}</span></div>
                <div className="flex justify-between text-gray-400"><span>Shipping</span><span className={shipping === 0 ? "text-green-400" : "text-white"}>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span></div>
                <div className="flex justify-between font-bold text-base text-white border-t pt-2" style={{ borderColor: 'var(--border-glass)' }}>
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
              </div>
              
              <motion.button 
                {...buttonPress}
                type="submit"
                disabled={isSubmitting}
                className="magic-button w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white shadow-glow disabled:opacity-50 disabled:cursor-not-allowed" 
              >
                {isSubmitting ? 'Processing...' : 'Place Order (COD)'} 
                {!isSubmitting && <ArrowRight size={16} />}
              </motion.button>
            </div>
          </div>
          
        </form>
      </div>
    </AnimatedPage>
  )
}
