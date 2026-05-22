---
name: WashFlow
description: Car wash management platform for admins, clients, and washers.
colors:
  directive-indigo: "#4f46e5"
  indigo-veil: "#eef2ff"
  indigo-deep: "#4338ca"
  workshop-canvas: "#f9fafb"
  bare-surface: "#ffffff"
  ink: "#111827"
  text-body: "#374151"
  text-muted: "#6b7280"
  chalk-line: "#e5e7eb"
  status-confirmed: "#1d4ed8"
  status-confirmed-surface: "#eff6ff"
  status-progress: "#b45309"
  status-progress-surface: "#fffbeb"
  status-done: "#15803d"
  status-done-surface: "#f0fdf4"
  status-cancelled: "#b91c1c"
  status-cancelled-surface: "#fef2f2"
  alert-red: "#dc2626"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  sm: "16px"
  md: "20px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.directive-indigo}"
    textColor: "{colors.bare-surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.indigo-deep}"
    textColor: "{colors.bare-surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.bare-surface}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.workshop-canvas}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-danger:
    backgroundColor: "{colors.alert-red}"
    textColor: "{colors.bare-surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  input-default:
    backgroundColor: "{colors.bare-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-item-active:
    backgroundColor: "{colors.indigo-veil}"
    textColor: "{colors.directive-indigo}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-item-default:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: WashFlow

## 1. Overview

**Creative North Star: "The Quiet Workshop"**

WashFlow operates like a well-organized workbench: every tool is visible and in its place, nothing competes for attention, and the work gets done without ceremony. The interface recedes behind the task. An admin scanning the bookings queue, a washer checking their next job, a client rescheduling a service — each finds what they need without friction.

The palette is gray-on-white with a single directive accent. Surfaces lift slightly off the canvas; not dramatically, just enough to feel like objects with thickness. Typography is system sans at considered weights. There is no decoration that doesn't carry information.

This system explicitly rejects three failure modes from PRODUCT.md: the generic Tailwind UI kit clone (everything lifted from shadcn with no design conviction), the over-engineered enterprise dashboard (nav layers, modal stacks, density for its own sake), and the cheap service-industry app aesthetic (neon buttons, clip-art, stock-photo heroes bled into the product shell).

**Key Characteristics:**
- Gray-on-white foundation with one directional accent (Directive Indigo, used to orient, not decorate)
- Slightly lifted surfaces: ambient shadow separates card from canvas
- System sans throughout: no display fonts, hierarchy through weight and size contrast
- Status conveyed through semantic chips only, never painted onto full surfaces
- Flat tables and lists; cards only where content is genuinely grouped

## 2. Colors: The Workshop Palette

One accent. Everything else is neutral.

### Primary
- **Directive Indigo** (`#4f46e5`): The one voice in the system. Used on primary buttons, active nav items, focus rings, and links. Its presence signals "this is the action or current location." Never used decoratively.
- **Indigo Veil** (`#eef2ff`): Active-state surface behind nav items. A hint of the accent — not a statement.
- **Indigo Deep** (`#4338ca`): Hover state for primary buttons only.

### Neutral
- **Bare Surface** (`#ffffff`): Cards, sidebar, modal backgrounds, input backgrounds. The working surface.
- **Workshop Canvas** (`#f9fafb`): Page background. Just off-white; the slight distinction from Bare Surface makes elevated objects visible.
- **Chalk Line** (`#e5e7eb`): Borders on cards, inputs, dividers, header bars. Thin and unassertive.
- **Ash** (`#6b7280`): Metadata, placeholders, secondary labels, table column headers.
- **Text Body** (`#374151`): Body text, form labels, secondary headings.
- **Ink** (`#111827`): Primary headings, active nav labels, high-importance data values.

### Status (contained use only)
Status colors appear only inside chips and badges — never as full-surface backgrounds or standalone text color on white.

- **Confirmed Blue** / surface (`#1d4ed8` / `#eff6ff`)
- **In Motion Amber** / surface (`#b45309` / `#fffbeb`)
- **Done Green** / surface (`#15803d` / `#f0fdf4`)
- **Cancelled Red** / surface (`#b91c1c` / `#fef2f2`)
- **Alert Red** (`#dc2626`): Error messages and destructive button variant.

**The One Voice Rule.** Directive Indigo (#4f46e5) is the only accent. It appears on the primary action and the active nav item per screen. Never used as a background tint, a gradient ingredient, or a decorative fill.

**The Contained Status Rule.** Status colors (confirmed/progress/done/cancelled) are always used as a text+surface pair inside a chip. They are never applied as standalone text on a white background, as card backgrounds, or as full-width banners.

## 3. Typography

**Body Font:** System sans-serif stack (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`)

No custom typeface. The system stack loads instantly and is consistent across OS — appropriate for a tool that runs all day in a browser tab.

**Character:** Neutral and clear. Hierarchy comes entirely from size and weight contrast, not expressive letterforms.

### Hierarchy
- **Display** (600, 24px / 1.5rem, lh 1.3): Page-level titles. "Dashboard", "Bookings", "Client Profile".
- **Headline** (600, 20px / 1.25rem, lh 1.4): Section headings, card group headers, modal titles.
- **Title** (600, 16px / 1rem, lh 1.5): Card titles, inline section labels, table group dividers.
- **Body** (400, 14px / 0.875rem, lh 1.5): All body copy, form values, nav labels. Medium variant (500) for form labels. Max line length 65ch on content-heavy pages.
- **Label** (500, 12px / 0.75rem, lh 1.5, tracking 0.05em, uppercase): Table column headers, sidebar group labels, small stat unit labels.

**The Weight-Before-Size Rule.** Before reaching for a larger font size to create emphasis, try 500 or 600 weight at the current size. This keeps the scale compact and avoids a jumpy hierarchy.

## 4. Elevation

The system uses a **slight ambient lift** model. Surfaces are white (#ffffff) on a gray-50 canvas (#f9fafb); the background contrast alone provides baseline separation. A thin ambient shadow adds just enough physicality to feel like an object rather than a flat region.

### Shadow Vocabulary
- **Flat** (`box-shadow: none`): Nav items, table rows, inline list items, button rest states. No lift.
- **Raised** (`box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)`): Cards, stat panels, sidebar. The standard "surface sitting on the canvas."
- **Floating** (`box-shadow: 0 4px 16px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)`): Modals, dropdown menus, popovers.

**The Flat-By-Default Rule.** Elements do not acquire shadows on hover as decoration. Hover state is expressed through background-color shift (gray-100 for nav/ghost, gray-50 for secondary). Shadows mark permanent structural hierarchy, not interactivity.

## 5. Components

### Buttons
8px radius, 14px/500 label. No uppercase, no tracking. `transition: background-color 150ms ease` only.

- **Primary:** Directive Indigo (#4f46e5) background, white text, 8px/16px padding. Hover: Indigo Deep (#4338ca). Focus: 2px indigo-500 ring, 2px offset.
- **Secondary:** White background, gray-700 text, Chalk Line border (1px). Hover: Workshop Canvas (#f9fafb) background.
- **Ghost:** Transparent background, gray-700 text, no border. Hover: gray-100 background.
- **Danger:** Alert Red (#dc2626) background, white text. Hover: red-700.
- **Disabled:** 50% opacity on any variant. No separate disabled color.
- **Loading:** Animated spinner (16px) prepends the label; button dimensions do not shift.

### Badges / Status Chips
Full-radius pill (9999px), 12px/500, inline-flex with 12px leading icon. Always use the status pair (text + surface) together — the dark text color on its matching light surface. Never the dark color alone on white.

### Cards / Containers
- **Stat cards** (summary metrics): 12px radius, white background, Chalk Line border, Raised shadow, 20px padding.
- **Content cards** (grouped content sections): 8px radius, white background, Chalk Line border, Raised shadow, 16–20px padding.
- No nested cards. No decorative border-left stripes.

### Inputs / Fields
White background, Chalk Line border (gray-200), 8px radius, 14px/400 text, Ink (#111827) value, gray-400 placeholder. Focus: border shifts to indigo-500, 2px indigo ring at 20% opacity. Error: red-500 border, red-600 error message text below the input.

### Sidebar Navigation
240px wide (collapsible to 64px icon-only). White background, Chalk Line right border, Raised shadow omitted (border carries the edge). Nav items: 8px radius, 2px horizontal margin. Active: Indigo Veil background (#eef2ff), Directive Indigo text (#4f46e5). Default: transparent, Ash text, transitions to gray-100 background on hover. Group labels: 12px/500/uppercase/tracking-wide, gray-500. Brand name: 18px/600, Directive Indigo.

### Admin Header Bar
White background, Chalk Line bottom border, 56px height. Page title (left, Display weight), contextual action buttons (right). No gradient, no color fill, no shadow.

## 6. Do's and Don'ts

### Do:
- **Do** use Directive Indigo (#4f46e5) only on the primary action and active nav item per screen.
- **Do** use the full status color pair (text + surface tint) together inside chips. Confirmed Blue (#1d4ed8) always on Confirmed Surface (#eff6ff).
- **Do** express hover state through background-color shift: gray-50 for secondary buttons, gray-100 for ghost/nav items.
- **Do** apply the Raised shadow to all cards and stat panels. Apply the Floating shadow to modals and dropdowns.
- **Do** use Workshop Canvas (#f9fafb) as the page background and Bare Surface (#ffffff) as the card/surface layer.
- **Do** cap content text columns at 65ch on detail and form pages.
- **Do** use 12px/500/uppercase/tracking-wide exclusively for structural metadata: table column headers, sidebar group labels.

### Don't:
- **Don't** use a border-left greater than 1px as a colored accent stripe on cards, list items, or alerts. Use full borders, background tints, or leading icons instead.
- **Don't** use gradient text (`background-clip: text` with a gradient fill). Emphasis is weight or size, never a gradient.
- **Don't** use glassmorphism, blur backdrops, or semi-transparent surface overlays.
- **Don't** build identical icon + heading + body card grids. Flat lists or tables serve that content without the visual monotony.
- **Don't** apply the generic Tailwind-kit aesthetic unmodified: every input, badge, and modal looking like a shadcn or Flowbite template.
- **Don't** add elevation to hover state. Shadow is structural, not interactive.
- **Don't** bleed service-industry aesthetics into the product shell: neon buttons, stock-photo panels, clip-art iconography.
- **Don't** stack enterprise-style nav layers or modal-on-modal patterns. One primary action and one modal per screen.
- **Don't** introduce new accent colors for one-off states. The status chip palette covers all semantic needs; extend through new chip variants, not new brand colors.
