# Common Components Documentation

This document provides comprehensive documentation for all common/shared components used across the Auto-Hub application.

## Table of Contents
- [Cards](#cards)
- [Layout Components](#layout-components)
- [Search & Filter Components](#search--filter-components)
- [Display Components](#display-components)
- [Utility Components](#utility-components)

---

## Cards

### VehicleCard

A reusable card component for displaying vehicle listings with image, details, and pricing.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Unique vehicle identifier |
| images | string[] \| null | No | Array of vehicle image URLs |
| makeName | string | Yes | Vehicle make name (Hebrew) |
| modelName | string | Yes | Vehicle model name (Hebrew) |
| year | number | Yes | Vehicle year |
| kilometers | number | No | Vehicle mileage |
| transmission | string | No | Transmission type ('automatic', 'manual', 'tiptronic') |
| fuelType | string | No | Fuel type ('gasoline', 'diesel', 'hybrid', 'electric') |
| price | number \| string | Yes | Regular price |
| hotSalePrice | number \| string \| null | No | Hot sale discounted price |
| isBoosted | boolean | No | Whether the listing is boosted |
| boostedUntil | string \| null | No | Boost expiration date |
| onClick | () => void | Yes | Click handler for the card |

**Usage:**
```tsx
import { VehicleCard } from '@/components/common';

<VehicleCard
  id={car.id}
  images={car.images}
  makeName="טויוטה"
  modelName="קורולה"
  year={2020}
  kilometers={50000}
  transmission="automatic"
  fuelType="gasoline"
  price={85000}
  hotSalePrice={79000}
  isBoosted={true}
  boostedUntil="2025-12-31"
  onClick={() => navigate(`/vehicle/${car.id}`)}
/>
```

**Features:**
- Displays "🔥 Hot Sale" badge for boosted listings with hot sale price
- Shows original price with strikethrough when on sale
- RTL layout with Hebrew text support
- Hover animation (`card-interactive`)
- Fallback to default car image if no image provided
- Automatic Hebrew label conversion for transmission and fuel types

---

## Layout Components

### Logo

Simple logo component without text, used in headers.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | Logo size variant |
| onClick | () => void | undefined | Optional click handler |
| className | string | undefined | Additional CSS classes |

**Size Mapping:**
- `sm`: h-8 (32px)
- `md`: h-10 (40px)
- `lg`: h-12 (48px)

**Usage:**
```tsx
import { Logo } from '@/components/common';

<Logo 
  size="lg" 
  onClick={() => navigate('/dashboard')} 
/>
```

---

### PageHeader

Standard page header with title, back button, and optional right action.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | Page title (Hebrew) |
| onBack | () => void | No | Back button click handler |
| rightAction | ReactNode | No | Optional right-side action element |

**Usage:**
```tsx
import { PageHeader } from '@/components/common';

<PageHeader
  title="חיפוש רכבים"
  onBack={() => navigate(-1)}
  rightAction={
    <Button onClick={handleAdd}>הוסף</Button>
  }
/>
```

**Features:**
- Fixed height (h-14) for consistency
- RTL layout with ArrowRight icon for back navigation
- Hebrew text styling applied
- Optional back button (only shows if `onBack` provided)

---

### PageContainer

Base wrapper component for all pages with RTL support.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | ReactNode | Yes | Page content |
| className | string | No | Additional CSS classes |

**Usage:**
```tsx
import { PageContainer } from '@/components/common';

<PageContainer>
  <PageHeader title="רכבים" />
  <div>Content here...</div>
</PageContainer>
```

**Features:**
- Automatic `dir="rtl"` attribute
- Default `space-y-4` spacing
- Supports className overrides with `cn()` utility

---

## Search & Filter Components

### SearchBar

Search input with icon positioned for RTL layout.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| placeholder | string | Yes | Input placeholder text |
| value | string | Yes | Current search value |
| onChange | (value: string) => void | Yes | Value change handler |
| className | string | No | Additional CSS classes |

**Usage:**
```tsx
import { SearchBar } from '@/components/common';

<SearchBar
  placeholder="חפש רכב..."
  value={searchQuery}
  onChange={setSearchQuery}
/>
```

**Features:**
- Search icon positioned on the right (RTL)
- Cyan focus ring (`ring-primary`)
- Padding for icon space (`pr-10`)

---

### FilterButton

Button with filter icon and badge for active filter count.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| activeCount | number | Yes | Number of active filters |
| onClick | () => void | Yes | Click handler |

**Usage:**
```tsx
import { FilterButton } from '@/components/common';

<FilterButton
  activeCount={3}
  onClick={() => setDrawerOpen(true)}
/>
```

**Features:**
- Badge only shows when `activeCount > 0`
- Destructive variant badge (red)
- Badge positioned at top-left (RTL: `-top-2 -left-2`)

---

### SearchFilterBar

Combines SearchBar and FilterButton in a flex layout.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| searchValue | string | Yes | Current search value |
| onSearchChange | (value: string) => void | Yes | Search change handler |
| searchPlaceholder | string | Yes | Search input placeholder |
| filterCount | number | Yes | Number of active filters |
| onFilterClick | () => void | Yes | Filter button click handler |

**Usage:**
```tsx
import { SearchFilterBar } from '@/components/common';

<SearchFilterBar
  searchValue={query}
  onSearchChange={setQuery}
  searchPlaceholder="חפש..."
  filterCount={activeFilters}
  onFilterClick={() => openDrawer()}
/>
```

---

## Display Components

### ResultsCount

Displays the count of search/filter results in Hebrew.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| count | number | Yes | Number of results |
| isLoading | boolean | No | Loading state (hides component if true) |

**Usage:**
```tsx
import { ResultsCount } from '@/components/common';

<ResultsCount count={results.length} isLoading={loading} />
```

**Output:** "נמצאו 42 רכבים"

**Features:**
- Hebrew number formatting with `toLocaleString('he-IL')`
- Muted text color
- Hides during loading

---

### ActiveFiltersDisplay

Shows active filter count with "Clear All" button.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| filterCount | number | Yes | Number of active filters |
| onClearAll | () => void | Yes | Clear all filters handler |

**Usage:**
```tsx
import { ActiveFiltersDisplay } from '@/components/common';

<ActiveFiltersDisplay
  filterCount={3}
  onClearAll={() => setFilters({})}
/>
```

**Features:**
- Automatically hides when `filterCount === 0`
- Flex wrap layout
- Hebrew text: "{count} פילטרים פעילים"

---

## Utility Components

### LoadingSpinner

Centered loading spinner with size variants.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | Spinner size |

**Size Mapping:**
- `sm`: h-6 w-6 (24px)
- `md`: h-8 w-8 (32px)
- `lg`: h-12 w-12 (48px)

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/common';

{isLoading && <LoadingSpinner size="lg" />}
```

**Features:**
- Uses `Loader2` icon with `animate-spin`
- Centered with `flex justify-center`
- Vertical padding (`py-12`)
- Primary color text

---

## RTL Considerations

All components are designed with RTL (Right-to-Left) support for Hebrew:

1. **Icon Positioning**: Icons are positioned on the left/right appropriately for RTL
2. **Text Direction**: All text uses `hebrew-text` class or explicit `dir="rtl"`
3. **Flexbox**: All flex layouts use `justify-between`, `gap`, and `space-x-reverse` when needed
4. **Badge Positioning**: Badges positioned using RTL-appropriate coordinates
5. **Number Formatting**: Hebrew locale number formatting (`toLocaleString('he-IL')`)

---

## Design System Integration

All components use semantic tokens from `src/index.css` and `tailwind.config.ts`:

- **Colors**: `primary`, `secondary`, `accent`, `muted`, `foreground`, etc.
- **Spacing**: Standard Tailwind spacing scale
- **Typography**: Hebrew text classes and font families
- **Shadows**: `shadow-card`, `shadow-elevated`
- **Animations**: `card-interactive` hover effects

**Never use direct color values** (e.g., `text-white`, `bg-blue-500`). Always use semantic tokens.

---

## Related Documentation

- [Mobile Screens Specification](./MOBILE_SCREENS_SPEC.md)
- [Admin Screens Specification](./ADMIN_SCREENS_SPEC.md)
- [Shared Components Guide](./SHARED_COMPONENTS.md)
- [Development Guidelines](../DEVELOPMENT_PROMPT.md)
