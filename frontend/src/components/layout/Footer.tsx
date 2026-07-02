import { Link } from 'react-router-dom'
import { Camera, MessageSquare, Share2, Video, Mail, MapPin, Phone } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

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
    <footer
      className="mt-20 border-t relative overflow-hidden"
      style={{ background: 'transparent', borderColor: 'var(--border-glass)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent -z-10" />
      
      {/* Newsletter */}
      <div
        className="border-b"
        style={{ borderColor: 'var(--border-glass)', background: 'var(--surface-glass)' }}
      >
        <div className="page-container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Stay in the loop</h3>
              <p className="text-gray-400 text-sm">Get early access to new drops, exclusive offers, and style tips.</p>
            </div>
            <form
              className="flex gap-2 w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-2 glass-input rounded-xl px-4 py-3 flex-1 md:w-72">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="page-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
              >
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="font-bold text-lg text-white">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Premium fashion crafted for the modern individual. Designed with purpose, worn with confidence.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>ayush@clothhive.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-sm font-semibold text-white mb-4">{group}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
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
      <div className="border-t" style={{ borderColor: 'var(--border-glass)' }}>
        <div className="page-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-gray-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
