# Application Architecture

This application consists of two completely separate systems:

## 1. Mobile Application (`/src/components/mobile/`, `/src/pages/mobile/`)
- **Route Prefix**: `/` (root routes)
- **Layout**: `MobileLayout` with `MobileHeader` and `MobileTabBar`
- **Design**: Mobile-first responsive design with RTL support
- **Pages**: Dashboard, Car Search, Chats, Notifications, Auctions, Profile, ISO Requests
- **Navigation**: Bottom tab bar navigation

## 2. Admin Desktop Application (`/src/components/admin/`, `/src/pages/admin/`)
- **Route Prefix**: `/admin/`
- **Layout**: `AdminDesktopLayout` with `AdminDesktopSidebar`
- **Design**: Desktop-first design with fixed header, footer, and sidebar
- **Pages**: Dashboard, Users Management, Vehicles Management, Reports, Settings, etc.
- **Navigation**: Right-side fixed sidebar navigation (RTL)

## Folder Structure

```
src/
├── components/
│   ├── mobile/          # Mobile-specific components
│   │   ├── MobileLayout.tsx
│   │   ├── MobileHeader.tsx
│   │   └── MobileTabBar.tsx
│   ├── admin/           # Admin-specific components
│   │   ├── AdminDesktopLayout.tsx
│   │   └── AdminDesktopSidebar.tsx
│   └── ui/              # Shared UI components (shadcn)
├── pages/
│   ├── mobile/          # Mobile pages
│   └── admin/           # Admin pages
├── hooks/
│   ├── mobile/          # Mobile-specific hooks
│   └── admin/           # Admin-specific hooks
├── utils/
│   ├── mobile/          # Mobile-specific utilities
│   └── admin/           # Admin-specific utilities
├── types/
│   ├── mobile/          # Mobile-specific types
│   └── admin/           # Admin-specific types
├── services/
│   ├── mobile/          # Mobile-specific services
│   └── admin/           # Admin-specific services
└── lib/                 # Shared utilities
```

## Key Principles

1. **Complete Separation**: Mobile and admin applications share NO components except UI library components
2. **Independent Routing**: Each application has its own routing system
3. **Dedicated Layouts**: Each application has its own layout system
4. **No Cross-Dependencies**: Mobile components cannot import admin components and vice versa
5. **Shared UI Only**: Only `/src/components/ui/` and `/src/lib/` are shared between applications

## Adding New Features

### For Mobile:
- Add components to `/src/components/mobile/`
- Add pages to `/src/pages/mobile/`
- Add routes in `App.tsx` under the mobile routing section
- Use `MobileLayout` wrapper

### For Admin:
- Add components to `/src/components/admin/`
- Add pages to `/src/pages/admin/`
- Add routes in `App.tsx` under the admin routing section
- Use `AdminDesktopLayout` wrapper

## Navigation

- **Mobile**: Access via root routes (`/`, `/search`, `/auctions`, etc.)
- **Admin**: Access via `/admin/` prefix (`/admin/`, `/admin/users`, `/admin/reports`, etc.)