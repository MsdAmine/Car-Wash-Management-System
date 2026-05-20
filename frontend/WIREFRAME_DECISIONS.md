# WIREFRAME_DECISIONS.md — WashFlow

All structural decisions made during the wireframing phase.
Reference this when building each screen to understand layout intent.

---

## Auth screens

### Login
- Split layout: left 45% = ImagePlaceholder (brand image), right 55% = form
- Right panel: logo + app name → title "Login to your account" → subtitle
- Fields: Email, Password
- Row below password: Remember me checkbox (left) + Forgot password link (right)
- Full-width indigo CTA button
- Footer link: "Don't have an account? Register"
- No social auth buttons

### Register — step 1 (role picker)
- Centered card on gray background (no split layout)
- Top: Back link (left) + progress dots (right, step 1 of 2 active)
- Title + subtitle
- Two role option cards: Client, Car Washer
  - Each: Lucide icon + role name + one-line description
  - Selected state: indigo border + indigo-50 background
- Full-width Continue button (disabled until role selected)
- Footer: "Already have an account? Login"

### Register — step 2 (account details)
- Same centered card layout
- Top: Back link + progress dots (step 2 active)
- Title + role badge pill (shows selected role, read-only)
- Fields in 2-col grid: First name, Last name
- Full-width fields: Email, Phone, Password
- Full-width "Create account" button
- Car Washer note: after submit → pending activation screen (flagged, not yet designed)

### Forgot password
- Single centered card (no split layout)
- State 1: email field + "Send reset link" button + "Back to login" link
- State 2: success icon + "Check your email" message + "Back to login" button + "Resend" link
- Both states on same route — no page redirect on submit

---

## Client screens

### Home
- Layout: client top nav + max-w-5xl content area
- Greeting: "Good morning, [Name]" + today's date (dynamic)
- Upcoming booking card: left status-colour border, service, date, vehicle, washer
  - If no upcoming booking: replace with "Book your first wash" CTA
- Quick book row: 2–3 service shortcut cards side by side
  - Tapping pre-fills service and opens booking flow at step 1 (service still visible)
- My vehicles strip: horizontal row of vehicle cards + "+" add card
- Recent activity: last 2–3 bookings as compact rows

### Booking flow shell
- Layout: client top nav + gray page background + centered white card (max-w-lg)
- Step indicator: 4 numbered dots + labels + connecting lines
  - Completed: filled indigo circle + checkmark
  - Active: indigo outline circle
  - Pending: gray filled circle
- Step labels: Service / Vehicle / Date & Time / Confirm
- Back / Continue row at card bottom separated by hairline
- Continue disabled until step requirement met
- Step 4 Continue label = "Confirm booking"
- Success state: replace card content (no page redirect)
  - Check icon + "You're all set!" + booking ref (monospace) + "View my bookings" link

### Booking — step 1 (service)
- 2×2 card grid of services
- Each card: image placeholder, name, description, duration badge, price
- Selected: indigo border + indigo-50 background
- "Popular" / "Best Value" badges anchored top-right of card

### Booking — step 2 (vehicle)
- List of saved vehicle cards (full width)
- Each: car icon, make + model, plate + type, radio selection indicator
- "Add a new vehicle" ghost button below list
- Selected: indigo border + indigo-50 background

### Booking — step 3 (date & time)
- Calendar: month/year header with prev/next, 7-col day grid
- Past dates: muted, not clickable
- Selected date: filled indigo circle
- Time slot grid (5 per row) appears below calendar after date is selected
- Booked slots: strikethrough text, not clickable
- Selected slot: indigo background

### Booking — step 4 (confirm)
- Summary card: 4 rows (Service, Vehicle, Date, Time) with label + value + price
- Green info box: free cancellation policy
- Confirm button submits booking

### My bookings
- Page header: "My Bookings" + "+ New booking" button
- Tab filter: Upcoming (default) / Past
  - Upcoming count badge on tab
- Booking cards:
  - Left border colour = status (amber=in progress, indigo=confirmed)
  - Service name, booking ref (monospace), date/time, vehicle, status badge
  - In-progress: progress bar instead of action buttons
  - Confirmed: Reschedule + Cancel action buttons
- Past tab: same cards, muted text, "Book again" + "Receipt" buttons

### Booking detail (client)
- Back arrow + "My Bookings / #CW-XXXXX" breadcrumb
- Booking title + monospace ref + status badge
- Horizontal progress tracker: Pending → Confirmed → In Progress → Completed
  - Date/time shown below completed steps
- 3-column info grid: Booking Info / Vehicle / Washer
- Service summary row with price
- Contextual actions (change with status):
  - Confirmed: Reschedule (ghost) + Cancel (danger)
  - In Progress: no actions
  - Completed: Book again + Receipt

### My vehicles
- Page header: "My Vehicles" + "+ Add vehicle" button
- 3-column card grid (single column on mobile)
- Each card: image placeholder, make + model, plate, type badge, Edit + Delete buttons
- Last card in grid: ghost "+ Add vehicle" card
- Add/edit: modal (not new page)
  - Modal fields: make, model, year, plate, type, colour
- Delete: confirm dialog — "This vehicle will be removed from future bookings"
- Empty state: centred illustration + "Add your first vehicle" CTA

### Profile & settings
- Left sub-nav (2 groups):
  - Account: Personal info, Notifications, Change password
  - Danger: Delete account (red text)
- Main content: stacked editable section cards
  - View mode: label + value + Edit button (top right)
  - Edit mode: inline form + Save/Cancel (no new page or modal)
- Personal info card: avatar upload circle + 2-col name grid + email + phone
- Delete account: type "DELETE" in input to confirm

---

## Car Washer screens (all mobile-first, max-w-sm)

### Today's jobs
- Header: avatar (left) + name + role text / notification bell (right)
- Search bar below header
- Section label "Today's jobs" + assigned count (right)
- Job cards (scrollable list):
  - Left border colour = status (amber=in progress, indigo=assigned)
  - Job ref (monospace), status badge, client name, vehicle, service, time
  - In-progress card: progress bar (time-based, read-only)
- Section label "Completed today" + count — muted, 50% opacity
- Completed cards below (muted styling)
- Bottom tab bar: Jobs (active) / History / Alerts / Profile
- Empty state: "No jobs assigned yet" — no CTA (washers cannot self-assign)

### Job detail
- Header: back arrow + "Job #CW-XXXXX"
- Status badge + booking ref
- Info sections (gray background cards):
  - Booking info: date, time, service name, estimated duration
    - In-progress only: elapsed/total progress bar
  - Vehicle: image placeholder, make, model, plate
  - Client: name, phone number
- Primary action button (bottom of content, not position:fixed):
  - Assigned state: "Start wash" → sets status to In Progress
  - In Progress state: "Mark as complete" → sets status to Completed
  - Completed state: button replaced by green "Completed" confirmation banner
- No back navigation while wash is in progress (prevent accidental status loss)

### Job history
- Header: "History" + "X jobs completed" subtitle
- Search bar + Filter button (filter opens bottom sheet)
- Jobs grouped by date label ("Today", "Yesterday", "May 14"...)
- Job cards: same as today's jobs but muted, no action buttons
- Tapping opens read-only job detail
- Filter bottom sheet: date range picker + service type filter
- Bottom tab bar: Jobs / History (active) / Alerts / Profile

### Profile (washer)
- Header: "Profile"
- Identity card: avatar + full name + "Car Washer" role badge
- Editable rows card: Name, Phone, Email — each has inline Edit button
  - Tapping Edit turns row into input field + Save/Cancel
- Change password: chevron row → navigates to password change screen
- Log out: ghost button at bottom of content
- No delete account option (admin manages staff accounts)
- Bottom tab bar: Jobs / History / Alerts / Profile (active)

---

## Admin screens (all desktop-first)

### Dashboard
- Sidebar: active icon = Dashboard
- Top bar: "Dashboard" + today's date (left) / "+ New booking" (right)
- 4 stat cards (full-width grid):
  - Today's bookings, Revenue today, Active washes, Staff on duty
  - Each: muted label, large number, trend vs yesterday
- Revenue bar chart (spans 3 columns): last 30 days, switchable to weekly/monthly
- Today's active bookings list (1 column): live list, status badges, click → detail
- Unassigned alert strip (bottom): red left border, bookings with no washer assigned
- Donut chart (revenue breakdown by service)

### Bookings list
- Sidebar: active icon = Bookings
- Top bar: "Bookings" / "+ New booking"
- Tab filters: All / Today (DEFAULT) / Upcoming / In Progress / Completed / Cancelled
- Toolbar: search (client name or booking ref) + Filter + Sort + Date range picker
- Table columns: checkbox, Client (avatar+name), Service, Vehicle, Date & time,
  Washer (red "Unassigned" when empty), Status badge, Actions (···)
- Actions dropdown: View detail, Assign washer, Reschedule, Cancel
  - "Assign washer" opens assign modal without navigating away
- Table row states: default white, hover gray-50, selected indigo-50
- Column headers: text-xs uppercase tracking-wide
- Pagination: "Page X of Y" left, prev/next/numbers right

### Booking detail (admin)
- Sidebar: active icon = Bookings
- Top bar: back arrow + "Bookings / #CW-XXXXX" breadcrumb (left)
  + Reschedule (ghost) + Cancel (danger) buttons (right)
- Booking title + status badge
- Horizontal progress tracker (same as client view)
- 3-column info grid: Booking Info / Vehicle / Client Details
- Washer assignment card (dashed border = unassigned, solid = assigned):
  - Unassigned: dashed indigo border, "Assign washer" button
  - Assigned: avatar + name + assigned time, "Reassign" button
- Cancel requires reason: dropdown (Client no-show, Schedule conflict, Other) + notes

### Assign job (modal)
- Triggered from: booking detail "Assign washer" or table row "···" menu
- Modal overlay on current page
- Header: "Assign washer" + close button
- Booking summary strip (read-only): service, date, time
- Available washers list:
  - Each row: avatar, name, jobs today count, availability badge
  - Available: dashed border, selectable
  - Busy (overlap): solid border, greyed out, not selectable — shown so admin knows why
- Single selection (radio pattern)
- Footer: Cancel (ghost) + Assign washer (primary, disabled until selection)
- On confirm: modal closes, booking detail updates without page reload

### Services list
- Sidebar: active icon = Services
- Top bar: "Services" / "+ Add service"
- Card grid (not table): 3 columns
  - Each card: image placeholder, name, description, duration badge, price,
    active/inactive toggle, Edit button
  - Inactive cards: muted styling
- Last card in grid: ghost "+ Add service" card
- Add/edit: right slide-over panel (not modal, not new page)
  - Panel fields: name, description, duration (minutes), price, image upload, active toggle
  - Save / Cancel in panel footer
- No delete — deactivate only

### Staff list
- Sidebar: active icon = Staff
- Top bar: "Staff" / search input (no add button — washers self-register)
- Tab filters: All / Active / Inactive / Pending (pending = registered, not yet activated)
- Table columns: Name (avatar+name), Email, Phone, Status badge, Jobs this month, Actions
- Clicking row opens right detail panel:
  - Avatar + name + status badge
  - Contact info (email, phone, joined date)
  - Stats: total jobs, jobs this month, completion rate
  - Recent job history (last 3)
  - Deactivate (ghost) + Edit info (primary) buttons
- Pending tab: "Activate" button in place of Deactivate

### Clients list
- Sidebar: active icon = Clients
- Top bar: "Clients" / search input
- Table columns: Name, Email, Vehicles count, Total bookings, Last booking, Actions (view)
- Clicking row opens right detail panel:
  - Avatar + name + email + phone + joined date
  - Saved vehicles (small cards)
  - Recent bookings (last 3 with status)
  - "Create booking for this client" shortcut button
- No admin edit of client accounts
- Search covers: name, email, phone

### Analytics
- Sidebar: active icon = Analytics
- Top bar: "Analytics" / Date range picker (left) + Export CSV (right)
- Date range change reruns all charts simultaneously
- Layout (2×2 grid):
  - Revenue over time: bar chart, full width (spans 2 cols), daily/weekly/monthly toggle
  - Bookings by service: donut chart with legend
  - Activity heatmap: 7-col (days) × time slots, colour intensity = booking volume
  - (4th slot: reserved for staff performance table or top clients — defer to P3)

### Settings
- Sidebar: active icon = Settings (bottom of nav)
- Left sub-nav (no groups needed):
  - Business info (default)
  - Operating hours
  - Notifications
  - Cancellation policy
- Business info: logo upload + business name, phone, address, city
- Operating hours: 7 rows (Mon–Sun), each with open/close time + active toggle
  - Closed days greyed out
  - Hours feed into booking time slot availability
- Cancellation policy: single number input (hours) + save
- Personal settings (password, profile) → in avatar dropdown in sidebar bottom

---

## Shared component notes

### ImagePlaceholder
Used everywhere a real image would appear. Gray background, centered label text.
Never generate or embed real images during build phase.

### EmptyState
Every list screen needs an empty state. Keep toolbar (search/filter) visible.
Structure: ghosted skeleton cards + title + subtitle + CTA button

### Status badges
Always: icon + text + coloured pill. Never colour alone.
Never omit the text label even when space is tight.

### LoadingSpinner / ErrorState
Required on every component that fetches data.
Pattern (in every data component):
  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState message="..." />
  if (!data.length) return <EmptyState ... />
