import Link from 'next/link'
import Image from 'next/image'
import { ArrowDownToLine } from 'lucide-react'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: "Brand Assets — SyncMaster",
  description: "Download official SyncMaster logos, colors, and brand guidelines for use in press, presentations, and marketing materials.",
}

const colors = [
  { name: "SyncMaster Purple", hex: "#4B4BC0", usage: "Primary brand color — buttons, links, highlights" },
  { name: "Foreground", hex: "#111111", usage: "Body text and headings (light mode)" },
  { name: "Muted", hex: "#666666", usage: "Secondary text, captions" },
  { name: "Background", hex: "#FFFFFF", usage: "Page and card backgrounds (light mode)" },
  { name: "Dark Background", hex: "#0F0F1A", usage: "Page background (dark mode)" },
  { name: "Emerald", hex: "#22C55E", usage: "Supervisor accent, success states" },
]

export default function BrandPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      {/* Navigation */}
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="pt-20 pb-16 border-b border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Press &amp; Brand</p>
              <h1 className="text-5xl md:text-6xl font-black tracking-[-0.03em] leading-[1.1] mb-6">Brand Assets</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Official SyncMaster logos and brand guidelines for use in press coverage, presentations, and partner materials. Please follow the usage guidelines below.
              </p>
            </div>
          </div>
        </section>

        {/* Logos */}
        <section className="py-24 border-b border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black tracking-tight">Logo Downloads</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Light version */}
              <div className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-center p-16 bg-[#0f0f1a] min-h-[200px]">
                  <div className="relative w-56 h-14">
                    <Image src="/syncmaster-logo-light.svg" alt="SyncMaster Logo (Light)" fill className="object-contain" />
                  </div>
                </div>
                <div className="p-8 pt-0 flex flex-col gap-4">
                  <div>
                    <p className="font-bold text-base">Light Logo</p>
                    <p className="text-sm text-muted-foreground mt-1">Use on dark or colored backgrounds.</p>
                  </div>
                  <a
                    href="/syncmaster-logo-light.svg"
                    download
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                    Download SVG
                  </a>
                </div>
              </div>

              {/* Dark version */}
              <div className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-center p-16 bg-white min-h-[200px]">
                  <div className="relative w-56 h-14">
                    <Image src="/syncmaster-logo-dark.svg" alt="SyncMaster Logo (Dark)" fill className="object-contain" />
                  </div>
                </div>
                <div className="p-8 pt-0 flex flex-col gap-4">
                  <div>
                    <p className="font-bold text-base">Dark Logo</p>
                    <p className="text-sm text-muted-foreground mt-1">Use on white or light backgrounds.</p>
                  </div>
                  <a
                    href="/syncmaster-logo-dark.svg"
                    download
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                    Download SVG
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="py-24 border-b border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-12 flex flex-col items-center">
              <h2 className="text-3xl font-black tracking-tight mb-4">Brand Colors</h2>
              <p className="text-muted-foreground max-w-xl">Core palette for use across all brand touchpoints.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {colors.map((color) => (
                <div key={color.hex} className="flex flex-col gap-3">
                  <div
                    className="w-full h-20 rounded-[1rem] border border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="font-bold text-sm">{color.name}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{color.hex}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="py-24 border-b border-border">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black tracking-tight">Typography</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto">
              <div className="flex flex-col gap-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Primary Typeface</p>
                <p className="text-5xl font-black tracking-tight">DM Sans</p>
                <p className="text-muted-foreground leading-relaxed">Used for all headings, body copy, and UI elements. Available via Google Fonts.</p>
                <div className="flex flex-wrap gap-3 text-sm font-bold text-muted-foreground">
                  <span>300 Light</span>
                  <span>400 Regular</span>
                  <span>700 Bold</span>
                  <span>900 Black</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Monospace</p>
                <p className="text-5xl font-mono font-bold tracking-tight">Geist Mono</p>
                <p className="text-muted-foreground leading-relaxed">Used for numeric values, code, and technical metadata in the product UI.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="py-24">
          <div className="max-w-screen-2xl w-full mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black tracking-tight">Usage Guidelines</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col gap-4 p-8 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Do</p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Use the logo at full size with adequate clear space",
                    "Use the light logo on dark or colored backgrounds",
                    "Use the dark logo on white or light backgrounds",
                    "Maintain the original logo proportions when resizing",
                    "Credit SyncMaster when writing about the platform",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4 p-8 rounded-[1.5rem] bg-destructive/5 border border-destructive/20">
                <p className="text-xs font-bold uppercase tracking-widest text-destructive">Don&apos;t</p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Alter, distort, or rotate the logo",
                    "Change the logo colors",
                    "Place the logo on busy or low-contrast backgrounds",
                    "Use the logo to imply endorsement without permission",
                    "Recreate the logo from scratch or modify letterforms",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-10 text-center">
              Questions about brand usage?{' '}
              <Link href="/contact" className="text-primary font-bold hover:underline underline-offset-4">
                Contact us
              </Link>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
