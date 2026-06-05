'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const Apple = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.05 20.28c-.96.95-2.04 1.72-3.32 1.72-1.22 0-1.74-.75-3.23-.75-1.48 0-2.06.73-3.23.75-1.28 0-2.43-.84-3.41-1.89-1.99-2.12-3.04-5.99-3.04-8.48 0-3.37 2.1-5.16 4.12-5.16 1.07 0 2.09.61 2.74.61.64 0 1.76-.75 3.01-.75 1.15 0 2.45.54 3.23 1.54-2.58 1.15-2.16 4.67.43 5.75-.72 1.79-1.63 3.52-2.53 4.66zM12.03 5.07c-.1.01-.19.01-.26.01-.84 0-1.72-.51-2.27-1.45.58-.5 1.48-.82 2.3-.82.08 0 .17 0 .25.01.88 0 1.7.54 2.21 1.4-.63.53-1.44.85-2.23.85z" />
  </svg>
)

const columns = [
  {
    heading: 'Solutions',
    links: [
      { label: 'For Composers', href: '/composers' },
      { label: 'For Supervisors', href: '/supervisors' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Placement Stories', href: '/stories' },
    ],
  },
  {
    heading: 'Resources & Support',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Brand Assets', href: '/brand' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Platform', href: '/platform' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookies', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
]

const TikTok = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

const socials = [
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'YouTube', href: '#', icon: Youtube },
  { label: 'TikTok', href: '#', icon: TikTok },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="bg-card text-foreground border-t border-border selection:bg-primary/20">
      <div className="max-w-screen-2xl w-full mx-auto px-6 py-16 md:py-24">
        
        {/* Mobile Accordion View */}
        <div className="md:hidden mb-16">
          <Accordion type="single" className="w-full">
            {columns.map((col) => (
              <AccordionItem key={col.heading} value={col.heading} className="border-border">
                <AccordionTrigger className="text-sm font-black uppercase tracking-widest hover:no-underline py-6">
                  {col.heading}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pb-8">
                  {col.links.map((link) => (
                    <Link
                      key={link.label + link.href}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-4 gap-12 mb-20">
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3.5">
                {col.links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Horizontal Brand & Socials Section */}
        <div className="pt-12 border-t border-border/50 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Logo - Left */}
          <Link href="/" className="transition-transform hover:scale-105 shrink-0">
            <div className="relative w-48 h-10 md:w-56 md:h-12">
              <Image
                src="/syncmaster-logo-light.svg"
                alt="SyncMaster Logo"
                fill
                className="object-contain dark:hidden"
              />
              <Image
                src="/syncmaster-logo-dark.svg"
                alt="SyncMaster Logo"
                fill
                className="object-contain hidden dark:block"
              />
            </div>
          </Link>

          {/* Social Icons - Center */}
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all group"
              >
                <s.icon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>

          {/* App Stores - Right */}
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="#" 
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-muted hover:bg-muted/80 border border-border transition-all"
            >
              <Apple className="w-6 h-6" />
              <div className="flex flex-col">
                <span className="text-[8px] font-bold uppercase leading-none opacity-60">Download on the</span>
                <span className="text-sm font-black leading-tight tracking-tight">App Store</span>
              </div>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-muted hover:bg-muted/80 border border-border transition-all"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.66,16.05C21.44,16.97 21.44,18.03 18.66,18.95L15.12,16.81L16.81,15.12M14.4,12.71L18.66,9.05C21.44,9.97 21.44,11.03 18.66,11.95L14.4,12.71M4.54,1.5L14.4,11.36L16.12,9.64L4.54,1.5Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold uppercase leading-none opacity-60">GET IT ON</span>
                <span className="text-sm font-black leading-tight tracking-tight">Google Play</span>
              </div>
            </a>
          </div>
        </div>

        {/* Final Copyright */}
        <div className="mt-20 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            © 2026 SyncMaster Operations, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground transition-colors">Security</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground transition-colors">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
