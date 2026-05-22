---
target: frontend/car-wash-web/src
total_score: 26
p0_count: 0
p1_count: 2
p2_count: 3
timestamp: 2026-05-22T01-17-00Z
slug: frontend-car-wash-web-src
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Period toggles and search bar claim to respond but don't change state |
| 2 | Match System / Real World | 3 | Washer sees customer email, not name — wrong primary identifier |
| 3 | User Control and Freedom | 3 | Cancel confirmation is solid; no undo after washer assignment |
| 4 | Consistency and Standards | 3 | Minor: active vs. completed count badges look identical on washer page |
| 5 | Error Prevention | 3 | Destructive confirm exists; non-functional search has no disabled state |
| 6 | Recognition Rather Than Recall | 3 | Main actions visible; booking IDs as primary identifiers require memorization |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts; no bulk assignment; search non-functional |
| 8 | Aesthetic and Minimalist Design | 3 | Hardcoded progress bar and decorative controls add noise without signal |
| 9 | Error Recovery | 2 | Generic "could not load" messages with no retry action |
| 10 | Help and Documentation | 1 | No contextual help anywhere across all three role views |
| **Total** | | **26/40** | **Acceptable** |

## Anti-Patterns Verdict

5 detector findings (codebase-wide). Direct hits on reviewed pages: Modal.tsx:51 bg-black backdrop used by ConfirmDialog on ClientHomePage.

## Priority Issues

### [P1] Non-functional controls — period toggles, search, progress bar
Revenue chart period toggles show identical hardcoded data. Washer search has no filter logic. Progress bar hardcoded at w-3/5.
Fix: disable/remove period toggles until real data; wire or remove search; replace decorative progress bar with text status.

### [P1] Washer job card uses email as primary identifier
customerEmail shown as primary text. Washer needs license plate + customer name at job site, not email.
Fix: make vehicleLicensePlate the primary heading; demote email to detail view.

### [P2] QuickServiceCard grid is identical-card anti-pattern
3 cards with image→name→price→button, repeating without variation.
Fix: switch to horizontal list with compact item layout (thumbnail + name + price + link).

### [P2] Error states have no recovery action
"Could not load X" with no retry button or actionable next step.
Fix: add retry callback to ErrorState; pass refetch from React Query hooks.

### [P2] Modal backdrop uses bg-black against DESIGN.md
Modal.tsx:51 bg-black violates design system. Surfaces via ConfirmDialog on ClientHomePage.
Fix: replace with bg-gray-900/60.

## Persona Red Flags

### Alex (Power User) — Admin:
- No keyboard shortcuts for assign/create
- No bulk assignment workflow
- Active bookings list has no filter/sort
- Broken toggles signal untrusted chart data

### Jordan (First-Timer) — Client:
- Two competing click paths on QuickServiceCard (card role=button + inner Book button)
- "Quick book" label is jargon-y vs "Book a service"
- AddVehicleCard navigates away, losing context

### Casey (Mobile) — Washer:
- Search bar and bell top-of-screen; unreachable one-handed
- Email as primary identifier requires more parsing on small screen
- font-mono booking ID is the first thing scanned per card

## Minor Observations

- StatCard trend text describes time context, not actual trend
- VehicleCard shows same placeholder image for all vehicles
- Washer avatar is hardcoded placeholder
- UnassignedStrip has no pagination cap
- "View all" link appears even with 0-1 bookings
