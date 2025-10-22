# Auto-Hub UI Styling Guide
## Global Design System Documentation

> **Purpose:** This guide documents the UI styling patterns used in the Profile page (הפרופיל שלי) and Vehicles page (מאגר הרכבים) to ensure consistent styling across all screens in the application.

---

## Table of Contents
1. [Core Design Philosophy](#core-design-philosophy)
2. [Global Elements & Components](#global-elements--components)
3. [Color System](#color-system)
4. [Typography & Text](#typography--text)
5. [Layout Patterns](#layout-patterns)
6. [Card Styling](#card-styling)
7. [Interactive Elements](#interactive-elements)
8. [Icons & SVG Elements](#icons--svg-elements)
9. [Spacing & Structure](#spacing--structure)
10. [RTL Support](#rtl-support)
11. [Component Usage Examples](#component-usage-examples)

---

## Core Design Philosophy

### Dark Theme First
- **Primary Background:** Black (`bg-black` or `--background: 0 0% 0%`)
- **Card Backgrounds:** Black with dark gray variants (`bg-black`, `--card: 197 98% 16%`)
- **Text on Dark:** White text (`text-white`, `text-foreground`)
- **Accent Elements:** Cyan to Blue gradient (`#2277ee` → `#5be1fd`)

### Key Principles
1. **Gradient Borders** - All interactive cards and containers use gradient borders
2. **Consistent Spacing** - Use Tailwind spacing scale (p-4, p-6, space-y-4, etc.)
3. **Hebrew Text Class** - Always apply `hebrew-text` class for Hebrew content
4. **RTL Direction** - Use `dir="rtl"` on Hebrew content containers
5. **Black Card Backgrounds** - Inner cards always use `bg-black border-0`

---

## Global Elements & Components

### 1. GradientBorderContainer

**Purpose:** Wraps all major cards and interactive elements with a consistent gradient border.

**Location:** `src/components/ui/gradient-border-container.tsx`

**Configuration:** `src/constants/gradientColors.ts`

```tsx
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

// Basic Usage (recommended)
<GradientBorderContainer className="rounded-md">
  <Card className="bg-black border-0 rounded-md">
    {/* Your content */}
  </Card>
</GradientBorderContainer>

// With custom border width
<GradientBorderContainer className="rounded-md" borderWidth={2}>
  <Card className="bg-black border-0 rounded-md">
    {/* Thicker border */}
  </Card>
</GradientBorderContainer>
```

**Key Props:**
- `className` - Additional CSS classes (always include `rounded-md`)
- `borderWidth` - Border thickness in pixels (default: 1)
- `fromColor` - Gradient start color (default: uses global config)
- `toColor` - Gradient end color (default: uses global config)

**Important Notes:**
- ⚠️ Always wrap Card components with `bg-black border-0` inside
- ⚠️ Always include `rounded-md` on the container
- ⚠️ Don't override `fromColor`/`toColor` unless absolutely necessary

### 2. GradientSeparator

**Purpose:** Creates horizontal or vertical gradient lines to separate content within cards.

**Location:** `src/components/ui/gradient-separator.tsx`

```tsx
import { GradientSeparator } from "@/components/ui/gradient-separator";

// Horizontal separator (default)
<GradientSeparator />

// With custom styling
<GradientSeparator className="my-4" />

// Vertical separator
<GradientSeparator orientation="vertical" />

// Custom thickness
<GradientSeparator thickness={2} />
```

**Key Props:**
- `orientation` - "horizontal" (default) or "vertical"
- `thickness` - Line thickness in pixels (default: 1)
- `className` - Additional CSS classes for spacing

**Usage Pattern:**
```tsx
<div className="space-y-4">
  <div>First section</div>
  <GradientSeparator />
  <div>Second section</div>
  <GradientSeparator />
  <div>Third section</div>
</div>
```

### 3. SuperArrowsIcon

**Purpose:** Animated back navigation icon with hover effects.

**Location:** `src/components/common/SuperArrowsIcon.tsx`

```tsx
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";

<div 
  onClick={() => navigate(-1)}
  className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
>
  <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
</div>
```

**Key Features:**
- Animated on hover
- White glow effect
- Standard size: h-6 w-6
- Always use with cursor-pointer and onClick handler

---

## Color System

### Primary Gradient
**Configuration File:** `src/constants/gradientColors.ts`

```typescript
export const GRADIENT_COLORS = {
  from: "#2277ee",  // Blue
  to: "#5be1fd",    // Cyan
} as const;
```

**Where Used:**
- GradientBorderContainer borders
- GradientSeparator lines
- Icon gradients (via SVG)
- Primary buttons and accents

### CSS Custom Properties
**Location:** `src/index.css`

```css
:root {
  /* Core Colors */
  --background: 0 0% 0%;              /* Black */
  --foreground: 0 0% 100%;            /* White */
  
  /* Cards */
  --card: 197 98% 16%;                /* Dark gray-blue */
  --card-foreground: 0 0% 100%;       /* White */
  
  /* Primary Accent */
  --primary: 193 97% 67%;             /* Cyan */
  --primary-foreground: 0 0% 100%;    /* White */
  
  /* Hover States */
  --hover-bg: 193 97% 67%;            /* Cyan background */
  --hover-text: 0 0% 0%;              /* Black text */
  --hover-icon: 0 0% 0%;              /* Black icon */
  
  /* Muted/Secondary */
  --muted: 0 0% 15%;                  /* Dark gray */
  --muted-foreground: 0 0% 70%;       /* Light gray */
  
  /* Border/Input */
  --border: 0 0% 20%;                 /* Gray */
  --input: 197 98% 12%;               /* Dark blue-gray */
}
```

### Tailwind Color Classes

**Backgrounds:**
```tsx
className="bg-black"           // Main background
className="bg-muted"           // Muted gray background
className="bg-primary"         // Cyan accent background
```

**Text Colors:**
```tsx
className="text-white"         // Primary text on dark
className="text-foreground"    // Semantic foreground
className="text-muted-foreground" // Secondary/muted text
className="text-primary"       // Cyan accent text
className="text-orange-500"    // Warning/boost colors
className="text-yellow-600"    // Gold tier color
className="text-gray-600"      // Silver tier color
className="text-orange-700"    // Bronze tier color
```

---

## Typography & Text

### Hebrew Text Class

**Critical:** Always use `hebrew-text` class on Hebrew content.

```tsx
<h1 className="text-2xl font-bold text-foreground hebrew-text">
  הפרופיל שלי
</h1>

<p className="text-sm text-muted-foreground hebrew-text">
  זהו תיאור בעברית
</p>
```

**Font Sizes:**
```tsx
className="text-4xl"   // Large headings (Admin pages)
className="text-3xl"   // Page titles (Admin)
className="text-2xl"   // Section titles (Mobile)
className="text-xl"    // Card titles
className="text-lg"    // Subtitles/descriptions
className="text-base"  // Body text (explicit 16px)
className="text-sm"    // Secondary text
className="text-xs"    // Helper text/badges
```

**Font Weights:**
```tsx
className="font-bold"      // Headings, labels
className="font-semibold"  // Sub-headings
className="font-medium"    // Emphasis
className="font-normal"    // Body text (default)
```

### Typography Patterns

**Page Header:**
```tsx
<div>
  <h1 className="text-2xl font-bold text-foreground hebrew-text">
    הפרופיל שלי
  </h1>
</div>
```

**Card Title:**
```tsx
<CardHeader>
  <CardTitle className="text-2xl hebrew-text">
    רשימת רכבים ({count})
  </CardTitle>
</CardHeader>
```

**Label + Value:**
```tsx
<div className="flex items-center space-x-2 space-x-reverse">
  <Label className="text-base font-bold hebrew-text">
    שם העסק:
  </Label>
  <span className="text-sm text-foreground hebrew-text">
    {businessName}
  </span>
</div>
```

---

## Layout Patterns

### Page Container

**Mobile Pages:**
```tsx
<div className="container max-w-md mx-auto px-4 space-y-4" dir="rtl">
  {/* Content */}
</div>
```

**Admin Pages:**
```tsx
<div className="space-y-8">
  {/* Content with larger spacing */}
</div>
```

### Header with Navigation

**Mobile Pattern:**
```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div 
      onClick={() => navigate(-1)}
      className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
    >
      <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
    </div>
    <h1 className="text-2xl font-bold text-foreground hebrew-text">
      הפרופיל שלי
    </h1>
  </div>
  
  {/* Right-side action button */}
  <GradientBorderContainer className="rounded-md">
    <Button 
      variant="ghost" 
      size="sm"
      className="bg-black border-0 text-white"
    >
      <Edit3 className="h-5 w-5 ml-1" />
      ערוך פרופיל
    </Button>
  </GradientBorderContainer>
</div>
```

**Admin Pattern:**
```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold text-foreground hebrew-text">
      ניהול רכבים
    </h1>
    <p className="text-lg text-muted-foreground hebrew-text mt-2">
      ניהול כל הרכבים במערכת
    </p>
  </div>
  <Button size="lg" className="hebrew-text">
    <Plus className="h-4 w-4 ml-2" />
    הוסף רכב חדש
  </Button>
</div>
```

---

## Card Styling

### Standard Card Structure

```tsx
<GradientBorderContainer className="rounded-md flex-1">
  <Card className="bg-black border-0 rounded-md">
    <CardContent className="p-6">
      {/* Card content */}
    </CardContent>
  </Card>
</GradientBorderContainer>
```

**Key Elements:**
1. **Outer:** `GradientBorderContainer` with `rounded-md`
2. **Inner:** `Card` with `bg-black border-0 rounded-md`
3. **Content:** `CardContent` with appropriate padding

### Card with Header

```tsx
<GradientBorderContainer className="rounded-md flex-1">
  <Card className="bg-black border-0 rounded-md">
    <CardHeader>
      <CardTitle className="text-2xl hebrew-text">
        כותרת הכרטיס
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      {/* Content */}
    </CardContent>
  </Card>
</GradientBorderContainer>
```

### Black Card with White Text

**Standard pattern from Profile page:**

```tsx
<GradientBorderContainer className="rounded-md flex-1">
  <Card className="bg-black border-0 rounded-md">
    <CardContent className="p-6 space-y-4">
      {/* SVG Gradient for Icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2277ee" />
            <stop offset="100%" stopColor="#5be1fd" />
          </linearGradient>
        </defs>
      </svg>

      <div className="space-y-4">
        {/* Content sections with gradient separators */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <Building className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
          <Label className="text-base font-bold hebrew-text">
            שם העסק:
          </Label>
          <span className="text-sm text-foreground hebrew-text">
            {businessName}
          </span>
        </div>
        
        <GradientSeparator />
        
        {/* More sections... */}
      </div>
    </CardContent>
  </Card>
</GradientBorderContainer>
```

### Subscription/Stats Card Pattern

```tsx
<GradientBorderContainer className="rounded-md flex-1">
  <Card className="bg-black border-0 rounded-md">
    <CardContent className="p-6 space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium hebrew-text text-white">
            סוג מנוי
          </Label>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Crown className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-white hebrew-text">
              {subscriptionType}
            </span>
          </div>
        </div>
        <Badge variant="outline" className="text-yellow-600 border-current">
          <Award className="h-3 w-3 ml-1" />
          זהב
        </Badge>
      </div>

      <GradientSeparator className="mt-2" />

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-white">5</div>
          <div className="text-xs text-white hebrew-text">בוסטים</div>
        </div>
        {/* More stat columns... */}
      </div>
    </CardContent>
  </Card>
</GradientBorderContainer>
```

---

## Interactive Elements

### Buttons

**Primary Button (with gradient):**
```tsx
<Button className="hebrew-text">
  <Plus className="h-4 w-4 ml-2" />
  הוסף רכב חדש
</Button>
```

**Outline Button (with hover effect):**
```tsx
<Button variant="outline" className="hebrew-text">
  <Filter className="h-4 w-4 ml-2" />
  סינון מתקדם
</Button>
```

**Ghost Button in Black Card:**
```tsx
<GradientBorderContainer className="rounded-md">
  <Button 
    variant="ghost" 
    size="sm"
    className="bg-black border-0 text-white"
  >
    <Edit3 className="h-5 w-5 ml-1" />
    ערוך פרופיל
  </Button>
</GradientBorderContainer>
```

**Small Action Buttons:**
```tsx
<Button 
  variant="ghost" 
  size="sm" 
  className="hebrew-text"
>
  <Eye className="h-4 w-4 ml-2" />
  צפה
</Button>
```

### Button Sizes
```tsx
size="sm"    // Small buttons (icons in tables)
size="default" // Default size (most buttons)
size="lg"    // Large buttons (primary actions)
```

### Hover States

**Global Hover Classes** (defined in `src/index.css`):

```tsx
// Button hover (automatic on outline/ghost variants)
className="btn-hover-cyan"

// Icon hover
className="icon-hover-cyan"
```

**Example:**
```tsx
<Bell className="icon-hover-cyan" />
```

### Badges

**Status Badges:**
```tsx
<Badge variant="default" className="hebrew-text">זמין</Badge>
<Badge variant="secondary" className="hebrew-text">נמכר</Badge>
<Badge variant="outline" className="hebrew-text">בהמתנה</Badge>
```

**Rating Tier Badges:**
```tsx
<Badge variant="outline" className="text-yellow-600 border-current">
  <Award className="h-3 w-3 ml-1" />
  זהב
</Badge>

<Badge variant="outline" className="text-gray-600 border-current">
  <Award className="h-3 w-3 ml-1" />
  כסף
</Badge>

<Badge variant="outline" className="text-orange-700 border-current">
  <Award className="h-3 w-3 ml-1" />
  ברונזה
</Badge>
```

**Boost Badge:**
```tsx
<Badge className="bg-orange-500">🔥 פעיל</Badge>
```

### Form Inputs

**Text Input with Icon:**
```tsx
<div className="space-y-2">
  <Label htmlFor="fullName">שם מלא</Label>
  <div className="relative">
    <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
    <Input 
      id="fullName" 
      type="text" 
      placeholder="הזן שם מלא" 
      value={fullName} 
      onChange={(e) => setFullName(e.target.value)} 
      className="pr-10 text-right" 
      dir="rtl"
    />
  </div>
</div>
```

**Disabled Input:**
```tsx
<Input 
  type="text" 
  value={phoneNumber}
  disabled
  className="pr-10 text-right bg-muted" 
  dir="rtl"
/>
```

**Textarea:**
```tsx
<Textarea 
  placeholder="ספר קצת על העסק שלך..." 
  value={description} 
  onChange={(e) => setDescription(e.target.value)} 
  className="pr-10 text-right min-h-[100px] hebrew-text" 
  dir="rtl"
/>
```

**Search Input (Admin):**
```tsx
<div className="relative flex-1">
  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
  <Input
    placeholder="חפש לפי יצרן, דגם או מוכר..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pr-12 h-12 text-base hebrew-text"
  />
</div>
```

---

## Icons & SVG Elements

### Icon Sizing
```tsx
className="h-4 w-4"   // Small icons (16px) - Table actions, badges
className="h-5 w-5"   // Medium icons (20px) - Buttons, headers
className="h-6 w-6"   // Large icons (24px) - Navigation, empty states
className="h-8 w-8"   // Extra large (32px) - Loading spinners
```

### Gradient SVG Icons

**Definition (place once per card):**
```tsx
<svg width="0" height="0" className="absolute">
  <defs>
    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#2277ee" />
      <stop offset="100%" stopColor="#5be1fd" />
    </linearGradient>
  </defs>
</svg>
```

**Usage:**
```tsx
<Building 
  className="h-4 w-4" 
  style={{ stroke: 'url(#icon-gradient)' }} 
/>
```

### Common Icon Patterns

**With Label:**
```tsx
<div className="flex items-center space-x-2 space-x-reverse">
  <User className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
  <Label className="text-base font-bold hebrew-text">
    שם מלא:
  </Label>
  <span className="text-sm text-foreground hebrew-text">
    {fullName}
  </span>
</div>
```

**In Button:**
```tsx
<Button className="hebrew-text">
  <Plus className="h-4 w-4 ml-2" />
  הוסף רכב
</Button>
```

**Colored Status Icons:**
```tsx
<Flame className="h-5 w-5 text-orange-500" />
<Crown className="h-5 w-5 text-primary" />
<Car className="h-5 w-5 text-green-500" />
<Gavel className="h-5 w-5 text-blue-500" />
```

---

## Spacing & Structure

### Container Spacing

**Page Level:**
```tsx
className="space-y-6"  // Mobile pages (24px between sections)
className="space-y-8"  // Admin pages (32px between sections)
className="space-y-4"  // Within cards (16px between items)
```

**Card Padding:**
```tsx
className="p-4"   // Small cards, mobile
className="p-6"   // Standard cards
className="p-8"   // Large cards, admin
```

**Grid Layouts:**
```tsx
// 3 columns (stats)
className="grid grid-cols-3 gap-4"

// 2 columns (forms)
className="grid grid-cols-1 md:grid-cols-2 gap-4"
```

### Flex Layouts

**RTL with Reverse Spacing:**
```tsx
<div className="flex items-center space-x-2 space-x-reverse">
  {/* space-x-reverse ensures proper RTL spacing */}
</div>
```

**Between (Justify):**
```tsx
<div className="flex items-center justify-between">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

**Center:**
```tsx
<div className="flex items-center justify-center">
  <Loader2 className="h-8 w-8 animate-spin text-primary" />
</div>
```

---

## RTL Support

### Direction Attribute

**Always set on Hebrew containers:**
```tsx
<div dir="rtl">
  {/* Hebrew content */}
</div>
```

**Page level:**
```tsx
<div className="container max-w-md mx-auto px-4 space-y-4" dir="rtl">
  {/* Entire page */}
</div>
```

**Input fields:**
```tsx
<Input 
  className="pr-10 text-right" 
  dir="rtl"
/>
```

### RTL Spacing Classes

**Use `space-x-reverse` with `space-x-*`:**
```tsx
<div className="flex items-center space-x-2 space-x-reverse">
  {/* Proper RTL spacing */}
</div>
```

### Icon Positioning in RTL

**Right-side icons:**
```tsx
<Button className="hebrew-text">
  <Plus className="h-4 w-4 ml-2" />  {/* ml-2 pushes icon to left of text in RTL */}
  טקסט
</Button>
```

**Left-side icons in Badge:**
```tsx
<Badge>
  <Award className="h-3 w-3 ml-1" />
  {text}
</Badge>
```

---

## Component Usage Examples

### Complete Profile Card Example

```tsx
<GradientBorderContainer className="rounded-md flex-1">
  <Card className="bg-black border-0 rounded-md">
    <CardContent className="p-6">
      {/* SVG Gradient Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2277ee" />
            <stop offset="100%" stopColor="#5be1fd" />
          </linearGradient>
        </defs>
      </svg>

      <div className="space-y-4">
        {/* Business Name */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <Building className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
          <Label className="text-base font-bold hebrew-text">
            שם העסק:
          </Label>
          <span className="text-sm text-foreground hebrew-text">
            {profile?.business_name || 'לא הוגדר'}
          </span>
        </div>

        <GradientSeparator />

        {/* Full Name */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <User className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
          <Label className="text-base font-bold hebrew-text">
            שם מלא:
          </Label>
          <span className="text-sm text-foreground hebrew-text">
            {profile?.full_name || 'לא הוגדר'}
          </span>
        </div>

        <GradientSeparator />

        {/* Phone */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <Phone className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
          <Label className="text-base font-bold hebrew-text">
            טלפון:
          </Label>
          <span className="text-sm text-foreground hebrew-text">
            {formatPhoneDisplay(phoneNumber)}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</GradientBorderContainer>
```

### Complete Table Example (Admin)

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-2xl hebrew-text">
      רשימת רכבים ({vehicles.length})
    </CardTitle>
  </CardHeader>
  <CardContent>
    {isLoading ? (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ) : vehicles.length === 0 ? (
      <div className="text-center p-12 text-muted-foreground hebrew-text">
        לא נמצאו רכבים
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right hebrew-text text-base">רכב</TableHead>
            <TableHead className="text-right hebrew-text text-base">מוכר</TableHead>
            <TableHead className="text-right hebrew-text text-base">מחיר</TableHead>
            <TableHead className="text-right hebrew-text text-base">סטטוס</TableHead>
            <TableHead className="text-right hebrew-text text-base">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="h-16">
              <TableCell>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium hebrew-text text-base">
                      {vehicle.make} {vehicle.model}
                    </div>
                    <div className="text-sm text-muted-foreground hebrew-text">
                      {vehicle.year}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hebrew-text text-base">
                {vehicle.owner}
              </TableCell>
              <TableCell className="hebrew-text text-base">
                <div className="font-medium">
                  ₪{vehicle.price?.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="default" className="hebrew-text">
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hebrew-text"
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    צפה
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hebrew-text"
                  >
                    <Edit className="h-4 w-4 ml-2" />
                    ערוך
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </CardContent>
</Card>
```

### Search Filter Pattern

```tsx
<Card>
  <CardContent className="p-8">
    <div className="flex gap-6">
      <div className="relative flex-1">
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="חפש לפי יצרן, דגם או מוכר..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-12 h-12 text-base hebrew-text"
        />
      </div>
      <Button variant="outline" size="lg" className="hebrew-text">
        סינון מתקדם
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## Quick Reference Checklist

### When Creating a New Screen

- [ ] **Container:** Use `space-y-6` (mobile) or `space-y-8` (admin)
- [ ] **RTL:** Add `dir="rtl"` to main container
- [ ] **Header:** Include navigation (mobile) or title (admin)
- [ ] **Cards:** Wrap with `GradientBorderContainer` + `rounded-md`
- [ ] **Card Inner:** Use `bg-black border-0 rounded-md`
- [ ] **Text:** Always add `hebrew-text` class to Hebrew text
- [ ] **Icons:** Use gradient SVG for profile-type icons
- [ ] **Spacing:** Use `space-x-2 space-x-reverse` for RTL flex
- [ ] **Buttons:** Use appropriate size and variant
- [ ] **Loading:** Show `Loader2` with `animate-spin text-primary`
- [ ] **Empty State:** Use centered text with `text-muted-foreground`

### Common Class Combinations

```tsx
// Page container (mobile)
className="container max-w-md mx-auto px-4 space-y-4"

// Page container (admin)
className="space-y-8"

// Card wrapper
className="rounded-md flex-1"

// Card inner
className="bg-black border-0 rounded-md"

// Card content
className="p-6 space-y-4"

// Hebrew text
className="text-base font-bold hebrew-text"

// Flex row RTL
className="flex items-center space-x-2 space-x-reverse"

// Flex between
className="flex items-center justify-between"

// Button in black card
className="bg-black border-0 text-white"
```

---

## Related Documentation

- **Gradient Border Guide:** `GRADIENT_BORDER_GUIDE.md`
- **Gradient Colors Guide:** `GRADIENT_COLORS_GUIDE.md`
- **Hover Styles Guide:** `HOVER_STYLES_GUIDE.md`
- **Component Files:**
  - `src/components/ui/gradient-border-container.tsx`
  - `src/components/ui/gradient-separator.tsx`
  - `src/constants/gradientColors.ts`
  - `src/index.css`

---

## Notes

1. **Consistency is Key:** Follow these patterns exactly for a unified look
2. **Don't Override:** Avoid custom colors on GradientBorderContainer instances
3. **Hebrew Text:** Never forget the `hebrew-text` class
4. **RTL Direction:** Always use `dir="rtl"` and `space-x-reverse`
5. **Black Backgrounds:** Inner cards should always be black for contrast
6. **Gradient Separators:** Use liberally to separate content sections
7. **Icon Gradients:** Define SVG gradient once per card, reuse for all icons

---

**Last Updated:** October 2025  
**Reference Pages:**
- Mobile: `src/pages/mobile/MyProfileScreen.tsx`
- Admin: `src/pages/admin/AdminVehiclesList.tsx`
