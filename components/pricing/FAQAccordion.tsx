'use client'

import { ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FAQItem = {
  q: string
  a: ReactNode
}

export type FAQSection = {
  title: string
  items: FAQItem[]
}

interface FAQAccordionProps {
  sections: FAQSection[]
}

export function FAQAccordion({ sections }: FAQAccordionProps) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-12 text-left">
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary">
            {section.title}
          </h3>
          <div className="flex flex-col divide-y divide-border">
            {section.items.map((item) => {
              const id = `${section.title}-${item.q}`
              const isOpen = open === id
              return (
                <div key={id} className="overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-primary transition-colors cursor-pointer group"
                  >
                    <span className="font-black text-lg tracking-[-0.04em] text-foreground group-hover:text-primary transition-colors">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200',
                        isOpen && 'rotate-180 text-primary'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'transition-all duration-200 ease-in-out',
                      isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
                    )}
                  >
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
