import * as React from 'react'
import { cn } from '@/lib/utils'

const base =
  'w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-jmc-rosa focus:outline-none focus:ring-2 focus:ring-jmc-rosa/40'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...props} />
}
export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, 'min-h-28 resize-y', className)} {...props} />
}
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-white/80', className)} {...props} />
}
