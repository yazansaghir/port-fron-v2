# Portfolio CMS – Frontend PRD (Updated)

## 1. Project Overview

A modern portfolio platform with an integrated CMS dashboard.

The system allows:

* Displaying software projects publicly in an attractive and interactive way
* Managing all content through an admin dashboard
* Handling contact messages and analytics
* Maintaining a clean, fast, and production-ready UI

This frontend is built on top of an already completed backend (Express + Prisma).

---

## 2. Core Goals

### 2.1 Usability

* Clean and intuitive UI
* Fast navigation and smooth UX
* Responsive design (mobile-first)

### 2.2 Maintainability

* Scalable React architecture
* Clear separation of concerns (UI / state / API)

### 2.3 Real-world readiness

* Works with cookie-based authentication
* Handles CSRF-protected endpoints
* Uses real API contracts from backend

---

## 3. Technical Stack

* React (Vite)
* Tailwind CSS
* React Router
* React Query (for server state)
* Axios (API layer)
* Framer Motion (animations)

---

## 4. Application Structure

## 4.1 Public Website

### Pages:

#### Home Page

* Hero section (simple animated, not 3D)
* Projects list (grid or horizontal scroll)
* Smooth animations

#### Project Details Page

* Full project info
* Image gallery
* Links (GitHub / Live)
* SEO-ready structure

#### Contact Page

* Contact form
* Sends message to backend
* Shows success/error feedback

---

## 4.2 Admin Dashboard

### Authentication

* Login page
* Cookie-based auth (no localStorage tokens)
* Protected routes

---

### Dashboard Pages

#### Overview (Analytics)

* Total views
* Average time spent
* Basic project breakdown

---

#### Projects Management

* List projects
* Create new project
* Edit project
* Change status (Draft / Published)
* Reorder projects

---

#### Assets Management

* Upload images (Cloudinary via backend)
* Update alt text
* Reorder assets

---

#### Messages (Inbox)

* List messages
* Mark as read/unread
* View message details

---

#### Settings

* Manage:

  * primary color
  * secondary color
  * background color
  * text color

---

#### Activity Logs

* Display admin activity history
* Sorted by latest actions

---

## 5. API Integration

* All data comes from backend API
* Uses cookie-based authentication
* Admin routes require CSRF-safe requests (Origin header handled by browser)

---

## 6. Analytics Behavior

* totalViews = number of tracked visits
* avgTimeSpent = based on valid dwell samples
* No unique visitor tracking
* Analytics are approximate but honest

---

## 7. Excluded Features (for now)

* AI assistant per project
* Advanced theme system (dark/light dual palettes)
* 3D scenes (React Three Fiber)

These may be added later.

---

## 8. Performance Considerations

* Avoid heavy libraries where possible
* Lazy load pages
* Optimize images
* Keep bundle small

---

## 9. Security Considerations

* No tokens in localStorage
* Use cookies for auth
* Respect CSRF requirements
* Sanitize user inputs in UI where needed

---

## 10. Future Enhancements

* Advanced analytics dashboard
* Charts (Recharts)
* Theme presets
* 3D landing section (optional)
* Deployment optimization
