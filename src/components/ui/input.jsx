import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, error, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-blue-500 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-blue-400 focus-visible:ring-[2px] focus-visible:ring-blue-100',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        error && 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200',
        className
      )}
      {...props}
    />
  )
}

export { Input }
