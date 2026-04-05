# Portfolio Backend API (Current)

This document reflects the current backend implementation only.

- Base URL: `/api/v1`
- Success envelope:
```json
{
  "success": true,
  "data": {}
}
```
- Error envelope:
```json
{
  "success": false,
  "error": {
    "message": "Human readable message"
  }
}
```
- Validation errors (Zod) return `400`:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "errors": [
      {
        "field": "body.email",
        "message": "Invalid email"
      }
    ]
  }
}
```

## Auth, Cookie, and CSRF

- Auth is cookie-based using `auth_token` (httpOnly).
- Protected admin routes require valid `auth_token` cookie (`protect` + `restrictTo('ADMIN')`).
- CSRF protection is origin-based for admin mutation routes using `enforceCsrfForMutations`.
- For `POST/PUT/PATCH/DELETE` routes protected by CSRF, request must include `Origin` (or `Referer`) that matches configured `CORS_ORIGINS`.
- Login/logout are not behind CSRF middleware.

---

## Health

### GET `/api/v1/health`
- Purpose: Health check endpoint.
- Auth required: No
- CSRF required: No
- Params: none
- Query: none
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "message": "Nexus Portfolio Engine v2.0 - Backend is running",
    "timestamp": "2026-04-01T12:34:56.000Z",
    "environment": "development"
  }
}
```
- Common error example:
```json
{
  "success": false,
  "error": {
    "message": "Something went wrong. Please try again later."
  }
}
```

---

## Auth

### POST `/api/v1/auth/login`
- Purpose: Authenticate admin user and set auth cookie.
- Auth required: No
- CSRF required: No
- Params: none
- Query: none
- Body schema:
  - `email` (string, email)
  - `password` (string, min 6)
- Request body example:
```json
{
  "email": "admin@portfolio.com",
  "password": "securePass123"
}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "9d44d9dc-1d87-40e1-a2c4-ccf4277bf2a2",
      "email": "admin@portfolio.com",
      "role": "ADMIN"
    }
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password"
  }
}
```

### POST `/api/v1/auth/logout`
- Purpose: Clear auth cookie.
- Auth required: No
- CSRF required: No
- Params: none
- Query: none
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Something went wrong. Please try again later."
  }
}
```

### GET `/api/v1/auth/me`
- Purpose: Get current authenticated admin user.
- Auth required: Yes (cookie)
- CSRF required: No
- Params: none
- Query: none
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "id": "9d44d9dc-1d87-40e1-a2c4-ccf4277bf2a2",
    "email": "admin@portfolio.com",
    "lastLogin": "2026-04-01T11:11:11.000Z"
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "You are not logged in. Please log in to get access."
  }
}
```

---

## Projects

### GET `/api/v1/projects`
- Purpose: List published projects (paginated).
- Auth required: No
- CSRF required: No
- Params: none
- Query schema:
  - `page` (number, int, min 1, default 1)
  - `limit` (number, int, min 1, max 50, default 10)
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "6b25f51f-8c9f-40e0-bce4-7e248f327066",
        "title": "Portfolio API",
        "slug": "portfolio-api",
        "shortSummary": "Backend API for portfolio",
        "thumbnailUrl": "https://cdn.example.com/thumb.png",
        "githubUrl": "https://github.com/example/portfolio-api",
        "liveUrl": "https://portfolio.example.com",
        "metaTitle": "Portfolio API",
        "metaDescription": "API for projects and content",
        "orderIndex": 0,
        "createdAt": "2026-03-31T08:00:00.000Z",
        "updatedAt": "2026-03-31T08:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "errors": [
      {
        "field": "query.limit",
        "message": "Number must be less than or equal to 50"
      }
    ]
  }
}
```

### GET `/api/v1/projects/:slug`
- Purpose: Get one published project with assets by slug.
- Auth required: No
- CSRF required: No
- Params schema:
  - `slug` (string, min 1)
- Query: none
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "id": "6b25f51f-8c9f-40e0-bce4-7e248f327066",
    "title": "Portfolio API",
    "slug": "portfolio-api",
    "shortSummary": "Backend API for portfolio",
    "content": "Long markdown/html content...",
    "thumbnailUrl": "https://cdn.example.com/thumb.png",
    "githubUrl": "https://github.com/example/portfolio-api",
    "liveUrl": "https://portfolio.example.com",
    "metaTitle": "Portfolio API",
    "metaDescription": "API for projects and content",
    "orderIndex": 0,
    "createdAt": "2026-03-31T08:00:00.000Z",
    "updatedAt": "2026-03-31T08:00:00.000Z",
    "assets": [
      {
        "id": "0ba5abf3-b96c-4d24-9194-92fa2e2172a4",
        "assetUrl": "https://cdn.example.com/asset1.png",
        "assetType": "image",
        "displayOrder": 0,
        "altText": "Landing screenshot"
      }
    ]
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Project not found"
  }
}
```

### GET `/api/v1/admin/projects`
- Purpose: List all projects (any status) for the admin UI, paginated. List items omit `content` to keep responses smaller when using a high `limit`.
- Auth required: Yes (admin cookie)
- CSRF required: No
- Params: none
- Query schema:
  - `page` (int >= 1, default `1`)
  - `limit` (int 1..100, default `20`)
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "6b25f51f-8c9f-40e0-bce4-7e248f327066",
        "title": "Portfolio API",
        "slug": "portfolio-api",
        "shortSummary": "Backend API for portfolio",
        "thumbnailUrl": "https://cdn.example.com/thumb.png",
        "status": "PUBLISHED",
        "githubUrl": "https://github.com/example/portfolio-api",
        "liveUrl": "https://portfolio.example.com",
        "orderIndex": 0,
        "metaTitle": "Portfolio API",
        "metaDescription": "API for projects and content",
        "createdAt": "2026-03-31T08:00:00.000Z",
        "updatedAt": "2026-03-31T08:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 100,
    "total": 12,
    "totalPages": 1
  }
}
```

### GET `/api/v1/admin/projects/:id`
- Purpose: Load a single project by id for edit screens (includes full `content` and ordered `assets`). Works for `DRAFT`, `PUBLISHED`, and `ARCHIVED`.
- Auth required: Yes (admin cookie)
- CSRF required: No
- Params schema: `id` (uuid)
- Query: none
- Request body example:
```json
{}
```
- Success response example (`200`): same project object shape as public `GET /api/v1/projects/:slug` (including `assets`), plus `status` and without a published-only filter.
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Project not found"
  }
}
```

### POST `/api/v1/admin/projects`
- Purpose: Create project (stored as `DRAFT`).
- Auth required: Yes (admin cookie)
- CSRF required: Yes (`Origin`/`Referer` must be trusted)
- Params: none
- Query: none
- Body schema:
  - `title` (string, 1..200)
  - `slug` (string, 1..100, lowercase slug pattern)
  - optional: `shortSummary`, `content`, `thumbnailUrl` (url), `githubUrl` (url), `liveUrl` (url), `metaTitle` (<=100), `metaDescription` (<=200), `orderIndex` (int >=0)
- Request body example:
```json
{
  "title": "Admin Dashboard Revamp",
  "slug": "admin-dashboard-revamp",
  "shortSummary": "Refreshed admin tools and API integration",
  "content": "Project details...",
  "thumbnailUrl": "https://cdn.example.com/projects/admin-dashboard/thumb.png",
  "githubUrl": "https://github.com/example/admin-dashboard",
  "liveUrl": "https://admin.example.com",
  "metaTitle": "Admin Dashboard Revamp",
  "metaDescription": "Internal admin dashboard redesign",
  "orderIndex": 2
}
```
- Success response example (`201`):
```json
{
  "success": true,
  "data": {
    "id": "9c9b3ea3-af87-4c1a-bb12-443ecdf61f74",
    "title": "Admin Dashboard Revamp",
    "slug": "admin-dashboard-revamp",
    "shortSummary": "Refreshed admin tools and API integration",
    "content": "Project details...",
    "thumbnailUrl": "https://cdn.example.com/projects/admin-dashboard/thumb.png",
    "status": "DRAFT",
    "githubUrl": "https://github.com/example/admin-dashboard",
    "liveUrl": "https://admin.example.com",
    "orderIndex": 2,
    "metaTitle": "Admin Dashboard Revamp",
    "metaDescription": "Internal admin dashboard redesign",
    "createdAt": "2026-04-01T10:00:00.000Z",
    "updatedAt": "2026-04-01T10:00:00.000Z"
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "CSRF validation failed for this request origin."
  }
}
```

### PATCH `/api/v1/admin/projects/:id`
- Purpose: Update a project by id.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid)
- Query: none
- Body schema: same as create, all optional.
- Request body example:
```json
{
  "title": "Admin Dashboard Revamp v2",
  "metaDescription": "Updated deployment and API docs"
}
```
- Success response example (`200`): same project object shape as create/update.
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Project not found"
  }
}
```

### DELETE `/api/v1/admin/projects/:id`
- Purpose: Delete project by id.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid)
- Query: none
- Request body example:
```json
{}
```
- Success response: `204 No Content` (empty body).
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Project not found"
  }
}
```

### PATCH `/api/v1/admin/projects/:id/status`
- Purpose: Set project status.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid)
- Query: none
- Body schema:
  - `status` enum: `DRAFT | PUBLISHED | ARCHIVED`
- Request body example:
```json
{
  "status": "PUBLISHED"
}
```
- Success response example (`200`): updated project object.
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "errors": [
      {
        "field": "body.status",
        "message": "Invalid enum value. Expected 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'"
      }
    ]
  }
}
```

### PUT `/api/v1/admin/projects/reorder`
- Purpose: Update order indices for multiple projects.
- Auth required: Yes
- CSRF required: Yes
- Params: none
- Query: none
- Body schema:
  - `items` (array, min 1)
  - each item: `id` (uuid), `orderIndex` (int >=0)
- Request body example:
```json
{
  "items": [
    {
      "id": "6b25f51f-8c9f-40e0-bce4-7e248f327066",
      "orderIndex": 0
    },
    {
      "id": "9c9b3ea3-af87-4c1a-bb12-443ecdf61f74",
      "orderIndex": 1
    }
  ]
}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "updated": 2
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "One or more project IDs not found"
  }
}
```

---

## Project Assets

### POST `/api/v1/admin/projects/:id/assets`
- Purpose: Upload and attach project asset.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid, project id)
- Query: none
- Content-Type: `multipart/form-data`
- Body fields:
  - `file` (required file, max 10MB by multer)
  - `assetType` (`image` | `video`)
  - optional `displayOrder` (int >=0), `altText` (string <=200 or null)
- JSON-style body example (field representation):
```json
{
  "assetType": "image",
  "displayOrder": 0,
  "altText": "Homepage hero screenshot"
}
```
- Success response example (`201`):
```json
{
  "success": true,
  "data": {
    "id": "0ba5abf3-b96c-4d24-9194-92fa2e2172a4",
    "projectId": "6b25f51f-8c9f-40e0-bce4-7e248f327066",
    "assetUrl": "https://res.cloudinary.com/demo/image/upload/v1/nexus-portfolio/sample.png",
    "assetType": "image",
    "displayOrder": 0,
    "altText": "Homepage hero screenshot"
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "No file uploaded"
  }
}
```

### DELETE `/api/v1/admin/assets/:id`
- Purpose: Delete project asset.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid)
- Query: none
- Request body example:
```json
{}
```
- Success response: `204 No Content`.
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Asset not found"
  }
}
```

### PATCH `/api/v1/admin/assets/:id/order`
- Purpose: Update asset display order.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid)
- Query: none
- Body schema:
  - `displayOrder` (int >=0)
- Request body example:
```json
{
  "displayOrder": 2
}
```
- Success response example (`200`): updated asset object.
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Asset not found"
  }
}
```

### PATCH `/api/v1/admin/assets/:id/alt`
- Purpose: Update asset alt text.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid)
- Query: none
- Body schema:
  - `altText` (string <=200 or `null`)
- Request body example:
```json
{
  "altText": "Tablet view screenshot"
}
```
- Success response example (`200`): updated asset object.
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "errors": [
      {
        "field": "body.altText",
        "message": "String must contain at most 200 character(s)"
      }
    ]
  }
}
```

---

## Site Settings

### GET `/api/v1/settings`
- Purpose: Get currently published site settings.
- Auth required: No
- CSRF required: No
- Params: none
- Query: none
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "id": "90c95480-629a-4558-bafb-ee8d6d5d2375",
    "siteName": "Nexus Portfolio",
    "activeFont": "Inter",
    "primaryColor": "#3B82F6",
    "secondaryColor": "#10B981",
    "bgColor": "#FFFFFF",
    "textPrimary": "#111827",
    "versionName": "v1.2",
    "isPublished": true,
    "updatedAt": "2026-03-31T10:00:00.000Z"
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "No active theme found"
  }
}
```

### GET `/api/v1/admin/settings`
- Purpose: List all settings versions (paginated).
- Auth required: Yes
- CSRF required: No
- Query schema:
  - `page` (int >=1, default 1)
  - `limit` (int 1..50, default 10)
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "90c95480-629a-4558-bafb-ee8d6d5d2375",
        "siteName": "Nexus Portfolio",
        "activeFont": "Inter",
        "primaryColor": "#3B82F6",
        "secondaryColor": "#10B981",
        "bgColor": "#FFFFFF",
        "textPrimary": "#111827",
        "versionName": "v1.2",
        "isPublished": true,
        "updatedAt": "2026-03-31T10:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "You are not logged in. Please log in to get access."
  }
}
```

### PUT `/api/v1/admin/settings/:id`
- Purpose: Update settings version fields.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid)
- Body schema (all optional):
  - `siteName` (1..100)
  - `activeFont` (1..50)
  - `primaryColor`, `secondaryColor`, `bgColor`, `textPrimary` (hex `#RRGGBB`)
  - `versionName` (<=50)
- Request body example:
```json
{
  "siteName": "Nexus Portfolio",
  "primaryColor": "#2563EB",
  "secondaryColor": "#14B8A6",
  "bgColor": "#F9FAFB",
  "textPrimary": "#0F172A",
  "versionName": "v1.3"
}
```
- Success response example (`200`): updated `SiteSettings` object.
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Settings not found"
  }
}
```

### POST `/api/v1/admin/settings/clone`
- Purpose: Clone settings into a new unpublished version.
- Auth required: Yes
- CSRF required: Yes
- Params: none
- Query: none
- Body schema:
  - `sourceId` (uuid, required)
  - `versionName` (<=50, optional)
- Request body example:
```json
{
  "sourceId": "90c95480-629a-4558-bafb-ee8d6d5d2375",
  "versionName": "v1.4-candidate"
}
```
- Success response example (`201`): created `SiteSettings` object (`isPublished: false`).
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Source settings not found"
  }
}
```

### PATCH `/api/v1/admin/settings/:id/publish`
- Purpose: Publish one settings version and unpublish others.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid)
- Query: none
- Request body example:
```json
{}
```
- Success response example (`200`): published `SiteSettings` object (`isPublished: true`).
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Settings not found"
  }
}
```

---

## Messages

### POST `/api/v1/messages`
- Purpose: Create contact message.
- Auth required: No
- CSRF required: No
- Params: none
- Query: none
- Body schema:
  - `senderName` (string, 1..100)
  - `senderEmail` (valid email)
  - `content` (string, 10..2000)
- Request body example:
```json
{
  "senderName": "Jane Doe",
  "senderEmail": "jane@example.com",
  "content": "Hi, I would like to discuss a collaboration opportunity."
}
```
- Success response example (`201`):
```json
{
  "success": true,
  "data": {
    "id": "d66312a8-334b-4db4-bf8d-d79ae2af4bc4",
    "senderName": "Jane Doe",
    "senderEmail": "jane@example.com",
    "content": "Hi, I would like to discuss a collaboration opportunity.",
    "isRead": false,
    "createdAt": "2026-04-01T13:00:00.000Z"
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "errors": [
      {
        "field": "body.content",
        "message": "String must contain at least 10 character(s)"
      }
    ]
  }
}
```

### GET `/api/v1/admin/messages`
- Purpose: List messages with optional read filter (paginated).
- Auth required: Yes
- CSRF required: No
- Params: none
- Query schema:
  - `page` (int >=1, default 1)
  - `limit` (int 1..100, default 20)
  - `isRead` (optional boolean; accepts `true`/`false` strings)
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "d66312a8-334b-4db4-bf8d-d79ae2af4bc4",
        "senderName": "Jane Doe",
        "senderEmail": "jane@example.com",
        "content": "Hi, I would like to discuss a collaboration opportunity.",
        "isRead": false,
        "createdAt": "2026-04-01T13:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "You are not logged in. Please log in to get access."
  }
}
```

### PATCH `/api/v1/admin/messages/:id/read`
- Purpose: Mark message as read/unread.
- Auth required: Yes
- CSRF required: Yes
- Params schema: `id` (uuid)
- Body schema:
  - `isRead` (boolean)
- Request body example:
```json
{
  "isRead": true
}
```
- Success response example (`200`): updated message object.
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Message not found"
  }
}
```

---

## Analytics

Production note: `POST /analytics/track/:projectId` and `GET /admin/analytics/stats` read and write the `ProjectAnalytics` table using `totalDwellMs` and `dwellSampleCount`. The database must include Prisma migration `20260402120000_analytics_dwell_totals` (or an equivalent schema). If that migration is missing on the deployed database, Prisma will error at runtime. The Vercel build runs `prisma migrate deploy` before `prisma generate` when `DATABASE_URL` is available at build time.

### POST `/api/v1/analytics/track/:projectId`
- Purpose: Track project visit metrics.
- Auth required: No
- CSRF required: No
- Params schema:
  - `projectId` (uuid)
- Query: none
- Body schema:
  - `incrementView` (boolean, default `true`) — when `true`, increments `totalViews` by 1 for this request.
  - `dwellMs` (optional int >=0) — milliseconds on page for this request; only contributes to `avgTimeSpent` when **both** `incrementView` is `true` and `dwellMs` > 0 (one dwell sample per such request).
- Semantics: There is no unique-visitor or session identity. The API does not accept a `sessionId` field.
- Request body example:
```json
{
  "incrementView": true,
  "dwellMs": 42000
}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "id": "57e8ff93-9d16-40a9-8d6f-9cc19f7ecda8",
    "projectId": "6b25f51f-8c9f-40e0-bce4-7e248f327066",
    "totalViews": 52,
    "avgTimeSpent": 38500,
    "lastVisitedAt": "2026-04-01T13:30:00.000Z"
  }
}
```
- `avgTimeSpent` is `null` when no qualifying dwell samples exist yet (`incrementView` + positive `dwellMs`).
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Project not found"
  }
}
```

### GET `/api/v1/admin/analytics/stats`
- Purpose: Get aggregate analytics statistics for admin dashboard.
- Auth required: Yes
- CSRF required: No
- Params: none
- Query: none
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "totalViews": 1200,
    "overallAvgTimeSpent": 28750,
    "projectBreakdown": [
      {
        "project": {
          "id": "6b25f51f-8c9f-40e0-bce4-7e248f327066",
          "title": "Portfolio API",
          "slug": "portfolio-api"
        },
        "totalViews": 500,
        "avgTimeSpent": 30250,
        "lastVisitedAt": "2026-04-01T13:30:00.000Z"
      }
    ]
  }
}
```
- `overallAvgTimeSpent` is the **dwell-sample-weighted** mean across all projects: `sum(totalDwellMs) / sum(dwellSampleCount)` over stored rows, or `null` if there are no dwell samples.
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to perform this action."
  }
}
```

---

## Admin Activity Logs

### GET `/api/v1/admin/logs`
- Purpose: List admin activity logs (paginated, optional user filter).
- Auth required: Yes
- CSRF required: No
- Params: none
- Query schema:
  - `page` (int >=1, default 1)
  - `limit` (int 1..100, default 20)
  - `userId` (uuid, optional)
- Request body example:
```json
{}
```
- Success response example (`200`):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "2e0e9ac0-6dbf-44eb-8ddc-e6f6d71131ac",
        "action": "Updated project: Admin Dashboard Revamp",
        "createdAt": "2026-04-01T12:00:00.000Z",
        "user": {
          "id": "9d44d9dc-1d87-40e1-a2c4-ccf4277bf2a2",
          "email": "admin@portfolio.com"
        }
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```
- Common error response example:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "errors": [
      {
        "field": "query.userId",
        "message": "Invalid uuid"
      }
    ]
  }
}
```

---

## Common Error Cases by Middleware

- `401`: missing/invalid/expired auth cookie on protected routes.
- `403`: CSRF origin validation failure on protected mutation routes, or role not allowed.
- `404`: not found resource (`Project`, `Asset`, `Message`, `Settings`, `User`).
- `409`: duplicate unique value from Prisma (for example duplicate project `slug`).
- `429`: rate limit reached (`/api` global limiter; stricter on `/auth/login`).
