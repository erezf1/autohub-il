# Development Prompt Template - Auto-Hub

## Pre-Development Checklist
Before making ANY changes to the Auto-Hub project, you MUST:

### 1. Review All Requirement Files
**MANDATORY**: Always check these files first:
- `docs/PROJECT_PRD.md` - Overall project requirements and business rules
- `docs/MOBILE_SCREENS_SPEC.md` - Mobile screen specifications and RTL requirements  
- `docs/ADMIN_SCREENS_SPEC.md` - Admin desktop screen specifications
- `README_ARCHITECTURE.md` - System architecture and separation principles

### 2. Update Documentation When Requirements Change
**REQUIRED**: When implementing new features or changes:
- Update `docs/PROJECT_PRD.md` if business rules or entities change
- Update relevant screen specification files if UI/UX changes
- Maintain consistency across all documentation
- Add new entities, screens, or business rules to appropriate files

### 3. Verify Current Implementation
**BEFORE CODING**: Always check what exists:
- Search the codebase for related functionality
- Review existing components that might be reused
- Check current routing and navigation patterns
- Verify mobile vs admin separation is maintained

## Core Development Guidelines

### Architecture Principles
- **Complete Separation**: Mobile and Admin systems are entirely separate
- **No Cross-Dependencies**: Mobile components never import Admin components and vice versa
- **Dedicated Layouts**: `MobileLayout` for mobile, `AdminDesktopLayout` for admin
- **Routing Separation**: Root routes for mobile, `/admin/*` routes for admin

### RTL (Hebrew) Development Requirements
**CRITICAL**: This is a Hebrew RTL application:

#### Text and Layout Direction
- All text must flow right-to-left (`dir="rtl"`)
- Icons positioned on LEFT side of text (opposite of LTR)
- Navigation flows right-to-left
- Forms and inputs align to the right
- Margins/padding mirror LTR layouts appropriately

#### Component RTL Considerations
- Tables: Headers align right, action columns on the left side
- Cards: Content flows RTL, pictues on the right, actions on left
- Navigation: Tabs, breadcrumbs, menus flow right-to-left
- Buttons: Primary actions typically on left side
- Forms: Labels on right, validation messages in Hebrew

#### RTL Testing Checklist
- Verify text direction in all components
- Check icon positioning with RTL text
- Test navigation flow (right-to-left)
- Validate form layout and alignment
- Ensure proper Arabic numeral handling within RTL context

### Design System Requirements
**MANDATORY**: Follow established design patterns:
- Use semantic tokens from `index.css` and `tailwind.config.ts`
- NO direct colors (no `text-white`, `bg-black`, etc.)
- All colors MUST use HSL format in design system
- Customize shadcn components rather than overriding with custom classes
- Create component variants for different use cases

### Mobile Development Guidelines
- **Mobile-First**: Design for mobile screen sizes
- **Bottom Navigation**: Use `MobileTabBar` for primary navigation
- **Touch Targets**: Ensure minimum 44px touch targets
- **RTL Mobile**: Special attention to mobile RTL layouts
- **Performance**: Optimize for mobile data usage

### Admin Development Guidelines  
- **Desktop-First**: Optimize for desktop screens
- **Sidebar Navigation**: Use `AdminDesktopSidebar` for navigation
- **Data Tables**: RTL-compliant tables with sorting, filtering, pagination
- **Responsive**: Support tablet and desktop breakpoints
- **Power User Features**: Keyboard shortcuts, bulk actions

### Code Organization Standards
```
src/
├── components/
│   ├── mobile/          # Mobile-only components
│   ├── admin/           # Admin-only components
│   └── ui/              # Shared UI library (shadcn)
├── pages/
│   ├── mobile/          # Mobile screens
│   └── admin/           # Admin screens
├── hooks/
│   ├── mobile/          # Mobile-specific hooks
│   └── admin/           # Admin-specific hooks
├── types/
│   ├── mobile/          # Mobile type definitions
│   └── admin/           # Admin type definitions
└── services/
    ├── mobile/          # Mobile API services
    └── admin/           # Admin API services
```

## Implementation Workflow

### 1. Planning Phase
- Reference all specification files
- Identify which system (mobile/admin) the feature belongs to
- Check for existing similar functionality
- Plan component reuse within the same system (mobile OR admin)

### 2. Development Phase
- Follow RTL guidelines for all UI components
- Use appropriate layout (`MobileLayout` or `AdminDesktopLayout`)
- Implement navigation consistent with the system
- Use semantic design tokens, not direct colors

### 3. Testing Phase
- Test RTL layout in both directions
- Verify mobile responsiveness (for mobile features)
- Test desktop functionality (for admin features)
- Check navigation flow and user experience

### 4. Documentation Phase
- Update specification files if requirements changed
- Document new components or patterns
- Maintain consistency across documentation

## Common RTL Patterns

### RTL Text Input
```tsx
<Input 
  placeholder="הזן טקסט כאן"
  className="text-right"
  dir="rtl"
/>
```

### RTL Button with Icon
```tsx
<Button>
  <span>שלח הודעה</span>
  <Send className="ml-2 h-4 w-4" /> {/* Icon on LEFT for RTL */}
</Button>
```

### RTL Table Header
```tsx
<TableHeader>
  <TableRow>
    <TableHead className="text-right">שם המשתמש</TableHead>
    <TableHead className="text-right">תאריך</TableHead>
    <TableHead className="text-right">פעולות</TableHead> {/* Actions on right */}
  </TableRow>
</TableHeader>
```

### RTL Navigation
```tsx
<nav className="flex flex-row-reverse gap-4"> {/* Reverse for RTL */}
  <Link to="/dashboard">לוח בקרה</Link>
  <Link to="/users">משתמשים</Link>
</nav>
```

## Quality Assurance

### Before Submitting Changes
- [ ] All requirement files reviewed
- [ ] RTL layout tested and verified
- [ ] Mobile/Admin separation maintained
- [ ] Design system tokens used (no direct colors)
- [ ] Navigation patterns consistent with system
- [ ] Hebrew text properly displayed
- [ ] Touch targets appropriate for mobile (if mobile feature)
- [ ] Desktop usability verified (if admin feature)
- [ ] Documentation updated if requirements changed

### RTL Verification Checklist
- [ ] Text flows right-to-left correctly
- [ ] Icons positioned on correct side (left) for RTL
- [ ] Form labels and inputs align right
- [ ] Tables display properly in RTL
- [ ] Navigation menus flow right-to-left
- [ ] Button layouts work in RTL context
- [ ] Numbers and mixed content display correctly

## Emergency Debugging Process
When issues arise:
1. Check console logs for RTL-related CSS issues
2. Verify component is using correct layout (Mobile vs Admin)
3. Check routing matches the intended system
4. Validate design tokens are being applied
5. Test in both RTL and LTR context if needed

---
**REMEMBER**: Always consult specification files before coding and update them when requirements evolve. The RTL nature of this application requires special attention to layout and text direction in every component.