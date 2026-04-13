import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'sos'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xl'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-red-600 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)]",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-slate-800 bg-transparent hover:bg-slate-800 hover:text-white",
      secondary: "bg-slate-800 text-white hover:bg-slate-700",
      ghost: "hover:bg-slate-800 hover:text-white",
      link: "text-red-500 underline-offset-4 hover:underline",
      sos: "bg-red-600 text-white rounded-full font-black text-4xl shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-pulse hover:scale-105 active:scale-95 transition-all border-8 border-red-900/50"
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-8 text-lg",
      xl: "w-48 h-48 rounded-full",
      icon: "h-9 w-9",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-black uppercase tracking-widest ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 italic",
          variants[variant as keyof typeof variants],
          sizes[size as keyof typeof sizes],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
