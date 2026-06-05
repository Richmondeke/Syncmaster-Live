'use client'

import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from '@/app/actions/contact'
import Link from 'next/link'
import { Mail, MessageSquare, MapPin, ArrowRight, Globe } from 'lucide-react'
import { buttonVariants } from '@/lib/button-variants'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

const contactChannels = [
  {
    icon: Mail,
    title: 'General Enquiries',
    description: 'Questions about the platform or our mission.',
    email: 'hello@syncmaster.io',
  },
  {
    icon: MessageSquare,
    title: 'Support',
    description: 'Technical help or questions about your account.',
    email: 'support@syncmaster.io',
  },
  {
    icon: Globe,
    title: 'Press & Media',
    description: 'Interviews, brand assets, and building in public.',
    email: 'press@syncmaster.io',
  },
]

export default function ContactPage() {
  const initialState: ContactFormState = { success: false }
  const [state, action, pending] = useActionState(submitContactForm, initialState)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
          </div>
          <div className="max-w-screen-2xl w-full mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8">
                <MessageSquare className="w-3.5 h-3.5" />
                Contact Us
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-[-0.068em] leading-[1.05] mb-8">
                Let&apos;s build the<br />
                <span className="text-primary italic">corridor together.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                Have questions about the roster? Need a specific sound for your project? Or just want to say hello? Reach out to the right team below.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="py-24 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactChannels.map((channel) => (
                <div key={channel.title} className="flex flex-col gap-6 p-8 rounded-[2rem] bg-card border border-border/50 hover:border-input transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <channel.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-black tracking-tight">{channel.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{channel.description}</p>
                  </div>
                  <a
                    href={`mailto:${channel.email}`}
                    className="mt-auto text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {channel.email}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple Form Placeholder */}
        <section className="py-32 border-t border-border bg-muted/30">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="max-w-xl mx-auto flex flex-col gap-10">
              <div className="text-center">
                <h2 className="text-3xl font-black tracking-tight mb-4">Send us a message</h2>
                <p className="text-muted-foreground">We usually respond within 24 hours.</p>
              </div>
              
              {state.success ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="font-black text-emerald-600">Message sent! We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form action={action} className="flex flex-col gap-4">
                  {state.error && (
                    <p className="text-sm text-destructive font-medium">{state.error}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                      <input
                        name="name"
                        type="text"
                        placeholder="Your name"
                        required
                        className="h-12 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        className="h-12 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                    <textarea
                      name="message"
                      placeholder="How can we help?"
                      rows={5}
                      required
                      className="rounded-xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pending}
                    className={buttonVariants({ size: 'lg' }) + ' w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 rounded-2xl font-black mt-4'}
                  >
                    {pending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Office Info */}
        <section className="py-32 border-t border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="flex flex-col items-center text-center gap-10 p-12 md:p-16 rounded-[3rem] border border-border bg-card/50">
              <div className="flex flex-col items-center text-center gap-4 max-w-xl">
                <div className="flex items-center gap-3 text-primary justify-center">
                  <MapPin className="w-5 h-5" />
                  <span className="font-black uppercase tracking-widest text-xs">Our Presence</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight">Globally distributed.<br className="hidden md:inline" /> African-rooted.</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SyncMaster operates as a remote-first team across London, Lagos, and Cape Town. We meet composers and supervisors where they are.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="px-6 py-4 rounded-2xl border border-border bg-background">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">London</p>
                  <p className="font-bold">Sync Hub &middot; UK</p>
                </div>
                <div className="px-6 py-4 rounded-2xl border border-border bg-background">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Lagos</p>
                  <p className="font-bold">Editorial &middot; NG</p>
                </div>
                <div className="px-6 py-4 rounded-2xl border border-border bg-background">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Cape Town</p>
                  <p className="font-bold">Roster &middot; SA</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
