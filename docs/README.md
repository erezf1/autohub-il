# Auto-Hub Documentation

This folder contains all project specifications and development guidelines for the Auto-Hub application.

## Documentation Files

### Core Specifications
- **`PROJECT_SPEC.md`** - Main project requirements, entities, and business rules
- **`MOBILE_SCREENS_SPEC.md`** - Detailed specifications for all mobile screens
- **`ADMIN_SCREENS_SPEC.md`** - Comprehensive admin desktop screen specifications
- **`DEVELOPMENT_PROMPT.md`** - Development guidelines and RTL requirements

### Architecture Reference
- **`../README_ARCHITECTURE.md`** - System architecture and mobile/admin separation principles

## Using This Documentation

### For Developers
1. **Always start with `DEVELOPMENT_PROMPT.md`** - Contains mandatory pre-development checklist
2. **Reference appropriate screen specification** - Mobile or Admin based on your feature
3. **Check `PROJECT_SPEC.md`** - For business rules and entity relationships
4. **Update documentation** - When requirements change during development

### For Project Management
1. **`PROJECT_SPEC.md`** - Primary reference for project scope and requirements
2. **Screen specification files** - Detailed UI/UX requirements for each system
3. **Track changes** - Ensure specifications stay current with implementation

## RTL (Hebrew) Application Notes
This is a Hebrew RTL application with specific requirements:
- All text flows right-to-left
- Special layout considerations for forms, tables, and navigation
- Icon positioning differs from standard LTR applications
- See `DEVELOPMENT_PROMPT.md` for detailed RTL guidelines

## Mobile vs Admin Systems
The application consists of two completely separate systems:
- **Mobile System**: For dealers and car traders (root routes)
- **Admin System**: For administrators (*/admin routes)
- **No Cross-Dependencies**: Components are not shared between systems

---
*Keep this documentation updated as the project evolves.*