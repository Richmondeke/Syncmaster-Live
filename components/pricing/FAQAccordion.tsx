'use client'

import { useState } from 'react'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FAQItem = { q: string; a: React.ReactNode }
export type FAQSection = { title: string; items: FAQItem[] }

export function FAQAccordion({ sections }: { sections: FAQSection[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-12 text-left">
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary">{section.title}</h3>
          <div className="flex flex-col divide-y divide-border">
            {section.items.map((item) => {
              const id = `${section.title}-${item.q}`
              const isOpen = open === id
              return (
                <div key={id} className="border-border">
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-primary transition-colors focus:outline-none"
                  >
                    <span className="font-black text-lg tracking-[-0.04em] text-foreground">{item.q}</span>
                    <ChevronDown className={cn('w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen && (
                    <p className="pb-5 text-muted-foreground leading-relaxed text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                      {item.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
