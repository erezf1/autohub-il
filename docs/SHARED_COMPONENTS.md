# Shared Components & Constants - Auto-Hub

## Overview
This document catalogs shared components, constants, and utilities used across both mobile and admin systems in Auto-Hub. These shared resources ensure consistency and maintainability.

## Shared Constants

### Vehicle Types (`src/constants/vehicleTypes.ts`)
**Purpose**: Predefined vehicle type categories for consistent classification across the application.

**File Location**: `src/constants/vehicleTypes.ts`

**Usage**: 
- Mobile: Add Vehicle Screen, Edit Vehicle Screen, Search Filters
- Admin: Add Vehicle Screen, Edit Vehicle Screen, Vehicle Detail View, Vehicle List Filters

**Type Definition**:
```typescript
export const VEHICLE_TYPES = [
  { value: 'micro', label: 'מיקרו' },
  { value: 'mini', label: 'מיני' },
  { value: 'family', label: 'משפחתי' },
  { value: 'executive', label: 'מנהלים' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'יוקרתי' },
  { value: 'sport', label: 'ספורט' },
] as const;

export type VehicleType = typeof VEHICLE_TYPES[number]['value'];
```

**Helper Functions**:
- `getVehicleTypeLabel(value: string)`: Returns Hebrew label for given value
- Returns '-' for null/undefined values
- Provides backward compatibility by returning the value itself if not found

**Database Storage**: Stored in `vehicle_listings.sub_model` column as TEXT type

**Display Guidelines**:
- Always use Hebrew labels in UI (`label` property)
- Use `value` property for database operations
- Apply RTL text direction for proper Hebrew rendering

---

## Shared UI Components

### UI Component Library (`src/components/ui/*`)
**shadcn/ui Components**: Complete set of customizable UI components
- Shared across mobile and admin interfaces
- Customized for RTL support where needed
- Themed via design system tokens in `index.css` and `tailwind.config.ts`

**Key Components Used Project-Wide**:
- `Button`: Primary action buttons
- `Card`: Content containers with headers and footers
- `Input`: Text input fields with validation
- `Select`: Dropdown selection components
- `Dialog`: Modal dialogs for confirmations
- `Badge`: Status indicators and tags
- `Table`: Data tables for admin panels
- `Tabs`: Tabbed content organization
- `Form`: Form handling with react-hook-form integration

---

## Shared Auth Clients

### Mobile Auth Client (`src/integrations/supabase/client.ts`)
**Storage Key**: Default Supabase auth storage
**Used By**: Mobile dealer/trader screens
**Session Scope**: Mobile user sessions

### Admin Auth Client (`src/integrations/supabase/adminClient.ts`)
**Storage Key**: `admin-auth` (separate localStorage key)
**Used By**: Admin desktop screens, Admin edge functions
**Session Scope**: Admin user sessions (isolated from mobile)
**Critical**: Always use `adminClient` in admin components to prevent cross-session contamination

**Implementation Example**:
```typescript
// ❌ WRONG - Admin component using mobile client
import { supabase } from '@/integrations/supabase/client';

// ✅ CORRECT - Admin component using admin client
import { adminClient } from '@/integrations/supabase/adminClient';
```

---

## Shared Utility Functions

### Phone Validation (`src/utils/phoneValidation.ts`)
**Purpose**: Israeli phone number formatting and validation
**Used By**: Login screens, user profile forms, contact detail displays

### Vehicle Filters (`src/utils/mobile/vehicleFilters.ts`)
**Purpose**: Vehicle search and filter logic
**Used By**: Mobile search screens, vehicle list filtering

### RTL Utilities
**Location**: Embedded in component implementations
**Purpose**: Right-to-left text direction handling
**Best Practices**:
- Use `dir="rtl"` on container elements
- Add `text-right` class for text alignment
- Use `hebrew-text` class for Hebrew font rendering
- Position icons on LEFT side of text (opposite of LTR)

---

## Shared Type Definitions

### Database Types (`src/integrations/supabase/types.ts`)
**Auto-Generated**: DO NOT EDIT MANUALLY
**Source**: Generated from Supabase database schema
**Usage**: Import types for type-safe database operations
**Shared Across**: All database queries in mobile and admin systems

### Custom Types
**Mobile Types**: `src/types/mobile/index.ts`
**Admin Types**: `src/types/admin/index.ts`
**Separation**: Mobile and admin maintain separate type definitions for their specific domains

---

## Shared Hooks

### `useMobile` (`src/hooks/use-mobile.tsx`)
**Purpose**: Responsive design hook for mobile/desktop detection
**Usage**: Conditional rendering based on device type
**Note**: Admin is desktop-only, but hook available if needed

### `useToast` (`src/hooks/use-toast.ts`)
**Purpose**: Toast notification system
**Usage**: Success messages, error alerts, user feedback
**Shared Across**: All screens (mobile and admin)

---

## Mobile-Specific Components

### VehicleFilterDrawer (`src/components/mobile/VehicleFilterDrawer.tsx`)
**Purpose**: Full-screen mobile filter drawer for vehicle search with RTL support

**Features**:
- **Full-Width Design**: Spans entire mobile screen width (`w-full`) for optimal UX
- **Max Height**: 90vh for scrollable content
- **Filter Categories**: 
  - Make (יצרן): Dropdown with "הכל" (all) option
  - Model (דגם): Dependent on make selection, disabled until make is selected
  - Year Range (שנת ייצור): From/To numeric inputs
  - Price Range (מחיר): From/To numeric inputs  
  - Tags (תגיות): Interactive badge selection with color coding
- **State Management**: 
  - Local state synchronized with parent component
  - Uses "all" value instead of empty string for Select "All" options
  - Handles make/model dependencies correctly
- **RTL Support**: Full Hebrew interface with `dir="rtl"`
- **Clear All Behavior**: 
  - Resets all filters to empty state (`{}`)
  - Immediately applies changes via `onApplyFilters({})`
  - Auto-closes drawer via `onOpenChange(false)`
  - Returns user to main search screen in one action

**Props Interface**:
```typescript
interface VehicleFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: VehicleFilters;
  onApplyFilters: (filters: VehicleFilters) => void;
}
```

**Implementation Details**:
- Uses `Drawer` component from shadcn/ui (vaul library)
- `DrawerContent` styled with `max-h-[90vh] w-full`
- Select dropdowns use "all" value for "הכל" options (not empty string)
- Handler functions convert "all" to `undefined` for filter state
- Footer buttons: "אפס הכל" (Reset All) and "החל פילטרים" (Apply Filters)

**Usage Example**:
```typescript
<VehicleFilterDrawer
  open={filterDrawerOpen}
  onOpenChange={setFilterDrawerOpen}
  currentFilters={filters}
  onApplyFilters={setFilters}
/>
```

### VehicleDetailScreen (`src/pages/mobile/VehicleDetailScreen.tsx`)
**Purpose**: Display comprehensive vehicle information for other users' listings with seller contact

**Features**:
- **Data Fetching**: Joins `vehicle_makes`, `vehicle_models`, `vehicle_listing_tags` with nested `vehicle_tags`
- **Image Carousel**: Full-width display with navigation and status badge
- **Comprehensive Details**: 
  - Technical specifications (מפרט טכני)
  - Engine size displayed as "XXX סמ״ק" for cubic centimeters
  - Description (תיאור) - optional
  - Color-coded tags (תגיות) - optional
  - Vehicle condition & history (מצב ורקע הרכב)
  - Severe crash status (תאונה חמורה)
  - Previous owners count (בעלים קודמים)
  - Test result file viewer (קובץ תוצאות טסט)
- **Seller Contact**: Avatar, name, and message button
- **RTL Support**: Full Hebrew interface with proper text flow

**Query Pattern**:
```typescript
const { data: vehicle } = useQuery({
  queryKey: ['vehicle-detail', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('vehicle_listings')
      .select(`
        *,
        make:vehicle_makes(id, name_hebrew, name_english),
        model:vehicle_models(id, name_hebrew, name_english),
        vehicle_listing_tags(
          tag_id,
          tag:vehicle_tags(id, name_hebrew, name_english, color, tag_type)
        )
      `)
      .eq('id', id)
      .single();
    return data;
  }
});
```

**Display Pattern**:
- Cards for each section (specifications, description, tags, condition, seller)
- Grid layout (2 columns) for technical specifications
- Color-coded badges for tags using `style` prop with database colors
- Conditional rendering for optional fields
- Test result file opens in new tab via `window.open()`

---

## Design System Tokens

### Color System (`src/index.css`)
**Semantic Tokens**: Defined in CSS variables (HSL format)
**Usage**: ALWAYS use semantic tokens, never hardcoded colors
**Examples**:
- `--primary`: Main brand color
- `--secondary`: Secondary actions
- `--accent`: Highlights and emphasis
- `--muted`: Subdued backgrounds

### Tailwind Configuration (`tailwind.config.ts`)
**Purpose**: Maps CSS variables to Tailwind classes
**RTL Support**: Configured for right-to-left layouts
**Theme**: Consistent design system across mobile and admin

---

## Best Practices for Shared Components

### ✅ DO:
- Use vehicle type constants for dropdown options
- Import types from shared type definitions
- Use semantic design tokens for colors
- Apply RTL classes consistently
- Use appropriate auth client (mobile vs admin)

### ❌ DON'T:
- Hardcode vehicle type options in components
- Mix admin and mobile auth clients
- Use direct color values (e.g., `text-white`, `bg-black`)
- Forget RTL directives on Hebrew content
- Duplicate constants across mobile and admin

---

## Adding New Shared Components

When adding new shared resources:

1. **Determine Scope**: Is it truly shared or system-specific?
2. **Choose Location**: 
   - Constants → `src/constants/`
   - UI Components → `src/components/ui/`
   - Utilities → `src/utils/`
3. **Document Here**: Add entry to this specification
4. **Update Imports**: Use in both mobile and admin where applicable
5. **Test Isolation**: Ensure no cross-contamination between mobile/admin sessions

---

## References

- **Vehicle Type Implementation**: See `src/constants/vehicleTypes.ts`
- **Auth Separation**: See `src/integrations/supabase/adminClient.ts`
- **Mobile Screens**: See `docs/MOBILE_SCREENS_SPEC.md`
- **Admin Screens**: See `docs/ADMIN_SCREENS_SPEC.md`
- **Database Schema**: See `docs/DATABASE_SCHEMA_SPEC.md`

---

*This document should be updated whenever new shared components or constants are added to maintain accurate project documentation.*
