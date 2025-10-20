# Gradient Border Container Guide

## Overview
The `GradientBorderContainer` component provides consistent gradient borders throughout the application. All gradient border styling is centralized in one component, making it easy to update the gradient colors globally.

## Quick Customization

### How to Change Gradient Border Colors Globally

To change the gradient border colors for the entire application:

1. Open `src/components/ui/gradient-border-container.tsx`
2. Find the default props (lines 17-18):

```tsx
fromColor = "#2277ee",  // Start color (blue) - CHANGE THIS
toColor = "#5be1fd",     // End color (cyan) - CHANGE THIS
```

3. Change these values to your desired colors

**That's it!** All gradient borders across the entire app will update instantly.

### Color Format
Colors use standard HEX format:
- Format: `#RRGGBB`
- Example: `#2277ee` = Blue
- Example: `#5be1fd` = Cyan
- Example: `#ff0000` = Red
- Example: `#00ff00` = Green

### Common Gradient Color Combinations

```tsx
/* Current (Blue to Cyan) */
fromColor = "#2277ee"
toColor = "#5be1fd"

/* Purple to Pink */
fromColor = "#8b5cf6"
toColor = "#ec4899"

/* Orange to Yellow */
fromColor = "#f97316"
toColor = "#fbbf24"

/* Green to Teal */
fromColor = "#10b981"
toColor = "#14b8a6"

/* Red to Orange */
fromColor = "#ef4444"
toColor = "#f97316"

/* Indigo to Purple */
fromColor = "#6366f1"
toColor = "#a855f7"
```

## Usage

### Basic Usage (Uses Default Colors)
```tsx
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

<GradientBorderContainer className="rounded-md">
  <Card>
    Your content here
  </Card>
</GradientBorderContainer>
```

### Custom Border Width
```tsx
<GradientBorderContainer 
  className="rounded-md"
  borderWidth={2}  // Default is 1
>
  <Card>Thicker border</Card>
</GradientBorderContainer>
```

### Per-Instance Custom Colors (Not Recommended)
While possible, this defeats the purpose of centralized styling:
```tsx
<GradientBorderContainer 
  fromColor="#ff0000"
  toColor="#00ff00"
  className="rounded-md"
>
  <Card>Custom colors</Card>
</GradientBorderContainer>
```

**⚠️ Warning:** Using custom colors per-instance means that changing the global colors won't affect this component. We've removed all such instances from the codebase.

## Components Using GradientBorderContainer

### Mobile Pages
- **CarSearchScreen** - Search and filter bar
- **DashboardScreen** - All 4 stat cards
- **HotCarsScreen** - Boost button, search/filter bar, vehicle cards
- **BidsScreen** - Filter button, bid cards, auction cards
- **MyProfileScreen** - Edit button, subscription card, profile info card
- **ProfileEditScreen** - Subscription info card, form card
- **MyVehiclesScreen** - Vehicle cards
- **RequiredCarsScreen** - ISO request cards
- **ChatListScreen** - Chat item cards
- **ChatDetailScreen** - Header card, message input card
- **ChatRequestScreen** - Context cards
- **NotificationListScreen** - Notification cards

### Auth Screens
- **WelcomeScreen** - Main card
- **LoginScreen** - Login form card
- **RegisterScreen** - Registration form card

### Landing Page
- **LandingPage** - Mobile interface card, Admin interface card

### Common Components
- **VehicleCard** - Vehicle listing cards
- **SearchFilterBar** - Search and filter components

## How It Works

### Component Structure
The `GradientBorderContainer` creates a border effect using CSS:
1. Outer div has the gradient background
2. Inner div has the app background color
3. Padding on outer div creates the "border" effect

### Default Props
```tsx
borderWidth = 1          // Thickness of the gradient border in pixels
fromColor = "#2277ee"   // Start color of gradient (left/top)
toColor = "#5be1fd"     // End color of gradient (right/bottom)
```

### Props Interface
```tsx
export interface GradientBorderContainerProps {
  borderWidth?: number      // Optional: border thickness
  fromColor?: string        // Optional: gradient start color
  toColor?: string          // Optional: gradient end color
  className?: string        // Optional: additional CSS classes
  children: React.ReactNode // Required: content to wrap
}
```

## Testing Changes

After modifying the default gradient colors:

1. Save `src/components/ui/gradient-border-container.tsx`
2. Check these pages to verify the changes:
   - Mobile: Dashboard (stat cards)
   - Mobile: Search page (search bar and filter button)
   - Mobile: Hot Cars page (vehicle cards)
   - Mobile: Profile page (cards)
   - Landing page (both main cards)

3. All gradient borders should now use your new colors!

## Best Practices

### ✅ DO:
- Use `GradientBorderContainer` without `fromColor` or `toColor` props
- Change colors in the component file for global updates
- Add `className` for styling the container itself
- Use consistent border radius with Tailwind classes

### ❌ DON'T:
- Don't add `fromColor` or `toColor` props to individual instances
- Don't create multiple gradient border components
- Don't hardcode gradient colors in inline styles elsewhere
- Don't forget to test on multiple pages after changes

## Examples

### Dashboard Stat Card
```tsx
<GradientBorderContainer className="rounded-md flex-1">
  <Card className="card-interactive border-0 bg-black rounded-md">
    <CardHeader>
      <CardTitle>Stats</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Content here</p>
    </CardContent>
  </Card>
</GradientBorderContainer>
```

### Search Bar with Filter
```tsx
<div className="flex gap-2">
  <GradientBorderContainer className="rounded-md flex-1">
    <SearchBar placeholder="Search..." />
  </GradientBorderContainer>
  
  <GradientBorderContainer className="rounded-md">
    <FilterButton onClick={handleFilter} />
  </GradientBorderContainer>
</div>
```

### Vehicle Card
```tsx
<GradientBorderContainer className="rounded-md">
  <Card className="bg-black border-0">
    <img src={vehicle.image} alt={vehicle.name} />
    <CardContent>
      <h3>{vehicle.name}</h3>
      <p>{vehicle.price}</p>
    </CardContent>
  </Card>
</GradientBorderContainer>
```

## Troubleshooting

### Borders not showing?
1. Make sure the inner content has a background color (usually `bg-black`)
2. Check that `borderWidth` is set (default is 1)
3. Verify the container has proper dimensions

### Some borders didn't change?
1. Search for `fromColor=` or `toColor=` in the codebase
2. Remove any hardcoded color props from specific instances
3. Those instances will then use the global defaults

### Border too thick/thin?
- Adjust the `borderWidth` prop on specific instances
- Or change the default in the component file

### Wrong gradient direction?
- The gradient goes from left to right (or top to bottom when stacked)
- Modify the `background` style in the component to change direction:
  ```tsx
  background: `linear-gradient(to right, ${fromColor}, ${toColor})`
  // Change "to right" to "to bottom", "135deg", etc.
  ```

## Related Files

```
src/
  components/
    ui/
      gradient-border-container.tsx  # MAIN FILE - Edit gradient colors here
    common/
      VehicleCard.tsx               # Uses GradientBorderContainer
      SearchFilterBar.tsx           # Uses GradientBorderContainer
  pages/
    LandingPage.tsx                 # Uses GradientBorderContainer
    mobile/
      Dashboard Screen.tsx           # Uses GradientBorderContainer (4x)
      HotCarsScreen.tsx             # Uses GradientBorderContainer (4x)
      MyProfileScreen.tsx           # Uses GradientBorderContainer (3x)
      ... and many more
```

## Summary

✅ **All gradient borders now use centralized defaults**
✅ **Change colors in ONE file** (`gradient-border-container.tsx`)
✅ **All instances updated** (31 hardcoded color props removed)
✅ **Consistent design** throughout the app

🎨 **To change gradient colors globally:** Edit lines 17-18 in `src/components/ui/gradient-border-container.tsx`
