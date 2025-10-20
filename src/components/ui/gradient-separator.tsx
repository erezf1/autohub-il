import * as React from "react"
import { cn } from "@/lib/utils"
import { GRADIENT_COLORS } from "@/constants/gradientColors"

export interface GradientSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  thickness?: number
  fromColor?: string
  toColor?: string
  decorative?: boolean
}

const GradientSeparator = React.forwardRef<
  HTMLDivElement,
  GradientSeparatorProps
>(({ 
  className, 
  orientation = "horizontal",
  thickness = 1, 
  fromColor = GRADIENT_COLORS.from, 
  toColor = GRADIENT_COLORS.to,
  decorative = true,
  style,
  ...props 
}, ref) => {
  const isHorizontal = orientation === "horizontal"
  
  const separatorStyle = {
    ...style,
    background: `linear-gradient(to ${isHorizontal ? 'right' : 'bottom'}, ${fromColor}, ${toColor})`,
    width: isHorizontal ? '100%' : `${thickness}px`,
    height: isHorizontal ? `${thickness}px` : '100%',
    minHeight: isHorizontal ? `${thickness}px` : undefined,
    minWidth: isHorizontal ? undefined : `${thickness}px`,
    // Add anti-aliasing and smoother rendering
    transform: 'translateZ(0)', // Hardware acceleration
    backfaceVisibility: 'hidden' as const,
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
  }

  return (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={!decorative ? orientation : undefined}
      className={cn("gradient-separator", className)}
      style={separatorStyle}
      {...props}
    />
  )
})

GradientSeparator.displayName = "GradientSeparator"

export { GradientSeparator }
