import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const sizeStyles = {
  sm: "h-10 w-10 rounded-xl text-sm",
  md: "h-14 w-14 rounded-2xl text-base",
  lg: "h-16 w-16 rounded-2xl text-lg",
  xl: "h-20 w-20 rounded-3xl text-xl",
}

export interface KeyboardKeyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeStyles | number
  asChild?: boolean
}

const KeyboardKey = React.forwardRef<HTMLDivElement, KeyboardKeyProps>(
  ({ className, size = "md", asChild = false, style, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    const isNumberSize = typeof size === "number"

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex select-none items-center justify-center overflow-hidden",
          "border border-white/10 bg-zinc-700 text-white/90",
          "shadow-[0_6px_0_0_rgba(0,0,0,0.45),0_12px_20px_rgba(0,0,0,0.35)]",
          "transition-transform duration-100 ease-out",
          "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/25 before:to-transparent before:opacity-70",
          "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-br after:from-white/10 after:to-black/30",
          "active:translate-y-1 active:shadow-[0_3px_0_0_rgba(0,0,0,0.45),0_6px_12px_rgba(0,0,0,0.3)]",
          !isNumberSize && sizeStyles[size],
          className
        )}
        style={isNumberSize ? { width: size, height: size, ...style } : style}
        {...props}
      >
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      </Comp>
    )
  }
)
KeyboardKey.displayName = "KeyboardKey"

export { KeyboardKey }
