'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export function Toaster({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onRemove])

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  return (
    <div className={cn(
      "pointer-events-auto flex items-center gap-3 p-4 bg-white border-2 border-border/50 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 min-w-[300px]",
      "hover:border-primary/20 transition-all group"
    )}>
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>
      <p className="flex-1 text-sm font-black text-[#1a1a2e] tracking-tight">
        {toast.message}
      </p>
      <button 
        onClick={onRemove}
        className="text-muted-foreground/30 hover:text-[#1a1a2e] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
