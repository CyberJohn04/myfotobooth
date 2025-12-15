<!-- 
PHOTOBOOTH LOGIN PAGE - VISUAL REFERENCE & DESIGN SYSTEM
=========================================================

This document provides a visual reference for the login page design,
including layout, colors, typography, and component hierarchy.
-->

# Visual Design Reference

## Color Palette

### Primary Colors
- **Indigo-600**: `#4f46e5` — Primary brand color (buttons, links, accents)
- **Indigo-700**: `#4338ca` — Hover state for buttons
- **Indigo-800**: `#3730a3` — Desktop illustration panel background

### Semantic Colors
- **White**: `#ffffff` — Card background, form inputs
- **Slate-50**: `#f8fafc` — Page background (gradient start)
- **Slate-100**: `#f1f5f9` — Secondary backgrounds
- **Slate-300**: `#cbd5e1` — Input borders (inactive)
- **Slate-500**: `#64748b` — Secondary text, icons
- **Slate-700**: `#334155` — Primary text, labels
- **Slate-900**: `#0f172a` — Headings, emphasis

### Status Colors
- **Red-500**: `#ef4444` — Error states, validation messages
- **Red-600**: `#dc2626` — Error hover states
- **Amber-50**: `#fffbeb` — Demo credentials background
- **Amber-200**: `#fcd34d` — Demo credentials border

## Typography

### Font Family
- **Base**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- (Tailwind default system font stack)

### Font Sizes & Weights

```
H1 Brand (Login Header)
├─ Size: 1.875rem (30px)
├─ Weight: 700 (bold)
└─ Line-height: 2.25rem (36px)

H2 Subtitle
├─ Size: 0.875rem (14px)
├─ Weight: 400 (normal)
└─ Color: slate-500

LABEL (Form labels)
├─ Size: 0.875rem (14px)
├─ Weight: 500 (medium)
├─ Color: slate-700
└─ Letter-spacing: normal

INPUT/BUTTON
├─ Size: 1rem (16px)
├─ Weight: 400 (normal)
└─ Line-height: 1.5rem (24px)

ERROR MESSAGE
├─ Size: 0.75rem (12px)
├─ Weight: 500 (medium)
├─ Color: red-600
└─ Letter-spacing: normal

FOOTER LINK
├─ Size: 0.875rem (14px)
├─ Weight: 500 (medium)
├─ Color: indigo-600
└─ Hover: indigo-700
```

## Layout Structure

### Mobile Layout (< 768px)
```
┌─────────────────────────────────┐
│                                 │
│    ☰ Gradient Background        │
│    (Slate 50 → Slate 100)       │
│                                 │
│    ┌───────────────────────┐    │
│    │      Login Card       │    │
│    │   (White, rounded)    │    │
│    │                       │    │
│    │  📷 Photobooth        │    │  ← Brand section
│    │  Sign in to account   │    │
│    │                       │    │
│    │  [Email Input]        │    │  ← Form fields
│    │  [Password Input]     │    │
│    │  ☑ Remember me        │    │
│    │                       │    │
│    │  [Sign In Button]     │    │  ← Primary action
│    │                       │    │
│    │ ─────────────────────  │    │  ← Divider
│    │ Forgot password?      │    │  ← Secondary actions
│    │ Create account        │    │
│    │                       │    │
│    │ Demo: any@email + pwd │    │  ← Demo hint
│    │                       │    │
│    └───────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### Desktop Layout (≥ 768px)
```
┌────────────────────────────────────────────────┐
│                                                │
│  ┌──────────────────┬─────────────────────┐   │
│  │                  │                     │   │
│  │ Illustration     │   Login Card        │   │
│  │ Panel            │                     │   │
│  │                  │  📷 Photobooth      │   │
│  │ 🎥              │  Sign in to account │   │
│  │                  │                     │   │
│  │ "Capture         │  [Email]            │   │
│  │ Moments"         │  [Password]         │   │
│  │                  │  ☑ Remember me      │   │
│  │ Professional     │                     │   │
│  │ quality, instant │  [Sign In Button]   │   │
│  │ prints...        │                     │   │
│  │                  │  ──────────────     │   │
│  │ ● ● ●           │  Forgot password    │   │
│  │                  │  Create account     │   │
│  │ (Indigo gradient)│                     │   │
│  │                  │  Demo: any@email... │   │
│  │                  │                     │   │
│  └──────────────────┴─────────────────────┘   │
│                                                │
└────────────────────────────────────────────────┘
```

## Component Spacing

### Card Padding
```
Desktop:  padding: 2.5rem (40px)   [p-10]
Mobile:   padding: 2rem (32px)     [p-8]
```

### Form Field Spacing
```
Input height:        2.5rem (40px)        [h-10]
Field gap:           1.25rem (20px)       [space-y-5]
Label to input gap:  0.5rem (8px)         [space-y-2]
```

### Border & Shadows
```
Card border-radius:   1rem (16px)         [rounded-2xl]
Input border-radius:  0.5rem (8px)        [rounded-lg]
Button border-radius: 0.5rem (8px)        [rounded-lg]

Card box-shadow:      
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04)
  [shadow-2xl]

Input focus ring:     offset 2px, width 2px, color indigo-100
Button hover shadow:  [shadow-md]
```

## Interactive States

### Form Inputs

```
DEFAULT (Valid)
├─ Border: slate-300
├─ Background: white
└─ Focus: border indigo-500, ring indigo-100

ERROR
├─ Border: red-500
├─ Background: white
├─ Text color: red-600
└─ Focus: border red-500, ring red-100

DISABLED
├─ Background: slate-100
├─ Cursor: not-allowed
└─ Opacity: 0.5

FOCUS
├─ Border color: indigo-500
├─ Ring: indigo-100 (2px)
└─ Outline: 2px solid, offset 2px
```

### Buttons

```
PRIMARY BUTTON (ENABLED)
├─ Background: indigo-600
├─ Text: white
└─ Hover: indigo-700, shadow-md

PRIMARY BUTTON (DISABLED)
├─ Background: indigo-300
├─ Text: white
├─ Cursor: not-allowed
└─ Opacity: 1 (visual enough)

PRIMARY BUTTON (LOADING)
├─ Background: indigo-600
├─ Icon: spinner (animate-spin)
├─ Text: "Signing in..."
└─ Disabled: true
```

### Links (Secondary Actions)

```
DEFAULT
├─ Color: indigo-600
├─ Text-decoration: none
└─ Font-weight: 500

HOVER
├─ Color: indigo-700
└─ Transition: color 200ms

FOCUS
├─ Outline: 2px solid indigo-500
├─ Border-radius: 4px
└─ Offset: 2px
```

### Checkbox

```
UNCHECKED
├─ Border: slate-300
├─ Background: white
└─ Cursor: pointer

CHECKED
├─ Border: indigo-600
├─ Background: indigo-600
├─ Checkmark: white
└─ Cursor: pointer

FOCUS
├─ Ring: indigo-500
├─ Ring-offset: 2px
└─ Border-radius: 4px
```

## Animations

### Entrance
```
Card fade-in + slide-in:
├─ Duration: 500ms
├─ Easing: ease-out
├─ From: opacity 0, translateX(10px)
└─ To: opacity 1, translateX(0)
```

### Error Message
```
Slide-in from top:
├─ Duration: 200ms
├─ Easing: ease-out
└─ From: opacity 0, translateY(-10px)
   To: opacity 1, translateY(0)
```

### Hover Effects
```
Button:
├─ Box-shadow transition: 200ms
└─ Background-color transition: 200ms

Input focus:
├─ Border-color transition: 200ms
└─ Ring transition: 200ms

Links:
├─ Color transition: 200ms
└─ Background transition: 200ms
```

### Loading Spinner
```
Icon: Loader2 (lucide-react)
├─ Size: 18px
├─ Rotation: continuous spin
└─ Animation: animate-spin (Tailwind)
```

## Accessibility Spacing

### Focus Outlines
```
All interactive elements have:
├─ Focus outline: 2px solid
├─ Outline-offset: 2px
├─ Outline-color: indigo-500
└─ Border-radius: 4px-8px
```

### Touch Targets (Mobile)
```
Minimum height: 44px (buttons, inputs)
Minimum width: 44px (small icons)
Minimum padding: 12px (surrounding elements)
```

### Error Message Visibility
```
├─ Minimum contrast: 4.5:1
├─ Font-size: 12px minimum
├─ Associated via aria-describedby
└─ Announcement: automatic for screen readers
```

## Responsive Breakpoints

```
Mobile:     < 640px   (sm) — Single column, stacked layout
Tablet:     768-1023px (md) — Two column layout appears
Desktop:    ≥ 1024px  (lg) — Full desktop experience
```

### Component Adjustments

| Component | Mobile | Tablet/Desktop |
|-----------|--------|----------------|
| Layout | Single column | Grid 2 columns |
| Card width | Full width - 16px | 50% width |
| Padding | p-8 (32px) | p-10 (40px) |
| Illustration panel | Hidden | Visible |
| Font size | Base | Base |
| Input height | h-10 (40px) | h-10 (40px) |

## Icons

### Used Icons (Lucide React)

```
Camera (📷)
├─ Brand logo
├─ Size: 24px, 48px
└─ Color: indigo-600, white

Eye (👁️)
├─ Show password toggle
├─ Size: 18px
└─ Color: slate-500 (hover: slate-700)

EyeOff (🙈)
├─ Hide password toggle
├─ Size: 18px
└─ Color: slate-500 (hover: slate-700)

Loader2 (⏳)
├─ Loading indicator
├─ Size: 18px
├─ Color: white
└─ Animation: spin
```

All icons use: `lucide-react` package
Size: `className="w-XYpx h-XYpx"`

## Form Validation Visual Feedback

### Email Field Example

```
BEFORE INPUT:
┌─────────────────────────────────┐
│ Email Address                   │
│ ┌───────────────────────────────┤  ← Border: slate-300
│ │ you@example.com (placeholder) │
│ └───────────────────────────────┘

INVALID INPUT:
┌─────────────────────────────────┐
│ Email Address                   │
│ ┌───────────────────────────────┤  ← Border: red-500
│ │ invalid-email                 │  ← Text: red-600
│ └───────────────────────────────┘
│ ⚠ Please enter a valid email     │  ← Error: red-600, 12px
│   address (ID: email-error)      │

CORRECTED:
┌─────────────────────────────────┐
│ Email Address                   │
│ ┌───────────────────────────────┤  ← Border: slate-300
│ │ valid@example.com             │  ← Text: slate-900
│ └───────────────────────────────┘
```

## Demo Hint Box

```
┌─────────────────────────────────┐
│  ⚠ Demo: any@email + password  │  ← Amber-50 background
│    (6+ chars)                   │  ← Amber-800 text
│    • Check console              │  ← Monospace font
└─────────────────────────────────┘
Border: amber-200, 1px
Padding: 12px (p-3)
Border-radius: 8px (rounded-lg)
```

## Error Banner (Top of Card)

```
┌─────────────────────────────────┐
│ × Server error. Please try      │  ← Red-600 text
│   again later.                  │  ← Red-50 background
└─────────────────────────────────┘
Animation: slide-in-from-top-2
Duration: 200ms
Margin-bottom: 24px (mb-6)
```

## Submit Button States

```
ENABLED (Form Valid):
┌─────────────────────────────────┐
│       Sign In                   │  ← Indigo-600 background
│                                 │  ← White text, bold
└─────────────────────────────────┘

DISABLED (Form Invalid):
┌─────────────────────────────────┐
│       Sign In                   │  ← Indigo-300 background
│                                 │  ← White text, opacity 0.5
└─────────────────────────────────┘

LOADING (During submission):
┌─────────────────────────────────┐
│    ⏳ Signing in...             │  ← Spinner + text
│                                 │  ← Disabled state
└─────────────────────────────────┘
```

## Keyboard Focus Visual Guide

```
Tab Order:
1. Email Input
2. Password Input
3. Show/Hide Toggle Button
4. Remember Me Checkbox
5. Sign In Button
6. Footer Links (Forgot password, Create account)

Focus Indicator:
├─ Ring: 2px solid indigo-500
├─ Ring-offset: 2px
└─ Outline-offset: 2px
```

## Dark Mode Support (If Implemented)

Current: Light theme only
Future: Consider adding dark mode variant

```
Dark theme colors (example):
├─ Background: slate-900
├─ Card: slate-800
├─ Text: slate-100
├─ Primary: indigo-500
└─ Illustration: indigo-600
```

---

## Design System Files

- **Colors**: Tailwind config (core + extensions in PostCSS)
- **Typography**: Tailwind defaults (system font stack)
- **Spacing**: Tailwind 4px baseline (multiples: 2, 3, 4, 5, 6, 8, 10, etc.)
- **Shadows**: Tailwind predefined (shadow-lg, shadow-2xl, shadow-md)
- **Animations**: Tailwind built-in (animate-spin, fade-in, slide-in)
- **Breakpoints**: Tailwind defaults (sm, md, lg, xl, 2xl)

---

## Asset Requirements

### Images
- Logo/Icon: Provide as SVG or use Lucide React icon
- Illustration: Currently using Camera icon + text (customize as needed)

### Fonts
- No custom fonts needed (system font stack used)
- Icons: Lucide React (npm package)

### External Libraries
- React 18+
- Tailwind CSS 3+
- Lucide React (icons)
- Radix UI (component primitives)
- React Router v6 (navigation)

---

Generated: November 26, 2025
Design System: Tailwind CSS + Radix UI
Compliance: WCAG 2.1 AA
Browser Support: Modern browsers (Chrome, Firefox, Safari, Edge, last 2 versions)
