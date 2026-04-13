import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning'
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-red-600 text-white shadow hover:bg-red-600/80",
    secondary: "border-transparent bg-slate-800 text-white hover:bg-slate-800/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    outline: "text-white border-slate-700 hover:bg-slate-800",
    warning: "border-transparent bg-orange-600 text-white hover:bg-orange-600/80",
  }

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 italic", 
        variants[variant as keyof typeof variants], 
        className
      )} 
      {...props} 
    />
  )
}

export { Badge }
