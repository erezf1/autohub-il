# Gradient Colors Centralization Guide

## Overview
All gradient colors used across the application are now centralized in a single configuration file. This ensures consistency and makes it easy to update the gradient theme throughout the entire app.

## Configuration File
**Location:** `src/constants/gradientColors.ts`

```typescript
export const GRADIENT_COLORS = {
  from: "#2277ee",
  to: "#5be1fd",
} as const;
```

## Components Using Centralized Colors

### 1. GradientBorderContainer
- **File:** `src/components/ui/gradient-border-container.tsx`
- **Usage:** Wraps elements with a gradient border
- **Default Colors:** Uses `GRADIENT_COLORS.from` and `GRADIENT_COLORS.to`

### 2. GradientSeparator
- **File:** `src/components/ui/gradient-separator.tsx`
- **Usage:** Creates horizontal or vertical gradient separator lines
- **Default Colors:** Uses `GRADIENT_COLORS.from` and `GRADIENT_COLORS.to`

## How to Change Gradient Colors

### To change colors throughout the entire app:
1. Open `src/constants/gradientColors.ts`
2. Update the `from` and `to` values:
```typescript
export const GRADIENT_COLORS = {
  from: "#YOUR_START_COLOR",  // Change this
  to: "#YOUR_END_COLOR",      // Change this
} as const;
```
3. Save the file
4. All components will automatically use the new colors

### Benefits:
- ✅ Single source of truth for gradient colors
- ✅ Consistent gradient theme across the app
- ✅ Easy to maintain and update
- ✅ No need to search and replace in multiple files
- ✅ Type-safe with TypeScript

## Usage Examples

### Using default colors (recommended):
```tsx
// Both components automatically use centralized colors
<GradientBorderContainer>
  <YourContent />
</GradientBorderContainer>

<GradientSeparator />
```

### Overriding colors (for special cases):
```tsx
// You can still override if needed for specific use cases
<GradientBorderContainer fromColor="#custom1" toColor="#custom2">
  <YourContent />
</GradientBorderContainer>

<GradientSeparator fromColor="#custom1" toColor="#custom2" />
```

## Current Gradient Colors
- **From:** `#2277ee` (Blue)
- **To:** `#5be1fd` (Cyan)

## Components Affected by Changes
When you update `gradientColors.ts`, these components will automatically reflect the changes:
- All `GradientBorderContainer` instances (buttons, inputs, dropdowns, etc.)
- All `GradientSeparator` instances
- Any custom component using the centralized gradient colors

## Related Documentation
- [Gradient Border Guide](./GRADIENT_BORDER_GUIDE.md)
- [Hover Styles Guide](./HOVER_STYLES_GUIDE.md)
