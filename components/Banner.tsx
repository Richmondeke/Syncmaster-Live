import React from 'react'

type BannerProps = {
  children: React.ReactNode
  variant?: 'default' | 'error' | 'warning' | 'success' | 'info'
}

const variantStyles = {
  default: 'border-l-primary bg-muted/30',
  error: 'border-l-destructive bg-destructive/10 text-destructive',
  warning: 'border-l-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  success: 'border-l-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  info: 'border-l-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400'
}

export function Banner({ children, variant = 'default' }: BannerProps) {
  return (
    <div className={`border border-border/50 border-l-4 p-4 rounded-xl flex items-center justify-between gap-4 transition-all hover:opacity-90 group ${variantStyles[variant]}`}>
      <div className="flex-1 font-medium text-sm">
        {children}
      </div>
    </div>
  )
}
