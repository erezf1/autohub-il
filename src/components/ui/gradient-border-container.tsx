import * as React from "react"
import { cn } from "@/lib/utils"
import { GRADIENT_COLORS } from "@/constants/gradientColors"

export interface GradientBorderContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number
  fromColor?: string
  toColor?: string
  children: React.ReactNode
}

const GradientBorderContainer = React.forwardRef<
  HTMLDivElement,
  GradientBorderContainerProps
>(({ 
  className, 
  children, 
  borderWidth = 1, 
  fromColor = GRADIENT_COLORS.from, 
  toColor = GRADIENT_COLORS.to, 
  style,
  ...props 
}, ref) => {
  const containerStyle = {
    ...style,
    background: `linear-gradient(to right, ${fromColor}, ${toColor})`,
    padding: `${borderWidth}px`,
    // Add anti-aliasing and smoother rendering
    transform: 'translateZ(0)', // Hardware acceleration
    backfaceVisibility: 'hidden' as const,
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
  }

  const innerStyle = {
    // Use a very slight inset box-shadow for sharper edges
    boxShadow: `inset 0 0 0 ${borderWidth}px hsl(var(--background))`,
    background: 'hsl(var(--background))',
  }

  return (
    <div
      ref={ref}
      className={cn("gradient-border-container", className)}
      style={containerStyle}
      {...props}
    >
      <div 
        className="w-full h-full"
        style={{
          ...innerStyle,
          borderRadius: `calc(var(--radius) - ${borderWidth}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
})

GradientBorderContainer.displayName = "GradientBorderContainer"

export { GradientBorderContainer }