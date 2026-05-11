# SHSH Panel Full Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all 10 panel requirements: willhaben scraping, seller templates, event tracking, chat images, chat quick-reply templates, listing detail page, listing edit, and updated listings table.

**Architecture:** Incremental expansion of existing Next.js App Router panel. New Prisma models (SellerTemplate, ChatTemplate, Event) + fields on existing models (Listing.sourceUrl, Message.imageUrl). New API routes follow existing auth/CORS patterns. File uploads stored locally in `public/uploads/`.

**Tech Stack:** Next.js 16, Prisma 7, TypeScript, Tailwind CSS 4, NextAuth 4, cheerio (HTML parsing for scraping fallback)

---

## File Map

### New Files
```
prisma/migrations/TIMESTAMP_add_features/migration.sql  (auto-generated)

src/app/api/scrape/route.ts                    — willhaben scraping endpoint
src/app/api/seller-templates/route.ts          — GET/POST seller templates
src/app/api/seller-templates/[id]/route.ts     — PATCH/DELETE seller template
src/app/api/chat-templates/route.ts            — GET/POST chat templates
src/app/api/chat-templates/[id]/route.ts       — PATCH/DELETE chat template
src/app/api/events/route.ts                    — POST event (public)
src/app/api/events/[listingId]/route.ts        — GET events for listing (protected)
src/app/api/upload/route.ts                    — POST file upload (protected)
src/app/api/chat/[listingId]/upload/route.ts   — POST file upload (public, for clients)

src/app/listings/[id]/page.tsx                 — listing detail page
src/app/listings/[id]/edit/page.tsx            — listing edit page
src/app/settings/sellers/page.tsx              — seller templates management
src/app/settings/chat-templates/page.tsx       — chat templates management
```

### Modified Files
```
prisma/schema.prisma                           — add 3 models, modify Listing + Message + User
src/middleware.ts                               — add /api/seller-templates, /api/chat-templates, /api/upload to matcher
src/app/api/listings/route.ts                  — POST: accept sourceUrl, description
src/app/api/chat/[listingId]/route.ts          — POST: accept imageUrl
src/app/listings/new/page.tsx                  — add scrape URL field, seller template dropdown
src/app/listings/page.tsx                      — row click, events column, sourceUrl icon
src/app/chat/[listingId]/page.tsx              — image upload button, image rendering, quick-reply button
src/app/settings/page.tsx                      — add sub-navigation to sellers/chat-templates
src/components/Sidebar.tsx                     — no changes needed (Settings link covers subpages)
```

---

## Phase 1: Database & Core APIs

### Task 1: Update Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add new models and fields to schema**

In `prisma/schema.prisma`, replace the entire file with:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  listings        Listing[]
  settings        Settings?
  sellerTemplates SellerTemplate[]
  chatTemplates   ChatTemplate[]
}

model Listing {
  id          String   @id @default(cuid())
  sellerName  String
  address     String
  template    String   @default("default")
  title       String
  price       Float
  mainImage   String
  images      String[] @default([])
  slug        String
  status      String   @default("draft")
  externalUrl String?
  sourceUrl   String?
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  messages    Message[]
  events      Event[]
}

model Message {
  id        String   @id @default(cuid())
  content   String
  sender    String   // "client" or "support"
  read      Boolean  @default(false)
  imageUrl  String?
  createdAt DateTime @default(now())

  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
}

model Settings {
  id              String @id @default(cuid())
  externalDomain  String @default("")
  apiKey          String @default("")
  apiEndpoint     String @default("")
  telegramBotToken String @default("")
  telegramChatId   String @default("")

  userId          String @unique
  user            User   @relation(fields: [userId], references: [id])
}

model SellerTemplate {
  id        String   @id @default(cuid())
  name      String
  address   String   @default("")
  phone     String   @default("")
  email     String   @default("")
  iban      String   @default("")
  notes     String   @default("")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

model ChatTemplate {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())

  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

model Event {
  id        String   @id @default(cuid())
  type      String   // page_view | continue_click | chat_open | message_sent
  ip        String   @default("")
  userAgent String   @default("")
  metadata  Json?
  createdAt DateTime @default(now())

  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 2: Run migration**

Run: `npx prisma migrate dev --name add_features`
Expected: Migration applied successfully, Prisma client regenerated.

- [ ] **Step 3: Verify generated client**

Run: `ls src/generated/prisma/models/ | grep -E "SellerTemplate|ChatTemplate|Event"`
Expected: Files for all three new models appear.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ src/generated/
git commit -m "feat: add SellerTemplate, ChatTemplate, Event models + Listing.sourceUrl, Message.imageUrl"
```

---

### Task 2: Update Middleware

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add new protected routes to matcher**

Replace `src/middleware.ts` with:

```ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/listings/:path*",
    "/settings/:path*",
    "/chat/:path*",
    "/api/listings/:path*",
    "/api/settings/:path*",
    "/api/seller-templates/:path*",
    "/api/chat-templates/:path*",
    "/api/upload/:path*",
    "/api/scrape/:path*",
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: protect new API routes in middleware"
```

---

### Task 3: Scraping API

**Files:**
- Create: `src/app/api/scrape/route.ts`

- [ ] **Step 1: Create the scrape endpoint**

Create `src/app/api/scrape/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();

  if (!url || !url.includes("willhaben.at")) {
    return NextResponse.json({ error: "Invalid URL. Must be a willhaben.at link." }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "de-AT,de;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch page: ${response.status}` }, { status: 502 });
    }

    const html = await response.text();

    // Extract JSON-LD Product data
    const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let productData = null;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        if (data["@type"] === "Product") {
          productData = data;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!productData) {
      return NextResponse.json({ error: "Could not find listing data on page" }, { status: 422 });
    }

    const result = {
      title: productData.name || "",
      price: parseFloat(productData.offers?.price) || 0,
      mainImage: productData.image || "",
      sellerName: productData.offers?.seller?.givenName || "",
      description: productData.description || "",
      sourceUrl: url,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Scraping failed", details: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Test manually**

Run: `curl -s -X POST http://localhost:8500/api/scrape -H "Content-Type: application/json" -d '{"url":"https://www.willhaben.at/iad/kaufen-und-verkaufen/d/iphone-12-pro-256-gb-1441954182"}' -b "$(curl -s -c - http://localhost:8500/api/auth/csrf | grep -o 'next-auth.csrf-token=[^;]*')" 2>&1 | head -20`

Note: This will return 401 without a valid session. Test via browser console after login:
```js
fetch('/api/scrape', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({url:'https://www.willhaben.at/iad/kaufen-und-verkaufen/d/iphone-12-pro-256-gb-1441954182'}) }).then(r=>r.json()).then(console.log)
```
Expected: JSON with title, price, mainImage, sellerName, description, sourceUrl.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/scrape/route.ts
git commit -m "feat: add willhaben scraping API endpoint"
```

---

### Task 4: Update Listings API to accept new fields

**Files:**
- Modify: `src/app/api/listings/route.ts`

- [ ] **Step 1: Add sourceUrl and description to POST**

In `src/app/api/listings/route.ts`, replace the `prisma.listing.create` call data object. Change lines 29-40:

```ts
  const listing = await prisma.listing.create({
    data: {
      sellerName: body.sellerName,
      address: body.address,
      template: body.template || "default",
      title: body.title,
      price: parseFloat(body.price),
      mainImage: body.mainImage || "",
      images: body.images || [],
      slug,
      userId,
      sourceUrl: body.sourceUrl || null,
      description: body.description || null,
    },
  });
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/listings/route.ts
git commit -m "feat: accept sourceUrl and description in listing creation"
```

---

### Task 5: Seller Templates API

**Files:**
- Create: `src/app/api/seller-templates/route.ts`
- Create: `src/app/api/seller-templates/[id]/route.ts`

- [ ] **Step 1: Create list/create endpoint**

Create `src/app/api/seller-templates/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const templates = await prisma.sellerTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const template = await prisma.sellerTemplate.create({
    data: {
      name: body.name.trim(),
      address: body.address?.trim() || "",
      phone: body.phone?.trim() || "",
      email: body.email?.trim() || "",
      iban: body.iban?.trim() || "",
      notes: body.notes?.trim() || "",
      userId,
    },
  });

  return NextResponse.json(template, { status: 201 });
}
```

- [ ] **Step 2: Create update/delete endpoint**

Create `src/app/api/seller-templates/[id]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const template = await prisma.sellerTemplate.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.address !== undefined && { address: body.address.trim() }),
      ...(body.phone !== undefined && { phone: body.phone.trim() }),
      ...(body.email !== undefined && { email: body.email.trim() }),
      ...(body.iban !== undefined && { iban: body.iban.trim() }),
      ...(body.notes !== undefined && { notes: body.notes.trim() }),
    },
  });

  return NextResponse.json(template);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.sellerTemplate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/seller-templates/
git commit -m "feat: add seller templates CRUD API"
```

---

### Task 6: Chat Templates API

**Files:**
- Create: `src/app/api/chat-templates/route.ts`
- Create: `src/app/api/chat-templates/[id]/route.ts`

- [ ] **Step 1: Create list/create endpoint**

Create `src/app/api/chat-templates/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const templates = await prisma.chatTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const template = await prisma.chatTemplate.create({
    data: {
      title: body.title.trim(),
      content: body.content.trim(),
      userId,
    },
  });

  return NextResponse.json(template, { status: 201 });
}
```

- [ ] **Step 2: Create update/delete endpoint**

Create `src/app/api/chat-templates/[id]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const template = await prisma.chatTemplate.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.content !== undefined && { content: body.content.trim() }),
    },
  });

  return NextResponse.json(template);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.chatTemplate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/chat-templates/
git commit -m "feat: add chat templates CRUD API"
```

---

### Task 7: Events API

**Files:**
- Create: `src/app/api/events/route.ts`
- Create: `src/app/api/events/[listingId]/route.ts`

- [ ] **Step 1: Create public event ingestion endpoint**

Create `src/app/api/events/route.ts`:

```ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { corsResponse, corsOptions } from "@/lib/cors";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const validTypes = ["page_view", "continue_click", "chat_open", "message_sent"];
  if (!body.type || !validTypes.includes(body.type)) {
    return corsResponse({ error: "Invalid event type" }, 400);
  }

  if (!body.listingId) {
    return corsResponse({ error: "listingId is required" }, 400);
  }

  // Verify listing exists
  const listing = await prisma.listing.findUnique({ where: { id: body.listingId } });
  if (!listing) {
    return corsResponse({ error: "Listing not found" }, 404);
  }

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const userAgent = req.headers.get("user-agent") || "";

  const event = await prisma.event.create({
    data: {
      type: body.type,
      listingId: body.listingId,
      ip,
      userAgent,
      metadata: body.metadata || undefined,
    },
  });

  return corsResponse(event, 201);
}
```

- [ ] **Step 2: Create protected events list endpoint**

Create `src/app/api/events/[listingId]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ listingId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId } = await params;

  const events = await prisma.event.findMany({
    where: { listingId },
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    page_view: events.filter((e) => e.type === "page_view").length,
    continue_click: events.filter((e) => e.type === "continue_click").length,
    chat_open: events.filter((e) => e.type === "chat_open").length,
    message_sent: events.filter((e) => e.type === "message_sent").length,
  };

  return NextResponse.json({ events, counts });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/events/
git commit -m "feat: add event tracking API (public POST + protected GET)"
```

---

### Task 8: File Upload API

**Files:**
- Create: `src/app/api/upload/route.ts`
- Create: `src/app/api/chat/[listingId]/upload/route.ts`

- [ ] **Step 1: Create uploads directory**

Run: `mkdir -p public/uploads && echo "public/uploads/*" >> .gitignore`

- [ ] **Step 2: Create protected upload endpoint (for operator)**

Create `src/app/api/upload/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed. Use jpg, png, gif, or webp." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const path = join(process.cwd(), "public", "uploads", filename);

  await writeFile(path, bytes);

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
```

- [ ] **Step 3: Create public upload endpoint (for clients)**

Create `src/app/api/chat/[listingId]/upload/route.ts`:

```ts
import { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { corsResponse, corsOptions } from "@/lib/cors";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return corsResponse({ error: "No file provided" }, 400);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return corsResponse({ error: "File type not allowed. Use jpg, png, gif, or webp." }, 400);
  }

  if (file.size > MAX_SIZE) {
    return corsResponse({ error: "File too large. Max 5MB." }, 400);
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const path = join(process.cwd(), "public", "uploads", filename);

  await writeFile(path, bytes);

  return corsResponse({ url: `/uploads/${filename}` }, 201);
}
```

- [ ] **Step 4: Update chat message endpoint to accept imageUrl**

In `src/app/api/chat/[listingId]/route.ts`, update the POST handler. Change the validation and create:

Replace lines 36-48 (the POST body validation and create block):

```ts
  if (!body.content?.trim() && !body.imageUrl) {
    return corsResponse({ error: "Message is empty" }, 400);
  }

  const sender = body.sender === "support" ? "support" : "client";

  const message = await prisma.message.create({
    data: {
      content: body.content?.trim() || "",
      sender,
      listingId,
      imageUrl: body.imageUrl || null,
    },
  });
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/upload/ src/app/api/chat/[listingId]/upload/ src/app/api/chat/[listingId]/route.ts .gitignore
git commit -m "feat: add image upload endpoints + imageUrl support in chat messages"
```

---

## Phase 2: Frontend Pages

### Task 9: Settings Sub-Navigation + Seller Templates Page

**Files:**
- Modify: `src/app/settings/page.tsx`
- Create: `src/app/settings/sellers/page.tsx`

- [ ] **Step 1: Add sub-navigation to settings page**

In `src/app/settings/page.tsx`, add navigation links at the top of the page. After the `<div>` with the heading (lines 64-68), add a nav block. Replace lines 64-68:

```tsx
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">External server connection</p>
      </div>

      <div className="flex gap-2">
        <span className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-medium rounded-full">
          Connection
        </span>
        <Link href="/settings/sellers" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full transition-colors">
          Seller Templates
        </Link>
        <Link href="/settings/chat-templates" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full transition-colors">
          Chat Templates
        </Link>
      </div>
```

Also add `import Link from "next/link";` at the top of the file.

- [ ] **Step 2: Create seller templates page**

Create `src/app/settings/sellers/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface SellerTemplate {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  iban: string;
  notes: string;
}

const emptyForm = { name: "", address: "", phone: "", email: "", iban: "", notes: "" };

export default function SellerTemplatesPage() {
  const [templates, setTemplates] = useState<SellerTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchTemplates = () => {
    fetch("/api/seller-templates")
      .then((r) => r.json())
      .then((data) => {
        setTemplates(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = editingId ? `/api/seller-templates/${editingId}` : "/api/seller-templates";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchTemplates();
    }
    setSaving(false);
  };

  const handleEdit = (t: SellerTemplate) => {
    setForm({ name: t.name, address: t.address, phone: t.phone, email: t.email, iban: t.iban, notes: t.notes });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/seller-templates/${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const inputClass = "w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white placeholder-[#4A4A4A] text-sm focus:bg-[#252525] transition-colors";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Manage seller templates</p>
      </div>

      <div className="flex gap-2">
        <Link href="/settings" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full transition-colors">
          Connection
        </Link>
        <span className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-medium rounded-full">
          Seller Templates
        </span>
        <Link href="/settings/chat-templates" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full transition-colors">
          Chat Templates
        </Link>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#E8E8E8] text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editingId ? "Edit Template" : "New Template"}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="text-[#6B6B6B] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Full name *" required />
              <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Address" />
              <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="Phone" />
              <input name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="Email" />
              <input name="iban" value={form.iban} onChange={handleChange} className={inputClass} placeholder="IBAN" />
              <textarea name="notes" value={form.notes} onChange={handleChange} className={inputClass + " resize-none"} rows={2} placeholder="Notes" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="px-4 py-2 text-[#6B6B6B] hover:text-white text-sm rounded-2xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B6B6B] text-sm">Loading...</div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#6B6B6B] text-sm">No seller templates yet</p>
          </div>
        ) : (
          templates.map((t) => (
            <div key={t.id} className="border-b border-[#1E1E1E] last:border-0">
              <div className="flex items-center justify-between px-6 py-4 hover:bg-[#1A1A1A] transition-colors">
                <button
                  onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                  className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium">{t.name}</p>
                    <p className="text-xs text-[#6B6B6B] truncate">{t.address || "No address"}</p>
                  </div>
                  {expandedId === t.id ? (
                    <ChevronUp className="w-4 h-4 text-[#6B6B6B] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6B6B6B] shrink-0" />
                  )}
                </button>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => handleEdit(t)} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#1E1E1E] transition-colors cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 rounded-xl text-[#6B6B6B] hover:text-red-400 hover:bg-[#1E1E1E] transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {expandedId === t.id && (
                <div className="px-6 pb-4 grid grid-cols-2 gap-2 text-xs">
                  {t.phone && <div><span className="text-[#6B6B6B]">Phone:</span> <span className="text-white">{t.phone}</span></div>}
                  {t.email && <div><span className="text-[#6B6B6B]">Email:</span> <span className="text-white">{t.email}</span></div>}
                  {t.iban && <div className="col-span-2"><span className="text-[#6B6B6B]">IBAN:</span> <span className="text-white">{t.iban}</span></div>}
                  {t.notes && <div className="col-span-2"><span className="text-[#6B6B6B]">Notes:</span> <span className="text-white">{t.notes}</span></div>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/settings/page.tsx src/app/settings/sellers/page.tsx
git commit -m "feat: add settings sub-navigation and seller templates management page"
```

---

### Task 10: Chat Templates Page

**Files:**
- Create: `src/app/settings/chat-templates/page.tsx`

- [ ] **Step 1: Create chat templates management page**

Create `src/app/settings/chat-templates/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import Link from "next/link";

interface ChatTemplate {
  id: string;
  title: string;
  content: string;
}

const emptyForm = { title: "", content: "" };

export default function ChatTemplatesPage() {
  const [templates, setTemplates] = useState<ChatTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchTemplates = () => {
    fetch("/api/chat-templates")
      .then((r) => r.json())
      .then((data) => {
        setTemplates(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = editingId ? `/api/chat-templates/${editingId}` : "/api/chat-templates";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchTemplates();
    }
    setSaving(false);
  };

  const handleEdit = (t: ChatTemplate) => {
    setForm({ title: t.title, content: t.content });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/chat-templates/${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const inputClass = "w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white placeholder-[#4A4A4A] text-sm focus:bg-[#252525] transition-colors";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Manage quick reply templates</p>
      </div>

      <div className="flex gap-2">
        <Link href="/settings" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full transition-colors">
          Connection
        </Link>
        <Link href="/settings/sellers" className="px-4 py-2 text-[#6B6B6B] hover:text-[#A8A29E] text-xs font-medium rounded-full transition-colors">
          Seller Templates
        </Link>
        <span className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-medium rounded-full">
          Chat Templates
        </span>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#E8E8E8] text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editingId ? "Edit Template" : "New Template"}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="text-[#6B6B6B] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Template title *" required />
              <textarea name="content" value={form.content} onChange={handleChange} className={inputClass + " resize-none"} rows={4} placeholder="Message content *" required />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="px-4 py-2 text-[#6B6B6B] hover:text-white text-sm rounded-2xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B6B6B] text-sm">Loading...</div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#6B6B6B] text-sm">No chat templates yet</p>
            <p className="text-[#4A4A4A] text-xs mt-1">Create quick replies for common responses</p>
          </div>
        ) : (
          templates.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#1A1A1A] transition-colors border-b border-[#1E1E1E] last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white font-medium">{t.title}</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">{t.content}</p>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <button onClick={() => handleEdit(t)} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#1E1E1E] transition-colors cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-2 rounded-xl text-[#6B6B6B] hover:text-red-400 hover:bg-[#1E1E1E] transition-colors cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/settings/chat-templates/page.tsx
git commit -m "feat: add chat templates management page"
```

---

### Task 11: Update New Listing Page (Scraping + Seller Templates)

**Files:**
- Modify: `src/app/listings/new/page.tsx`

- [ ] **Step 1: Rewrite new listing page with scrape and seller template features**

Replace `src/app/listings/new/page.tsx` entirely:

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Loader2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

interface SellerTemplate {
  id: string;
  name: string;
  address: string;
  phone: string;
}

const TEMPLATES = [
  { value: "default", label: "Default" },
  { value: "premium", label: "Premium" },
  { value: "minimal", label: "Minimal" },
];

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [sellerTemplates, setSellerTemplates] = useState<SellerTemplate[]>([]);
  const [form, setForm] = useState({
    sellerName: "",
    address: "",
    template: "default",
    title: "",
    price: "",
    mainImage: "",
    images: "" as string,
    sourceUrl: "",
    description: "",
  });

  // Fetch seller templates
  useEffect(() => {
    fetch("/api/seller-templates")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setSellerTemplates(data); });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          price: data.price ? String(data.price) : prev.price,
          mainImage: data.mainImage || prev.mainImage,
          sellerName: data.sellerName || prev.sellerName,
          description: data.description || prev.description,
          sourceUrl: data.sourceUrl || scrapeUrl.trim(),
        }));
      } else {
        alert(data.error || "Failed to load data");
      }
    } catch {
      alert("Failed to connect");
    }
    setScraping(false);
  };

  const handleSellerTemplateSelect = (templateId: string) => {
    const t = sellerTemplates.find((s) => s.id === templateId);
    if (t) {
      setForm((prev) => ({ ...prev, sellerName: t.name, address: t.address }));
    }
    setSellerSelectOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: form.images ? form.images.split("\n").filter(Boolean) : [],
      }),
    });

    if (res.ok) {
      router.push("/listings");
    } else {
      alert("Failed to create listing");
      setLoading(false);
    }
  };

  // Template select dropdown
  const [selectOpen, setSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Seller template select dropdown
  const [sellerSelectOpen, setSellerSelectOpen] = useState(false);
  const sellerSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) setSelectOpen(false);
      if (sellerSelectRef.current && !sellerSelectRef.current.contains(e.target as Node)) setSellerSelectOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const inputClass = "w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white placeholder-[#4A4A4A] text-sm focus:bg-[#252525] transition-colors";
  const selectedTemplate = TEMPLATES.find((t) => t.value === form.template);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/listings" className="p-2 rounded-xl text-[#6B6B6B] hover:text-white hover:bg-[#141414] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">New Listing</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">Create a listing for the external platform</p>
        </div>
      </div>

      {/* Scrape Section */}
      <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
        <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Import from willhaben</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" />
            <input
              type="url"
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              className={inputClass + " pl-11"}
              placeholder="https://www.willhaben.at/iad/..."
            />
          </div>
          <button
            type="button"
            onClick={handleScrape}
            disabled={scraping || !scrapeUrl.trim()}
            className="px-5 py-3 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer shrink-0"
          >
            {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Seller Section */}
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Seller</p>
            {sellerTemplates.length > 0 && (
              <div ref={sellerSelectRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSellerSelectOpen(!sellerSelectOpen)}
                  className="text-xs text-[#A8A29E] hover:text-white transition-colors cursor-pointer"
                >
                  Use template
                </button>
                {sellerSelectOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-[#1E1E1E] rounded-2xl overflow-hidden z-10 py-1 min-w-[200px]">
                    {sellerTemplates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSellerTemplateSelect(t.id)}
                        className="w-full px-4 py-2.5 text-left text-sm text-[#6B6B6B] hover:text-white hover:bg-[#252525] transition-colors cursor-pointer"
                      >
                        <span className="text-white">{t.name}</span>
                        {t.address && <span className="text-[#4A4A4A] text-xs block">{t.address}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" name="sellerName" value={form.sellerName} onChange={handleChange} className={inputClass} placeholder="Full name" required />
            <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Address" required />
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Details</p>

          <div ref={selectRef} className="relative">
            <button
              type="button"
              onClick={() => setSelectOpen(!selectOpen)}
              className="w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white text-sm flex items-center justify-between cursor-pointer hover:bg-[#252525] transition-colors"
            >
              <span>{selectedTemplate?.label}</span>
              <ChevronDown className={`w-4 h-4 text-[#6B6B6B] transition-transform ${selectOpen ? "rotate-180" : ""}`} />
            </button>
            {selectOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E1E1E] rounded-2xl overflow-hidden z-10 py-1">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => { setForm((prev) => ({ ...prev, template: t.value })); setSelectOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                      form.template === t.value ? "text-white bg-[#252525]" : "text-[#6B6B6B] hover:text-white hover:bg-[#252525]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input type="text" name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Listing title" required />
          <input type="number" name="price" value={form.price} onChange={handleChange} className={inputClass} placeholder="Price (EUR)" step="0.01" min="0" required />
        </div>

        {/* Images Section */}
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Images</p>
          <input type="url" name="mainImage" value={form.mainImage} onChange={handleChange} className={inputClass} placeholder="Main image URL" required />
          <textarea name="images" value={form.images} onChange={handleChange} rows={3} className={inputClass + " resize-none"} placeholder="Additional image URLs (one per line)" />
        </div>

        {/* Hidden fields */}
        <input type="hidden" name="sourceUrl" value={form.sourceUrl} />
        <input type="hidden" name="description" value={form.description} />

        <div className="flex justify-end gap-2 pt-2">
          <Link href="/listings" className="px-5 py-2.5 text-[#6B6B6B] hover:text-white text-sm font-medium rounded-2xl transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify page loads in browser**

Open http://localhost:8500/listings/new — should show the scrape URL field at the top, and "Use template" link in Seller section.

- [ ] **Step 3: Commit**

```bash
git add src/app/listings/new/page.tsx
git commit -m "feat: add willhaben scraping and seller template selection to new listing form"
```

---

### Task 12: Listing Detail Page

**Files:**
- Create: `src/app/listings/[id]/page.tsx`

- [ ] **Step 1: Create the listing detail page**

Create `src/app/listings/[id]/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ExternalLink, Send, Trash2, Pencil,
  Eye, MousePointerClick, MessageCircle, Play
} from "lucide-react";
import Link from "next/link";

interface Listing {
  id: string;
  sellerName: string;
  address: string;
  template: string;
  title: string;
  price: number;
  mainImage: string;
  images: string[];
  slug: string;
  status: string;
  externalUrl: string | null;
  sourceUrl: string | null;
  description: string | null;
  createdAt: string;
}

interface Event {
  id: string;
  type: string;
  ip: string;
  createdAt: string;
}

interface EventData {
  events: Event[];
  counts: {
    page_view: number;
    continue_click: number;
    chat_open: number;
    message_sent: number;
  };
}

const EVENT_ICONS: Record<string, { icon: typeof Eye; label: string }> = {
  page_view: { icon: Eye, label: "Page view" },
  continue_click: { icon: Play, label: "Clicked continue" },
  chat_open: { icon: MessageCircle, label: "Opened chat" },
  message_sent: { icon: MousePointerClick, label: "Sent message" },
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/listings").then((r) => r.json()),
      fetch(`/api/events/${id}`).then((r) => r.json()),
    ]).then(([listings, events]) => {
      const found = listings.find((l: Listing) => l.id === id);
      if (found) setListing(found);
      setEventData(events);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    router.push("/listings");
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/listings/${id}/publish`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setListing((prev) => prev ? { ...prev, status: "published", externalUrl: data.externalUrl } : prev);
      } else {
        alert(data.error || "Failed to publish");
      }
    } catch {
      alert("Failed to publish");
    }
    setPublishing(false);
  };

  if (loading) return <div className="text-[#6B6B6B] text-sm py-20 text-center">Loading...</div>;
  if (!listing) return <div className="text-[#6B6B6B] text-sm py-20 text-center">Listing not found</div>;

  const counts = eventData?.counts || { page_view: 0, continue_click: 0, chat_open: 0, message_sent: 0 };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/listings" className="p-2 rounded-xl text-[#6B6B6B] hover:text-white hover:bg-[#141414] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{listing.title}</h1>
            <p className="text-[#6B6B6B] text-sm mt-0.5">{listing.sellerName} &middot; {listing.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link href={`/listings/${id}/edit`} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors">
            <Pencil className="w-4 h-4" />
          </Link>
          {listing.status === "draft" && (
            <button onClick={handlePublish} disabled={publishing} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors cursor-pointer disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          )}
          {listing.externalUrl && (
            <a href={listing.externalUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Link href={`/chat/${id}`} className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors">
            <MessageCircle className="w-4 h-4" />
          </Link>
          <button onClick={handleDelete} className="p-2 rounded-xl text-[#6B6B6B] hover:text-red-400 hover:bg-[#141414] transition-colors cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#141414] rounded-2xl p-6">
        <div className="flex gap-6">
          {listing.mainImage && (
            <img src={listing.mainImage} alt={listing.title} className="w-32 h-32 rounded-xl object-cover shrink-0" />
          )}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-white tabular-nums">{listing.price.toLocaleString("de-DE")} &euro;</span>
              <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full ${
                listing.status === "published" ? "bg-[#1E1E1E] text-[#A8A29E]" : "bg-[#1E1E1E] text-[#6B6B6B]"
              }`}>
                {listing.status}
              </span>
            </div>
            {listing.description && <p className="text-sm text-[#6B6B6B]">{listing.description}</p>}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-[#6B6B6B]">Template:</span> <span className="text-white">{listing.template}</span></div>
              <div><span className="text-[#6B6B6B]">Created:</span> <span className="text-white">{new Date(listing.createdAt).toLocaleDateString("de-DE")}</span></div>
              {listing.sourceUrl && (
                <div className="col-span-2">
                  <span className="text-[#6B6B6B]">Source: </span>
                  <a href={listing.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#A8A29E] hover:text-white transition-colors">
                    willhaben.at
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Counters */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Views", value: counts.page_view, icon: Eye },
          { label: "Continues", value: counts.continue_click, icon: Play },
          { label: "Chat Opens", value: counts.chat_open, icon: MessageCircle },
          { label: "Messages", value: counts.message_sent, icon: MousePointerClick },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#141414] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-[#6B6B6B] uppercase tracking-wider">{stat.label}</span>
              <stat.icon className="w-3.5 h-3.5 text-[#A8A29E]" />
            </div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-sm font-semibold text-white">Activity</h2>
        </div>
        {!eventData?.events.length ? (
          <div className="px-6 pb-6 text-center">
            <p className="text-[#6B6B6B] text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {eventData.events.map((event) => {
              const info = EVENT_ICONS[event.type] || { icon: Eye, label: event.type };
              const Icon = info.icon;
              return (
                <div key={event.id} className="flex items-center gap-3 px-6 py-2.5 hover:bg-[#1A1A1A] transition-colors">
                  <Icon className="w-3.5 h-3.5 text-[#A8A29E] shrink-0" />
                  <span className="text-sm text-white flex-1">{info.label}</span>
                  <span className="text-[11px] text-[#4A4A4A]">
                    {new Date(event.createdAt).toLocaleString("de-DE", {
                      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Images Gallery */}
      {listing.images.length > 0 && (
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Additional Images</h2>
          <div className="grid grid-cols-3 gap-3">
            {listing.images.map((img, i) => (
              <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                <img src={img} alt={`Image ${i + 1}`} className="w-full h-28 rounded-xl object-cover hover:opacity-80 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify page loads**

Open http://localhost:8500/listings/[any-listing-id] — should show the detail page with info card, counters, and activity feed.

- [ ] **Step 3: Commit**

```bash
git add src/app/listings/[id]/page.tsx
git commit -m "feat: add listing detail page with event tracking and activity feed"
```

---

### Task 13: Listing Edit Page

**Files:**
- Create: `src/app/listings/[id]/edit/page.tsx`

- [ ] **Step 1: Create the edit page**

Create `src/app/listings/[id]/edit/page.tsx`:

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Loader2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const TEMPLATES = [
  { value: "default", label: "Default" },
  { value: "premium", label: "Premium" },
  { value: "minimal", label: "Minimal" },
];

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [form, setForm] = useState({
    sellerName: "",
    address: "",
    template: "default",
    title: "",
    price: "",
    mainImage: "",
    images: "",
    sourceUrl: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((listings) => {
        const found = listings.find((l: { id: string }) => l.id === id);
        if (found) {
          setForm({
            sellerName: found.sellerName,
            address: found.address,
            template: found.template,
            title: found.title,
            price: String(found.price),
            mainImage: found.mainImage,
            images: (found.images || []).join("\n"),
            sourceUrl: found.sourceUrl || "",
            description: found.description || "",
          });
          setScrapeUrl(found.sourceUrl || "");
        }
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          price: data.price ? String(data.price) : prev.price,
          mainImage: data.mainImage || prev.mainImage,
          sellerName: data.sellerName || prev.sellerName,
          description: data.description || prev.description,
          sourceUrl: data.sourceUrl || scrapeUrl.trim(),
        }));
      } else {
        alert(data.error || "Failed to load data");
      }
    } catch {
      alert("Failed to connect");
    }
    setScraping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        images: form.images ? form.images.split("\n").filter(Boolean) : [],
      }),
    });

    if (res.ok) {
      router.push(`/listings/${id}`);
    } else {
      alert("Failed to update");
      setSaving(false);
    }
  };

  const [selectOpen, setSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) setSelectOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) return <div className="text-[#6B6B6B] text-sm py-20 text-center">Loading...</div>;

  const inputClass = "w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white placeholder-[#4A4A4A] text-sm focus:bg-[#252525] transition-colors";
  const selectedTemplate = TEMPLATES.find((t) => t.value === form.template);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/listings/${id}`} className="p-2 rounded-xl text-[#6B6B6B] hover:text-white hover:bg-[#141414] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Listing</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">Update listing details</p>
        </div>
      </div>

      {/* Re-scrape */}
      <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
        <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Re-import from willhaben</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" />
            <input type="url" value={scrapeUrl} onChange={(e) => setScrapeUrl(e.target.value)} className={inputClass + " pl-11"} placeholder="https://www.willhaben.at/iad/..." />
          </div>
          <button type="button" onClick={handleScrape} disabled={scraping || !scrapeUrl.trim()} className="px-5 py-3 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer shrink-0">
            {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Seller</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" name="sellerName" value={form.sellerName} onChange={handleChange} className={inputClass} placeholder="Full name" required />
            <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Address" required />
          </div>
        </div>

        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Details</p>
          <div ref={selectRef} className="relative">
            <button type="button" onClick={() => setSelectOpen(!selectOpen)} className="w-full px-4 py-3 bg-[#1E1E1E] rounded-2xl text-white text-sm flex items-center justify-between cursor-pointer hover:bg-[#252525] transition-colors">
              <span>{selectedTemplate?.label}</span>
              <ChevronDown className={`w-4 h-4 text-[#6B6B6B] transition-transform ${selectOpen ? "rotate-180" : ""}`} />
            </button>
            {selectOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E1E1E] rounded-2xl overflow-hidden z-10 py-1">
                {TEMPLATES.map((t) => (
                  <button key={t.value} type="button" onClick={() => { setForm((prev) => ({ ...prev, template: t.value })); setSelectOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${form.template === t.value ? "text-white bg-[#252525]" : "text-[#6B6B6B] hover:text-white hover:bg-[#252525]"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input type="text" name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Listing title" required />
          <input type="number" name="price" value={form.price} onChange={handleChange} className={inputClass} placeholder="Price (EUR)" step="0.01" min="0" required />
        </div>

        <div className="bg-[#141414] rounded-2xl p-6 space-y-4">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Images</p>
          <input type="url" name="mainImage" value={form.mainImage} onChange={handleChange} className={inputClass} placeholder="Main image URL" required />
          <textarea name="images" value={form.images} onChange={handleChange} rows={3} className={inputClass + " resize-none"} placeholder="Additional image URLs (one per line)" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href={`/listings/${id}`} className="px-5 py-2.5 text-[#6B6B6B] hover:text-white text-sm font-medium rounded-2xl transition-colors">Cancel</Link>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-white hover:bg-[#E8E8E8] disabled:opacity-40 text-[#0A0A0A] text-sm font-medium rounded-2xl transition-colors cursor-pointer">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/listings/[id]/edit/page.tsx
git commit -m "feat: add listing edit page with re-scrape support"
```

---

### Task 14: Update Listings Table

**Files:**
- Modify: `src/app/listings/page.tsx`

- [ ] **Step 1: Add row click navigation, events column, sourceUrl icon**

Replace `src/app/listings/page.tsx` entirely:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Trash2, ExternalLink, Send, Search, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  sellerName: string;
  title: string;
  price: number;
  status: string;
  externalUrl: string | null;
  sourceUrl: string | null;
  createdAt: string;
}

export default function ListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);

  const fetchListings = () => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const handlePublish = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPublishing(id);
    try {
      const res = await fetch(`/api/listings/${id}/publish`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        fetchListings();
      } else {
        alert(data.error || "Failed to publish");
      }
    } catch {
      alert("Failed to publish");
    }
    setPublishing(null);
  };

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Listings</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Manage all your listings</p>
        </div>
        <Link
          href="/listings/new"
          className="px-5 py-2.5 bg-[#141414] hover:bg-[#1A1A1A] text-white text-sm font-medium rounded-2xl transition-colors"
        >
          + New Listing
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#141414] rounded-2xl text-white placeholder-[#6B6B6B] text-sm"
        />
      </div>

      <div className="bg-[#141414] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B6B6B] text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#6B6B6B] text-sm">{search ? "No results" : "No listings yet"}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((listing) => (
                <tr
                  key={listing.id}
                  onClick={() => router.push(`/listings/${listing.id}`)}
                  className="hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3.5 text-sm text-white">
                    <div className="flex items-center gap-2">
                      {listing.title}
                      {listing.sourceUrl && (
                        <a
                          href={listing.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#4A4A4A] hover:text-[#A8A29E] transition-colors"
                          title="View on willhaben"
                        >
                          <Eye className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#6B6B6B]">{listing.sellerName}</td>
                  <td className="px-6 py-3.5 text-sm text-white tabular-nums">{listing.price.toLocaleString("de-DE")} &euro;</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full ${
                      listing.status === "published" ? "bg-[#1E1E1E] text-[#A8A29E]" : "bg-[#1E1E1E] text-[#6B6B6B]"
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#6B6B6B]">
                    {new Date(listing.createdAt).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {listing.status === "draft" && (
                        <button
                          onClick={(e) => handlePublish(e, listing.id)}
                          disabled={publishing === listing.id}
                          className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#1E1E1E] transition-colors cursor-pointer disabled:opacity-40"
                          title="Publish"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {listing.externalUrl && (
                        <a
                          href={listing.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#1E1E1E] transition-colors"
                          title="Open"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={(e) => handleDelete(e, listing.id)}
                        className="p-2 rounded-xl text-[#6B6B6B] hover:text-red-400 hover:bg-[#1E1E1E] transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/listings/page.tsx
git commit -m "feat: add row click navigation, sourceUrl icon to listings table"
```

---

### Task 15: Update Chat Page (Images + Quick Replies)

**Files:**
- Modify: `src/app/chat/[listingId]/page.tsx`

- [ ] **Step 1: Rewrite chat page with image upload and quick replies**

Replace `src/app/chat/[listingId]/page.tsx` entirely:

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Paperclip, Zap, X, Settings } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  sender: "client" | "support";
  imageUrl: string | null;
  createdAt: string;
}

interface ChatTemplate {
  id: string;
  title: string;
  content: string;
}

export default function ChatPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [templates, setTemplates] = useState<ChatTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastTimestamp = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (initial = false) => {
    const url = initial
      ? `/api/chat/${listingId}`
      : `/api/chat/${listingId}?after=${encodeURIComponent(lastTimestamp.current || "")}`;

    const res = await fetch(url);
    const data: Message[] = await res.json();

    if (initial) {
      setMessages(data);
    } else if (data.length > 0) {
      setMessages((prev) => [...prev, ...data]);
    }

    if (data.length > 0) {
      lastTimestamp.current = data[data.length - 1].createdAt;
    }
  };

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((listings) => {
        const found = listings.find((l: { id: string }) => l.id === listingId);
        if (found) setTitle(found.title);
      });
  }, [listingId]);

  useEffect(() => {
    fetch("/api/chat-templates").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setTemplates(data);
    });
  }, []);

  useEffect(() => {
    fetchMessages(true);
    fetch(`/api/chat/${listingId}/read`, { method: "POST" });
  }, [listingId]);

  useEffect(() => {
    const interval = setInterval(() => fetchMessages(), 3000);
    return () => clearInterval(interval);
  }, [listingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (templatesRef.current && !templatesRef.current.contains(e.target as Node)) {
        setShowTemplates(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSend = async (imageUrl?: string) => {
    if (!input.trim() && !imageUrl) return;
    if (sending) return;
    setSending(true);

    const res = await fetch(`/api/chat/${listingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: input.trim(),
        sender: "support",
        imageUrl: imageUrl || null,
      }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      lastTimestamp.current = msg.createdAt;
      setInput("");
      setImagePreview(null);
    }
    setSending(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        await handleSend(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateSelect = (content: string) => {
    setInput(content);
    setShowTemplates(false);
  };

  const hasClientMessage = messages.some((m) => m.sender === "client");

  return (
    <div className="flex flex-col h-[calc(100vh-56px-48px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/chat" className="p-2 rounded-xl text-[#6B6B6B] hover:text-white hover:bg-[#141414] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">{title || "Chat"}</h1>
          <p className="text-[#6B6B6B] text-xs">Live conversation</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#141414] rounded-2xl p-5 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[#4A4A4A] text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "support" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === "support" ? "bg-[#A8A29E] text-[#0A0A0A]" : "bg-[#1E1E1E] text-white"
              }`}>
                {msg.imageUrl && (
                  <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={msg.imageUrl}
                      alt="Shared image"
                      className="max-w-full max-h-48 rounded-xl mb-2 hover:opacity-80 transition-opacity"
                    />
                  </a>
                )}
                {msg.content && <p>{msg.content}</p>}
                <p className={`text-[10px] mt-1 ${msg.sender === "support" ? "text-[#0A0A0A]/50" : "text-[#4A4A4A]"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {hasClientMessage ? (
        <div className="flex items-center gap-2 mt-3">
          {/* Quick replies */}
          <div ref={templatesRef} className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-3 rounded-2xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors cursor-pointer"
              title="Quick replies"
            >
              <Zap className="w-4 h-4" />
            </button>
            {showTemplates && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#1E1E1E] rounded-2xl overflow-hidden z-10 min-w-[250px] max-h-60 overflow-y-auto">
                {templates.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-[#6B6B6B]">No templates yet</div>
                ) : (
                  templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTemplateSelect(t.content)}
                      className="w-full px-4 py-3 text-left hover:bg-[#252525] transition-colors cursor-pointer"
                    >
                      <p className="text-sm text-white">{t.title}</p>
                      <p className="text-xs text-[#4A4A4A] truncate mt-0.5">{t.content}</p>
                    </button>
                  ))
                )}
                <Link
                  href="/settings/chat-templates"
                  className="block px-4 py-2.5 text-xs text-[#A8A29E] hover:text-white border-t border-[#2A2A2A] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Settings className="w-3 h-3" />
                    Manage templates
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* File upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-3 rounded-2xl text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414] transition-colors cursor-pointer disabled:opacity-40"
            title="Upload image"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 bg-[#141414] rounded-2xl text-white placeholder-[#4A4A4A] text-sm"
            placeholder="Type a message..."
          />

          {/* Send */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="p-3 bg-[#A8A29E] hover:bg-[#BDB8B3] disabled:opacity-30 rounded-2xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#0A0A0A]" />
          </button>
        </div>
      ) : (
        <div className="mt-3 text-center py-3">
          <p className="text-[#4A4A4A] text-xs">Waiting for client to start the conversation</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:8500/chat/[listingId] — should show paperclip button and lightning bolt (quick replies) next to input.

- [ ] **Step 3: Commit**

```bash
git add src/app/chat/[listingId]/page.tsx
git commit -m "feat: add image upload and quick reply templates to chat"
```

---

## Phase 3: Final Integration

### Task 16: Create uploads directory and update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Ensure uploads directory exists with .gitkeep**

Run:
```bash
mkdir -p public/uploads
touch public/uploads/.gitkeep
```

- [ ] **Step 2: Update .gitignore**

Add to `.gitignore`:
```
# Uploaded files
public/uploads/*
!public/uploads/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore public/uploads/.gitkeep
git commit -m "chore: add uploads directory with gitkeep"
```

---

### Task 17: Final verification

- [ ] **Step 1: Run the dev server and verify all pages load**

Run: `PORT=8500 npm run dev`

Check each page:
- http://localhost:8500/listings/new — scrape field + seller templates
- http://localhost:8500/settings/sellers — seller templates CRUD
- http://localhost:8500/settings/chat-templates — chat templates CRUD
- http://localhost:8500/listings — row click navigates to detail
- http://localhost:8500/listings/[id] — detail page with events
- http://localhost:8500/listings/[id]/edit — edit page
- http://localhost:8500/chat/[id] — image upload + quick replies

- [ ] **Step 2: Test scraping**

On /listings/new, paste `https://www.willhaben.at/iad/kaufen-und-verkaufen/d/iphone-12-pro-256-gb-1441954182` and click Load. Form should auto-fill.

- [ ] **Step 3: Test event ingestion**

Run:
```bash
curl -X POST http://localhost:8500/api/events -H "Content-Type: application/json" -d '{"type":"page_view","listingId":"REPLACE_WITH_LISTING_ID"}'
```
Then check the listing detail page — should show 1 view.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: final adjustments from integration testing"
```
