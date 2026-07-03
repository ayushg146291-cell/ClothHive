import { Link } from 'react-router-dom'
import { Camera, MessageSquare, Share2, Video, Mail, MapPin, Phone } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import { Button } from '@/components/ui/button'

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: "Men's", href: '/shop?category=mens' },
    { label: "Women's", href: '/shop?category=womens' },
    { label: 'Accessories', href: '/shop?category=accessories' },
    { label: 'Sale', href: '/shop?sale=true' },
  ],
  Help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Track Order', href: '/orders' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Blog', href: '/blog' },
  ],
}

const socials = [
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: MessageSquare, href: '#', label: 'Twitter' },
  { icon: Share2, href: '#', label: 'Facebook' },
  { icon: Video, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-background">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="page-container py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-4">Stay in the loop</h3>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Get early access to new drops & exclusive offers.</p>
            </div>
            <form
              className="flex gap-4 w-full md:w-auto flex-col sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-4 bg-background border-b-2 border-foreground pb-2 flex-1 md:w-80">
                <Mail size={20} strokeWidth={2.5} className="text-foreground shrink-0" />
                <input
                  type="email"
                  placeholder="YOUR@EMAIL.COM"
                  className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1 font-bold tracking-widest uppercase"
                />
              </div>
              <Button type="submit" className="rounded-none h-14 px-8 uppercase font-bold tracking-widest text-sm bg-foreground text-background hover:bg-muted-foreground w-full sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="page-container py-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-8 group">
              <span className="font-black text-3xl tracking-tighter uppercase text-foreground">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground leading-relaxed mb-8 max-w-sm">
              Premium fashion crafted for the modern individual. Designed with purpose, worn with confidence.
            </p>
            <div className="space-y-4 text-xs font-bold uppercase tracking-widest text-foreground">
              <div className="flex items-center gap-4">
                <Mail size={16} strokeWidth={2.5} />
                <span>INFO@{APP_NAME.toUpperCase()}.COM</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={16} strokeWidth={2.5} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={16} strokeWidth={2.5} />
                <span>MUMBAI, INDIA</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">{group}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="page-container py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon size={18} strokeWidth={2.5} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
