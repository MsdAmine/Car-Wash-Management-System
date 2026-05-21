**Dead Or Placeholder Controls**




**Client-Facing Gaps**



**Cards And Interactive-Looking Elements**


**Other Placeholder Sections**



**Fixed**
- [AdminDashboardPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/admin/pages/AdminDashboardPage.tsx:190): `Assign washer` only logs to console.
- [AdminDashboardPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/admin/pages/AdminDashboardPage.tsx:227): `+ New booking` only logs to console.
- [AdminBookingsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/AdminBookingsPage.tsx:304): `Filter` only logs.
- [AdminBookingsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/AdminBookingsPage.tsx:308): `Sort` only logs.
- [AdminBookingsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/AdminBookingsPage.tsx:374): pagination changes `currentPage`, but rows are rendered from `visibleBookings.map(...)` without slicing, so pages do not change the table.
- [AdminAnalyticsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/admin/pages/AdminAnalyticsPage.tsx:328): date range inputs have no state/query wiring.
- [AdminAnalyticsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/admin/pages/AdminAnalyticsPage.tsx:336): `Export CSV` only logs.
- [AdminBookingsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/AdminBookingsPage.tsx:264): admin `+ New booking` only logs.
- [AdminBookingDetailPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/AdminBookingDetailPage.tsx:99): `Reschedule` only logs.
- [AdminBookingDetailPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/AdminBookingDetailPage.tsx:102): admin `Cancel` only logs, even though an admin cancel hook exists.
- [ClientBookingsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientBookingsPage.tsx:79): booking card `Reschedule` only logs.
- [ClientBookingsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientBookingsPage.tsx:82): booking card `Cancel` only logs.
- [ClientBookingsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientBookingsPage.tsx:92): `Book again` only logs.
- [ClientBookingsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientBookingsPage.tsx:95): `Receipt` only logs.
- [ClientProfilePage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/auth/pages/ClientProfilePage.tsx:80): `Upload photo` only logs.
- [ClientProfilePage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/auth/pages/ClientProfilePage.tsx:175): notification toggles are local state only.
- [ClientProfilePage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/auth/pages/ClientProfilePage.tsx:223): `Update password` only logs.
- [ClientProfilePage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/auth/pages/ClientProfilePage.tsx:263): `Delete my account` only logs.
- [ClientHomePage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientHomePage.tsx:120): upcoming booking `Reschedule` only logs.
- [ClientHomePage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientHomePage.tsx:127): upcoming booking `Cancel` only logs.
- [ClientBookingDetailPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientBookingDetailPage.tsx:209): detail `Reschedule` only logs. Detail `Cancel` is functional.
- [ClientBookingDetailPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientBookingDetailPage.tsx:234): detail `Book again` only logs.
- [ClientBookingDetailPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientBookingDetailPage.tsx:237): detail `Receipt` only logs.
- [LandingPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/auth/pages/LandingPage.tsx:121): service cards use mock data, `cursor-pointer`, hover styling, and `Learn more`, but have no click handler or destination.
- [LandingPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/auth/pages/LandingPage.tsx:46): `Pricing` anchors point to `#pricing`, but no `id="pricing"` section exists.
- [LandingPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/auth/pages/LandingPage.tsx:198): footer `About`, `Contact`, `Privacy`, `Terms` all use `href="#"`.
- [AdminDashboardPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/admin/pages/AdminDashboardPage.tsx:154): active booking rows show `See detail`, but it is plain text, not navigation.
- [ClientBookingsPage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientBookingsPage.tsx:111): booking cards do not link to the existing client detail route.
- [ClientHomePage.tsx](C:/Users/massi/IdeaProjects/Car-Wash-Managment-System/frontend/car-wash-web/src/features/bookings/pages/ClientHomePage.tsx:24): quick-book cards use mock services and navigate to generic booking, but do not preselect the clicked service.