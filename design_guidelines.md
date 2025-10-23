# CleanCity Design Guidelines

## Design Approach

**Selected Approach:** Hybrid - Material Design System foundation with civic platform references (SeeClickFix, 311 systems, Linear admin patterns)

**Justification:** CleanCity is a utility-focused civic platform requiring trust, clarity, and mobile-first design. Material Design provides the robust component system needed for forms and dashboards, while civic platform patterns ensure community trust and engagement.

**Core Principles:**
- Trust through transparency and clarity
- Mobile-first (reports often submitted on-site)
- Scannable information hierarchy
- Accessible to all community members

---

## Color Palette

### Light Mode
- **Primary:** 217 91% 60% (Trustworthy blue - civic authority)
- **Primary Hover:** 217 91% 50%
- **Secondary:** 142 71% 45% (Success green for resolved reports)
- **Background:** 0 0% 98%
- **Surface:** 0 0% 100%
- **Text Primary:** 220 13% 18%
- **Text Secondary:** 220 9% 46%
- **Border:** 220 13% 91%

### Dark Mode
- **Primary:** 217 91% 65%
- **Primary Hover:** 217 91% 55%
- **Secondary:** 142 71% 50%
- **Background:** 222 47% 11%
- **Surface:** 217 33% 17%
- **Text Primary:** 210 40% 98%
- **Text Secondary:** 217 20% 70%
- **Border:** 217 33% 24%

### Status Colors
- **Pending:** 45 93% 47% (Amber)
- **In Progress:** 217 91% 60% (Blue)
- **Resolved:** 142 71% 45% (Green)
- **Alert/Urgent:** 0 84% 60% (Red for critical issues)

---

## Typography

### Font Families
- **Primary (UI/Body):** Inter (Google Fonts) - clean, readable at all sizes
- **Headings:** Inter (same family, weight variation for consistency)
- **Monospace (optional):** JetBrains Mono for location coordinates/IDs

### Type Scale
- **Hero/H1:** text-5xl font-bold (48px) - landing hero, major sections
- **H2:** text-3xl font-semibold (30px) - page titles, dashboard headers
- **H3:** text-2xl font-semibold (24px) - section headers, card titles
- **H4:** text-xl font-medium (20px) - subsections, report titles
- **Body Large:** text-base (16px) - main content, descriptions
- **Body:** text-sm (14px) - secondary content, metadata
- **Caption:** text-xs (12px) - timestamps, labels, status badges

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 (focus on 4, 8, 16 for consistency)

### Grid Structure
- **Container:** max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- **Dashboard Sidebar:** Fixed 256px (w-64) on desktop, slide-over on mobile
- **Content Grid:** grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for report cards
- **Admin Table:** Full-width responsive table with fixed first column

### Responsive Breakpoints
- Mobile: base (< 640px) - single column, stacked navigation
- Tablet: md (768px+) - two columns, sidebar visible
- Desktop: lg (1024px+) - three columns, full dashboard layout

---

## Component Library

### Navigation
**Public Header:**
- Sticky top navigation with logo, main links (Home, Reports, Submit, Login)
- Mobile: Hamburger menu with slide-out drawer
- Background: surface with subtle border-b
- Height: h-16 with items centered

**Admin Sidebar:**
- Fixed left sidebar (hidden on mobile, slide-over overlay)
- Navigation items with icons (Dashboard, Reports, Users, Settings)
- Active state: primary background with rounded corners
- User profile section at bottom

### Cards & Reports

**Report Card (Public Feed):**
- White surface with subtle shadow (shadow-sm hover:shadow-md transition)
- Padding: p-6
- Structure: Image thumbnail (if available), title (h4), description (truncated), metadata row (category badge, status badge, location, timestamp)
- Radius: rounded-lg
- Border: border border-border in dark mode

**Status Badges:**
- Pill-shaped: rounded-full px-3 py-1 text-xs font-medium
- Colors: pending (amber bg), in-progress (blue bg), resolved (green bg)
- Subtle background with matching text color

### Forms

**Submit Report Form:**
- Single-column layout with generous spacing (space-y-6)
- Input fields: w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary
- Labels: text-sm font-medium mb-2
- Textarea: min-h-32 for description
- Category select: Dropdown with icon indicators
- Image upload: Drag-and-drop zone with preview
- Submit button: Primary color, w-full on mobile, auto on desktop

**Authentication Forms:**
- Centered card: max-w-md mx-auto
- Minimal design with large input fields
- Social login options if using Replit Auth (Google, GitHub icons)
- Clear error states with red border and text

### Data Display

**Admin Dashboard Table:**
- Striped rows (even:bg-surface/50) for readability
- Fixed header row with sorting indicators
- Action buttons: Icon-only (view, edit, delete) with tooltips
- Mobile: Card view instead of table
- Pagination: Bottom-aligned with page numbers and next/prev

**Statistics Cards:**
- Grid of 3-4 cards showing key metrics (total reports, pending, in-progress, resolved)
- Large number (text-3xl font-bold), label below (text-sm text-secondary)
- Icon in corner with subtle primary color tint
- Padding: p-6, rounded-lg, shadow-sm

### Buttons

**Primary:** bg-primary text-white hover:bg-primary-hover px-6 py-3 rounded-lg font-medium
**Secondary:** bg-surface border border-border hover:bg-surface/80
**Outline:** border-2 border-primary text-primary hover:bg-primary hover:text-white
**Danger:** bg-red-600 text-white hover:bg-red-700

### Map/Location

**Public Feed Map (Optional):**
- Interactive map showing report pins with status color-coding
- Clustered markers for dense areas
- Click to view report details in side panel
- Height: h-96 on desktop, h-64 on mobile

---

## Page-Specific Layouts

### Landing Page
**Hero Section:**
- Full-width with background image (city/community photo with overlay)
- Height: h-screen sm:h-96 - not forcing full viewport
- Centered content: Headline (text-5xl font-bold), subheading, dual CTAs (Submit Report, View Feed)
- Buttons on image: Use backdrop-blur-sm bg-white/10 for outlined buttons

**Features Section:**
- 3-column grid (grid-cols-1 md:grid-cols-3 gap-8)
- Each feature: Icon, heading, description
- Icons: Large (w-12 h-12) with primary color fill

**How It Works:**
- 3-step process cards in horizontal flow
- Numbers in circles, connecting lines between steps

**Recent Reports:**
- Preview of latest 6 reports in grid
- CTA to view all reports

### Public Feed
- Filter bar at top (category, status dropdowns, search)
- Grid of report cards below
- Infinite scroll or pagination
- Optional: Toggle between grid/map view

### Admin Dashboard
- KPI cards row at top (4 metrics)
- Reports table below with search, filter, sort
- Bulk action toolbar when items selected
- Side panel for report details

### Submit Report Page
- Two-column on desktop (form | map/preview)
- Single column on mobile
- Progress indicator if multi-step
- Clear success state with confirmation number

---

## Images

### Hero Section
**Description:** Wide, high-quality photograph showing a clean, vibrant community space or city street. Image should convey community pride and civic engagement. Use subtle dark overlay (bg-black/40) to ensure text readability.
**Placement:** Full-width background covering entire hero section

### Report Card Thumbnails
**Description:** User-uploaded photos of issues. Display as square thumbnails (aspect-square) with rounded corners. Show placeholder icon if no image available.
**Placement:** Top-left of each report card, max width w-24 md:w-32

### Feature Section Icons
**Description:** Use Material Icons or Heroicons for feature illustrations (e.g., report icon, dashboard icon, community icon)
**Placement:** Above feature card headings, centered

---

## Accessibility & Polish

- All form inputs maintain dark mode consistency with proper contrast
- Focus states: 2px ring in primary color (focus:ring-2 focus:ring-primary)
- Keyboard navigation: Clear focus indicators on all interactive elements
- Color contrast: WCAG AA compliant minimum
- Touch targets: Minimum 44px for mobile buttons/links
- Loading states: Skeleton screens for cards, spinners for buttons
- Empty states: Friendly illustrations with helpful text
- Error states: Red border, icon, and clear message text