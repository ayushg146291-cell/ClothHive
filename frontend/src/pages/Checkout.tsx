import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AnimatedPage from '@/components/common/AnimatedPage'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { api } from '@/services/api'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { SplitText } from '@/components/magic/SplitText'

const safeString = z.string().regex(/^[^<>;'"]*$/, 'Invalid characters not allowed')

const checkoutSchema = z.object({
  name: z.string().regex(/^[A-Za-z\s]+$/, 'Name must contain only alphabets'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
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
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tax = subtotal() * 0.08
  const shipping = subtotal() > 1000 ? 0 : 100
  const total = subtotal() + tax + shipping

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { 
      country: 'India',
      email: user?.email || '',
      name: user?.name || ''
    }
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
            toast.success('Location auto-filled')
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
        <div className="page-container pt-safe-nav pb-24 flex flex-col items-center justify-center text-center min-h-[70vh]">
          <ShoppingBag size={64} strokeWidth={1} className="mb-8 text-foreground" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-8">Cart is Empty</h1>
          <Link to="/shop">
            <Button size="lg" className="h-16 px-12 rounded-none bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:bg-muted-foreground transition-colors">
              Continue Shopping <ArrowRight size={18} className="ml-3" />
            </Button>
          </Link>
        </div>
      </AnimatedPage>
    )
  }

  const inputClasses = "w-full h-14 bg-background px-4 text-foreground border border-border focus:border-foreground outline-none transition-colors font-medium text-sm"
  const labelClasses = "block text-xs font-bold uppercase tracking-widest text-foreground mb-3"

  return (
    <AnimatedPage>
      <div className="page-container pt-safe-nav pb-24 min-h-screen">
        <SplitText 
          text="CHECKOUT"
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground mb-16"
          delay={30}
        />
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 lg:gap-24">
          
          {/* Left: Form */}
          <div className="space-y-12">
            <div className="border border-border p-8 md:p-12">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-10 pb-4 border-b border-border">Shipping Address</h2>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClasses}>Full Name</label>
                    <input {...register('name')} placeholder="JOHN DOE" className={inputClasses} />
                    {errors.name && <p className="text-foreground font-bold text-[10px] uppercase tracking-widest mt-2">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>Email</label>
                    <input 
                      {...register('email')} 
                      type="email" 
                      placeholder="JOHN@EXAMPLE.COM" 
                      className={`${inputClasses} ${isAuthenticated ? 'bg-muted text-muted-foreground border-transparent' : ''}`}
                      readOnly={isAuthenticated}
                    />
                    {errors.email && <p className="text-foreground font-bold text-[10px] uppercase tracking-widest mt-2">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Phone</label>
                  <input 
                    {...register('phone')} 
                    placeholder="9876543210" 
                    maxLength={10} 
                    className={inputClasses} 
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')
                    }}
                  />
                  {errors.phone && <p className="text-foreground font-bold text-[10px] uppercase tracking-widest mt-2">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Address Line 1</label>
                  <input {...register('line1')} placeholder="123 MAIN ST" className={inputClasses} />
                  {errors.line1 && <p className="text-foreground font-bold text-[10px] uppercase tracking-widest mt-2">{errors.line1.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClasses}>City</label>
                    <input {...register('city')} readOnly placeholder="MUMBAI" className={`${inputClasses} bg-muted text-muted-foreground border-transparent`} />
                    {errors.city && <p className="text-foreground font-bold text-[10px] uppercase tracking-widest mt-2">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>State</label>
                    <input {...register('state')} readOnly placeholder="MAHARASHTRA" className={`${inputClasses} bg-muted text-muted-foreground border-transparent`} />
                    {errors.state && <p className="text-foreground font-bold text-[10px] uppercase tracking-widest mt-2">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClasses}>PIN Code</label>
                    <input {...register('postalCode')} placeholder="400001" maxLength={6} className={inputClasses} />
                    {errors.postalCode && <p className="text-foreground font-bold text-[10px] uppercase tracking-widest mt-2">{errors.postalCode.message}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>Country</label>
                    <input {...register('country')} readOnly placeholder="INDIA" className={`${inputClasses} bg-muted text-muted-foreground border-transparent`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border p-8 md:p-12">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-8 pb-4 border-b border-border">Payment Method</h2>
              <div className="p-8 border border-foreground bg-foreground text-background">
                <span className="block font-black text-xl uppercase tracking-tighter mb-2">Cash on Delivery (COD)</span>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Pay with cash when your order is delivered.</p>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="border border-border p-8 md:p-12 sticky top-32">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-10 pb-4 border-b border-border">Order Summary</h2>
              
              <div className="space-y-6 mb-10">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground pr-4 leading-relaxed">{item.product.name} <br/>× {item.quantity}</span>
                    <span className="text-sm font-black tracking-widest text-foreground shrink-0">{formatCurrency((item.variant?.price ?? item.product.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6 text-sm border-t border-border pt-8 mb-10">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground"><span>Subtotal</span><span className="text-foreground">{formatCurrency(subtotal())}</span></div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground"><span>Tax (8%)</span><span className="text-foreground">{formatCurrency(tax)}</span></div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground"><span>Shipping</span><span className="text-foreground">{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
                
                <div className="flex justify-between font-black text-2xl tracking-tighter text-foreground border-t border-border pt-8 mt-4">
                  <span>TOTAL</span><span>{formatCurrency(total)}</span>
                </div>
              </div>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 rounded-none font-bold text-sm uppercase tracking-widest bg-foreground hover:bg-muted-foreground text-background transition-colors" 
              >
                {isSubmitting ? 'PROCESSING...' : 'CONFIRM ORDER'} 
                {!isSubmitting && <ArrowRight size={18} className="ml-3" />}
              </Button>
            </div>
          </div>
          
        </form>
      </div>
    </AnimatedPage>
  )
}
