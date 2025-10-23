# Heebo Font Configuration Guide

## Overview
The entire application now uses **Heebo** font as the default family with automatic font-weight mapping. This means every component automatically gets the correct Heebo font file based on the font-weight used.

## What Was Changed

### 1. **Font Face Definitions** (`src/index.css`)
All 9 Heebo font weights are registered with their corresponding TTF files:

```css
@font-face {
  font-family: 'Heebo';
  src: url('/Heebo/Heebo-Thin.ttf') format('truetype');
  font-weight: 100;
  font-display: swap;
}
/* ... more weights ... */
@font-face {
  font-family: 'Heebo';
  src: url('/Heebo/Heebo-Black.ttf') format('truetype');
  font-weight: 900;
  font-display: swap;
}
```

**Available Weights:**
- **100** - Thin (`Heebo-Thin.ttf`)
- **200** - Extra Light (`Heebo-ExtraLight.ttf`)
- **300** - Light (`Heebo-Light.ttf`)
- **400** - Regular (`Heebo-Regular.ttf`)
- **500** - Medium (`Heebo-Medium.ttf`)
- **600** - Semi Bold (`Heebo-SemiBold.ttf`)
- **700** - Bold (`Heebo-Bold.ttf`)
- **800** - Extra Bold (`Heebo-ExtraBold.ttf`)
- **900** - Black (`Heebo-Black.ttf`)

### 2. **Default Font Family** 
- **Body/Global**: Updated to use `'Heebo'` as the primary font
- **Fallback Chain**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`

### 3. **Tailwind Config** (`tailwind.config.ts`)
Updated the default `sans` font family to use Heebo:

```typescript
fontFamily: {
  sans: ['Heebo', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
}
```

### 4. **Font-Weight Utility Classes**
CSS utility classes ensure every font-weight automatically uses Heebo:

```css
.font-thin        { font-weight: 100; }
.font-extralight  { font-weight: 200; }
.font-light       { font-weight: 300; }
.font-normal      { font-weight: 400; }
.font-medium      { font-weight: 500; }
.font-semibold    { font-weight: 600; }
.font-bold        { font-weight: 700; }
.font-extrabold   { font-weight: 800; }
.font-black       { font-weight: 900; }
```

**Aliases** are also available for convenience:
- `.font-regular` → font-weight: 400
- `.font-semi` → font-weight: 600

## How to Use

### ✅ Do This (Already Automatic)
```jsx
// No need to specify font-family - Heebo is applied automatically!
<h1 className="font-bold">Heading</h1>
<p className="font-normal">Paragraph</p>
<span className="font-semibold">Semi Bold Text</span>
<p className="font-light">Light Text</p>
```

### ✅ How It Works
1. You specify a Tailwind font-weight class: `font-bold`, `font-light`, etc.
2. The Tailwind class applies `font-weight: 700` (or whatever)
3. The browser automatically matches this weight to the correct Heebo TTF file
4. **Result**: Perfect matching of font style without manual intervention

### ❌ Don't Do This (Not Needed)
```jsx
// ❌ No need for inline styles
<span style={{ fontFamily: 'Heebo', fontWeight: 700 }}>Text</span>

// ❌ No need for separate font classes
<span className="font-heebo font-bold">Text</span>
```

## Font Weight Mapping

When you use Tailwind's font-weight utilities, here's how they map:

| Tailwind Class | Font Weight | Heebo Font | Use Case |
|---|---|---|---|
| `font-thin` | 100 | Heebo-Thin.ttf | Minimal visibility, decorative |
| `font-extralight` | 200 | Heebo-ExtraLight.ttf | Very light emphasis |
| `font-light` | 300 | Heebo-Light.ttf | Light emphasis, secondary info |
| `font-normal` / `font-regular` | 400 | Heebo-Regular.ttf | **Default body text** |
| `font-medium` | 500 | Heebo-Medium.ttf | Slight emphasis |
| `font-semibold` / `font-semi` | 600 | Heebo-SemiBold.ttf | Moderate emphasis, labels |
| `font-bold` | 700 | Heebo-Bold.ttf | Strong emphasis, headings |
| `font-extrabold` | 800 | Heebo-ExtraBold.ttf | Very strong emphasis |
| `font-black` | 900 | Heebo-Black.ttf | Maximum emphasis, titles |

## Performance Optimization

**Font Display Strategy: `swap`**
- Ensures text is visible immediately
- Font files load in background
- Text updates when Heebo is ready
- Better UX than waiting for font

## Browser Support

✅ Works in all modern browsers:
- Chrome/Edge 4+
- Firefox 3.6+
- Safari 3.1+
- iOS Safari 4.2+
- Android Browser 2.2+

## Existing Codebase

Your app already uses font-weight classes throughout, so **no changes needed** to existing components:

✅ These are automatically Heebo now:
```jsx
className="font-semibold"      // ✅ Uses Heebo Semi Bold
className="font-bold"          // ✅ Uses Heebo Bold
className="text-sm"            // ✅ Uses Heebo Regular (default)
className="font-light"         // ✅ Uses Heebo Light
```

## Troubleshooting

### Font not loading?
1. Verify TTF files exist in `public/Heebo/`
2. Check browser DevTools → Network tab for failed font downloads
3. Ensure paths are correct: `/Heebo/Heebo-Bold.ttf`

### Font looks different per weight?
This is normal and expected - each weight has its own optimized letterforms.

### Want to override for specific component?
You can still use inline styles if needed:
```jsx
<span style={{ fontFamily: 'Heebo' }}>Text</span>
```

## References

- **Heebo Font Files**: `/public/Heebo/`
- **Font Configuration**: `src/index.css` (lines 1-62)
- **Tailwind Config**: `tailwind.config.ts` (theme.extend.fontFamily)
- **Global Styles**: `src/index.css` (components layer, lines 340-380)

## Summary

🎉 **The entire app now uses Heebo font by default!**

- ✅ All components automatically use Heebo
- ✅ Font weights automatically map to correct TTF files
- ✅ No changes needed to existing code
- ✅ Hebrew text support optimized
- ✅ Performance optimized with font-display: swap
