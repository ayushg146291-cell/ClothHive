import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AnimatedPage from '@/components/common/AnimatedPage'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { api } from '@/services/api'
import { toast } from 'sonner'
import { motion } from 'motion/react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const safeString = z.string().regex(/^[^<>;'"]*$/, 'Invalid characters not allowed')

const checkoutSchema = z.object({
  name: safeString.min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: safeString.min(10, 'Valid phone number is required'),
  line1: safeString.min(5, 'Address is required'),
  line2: safeString.optional(),
  city: safeString.min(2, 'City is required'),
  state: safeString.min(2, 'State is required'),
  postalCode: safeString.min(6, 'Valid 6-digit PIN code is required').max(6, 'Valid 6-digit PIN code is required'),
  country: safeString.default('India'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function Checkout() {
  const { items, subtotal, clearCart } = useCartStore()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tax = subtotal() * 0.08
  const shipping = subtotal() > 1000 ? 0 : 100
  const total = subtotal() + tax + shipping

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'India' }
  })

  const postalCode = watch('postalCode')

  useEffect(() => {
    if (postalCode?.length === 6) {
      const fetchLocation = async () => {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`)
          const data = await res.json()
          if (data && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0]
            setValue('city', postOffice.District, { shouldValidate: true })
            setValue('state', postOffice.State, { shouldValidate: true })
            setValue('country', postOffice.Country || 'India', { shouldValidate: true })
            toast.success('Location auto-filled from PIN code')
          } else {
            toast.error('Invalid PIN code')
          }
        } catch (error) {
          console.error('Failed to fetch PIN code data', error)
        }
      }
      fetchLocation()
    }
  }, [postalCode, setValue])

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
        },
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
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
        <div className="page-container pt-safe-nav pb-section flex flex-col items-center justify-center text-center min-h-[60vh]">
          <ShoppingBag size={64} className="mb-6 text-zinc-600" />
          <h1 className="h2 text-white mb-4">Your cart is empty</h1>
          <Link to="/shop">
            <Button variant="outline" className="rounded-full px-8 bg-zinc-900 border-zinc-800 text-primary hover:bg-zinc-800">
              Continue shopping <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-section">
        <h1 className="h1 text-white mb-10">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left: Form */}
          <div className="space-y-6">
            <Card className="glass border-border-glass bg-zinc-950/50">
              <CardHeader>
                <CardTitle className="text-xl text-white">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name</label>
                    <input {...register('name')} placeholder="John Doe" className="w-full glass bg-zinc-900/50 rounded-xl px-4 py-3 text-white border border-border-glass focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                    {errors.name && <p className="text-destructive text-xs mt-1.5">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
                    <input {...register('email')} type="email" placeholder="john@example.com" className="w-full glass bg-zinc-900/50 rounded-xl px-4 py-3 text-white border border-border-glass focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                    {errors.email && <p className="text-destructive text-xs mt-1.5">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Phone</label>
                  <input {...register('phone')} placeholder="+91 98765 43210" className="w-full glass bg-zinc-900/50 rounded-xl px-4 py-3 text-white border border-border-glass focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                  {errors.phone && <p className="text-destructive text-xs mt-1.5">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Address Line 1</label>
                  <input {...register('line1')} placeholder="123 Main St" className="w-full glass bg-zinc-900/50 rounded-xl px-4 py-3 text-white border border-border-glass focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                  {errors.line1 && <p className="text-destructive text-xs mt-1.5">{errors.line1.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-1.5">City (Auto-filled)</label>
                    <input {...register('city')} readOnly placeholder="Mumbai" className="w-full glass bg-zinc-900/30 rounded-xl px-4 py-3 text-zinc-400 border border-border-glass/50 cursor-not-allowed outline-none" />
                    {errors.city && <p className="text-destructive text-xs mt-1.5">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-1.5">State (Auto-filled)</label>
                    <input {...register('state')} readOnly placeholder="Maharashtra" className="w-full glass bg-zinc-900/30 rounded-xl px-4 py-3 text-zinc-400 border border-border-glass/50 cursor-not-allowed outline-none" />
                    {errors.state && <p className="text-destructive text-xs mt-1.5">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">PIN Code</label>
                    <input {...register('postalCode')} placeholder="400001" maxLength={6} className="w-full glass bg-zinc-900/50 rounded-xl px-4 py-3 text-white border border-border-glass focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                    {errors.postalCode && <p className="text-destructive text-xs mt-1.5">{errors.postalCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-1.5">Country (Auto-filled)</label>
                    <input {...register('country')} readOnly placeholder="India" className="w-full glass bg-zinc-900/30 rounded-xl px-4 py-3 text-zinc-400 border border-border-glass/50 cursor-not-allowed outline-none" />
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card className="glass border-border-glass bg-zinc-950/50">
              <CardHeader>
                <CardTitle className="text-xl text-white">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-5 rounded-xl text-center bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(190,24,93,0.15)]">
                  <span className="font-bold text-white text-lg">Cash on Delivery (COD)</span>
                  <p className="text-sm text-primary mt-1">Pay with cash when your order is delivered.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Summary */}
          <div>
            <Card className="glass border-border-glass bg-zinc-950/50 sticky top-28">
              <CardHeader>
                <CardTitle className="text-xl text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400 truncate pr-4 font-medium">{item.product.name} × {item.quantity}</span>
                      <span className="text-white shrink-0 font-bold">{formatCurrency((item.variant?.price ?? item.product.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 text-sm border-t border-border-glass pt-5 mb-8">
                  <div className="flex justify-between text-zinc-400 font-medium"><span>Subtotal</span><span className="text-white">{formatCurrency(subtotal())}</span></div>
                  <div className="flex justify-between text-zinc-400 font-medium"><span>Tax (8%)</span><span className="text-white">{formatCurrency(tax)}</span></div>
                  <div className="flex justify-between text-zinc-400 font-medium"><span>Shipping</span><span className={shipping === 0 ? "text-green-400" : "text-white"}>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span></div>
                  <div className="flex justify-between font-bold text-xl text-white border-t border-border-glass pt-4 mt-2">
                    <span>Total</span><span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 rounded-xl font-bold text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(190,24,93,0.3)] transition-all hover:scale-[1.02]" 
                >
                  {isSubmitting ? 'Processing...' : 'Place Order (COD)'} 
                  {!isSubmitting && <ArrowRight size={18} className="ml-2" />}
                </Button>
              </CardContent>
            </Card>
          </div>
          
        </form>
      </div>
    </AnimatedPage>
  )
}
