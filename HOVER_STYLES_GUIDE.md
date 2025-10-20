# Global Hover Styles Guide

## Overview
This application uses a centralized hover style system that ensures consistent button and icon hover behavior across all pages. All hover styles are configured in one place and can be easily customized.

## Quick Customization

### How to Change Hover Colors Globally

To change the hover background or text color for the entire application:

1. Open `src/index.css`
2. Find the `/* Global Hover States - CUSTOMIZE HERE */` section (around line 36)
3. Modify these CSS custom properties:

```css
/* Global Hover States - CUSTOMIZE HERE */
--hover-bg: 193 97% 67%;  /* Cyan background on hover - CHANGE THIS */
--hover-text: 0 0% 0%;     /* Black text on hover - CHANGE THIS */
--hover-icon: 0 0% 0%;     /* Black icon on hover - CHANGE THIS */
```

### Color Format
Colors use HSL format without the `hsl()` wrapper:
- Format: `H S% L%` (Hue Saturation% Lightness%)
- Example: `193 97% 67%` = Cyan color
- Example: `0 0% 0%` = Black
- Example: `0 0% 100%` = White

### Common Colors
Here are some common colors you might want to use:

```css
/* Blues & Cyans */
--hover-bg: 193 97% 67%;   /* Current Cyan */
--hover-bg: 217 91% 70%;   /* Blue */
--hover-bg: 200 100% 50%;  /* Bright Blue */

/* Greens */
--hover-bg: 142 76% 45%;   /* Green */
--hover-bg: 120 100% 40%;  /* Bright Green */

/* Purples */
--hover-bg: 262 83% 65%;   /* Purple */
--hover-bg: 280 100% 70%;  /* Magenta */

/* Oranges/Reds */
--hover-bg: 14 91% 60%;    /* Orange */
--hover-bg: 0 84% 60%;     /* Red */

/* Grays */
--hover-text: 0 0% 0%;     /* Black */
--hover-text: 0 0% 100%;   /* White */
--hover-text: 0 0% 50%;    /* Gray */
```

## How It Works

### CSS Classes

The system provides two main CSS classes:

#### 1. `btn-hover-cyan`
Used for buttons - changes background AND text color on hover.

**Usage:**
```tsx
<Button variant="outline" className="btn-hover-cyan">
  My Button
</Button>
```

**What it does:**
- On hover: Background becomes the `--hover-bg` color
- On hover: Text and icons become the `--hover-text` color

#### 2. `icon-hover-cyan`
Used for standalone icons - only changes the icon color on hover.

**Usage:**
```tsx
<MessageCircle className="icon-hover-cyan" />
```

**What it does:**
- On hover: Icon color becomes the `--hover-bg` color

### Automatic Application

The following button variants automatically include hover styles:
- `variant="outline"` - Uses `btn-hover-cyan`
- `variant="ghost"` - Uses `btn-hover-cyan`

This means most buttons in the app will automatically get consistent hover behavior without any additional classes.

## Examples

### Button with Hover (Automatic)
```tsx
// This button automatically gets cyan hover with black text
<Button variant="outline">
  <Filter className="h-4 w-4" />
  Filter
</Button>
```

### Icon with Hover
```tsx
// This icon changes to cyan on hover
<Bell className="icon-hover-cyan" />
```

### Custom Button with Hover
```tsx
// Custom styled button that still uses global hover
<Button 
  variant="ghost"
  className="bg-black text-white"
>
  My Custom Button
</Button>
```

## Components Using Hover Styles

### Mobile Components
- `FilterButton` - Filter button in search/list pages
- `SearchBar` - Search input components
- `MobileHeader` - Header icons (chat, notifications, profile)
- `MobileTabBar` - Bottom navigation tabs

### Mobile Pages
- `CarSearchScreen` - Search and filter buttons
- `HotCarsScreen` - Boost management and filter buttons
- `BidsScreen` - Filter buttons
- `MyVehiclesScreen` - Filter buttons
- `MyProfileScreen` - Edit profile button

### Admin Pages
- All admin pages automatically use consistent hover styles through Button variants

## Testing Changes

After modifying hover colors:

1. Save `src/index.css`
2. Check these pages to verify the changes:
   - Mobile: Search page (filter button)
   - Mobile: Hot Cars page (filter and "הבוסטים שלי" buttons)
   - Mobile: Profile page (edit button)
   - Admin: Any page with outline or ghost buttons

## Troubleshooting

### Hover not working?
1. Make sure the component uses `Button` with `variant="outline"` or `variant="ghost"`
2. For icons, ensure the `icon-hover-cyan` class is applied
3. Check that custom className isn't overriding hover styles with `!important`

### Different hover on some buttons?
- Pre-login screens (Welcome, Login, Register) intentionally have different styling
- Primary buttons (`variant="default"`) have their own gradient hover
- Destructive buttons (`variant="destructive"`) have red hover

### Need button-specific hover?
Add a custom class after the variant to override specific buttons:
```tsx
<Button variant="outline" className="hover:bg-red-500 hover:text-white">
  Special Button
</Button>
```

## File Structure

```
src/
  index.css                    # Global hover configuration (MAIN FILE TO EDIT)
  components/
    ui/
      button.tsx              # Button component with hover variants
    common/
      FilterButton.tsx        # Uses Button with outline variant
      SearchBar.tsx           # Uses Input with hover styles
    mobile/
      MobileHeader.tsx        # Header icons with icon-hover-cyan
      MobileTabBar.tsx        # Tab icons with icon-hover-cyan
```

## Need Help?

If you need to customize hover behavior beyond changing colors:
1. Check `src/index.css` lines 268-295 for the CSS classes
2. Modify the `.btn-hover-cyan` or `.icon-hover-cyan` classes
3. The styles use CSS custom properties, so changes are instant
