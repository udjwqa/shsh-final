# SHSH Panel — Full Feature Implementation Design

## Overview

Incremental expansion of the SHSH admin panel to fulfill all 10 original requirements. Panel-only scope — external server will be built separately later.

---

## 1. Data Models (Prisma)

### New Models

**SellerTemplate**
```
id          String   @id @default(cuid())
name        String
address     String   @default("")
phone       String   @default("")
email       String   @default("")
iban        String   @default("")
notes       String   @default("")
userId      String
user        User     @relation
createdAt   DateTime @default(now())
updatedAt   DateTime @updatedAt
```

**ChatTemplate**
```
id          String   @id @default(cuid())
title       String
content     String
userId      String
user        User     @relation
createdAt   DateTime @default(now())
```

**Event**
```
id          String   @id @default(cuid())
type        String   // page_view | continue_click | chat_open | message_sent
ip          String   @default("")
userAgent   String   @default("")
metadata    Json?
listingId   String
listing     Listing  @relation
createdAt   DateTime @default(now())
```

### Changes to Existing Models

**Listing** — add:
- `sourceUrl    String?` — original willhaben URL
- `description  String?` — description from willhaben
- `events       Event[]` — relation

**Message** — add:
- `imageUrl     String?` — path to uploaded image

**User** — add relations:
- `sellerTemplates  SellerTemplate[]`
- `chatTemplates    ChatTemplate[]`

---

## 2. Scraping willhaben.at

### Flow
1. Operator pastes willhaben URL in `/listings/new`
2. Clicks "Load data"
3. Server fetches page with browser User-Agent
4. Parses `<script type="application/ld+json">` for Product schema
5. Extracts: title, price, mainImage, sellerName, description
6. Form auto-fills with extracted data (editable)
7. `sourceUrl` saved with listing

### API
```
POST /api/scrape (protected)
Body: { url: string }
Response: { title, price, mainImage, sellerName, description, sourceUrl }
```
- Validates URL contains `willhaben.at`
- Uses fetch with Chrome User-Agent header
- Parses JSON-LD Product schema

---

## 3. Seller Templates

### API
```
GET    /api/seller-templates       — list user's templates
POST   /api/seller-templates       — create
PATCH  /api/seller-templates/[id]  — update
DELETE /api/seller-templates/[id]  — delete
```
All endpoints protected by auth.

### UI
- **Management page:** `/settings/sellers`
  - Table: name, address, phone, actions (edit, delete)
  - "+ New template" button → modal with fields: name, address, phone, email, IBAN, notes
  - Edit via modal

- **Usage in listing form:** `/listings/new`
  - Dropdown "Select from templates" in Seller section
  - On select → auto-fills name + address fields
  - Can skip and fill manually

---

## 4. Event Tracking

### API
```
POST /api/events (public, CORS enabled)
Body: { type, listingId, metadata? }
Response: { success: true }
```
- `type`: one of `page_view`, `continue_click`, `chat_open`, `message_sent`
- `ip` and `userAgent` extracted from request headers
- `metadata`: optional JSON for additional data

```
GET /api/events/[listingId] (protected)
Response: Event[]
```

### UI — Listing Detail Page `/listings/[id]`
- Info card: title, price, seller, status, sourceUrl, mainImage, dates
- **Activity section:** chronological event feed
  - Icon + event type + timestamp
  - Counters: total views, continue clicks, chat opens
- Action buttons: edit, publish, delete, open chat

---

## 5. Chat — Image Upload

### File Upload API
```
POST /api/upload (protected — operator)
Body: FormData (file field)
Response: { url: "/uploads/uuid-filename.jpg" }

POST /api/chat/[listingId]/upload (public — client)
Body: FormData (file field)
Response: { url: "/uploads/uuid-filename.jpg" }
```
- Storage: `public/uploads/` with UUID prefix
- Allowed: jpg, png, gif, webp
- Max size: 5MB

### Chat UI Changes
- Paperclip button (📎) next to input field
- Click → file picker → upload → send message with `imageUrl`
- Messages with `imageUrl` render as clickable image thumbnails
- Message can have text only, image only, or both

---

## 6. Chat Templates (Quick Replies)

### API
```
GET    /api/chat-templates       — list user's templates
POST   /api/chat-templates       — create
PATCH  /api/chat-templates/[id]  — update
DELETE /api/chat-templates/[id]  — delete
```
All protected.

### UI
- **In chat** (`/chat/[listingId]`):
  - Lightning bolt button (⚡) next to input
  - Click → dropdown list of templates
  - Click template → inserts text into input (does NOT auto-send)
  - "Manage templates" link at bottom → `/settings/chat-templates`

- **Management page:** `/settings/chat-templates`
  - List: title + text preview + actions (edit, delete)
  - "+ New template" → fields: title, content
  - Edit via modal

---

## 7. Listing Detail Page `/listings/[id]`

Three sections:
1. **Info** — card with all listing data, action buttons (edit, publish, delete, chat)
2. **Activity** — event feed + counters
3. **Images** — main + additional images gallery

---

## 8. Listing Edit Page `/listings/[id]/edit`

- Same fields as creation form, pre-filled with current data
- Uses existing `PATCH /api/listings/[id]`
- Scrape button to re-fetch from willhaben (if sourceUrl exists)

---

## 9. Listings Table Changes

- Row click → navigate to `/listings/[id]`
- New column: event count badge (views)
- sourceUrl shown as external link icon to willhaben

---

## 10. Navigation & Settings Subpages

Settings gets sub-navigation:
- `/settings` — connection & Telegram (existing)
- `/settings/sellers` — seller templates management
- `/settings/chat-templates` — chat templates management

Header navigation unchanged: Dashboard, Listings, Chat, Settings.

---

## Technical Notes

- All new API routes follow existing patterns (getServerSession, prisma, NextResponse)
- Public endpoints (events, chat upload) include CORS headers
- File uploads use `public/uploads/` with UUID filenames — easy to migrate to S3/Blob later
- Scraping uses server-side fetch + JSON-LD parsing, no headless browser needed
- Design system unchanged: dark theme, no shadows/borders, Tailwind, custom components
