# DESIGN_DECISIONS.md — WashFlow Frontend

Consolidated design decisions derived from 13 inspiration references.
Every decision here is final unless explicitly revised. Reference this before
building any screen or component.

---

## 1. Visual identity

| Token                   | Value                             | Rationale                      |
| ----------------------- | --------------------------------- | ------------------------------ |
| Primary color           | Indigo (`indigo-600` / `#4F46E5`) | Modern SaaS, professional      |
| Primary hover           | `indigo-700` / `#4338CA`          | Darker on interaction          |
| Primary subtle          | `indigo-50` / `#EEF2FF`           | Backgrounds, selected states   |
| Success                 | `green-600` / `#16A34A`           | Completed, active, confirmed   |
| Warning                 | `amber-500` / `#F59E0B`           | In-progress, pending           |
| Danger                  | `red-600` / `#DC2626`             | Cancelled, errors, destructive |
| Info                    | `blue-600` / `#2563EB`            | In-review, informational       |
| Neutral                 | `gray-*` scale                    | Text, borders, muted content   |
| Background              | `gray-50` / `#F9FAFB`             | Page background                |
| Surface                 | `white`                           | Cards, panels, modals          |
| Border                  | `gray-200` / `#E5E7EB`            | Default borders                |
| Border radius — cards   | `rounded-xl` (12px)               |                                |
| Border radius — buttons | `rounded-lg` (8px)                |                                |
| Border radius — inputs  | `rounded-lg` (8px)                |                                |
| Border radius — badges  | `rounded-full`                    | Pills only                     |

---

## 2. Typography

| Element          | Class                                                       | Notes                                       |
| ---------------- | ----------------------------------------------------------- | ------------------------------------------- |
| Page title       | `text-2xl font-semibold text-gray-900`                      |                                             |
| Section heading  | `text-lg font-semibold text-gray-900`                       |                                             |
| Card title       | `text-base font-semibold text-gray-900`                     |                                             |
| Body             | `text-sm text-gray-700`                                     | Default for most content                    |
| Label (form)     | `text-sm font-medium text-gray-700`                         | Above inputs                                |
| Micro label      | `text-xs font-medium text-gray-500 uppercase tracking-wide` | Table headers, field labels in detail views |
| Muted text       | `text-sm text-gray-500`                                     | Subtitles, secondary info                   |
| Monospace (refs) | `font-mono text-sm`                                         | Booking references, IDs                     |

---

## 3. Navigation patterns

### Admin — desktop sidebar

- Fixed left sidebar, 240px wide
- Two-level: icon strip (collapsed) + icon + label (expanded), collapsible
- Logo at top, user profile at bottom
- Active item: `bg-indigo-50 text-indigo-700 rounded-lg`
- Grouped nav sections with muted uppercase labels (e.g. "Operations", "Management")
- Reference: admin-dashboard_inspo

### Client — desktop top nav + mobile bottom tab bar

- Desktop: top navbar with logo left, nav links center, avatar right
- Mobile: bottom tab bar, 4 icons max, active icon has filled indigo background circle
- Tab items: Home, Book, My Bookings, Profile
- Reference: Mobile-bottom-nav_inspo

### Car Washer — mobile bottom tab bar

- Bottom tab bar, 4 icons: Today's Jobs, History, Notifications, Profile
- Same active state pattern as client mobile nav
- Entire washer experience is mobile-first (375px base)
- Reference: Mobile-bottom-nav_inspo, Mobile-job-list_inspo

---

## 4. Authentication screens

### Login page

- Split layout: left half = brand image placeholder, right half = form
- Right side: logo + app name, "Login to your account" title, subtitle
- Fields: Email, Password
- Options: Remember me checkbox (left) + Forgot password link (right)
- Primary CTA: full-width indigo button
- Divider: "Or continue with" — skip social auth (not in scope)
- Footer: "Don't have an account? Create one"
- Reference: login_inspo

### Register — role selection step

- Centered card layout (no split)
- Progress dots at top (step 1 of N)
- Title: "Who are you?" / Subtitle explaining the choice
- Two role cards only: Client, Car Washer (Admin accounts are created by admin)
- Each card: icon (Lucide) + role name + one-line description
- Selected card: `border-indigo-600 bg-indigo-50`
- Full-width "Continue" button at bottom
- Reference: pick-role-register_inspo

### Register — account details step

- Same centered card layout
- Fields depend on role selected
- Client: Full name, Email, Password, Phone
- Car Washer: Full name, Email, Password, Phone (admin activates account separately)

---

## 5. Status badge system

All statuses use the icon + colored pill pattern consistently across all roles.

| Status      | Icon (Lucide)  | Tailwind classes             |
| ----------- | -------------- | ---------------------------- |
| Pending     | `Clock`        | `bg-gray-100 text-gray-600`  |
| Confirmed   | `CheckCircle`  | `bg-blue-50 text-blue-700`   |
| In Progress | `Loader`       | `bg-amber-50 text-amber-700` |
| Completed   | `CheckCircle2` | `bg-green-50 text-green-700` |
| Cancelled   | `XCircle`      | `bg-red-50 text-red-700`     |

**Badge component pattern:**

```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
  <Loader className="w-3 h-3" />
  In Progress
</span>
```

**Rule:** Never use color alone to communicate status. Always pair with icon + text label.

Reference: Status-badge-patterns_inspo

---

## 6. Card patterns

### Service card (booking flow + admin services list)

- White card, `rounded-xl`, `border border-gray-200`
- Optional badge: "Popular" / "Best Value" — small pill anchored top-right
- Feature list with check icons (green) for included features
- Price displayed prominently (`text-2xl font-bold`)
- Duration as a muted pill badge
- Full-width CTA button pinned to card bottom, indigo background
- Selected state: `border-indigo-600 bg-indigo-50`
- Reference: service-card_inspo

### Job card (washer today's jobs)

- White card with left color-coded border (status color)
- Job reference in monospace, status badge top-right
- Key info: client name, vehicle, service type, time slot
- Progress bar when status is In Progress
- Tap to open job detail
- Reference: Mobile-job-list_inspo

---

## 7. Data tables (admin)

Applies to: Bookings list, Staff list, Clients list, Services list.

**Structure (top to bottom):**

1. Page header: title (left) + primary action button (right, e.g. "+ New Booking")
2. Tab filters for sub-categories (if applicable)
3. Toolbar: Search input (left) + Filter button + Sort button + view toggle (right)
4. Table:
   - Checkbox column (bulk actions)
   - First data column: avatar/icon + primary label
   - Supporting columns: key metadata
   - Status column: colored dot + text badge
   - Actions column: `···` menu (Edit, View, Delete)
5. Pagination: "Page X of Y" (left) + prev/next + page numbers (right)

**Table row states:**

- Default: `bg-white`
- Hover: `bg-gray-50`
- Selected: `bg-indigo-50`

**Column header:** `text-xs font-medium text-gray-500 uppercase tracking-wide`

Reference: data-table_inspo

---

## 8. Empty states

Applies to every list/table screen when no data exists.

**Structure:**

- Keep the page header, toolbar (search/filter/sort) visible — do not hide them
- Centered content below the toolbar:
  - Ghosted skeleton illustration (2–3 faded placeholder cards)
  - Title: descriptive (e.g. "No bookings yet")
  - Subtitle: one sentence explaining what to do
  - Primary CTA button (e.g. "+ Create first booking")
- Background of skeleton cards: `bg-gray-100`, rounded, no content

Reference: Empty-states_inspo

---

## 9. Detail pages (booking detail, job detail)

### Progress tracker

- Horizontal stepper at the top of the detail page
- Numbered circles connected by dashed lines
- Completed steps: filled indigo circle + indigo label
- Current step: indigo outline circle + bold label
- Future steps: gray circle + gray label
- Date/time shown below each completed step
- Reference: order-detail_inspo

### Info section

- Three-column grid below the tracker (desktop), stacked on mobile
- Each column: micro label header + values below
- Columns for booking: "Booking Info" / "Vehicle" / "Client Details"
- Columns for admin booking: "Booking Info" / "Assigned Washer" / "Client Details"

### Action area

- Washer job detail: large full-width primary button ("Mark as In Progress" / "Mark as Complete")
- Client booking detail: ghost "Reschedule" + danger "Cancel" buttons
- Admin booking detail: "Assign Washer" + status dropdown

Reference: order-detail_inspo, Mobile-job-list_inspo

---

## 10. Settings & profile

- Left sub-navigation with grouped sections and muted group labels
- Main content: stacked editable section cards
- Each card: title + "Edit" button (top right) → clicking Edit reveals inline form within the card
- Save/Cancel inline within the card, not a separate page
- Avatar upload area: placeholder circle + "Upload photo" button + format guidance text
- Destructive action (e.g. Delete account) at the very bottom of the sub-nav in red
- Reference: settings-profile_inspo

---

## 11. Mobile washer experience

The washer interface is mobile-first. Every washer screen is designed at 375px width first.

**Today's jobs screen:**

- Header: avatar + name + notification bell
- Search/filter bar
- Section label: "Today's jobs" with count
- Scrollable job card list
- Bottom tab bar

**Job detail screen:**

- Back arrow header
- Status badge + job reference (top)
- Progress tracker (compact, vertical on mobile)
- Key-value info pairs (label left, value right)
- Large action button at bottom (full width, fixed to bottom of screen)
- Reference: Mobile-job-list_inspo

---

## 12. Forms

- All inputs: `border border-gray-200 rounded-lg px-3 py-2 text-sm`
- Focus: `focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`
- Error: `border-red-500` + red error message below input
- Label above input, never placeholder-as-label
- Required fields: asterisk (\*) in label, `text-red-500`
- Submit button: full-width on mobile, right-aligned on desktop
- Disabled state when submitting: `opacity-50 cursor-not-allowed`

---

## 13. Landing page

- Clean white navbar: logo (left) + nav links (center) + CTA button (right)
- Hero: large headline (left) + brand image placeholder (right) + subtext + CTA button
- Trust strip: "Trusted by X clients" with placeholder logo row
- Services section: 2×2 card grid, each with service name + description + "Learn more" link
- How it works: 3-step horizontal process
- CTA banner: headline + "Book your first wash" button
- Footer: links + copyright
- Reference: Landing-Page-Design_inspo

---

## 14. Component library build order

Build shared components in this order before any feature screens:

1. `Button` (variants: primary, secondary, ghost, danger; sizes: sm, md, lg)
2. `Input`, `Select`, `Textarea`, `Checkbox`
3. `Badge` (all 5 status variants)
4. `Card` (base wrapper)
5. `ImagePlaceholder`
6. `LoadingSpinner`, `ErrorState`, `EmptyState`
7. `Table`, `TableRow`, `Pagination`
8. `Modal`, `ConfirmDialog`
9. `Sidebar` (admin), `BottomNav` (mobile)
10. `StepTracker` (progress indicator for booking flow + detail pages)
