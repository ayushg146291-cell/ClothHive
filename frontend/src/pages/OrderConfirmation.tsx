import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import AnimatedPage from '@/components/common/AnimatedPage'
import { api } from '@/services/api'
import { Order } from '@/types'
import { SplitText } from '@/components/magic/SplitText'
import { Button } from '@/components/ui/button'

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      api.get(`/orders/${id}`)
        .then((res) => {
          setOrder(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id])

  if (loading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-16 h-16 border-4 border-foreground border-t-transparent animate-spin"></div>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen flex items-center justify-center py-24 page-container bg-background">
        <div className="max-w-2xl w-full text-center border border-border p-12 md:p-20">
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-24 h-24 flex items-center justify-center mx-auto mb-12 bg-foreground text-background"
          >
            <CheckCircle2 size={48} strokeWidth={2} />
          </motion.div>

          <SplitText 
            text="CONFIRMED"
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground mb-6"
            delay={30}
          />

          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            THANK YOU FOR YOUR PURCHASE. YOUR ORDER <span className="text-foreground">#{order?.orderNumber || id}</span> HAS BEEN RECEIVED.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-12">
            WE'LL SEND YOU AN EMAIL CONFIRMATION WITH TRACKING DETAILS ONCE YOUR ITEMS SHIP.
          </p>

          <div className="p-6 border-2 border-foreground mb-12 inline-block text-left mx-auto">
            <p className="text-sm font-black uppercase tracking-widest text-foreground mb-2">PAYMENT METHOD: CASH ON DELIVERY</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PLEASE HAVE THE EXACT AMOUNT READY WHEN THE DELIVERY ARRIVES.</p>
          </div>

          <div className="flex flex-col gap-4">
            <Link to={`/profile`}>
              <Button className="w-full h-16 rounded-none bg-foreground hover:bg-muted-foreground text-background font-bold text-sm uppercase tracking-widest transition-colors">
                VIEW ORDER DETAILS
                <ArrowRight size={18} strokeWidth={2.5} className="ml-3" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="w-full h-16 rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background font-bold text-xs uppercase tracking-widest transition-colors">
                CONTINUE SHOPPING
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}
