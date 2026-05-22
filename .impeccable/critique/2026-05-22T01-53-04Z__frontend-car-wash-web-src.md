---
target: frontend/car-wash-web/src
total_score: 22
p0_count: 0
p1_count: 3
timestamp: 2026-05-22T01-53-04Z
slug: frontend-car-wash-web-src
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Revenue chart period toggle implies live data switching; all three periods show identical hardcoded bars |
| 2 | Match System / Real World | 3 | Booking reference IDs shown bare; stat card trends are vague descriptions |
| 3 | User Control and Freedom | 2 | No undo anywhere; washer has no dismiss; no breadcrumbs |
| 4 | Consistency and Standards | 3 | Component use consistent; minor heading-level divergence between pages |
| 5 | Error Prevention | 2 | Cancel confirmation good; chart period control implies filtering that does not exist |
| 6 | Recognition Rather Than Recall | 3 | Section labels clear; notification bell has no count badge |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts; no batch actions; washer cannot mark complete from list |
| 8 | Aesthetic and Minimalist Design | 3 | Generally clean; 4-stat hero-metric row is SaaS template; customer email on washer cards is noise |
| 9 | Error Recovery | 2 | ErrorState used consistently but generic messages, no retry action |
| 10 | Help and Documentation | 0 | No contextual help, tooltips, or onboarding anywhere |
| Total | | 22/40 | Acceptable - significant improvements needed |

## Anti-Patterns Verdict

LLM: 4-stat hero-metric row and QuickServiceCard tile grid are first-reflex SaaS patterns. UnassignedStrip and WasherJobsPage show genuine design intent.

Detector: 5 findings - border-l-4 side-tab in ClientBookingsPage:126; bg-black in Modal.tsx:51, AdminServicesPage:88, AdminStaffPage:148, WasherHistoryPage:61.

## Priority Issues

P1: Revenue chart period toggle shows hardcoded data for all three periods.
P1: QuickServiceCard has styled div that looks like Book button inside a button element.
P1: No keyboard path to primary admin actions.
P2: Customer email exposed on washer job cards.
P2: Error states have no retry action.
